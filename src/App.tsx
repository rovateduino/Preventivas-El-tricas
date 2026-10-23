import React, { useState, useEffect, useMemo, useRef } from "react";
import { Thermometer, Ticket, Search, Plus, Trash2, FileDown, X, Filter, Calendar, Save, AlertTriangle, LogOut, Download, Upload, Pencil, Database } from "lucide-react";
import appMark from "./assets/app-mark.svg";
import { subscribeToAuthChanges, logout } from './lib/auth';
import { getPreventivas, savePreventiva, newPreventivaDocId, updatePreventiva, deletePreventiva, deletePreventivas, importPreventivas, deleteAllPreventivas } from './lib/preventivaService';
import { exportToJSON, importFromJSON } from './lib/dataExport';
import { User } from 'firebase/auth';
import Login from './components/Login';
import { STORAGE_KEY, MODE_KEY, DRAFT_KEY } from './lib/constants';
import { usesTresFases, isViaAB, formatDateBR, getCorrenteGeralDC, downloadReport, usesTresFasesRecord, hasNomesRecord } from './lib/report';
import { createInvite, getUserProfile, isFirstAdminAvailable, listUnusedInvites, revokeInvite } from './lib/userService';

const SITES = [
  ...["Artur Alvim|AAL","Atibaia|AIA","Água Rasa|ARA","Bragança Paulista|BGP","Bangu|BGU","Bom Retiro|BRE",
    "Barueri|BRI","Butirapoã|BTP","Butantã|BUT","Cumbica|CBC","Campo Belo|CBE","Cidade Dutra|CDU",
    "Campo Grande|CGR","Cangaíba|CNG","Cotia|COA","Cons. Ramalho|CSR","Cursino|CUR","Diadema|DDA",
    "Fátima|FAT","Guarulhos|GRS","Itu|ITU","Jabaquara|JAB","Jundiaí|JAI","Jardim São Luiz|JDS","João Pessoa|JPS"
  ].map(s => { const [name, sigla] = s.split("|"); return { cat: "HUB", name, sigla }; }),
  ...["Limão|LIM","Mauá|MAU","EBT Mauro|MRO","Mogi das Cruzes|MCZ","Morumbi|MOR","Nova Petrópolis|NPT",
    "Osasco|OCO","Osasco II|JMA","Pernambuco|EPE","Pirituba|PIR","Perdizes|PRD","Santo André|SNE",
    "Santo Amaro|SAM","Salto|SLO","São Miguel|SMI","São Mateus|SMT","Santana|SNT","Suzano|SUZ",
    "Tatuapé|TAT","Vila Medeiros|VMD","Vila Mariana|VMN","Vila Matilde|VMT","Vesper SBO|VPE","Vila Sônia|VSO"
  ].map(s => { const [name, sigla] = s.split("|"); return { cat: "HUB", name, sigla }; }),
  ...["SW Americanópolis|SM-JAB50","SW Perdizes|SM-LAP14","SW Penha|SM-MOO62","SW Jaguaré|SM-MRB50"
  ].map(s => { const [name, sigla] = s.split("|"); return { cat: "SWITCH CLARO", name, sigla }; }),
  ...["EBT Ingleses|SPO-IG","EBT Lapa|SPO-LP","EBT Morumbi|SPO-MB","EBT Penha|SPO-PH"
  ].map(s => { const [name, sigla] = s.split("|"); return { cat: "CENTRAL EBT", name, sigla }; }),
  ...["EBT Barueri|BRE-AG","EBT José Caballero|SNE-JC","EBT João Pessoa|SBO-JP","EBT Osasco|OCO-SA","EBT Pernambuco|SCN-PE"
  ].map(s => { const [name, sigla] = s.split("|"); return { cat: "MUX EBT", name, sigla }; }),
];

const PANEL_TYPES = ["PDT", "QDF", "QDCC", "OUTRO"];
const defaultCircuitCount = (tipo: string) => (tipo === "PDT" ? 8 : 13);

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function createCircuit(n: number, tipo: string) {
  if (isViaAB(tipo)) {
    return { n, viaA: "", viaB: "" };
  }

  if (tipo === "OUTRO") {
    return { n, nome: "", r: "", s: "", t: "" };
  }

  if (usesTresFases(tipo)) {
    return { n, r: "", s: "", t: "" };
  }

  return { n, r: "" };
}

function createdAtMs(value: any) {
  if (typeof value === 'number') return value;
  return Date.parse(String(value ?? '')) || Number(value) || 0;
}

function parseNumber(value: string) {
  const num = Number(value.replace(',', '.'));
  return Number.isFinite(num) ? num : 0;
}

const PROFILE_RETRY_MAX = 3;
const PROFILE_RETRY_BASE_MS = 2000;
const SAVE_SOFT_CONFIRM_MS = 15000;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshFirstAdminAvailable = async () => {
    try {
      const available = await isFirstAdminAvailable();
      setFirstAdminAvailable(available);
    } catch (err) {
      console.error('Erro ao verificar disponibilidade do primeiro admin:', err);
      setFirstAdminAvailable(false);
    }
  };

  useEffect(() => {
    const generation = ++authGeneration.current;
    const isCurrentCycle = () => authGeneration.current === generation;
    const showWarning = (msg: string | null) => {
      profileWarningText.current = msg;
      setProfileWarning(msg);
    };

    const stopProfileRetry = () => {
      if (profileRetryTimer.current !== null) {
        clearTimeout(profileRetryTimer.current);
        profileRetryTimer.current = null;
      }
      profileRetryAttempts.current = 0;
    };

    const unauthorizedLogout = async () => {
      stopProfileRetry();
      await logout();
      if (!isCurrentCycle()) return;
      setUser(null);
      setUserRole(null);
      showWarning(null);
      setAuthError('Conta não autorizada. Cadastre-se com um convite válido ou peça autorização ao administrador.');
    };

    const applyProfileRole = (role: 'user' | 'admin') => {
      setUserRole(role);
      showWarning(null);
      profileRetryAttempts.current = 0;
    };

    const readProfile = async (u: User) => {
      profileReadInFlight.current = true;
      try {
        const profile = await getUserProfile(u.uid);
        if (!isCurrentCycle()) return;
        if (!profile) {
          await unauthorizedLogout();
          return;
        }
        applyProfileRole(profile.role);
      } catch (e) {
        console.error('Erro ao ler perfil do usuário; mantendo a sessão:', e);
        if (!isCurrentCycle()) return;
        setUserRole('user');
        scheduleProfileRetry(u);
      } finally {
        profileReadInFlight.current = false;
      }
    };

    const scheduleProfileRetry = (u: User) => {
      if (!isCurrentCycle()) return;
      if (profileRetryAttempts.current >= PROFILE_RETRY_MAX) {
        showWarning('Não foi possível confirmar sua autorização no Firebase. Você continua logado com acesso padrão.');
        return;
      }
      profileRetryAttempts.current += 1;
      const attempt = profileRetryAttempts.current;
      showWarning(`Falha ao ler sua autorização no Firebase (tentativa ${attempt} de ${PROFILE_RETRY_MAX}). A sessão foi mantida.`);
      profileRetryTimer.current = setTimeout(() => {
        profileRetryTimer.current = null;
        void readProfile(u);
      }, PROFILE_RETRY_BASE_MS * 2 ** (attempt - 1));
    };

    const unsubscribe = subscribeToAuthChanges(async (u) => {
      stopProfileRetry();
      sessionUser.current = u;
      if (!u) {
        setUser(null);
        setUserRole(null);
        setAuthError(null);
        showWarning(null);
        setAuthLoading(false);
        return;
      }

      setUser(u);
      setAuthError(null);

      await readProfile(u);
      if (isCurrentCycle()) setAuthLoading(false);
    });

    const handleOnline = () => {
      if (!isCurrentCycle()) return;
      const u = sessionUser.current;
      if (!u || profileReadInFlight.current || profileRetryTimer.current !== null) return;
      if (profileWarningText.current === null) return;
      profileRetryAttempts.current = 0;
      void readProfile(u);
    };
    window.addEventListener('online', handleOnline);

    refreshFirstAdminAvailable();
    return () => {
      authGeneration.current += 1;
      stopProfileRetry();
      window.removeEventListener('online', handleOnline);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authLoading) {
      refreshFirstAdminAvailable();
    }
  }, [authLoading, user]);

  const [tab, setTab] = useState("novo");
  const [records, setRecords] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [saveMode, setSaveMode] = useState<'local' | 'firebase'>('local');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(() => new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [bulkDeleteInProgress, setBulkDeleteInProgress] = useState(false);
  const [bulkDeleteError, setBulkDeleteError] = useState("");
  const [viewRecord, setViewRecord] = useState<any>(null);
  const [firebaseSyncError, setFirebaseSyncError] = useState('');
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [inviteToken, setInviteToken] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showPendingInvites, setShowPendingInvites] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<{ token: string; role: string; createdAt: number }[]>([]);
  const [pendingInvitesLoading, setPendingInvitesLoading] = useState(false);
  const [pendingInvitesError, setPendingInvitesError] = useState('');
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profileWarning, setProfileWarning] = useState<string | null>(null);
  const profileRetryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileRetryAttempts = useRef(0);
  const authGeneration = useRef(0);
  const profileWarningText = useRef<string | null>(null);
  const profileReadInFlight = useRef(false);
  const sessionUser = useRef<User | null>(null);
  const [firstAdminAvailable, setFirstAdminAvailable] = useState<boolean | null>(null);
  const [inviteCreatedAt, setInviteCreatedAt] = useState<number | null>(null);

  const [data, setData] = useState("");
  const [tipo, setTipo] = useState("PDT");
  const [tipoComplemento, setTipoComplemento] = useState("");
  const [tipoOutro, setTipoOutro] = useState("");
  const [viaSelecionada, setViaSelecionada] = useState<"A" | "B" | "ambas">("ambas");
  const [ticket, setTicket] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [siteQuery, setSiteQuery] = useState("");
  const [siteSelected, setSiteSelected] = useState<any>(null);
  const [siteOpen, setSiteOpen] = useState(false);
  const [qtdCircuitos, setQtdCircuitos] = useState(defaultCircuitCount("PDT"));
  const [circuitos, setCircuitos] = useState(Array.from({ length: 8 }, (_, i) => createCircuit(i + 1, "PDT")));
  
  const [correnteTotal, setCorrenteTotal] = useState("");
  const [correnteR, setCorrenteR] = useState("");
  const [correnteS, setCorrenteS] = useState("");
  const [correnteT, setCorrenteT] = useState("");
  const [correnteViaA, setCorrenteViaA] = useState("");
  const [correnteViaB, setCorrenteViaB] = useState("");
  const [correnteGeral, setCorrenteGeral] = useState("");
  const [tensaoR, setTensaoR] = useState("");
  const [tensaoS, setTensaoS] = useState("");
  const [tensaoT, setTensaoT] = useState("");
  const [tensaoRS, setTensaoRS] = useState("");
  const [tensaoST, setTensaoST] = useState("");
  const [tensaoTR, setTensaoTR] = useState("");
  const [tensaoAC, setTensaoAC] = useState("");
  const [tensaoDC, setTensaoDC] = useState("");
  const [observacao, setObservacao] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCriadoEm, setEditingCriadoEm] = useState<string | number | null>(null);
  const hydratingEdit = useRef(false);
  const [formError, setFormError] = useState("");
  const [pendingDraft, setPendingDraft] = useState<any | null>(null);
  const [failedRecord, setFailedRecord] = useState<any | null>(null);
  const [localOnlyCount, setLocalOnlyCount] = useState(0);
  const draftHydrated = useRef(false);
  const draftPending = useRef(false);
  const [unconfirmedSave, setUnconfirmedSave] = useState<any | null>(null);
  const pendingCreateId = useRef<string | null>(null);
  const saveSoftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const createAttempt = useRef(0);
  const locallySavedIds = useRef<Set<string>>(new Set());

  const [fData, setFData] = useState("");
  const [fSite, setFSite] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fVia, setFVia] = useState<"" | "A" | "B" | "ambas">("");
  const [fSigla, setFSigla] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState("");
  const [clearProgress, setClearProgress] = useState<{ total: number; done: number } | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const storedMode = localStorage.getItem(MODE_KEY);
      setSaveMode(storedMode === "firebase" ? "firebase" : "local");
    } catch (e) {
      console.error("Falha ao ler o modo de salvamento local:", e);
      setSaveMode("local");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MODE_KEY, saveMode);
  }, [saveMode]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    if (inviteToken) {
      const timer = setTimeout(() => {
        setInviteToken('');
        setInviteCreatedAt(null);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [inviteToken]);

  useEffect(() => {
    setInviteToken('');
    setInviteCreatedAt(null);
  }, [tab]);

  useEffect(() => {
    const loadRecords = async () => {
      setLoaded(false);
      setFirebaseSyncError("");

      if (saveMode === "local") {
        try {
          const res = localStorage.getItem(STORAGE_KEY);
          setRecords(res ? JSON.parse(res) : []);
        } catch (e) {
          console.error(e);
          setRecords([]);
        } finally {
          setLoaded(true);
        }
        return;
      }

      if (!user) {
        setRecords([]);
        setLoaded(true);
        return;
      }

      try {
        const firebaseRecords = await getPreventivas(user.uid);
        setRecords(firebaseRecords);
      } catch (e) {
        console.error("Erro ao carregar registros do Firebase:", e);
        setFirebaseSyncError("Não foi possível carregar registros do Firebase.");
        setRecords([]);
      } finally {
        setLoaded(true);
      }
    };

    loadRecords();
  }, [saveMode, user]);

  useEffect(() => {
    if (hydratingEdit.current) return;
    setQtdCircuitos(defaultCircuitCount(tipo));
    setCircuitos(Array.from({ length: defaultCircuitCount(tipo) }, (_, i) => createCircuit(i + 1, tipo)));
    setCorrenteTotal("");
    setCorrenteR("");
    setCorrenteS("");
    setCorrenteT("");
    setCorrenteViaA("");
    setCorrenteViaB("");
    setCorrenteGeral("");
    setTensaoR("");
    setTensaoS("");
    setTensaoT("");
    setTensaoRS("");
    setTensaoST("");
    setTensaoTR("");
    setTensaoAC("");
    setTensaoDC("");
    if (!isViaAB(tipo)) setViaSelecionada("ambas");
  }, [tipo]);

  useEffect(() => {
    const sumR = circuitos.reduce((acc, c: any) => acc + parseNumber(c.r || ""), 0);
    const sumS = circuitos.reduce((acc, c: any) => acc + parseNumber(c.s || ""), 0);
    const sumT = circuitos.reduce((acc, c: any) => acc + parseNumber(c.t || ""), 0);
    const sumViaA = circuitos.reduce((acc, c: any) => acc + parseNumber(c.viaA || ""), 0);
    const sumViaB = circuitos.reduce((acc, c: any) => acc + parseNumber(c.viaB || ""), 0);

    if (isViaAB(tipo)) {
      const showA = viaSelecionada === "A" || viaSelecionada === "ambas";
      const showB = viaSelecionada === "B" || viaSelecionada === "ambas";
      setCorrenteViaA(showA && sumViaA ? sumViaA.toFixed(1) : "");
      setCorrenteViaB(showB && sumViaB ? sumViaB.toFixed(1) : "");
      const geral = sumViaA + sumViaB;
      setCorrenteGeral(geral ? geral.toFixed(1) : "");
      setCorrenteTotal("");
      setCorrenteR("");
      setCorrenteS("");
      setCorrenteT("");
      return;
    }

    if (usesTresFases(tipo)) {
      setCorrenteR(sumR ? sumR.toFixed(1) : "");
      setCorrenteS(sumS ? sumS.toFixed(1) : "");
      setCorrenteT(sumT ? sumT.toFixed(1) : "");
      setCorrenteTotal("");
      return;
    }

    setCorrenteTotal(sumR ? sumR.toFixed(1) : "");
    setCorrenteR("");
    setCorrenteS("");
    setCorrenteT("");
    setCorrenteViaA("");
    setCorrenteViaB("");
    setCorrenteGeral("");
  }, [circuitos, tipo, viaSelecionada]);

  async function storeLocalRecords(next: any[]) {
    setRecords(next);
    setSaveState("saving");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch (e) {
      console.error("Erro ao salvar localmente:", e);
      setSaveState("idle");
    }
  }

  function clearSaveSoftTimer() {
    if (saveSoftTimer.current !== null) {
      clearTimeout(saveSoftTimer.current);
      saveSoftTimer.current = null;
    }
  }

  // O id em tentativa pertence ao formulário aberto. Limpar, confirmar com sucesso ou trocar
  // de registro abandona a tentativa; a escrita antiga ainda pode confirmar mais tarde, e aí
  // só a lista é reconciliada — nunca o formulário em que o técnico está agora.
  function abandonCreateAttempt() {
    createAttempt.current += 1;
    pendingCreateId.current = null;
    clearSaveSoftTimer();
    setUnconfirmedSave(null);
  }

  async function reconcileLateCreate(uid: string, docId: string) {
    const duplicouLocalmente = locallySavedIds.current.delete(docId);
    try {
      setRecords(await getPreventivas(uid));
    } catch (e) {
      console.error("Envio confirmado pelo servidor, mas a lista não pôde ser recarregada:", e);
    }
    showToast(
      duplicouLocalmente
        ? "O Firebase confirmou um envio que já estava salvo neste dispositivo. Confira a lista: pode haver duplicidade."
        : "O Firebase confirmou um envio antigo. Confira a lista de registros na nuvem.",
    );
  }

  async function persist(record: any, next: any[], isUpdate = false) {
    setSaveState("saving");
    if (saveMode === "local") {
      await storeLocalRecords(next);
      showToast(isUpdate ? "Registro atualizado localmente ✓" : "Registro salvo localmente ✓");
      return true;
    }

    if (!user) {
      setFormError("Login necessário para salvar no Firebase.");
      setSaveState("idle");
      return false;
    }

    try {
      if (isUpdate) {
        await updatePreventiva(record.id, { ...record, uid: user.uid });
        setRecords(next);
      } else {
        const attempt = ++createAttempt.current;
        if (!pendingCreateId.current) pendingCreateId.current = newPreventivaDocId();
        const docId = pendingCreateId.current;
        clearSaveSoftTimer();
        saveSoftTimer.current = setTimeout(() => {
          saveSoftTimer.current = null;
          if (createAttempt.current === attempt) setUnconfirmedSave({ ...record, id: docId });
        }, SAVE_SOFT_CONFIRM_MS);
        try {
          await savePreventiva({ ...record, uid: user.uid }, docId);
        } finally {
          clearSaveSoftTimer();
          setUnconfirmedSave(null);
        }
        if (createAttempt.current !== attempt) {
          await reconcileLateCreate(user.uid, docId);
          setSaveState("idle");
          return false;
        }
        pendingCreateId.current = null;
        setRecords([{ ...record, id: docId }, ...records]);
      }
      setSaveState("saved");
      showToast(isUpdate ? "Registro atualizado no Firebase ✓" : "Registro salvo no Firebase ✓");
      setTimeout(() => setSaveState("idle"), 1200);
      return true;
    } catch (e) {
      console.error("Erro ao salvar no Firebase:", e);
      const message = e instanceof Error ? e.message : "Falha desconhecida ao salvar no Firebase.";
      setFormError(`Falha ao salvar no Firebase: ${message}`);
      setFailedRecord(record);
      setSaveState("idle");
      return false;
    }
  }

  async function removeRecord(id: string) {
    if (saveMode === "local") {
      const next = records.filter((r) => r.id !== id);
      await storeLocalRecords(next);
      setSelectedRecordIds((selected) => {
        const nextSelected = new Set(selected);
        nextSelected.delete(id);
        return nextSelected;
      });
      showToast("Registro removido.");
      return;
    }

    if (!user) {
      setFormError("Login necessário para remover registros do Firebase.");
      return;
    }

    setSaveState("saving");
    try {
      await deletePreventiva(id);
      const next = records.filter((r) => r.id !== id);
      setRecords(next);
      setSelectedRecordIds((selected) => {
        const nextSelected = new Set(selected);
        nextSelected.delete(id);
        return nextSelected;
      });
      setSaveState("saved");
      showToast("Registro removido.");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch (e) {
      console.error("Erro ao remover do Firebase:", e);
      setFormError("Falha ao remover registro do Firebase.");
      setSaveState("idle");
    }
  }

  const maxCircuitos = isViaAB(tipo) ? 200 : 60;

  function handleQtdChange(val: string) {
    const n = Math.max(1, Math.min(maxCircuitos, Number(val) || 1));
    setQtdCircuitos(n);
    setCircuitos((prev) => {
      if (n > prev.length) {
        const extra = Array.from({ length: n - prev.length }, (_, i) => createCircuit(prev.length + i + 1, tipo));
        return [...prev, ...extra];
      }
      return prev.slice(0, n);
    });
  }

  function updateCircuit(idx: number, field: string, value: string) {
    setCircuitos((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  }

  const filteredSites = useMemo(() => {
    if (!siteQuery) return SITES.slice(0, 8);
    const q = siteQuery.toLowerCase();
    return SITES.filter((s) => s.name.toLowerCase().includes(q) || s.sigla.toLowerCase().includes(q)).slice(0, 8);
  }, [siteQuery]);

  function resetForm() {
    setData("");
    setTipo("PDT");
    setTipoComplemento("");
    setTipoOutro("");
    setViaSelecionada("ambas");
    setTicket("");
    setTemperatura("");
    setSiteQuery("");
    setSiteSelected(null);
    setQtdCircuitos(defaultCircuitCount("PDT"));
    setCircuitos(Array.from({ length: 8 }, (_, i) => createCircuit(i + 1, "PDT")));
    setCorrenteTotal("");
    setCorrenteR("");
    setCorrenteS("");
    setCorrenteT("");
    setCorrenteViaA("");
    setCorrenteViaB("");
    setCorrenteGeral("");
    setTensaoR("");
    setTensaoS("");
    setTensaoT("");
    setTensaoRS("");
    setTensaoST("");
    setTensaoTR("");
    setTensaoAC("");
    setTensaoDC("");
    setObservacao("");
    setEditingId(null);
    setEditingCriadoEm(null);
    setFormError("");
    setFailedRecord(null);
    abandonCreateAttempt();
  }

  function buildFormSnapshot() {
    return {
      data, tipo, tipoOutro, tipoComplemento, viaSelecionada, ticket, temperatura,
      siteSelected, qtdCircuitos, circuitos,
      correnteTotal, correnteR, correnteS, correnteT, correnteViaA, correnteViaB, correnteGeral,
      tensaoR, tensaoS, tensaoT, tensaoRS, tensaoST, tensaoTR, tensaoAC, tensaoDC,
      observacao,
    };
  }

  function isFormEmpty(snapshot: ReturnType<typeof buildFormSnapshot>) {
    const temMedida = (snapshot.circuitos || []).some((c: any) =>
      ['nome', 'r', 's', 't', 'viaA', 'viaB'].some((k) => String(c?.[k] ?? '').trim() !== ''));
    const temValor = [
      snapshot.correnteTotal, snapshot.correnteR, snapshot.correnteS, snapshot.correnteT,
      snapshot.correnteViaA, snapshot.correnteViaB, snapshot.correnteGeral,
      snapshot.tensaoR, snapshot.tensaoS, snapshot.tensaoT, snapshot.tensaoRS,
      snapshot.tensaoST, snapshot.tensaoTR, snapshot.tensaoAC, snapshot.tensaoDC,
    ].some((v) => String(v ?? '').trim() !== '');
    return !snapshot.data && !snapshot.ticket && !snapshot.temperatura && !snapshot.observacao
      && !snapshot.tipoComplemento && !snapshot.tipoOutro && !snapshot.siteSelected
      && !temMedida && !temValor;
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {
      console.error("Falha ao limpar rascunho local:", e);
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          draftPending.current = true;
          setPendingDraft(parsed);
        }
      }
    } catch (e) {
      console.error("Rascunho local inválido, descartando:", e);
      localStorage.removeItem(DRAFT_KEY);
    } finally {
      draftHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!draftHydrated.current || editingId || pendingDraft || draftPending.current) return;
    const hasStoredDraft = localStorage.getItem(DRAFT_KEY) !== null;
    const snapshot = buildFormSnapshot();
    if (isFormEmpty(snapshot)) {
      if (hasStoredDraft) clearDraft();
      return;
    }
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
      } catch (e) {
        console.error("Falha ao gravar rascunho local:", e);
      }
    }, 800);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (saveMode !== 'firebase') {
      setLocalOnlyCount(0);
      return;
    }
    try {
      const res = localStorage.getItem(STORAGE_KEY);
      const parsed = res ? JSON.parse(res) : [];
      setLocalOnlyCount(Array.isArray(parsed) ? parsed.length : 0);
    } catch (e) {
      console.error("Falha ao contar registros somente locais:", e);
      setLocalOnlyCount(0);
    }
  }, [saveMode, user, failedRecord]);

  function restoreDraft() {
    const d = pendingDraft;
    if (!d) return;
    hydratingEdit.current = true;
    setData(d.data ?? "");
    setTipo(d.tipo ?? "PDT");
    setTipoOutro(d.tipoOutro ?? "");
    setTipoComplemento(d.tipoComplemento ?? "");
    setViaSelecionada(d.viaSelecionada ?? "ambas");
    setTicket(d.ticket ?? "");
    setTemperatura(d.temperatura ?? "");
    setSiteSelected(d.siteSelected ?? null);
    setCircuitos(Array.isArray(d.circuitos) && d.circuitos.length
      ? d.circuitos
      : Array.from({ length: defaultCircuitCount(d.tipo ?? "PDT") }, (_, i) => createCircuit(i + 1, d.tipo ?? "PDT")));
    setQtdCircuitos(Number(d.qtdCircuitos) || defaultCircuitCount(d.tipo ?? "PDT"));
    setCorrenteTotal(d.correnteTotal ?? "");
    setCorrenteR(d.correnteR ?? "");
    setCorrenteS(d.correnteS ?? "");
    setCorrenteT(d.correnteT ?? "");
    setCorrenteViaA(d.correnteViaA ?? "");
    setCorrenteViaB(d.correnteViaB ?? "");
    setCorrenteGeral(d.correnteGeral ?? "");
    setTensaoR(d.tensaoR ?? "");
    setTensaoS(d.tensaoS ?? "");
    setTensaoT(d.tensaoT ?? "");
    setTensaoRS(d.tensaoRS ?? "");
    setTensaoST(d.tensaoST ?? "");
    setTensaoTR(d.tensaoTR ?? "");
    setTensaoAC(d.tensaoAC ?? "");
    setTensaoDC(d.tensaoDC ?? "");
    setObservacao(d.observacao ?? "");
    setEditingId(null);
    setEditingCriadoEm(null);
    setPendingDraft(null);
    draftPending.current = false;
    setTab("novo");
    window.setTimeout(() => { hydratingEdit.current = false; }, 0);
  }

  function discardDraft() {
    clearDraft();
    setPendingDraft(null);
    draftPending.current = false;
    showToast("Rascunho descartado.");
  }

  async function saveFailedRecordLocally() {
    if (!failedRecord) return;
    try {
      const res = localStorage.getItem(STORAGE_KEY);
      const existing: any[] = res ? JSON.parse(res) : [];
      const next = [failedRecord, ...existing.filter((r: any) => r.id !== failedRecord.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setFailedRecord(null);
      setFormError("");
      clearDraft();
      draftPending.current = false;
      setPendingDraft(null);
      resetForm();
      showToast("Salvo só neste dispositivo. NÃO foi enviado ao Firebase.");
    } catch (e) {
      console.error("Falha ao salvar registro neste dispositivo:", e);
      setFormError("Não foi possível salvar neste dispositivo.");
    }
  }

  function continueWaiting() {
    // Fecha o aviso sem desistir da escrita: a promessa continua em aberto, o id fica
    // reservado e um novo "Salvar" reusa o mesmo documento.
    setUnconfirmedSave(null);
  }

  async function saveUnconfirmedLocally() {
    if (!unconfirmedSave) return;
    const rec = unconfirmedSave;
    try {
      const res = localStorage.getItem(STORAGE_KEY);
      const existing: any[] = res ? JSON.parse(res) : [];
      const next = [rec, ...existing.filter((r: any) => r.id !== rec.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      locallySavedIds.current.add(rec.id);
      clearDraft();
      draftPending.current = false;
      setPendingDraft(null);
      resetForm();
      showToast("Salvo só neste dispositivo. O envio original ainda pode chegar ao Firebase e criar duplicata: confira a lista na nuvem antes de enviar de novo.");
    } catch (e) {
      console.error("Falha ao salvar neste dispositivo durante o aviso de confirmação:", e);
      setFormError("Não foi possível salvar neste dispositivo.");
    }
  }

  function startEdit(record: any) {
    abandonCreateAttempt();
    hydratingEdit.current = true;
    const knownTipo = PANEL_TYPES.includes(record.tipo) && record.tipo !== "OUTRO";
    setData(record.data || "");
    if (knownTipo) {
      setTipo(record.tipo);
      setTipoOutro("");
    } else {
      setTipo("OUTRO");
      setTipoOutro(record.tipo || "");
    }
    setTipoComplemento(record.tipoComplemento || "");
    setViaSelecionada(record.viaSelecionada || "ambas");
    setTicket(record.ticket || "");
    setTemperatura(String(record.temperatura ?? ""));
    setSiteSelected(record.site || null);
    setSiteQuery("");
    setSiteOpen(false);
    const loadedCircuitos = Array.isArray(record.circuitos) && record.circuitos.length > 0
      ? record.circuitos
      : Array.from({ length: defaultCircuitCount(knownTipo ? record.tipo : "OUTRO") }, (_, i) => createCircuit(i + 1, knownTipo ? record.tipo : "OUTRO"));
    setQtdCircuitos(loadedCircuitos.length);
    setCircuitos(loadedCircuitos);
    const mc = record.medicaoCorrente || {};
    setCorrenteTotal(mc.total != null ? String(mc.total) : "");
    setCorrenteR(mc.r != null ? String(mc.r) : "");
    setCorrenteS(mc.s != null ? String(mc.s) : "");
    setCorrenteT(mc.t != null ? String(mc.t) : "");
    setCorrenteViaA(mc.viaA != null ? String(mc.viaA) : "");
    setCorrenteViaB(mc.viaB != null ? String(mc.viaB) : "");
    setCorrenteGeral(getCorrenteGeralDC(record));
    setTensaoR(record.tensaoR || "");
    setTensaoS(record.tensaoS || "");
    setTensaoT(record.tensaoT || "");
    setTensaoRS(record.tensaoRS || "");
    setTensaoST(record.tensaoST || "");
    setTensaoTR(record.tensaoTR || "");
    setTensaoAC(record.tensaoAC || "");
    setTensaoDC(record.tensaoDC || "");
    setObservacao(record.observacao || "");
    setEditingId(record.id);
    setEditingCriadoEm(record.criadoEm ?? null);
    setFormError("");
    setViewRecord(null);
    setTab("novo");
    window.setTimeout(() => {
      hydratingEdit.current = false;
    }, 0);
  }

  async function handleSave() {
    if (!data) return setFormError("Informe a data da preventiva.");
    if (!siteSelected) return setFormError("Selecione o Site/Hub na lista.");
    if (!ticket.trim()) return setFormError("Informe o número do ticket.");
    if (!temperatura.trim()) return setFormError("Informe a temperatura do quadro.");
    if (tipo === "OUTRO" && !tipoOutro.trim()) return setFormError("Informe o tipo de quadro (campo Outro).");
    setFormError("");

    const finalTipo = tipo === "OUTRO" ? tipoOutro.trim().toUpperCase() : tipo;
    const medicaoCorrente = isViaAB(tipo)
      ? {
          viaA: (viaSelecionada === "A" || viaSelecionada === "ambas") ? correnteViaA.trim() : "",
          viaB: (viaSelecionada === "B" || viaSelecionada === "ambas") ? correnteViaB.trim() : "",
          geral: correnteGeral.trim(),
        }
      : { total: correnteTotal.trim(), r: correnteR.trim(), s: correnteS.trim(), t: correnteT.trim() };

    const isEdit = Boolean(editingId);
    const record = {
      id: isEdit ? editingId : uid(),
      data,
      tipo: finalTipo,
      tipoComplemento: tipoComplemento.trim(),
      ...(isViaAB(tipo) ? { viaSelecionada } : {}),
      ticket: ticket.trim(),
      temperatura: temperatura.trim(),
      site: siteSelected,
      circuitos,
      medicaoCorrente,
      tensaoR: tensaoR.trim(),
      tensaoS: tensaoS.trim(),
      tensaoT: tensaoT.trim(),
      tensaoRS: tensaoRS.trim(),
      tensaoST: tensaoST.trim(),
      tensaoTR: tensaoTR.trim(),
      tensaoAC: tensaoAC.trim(),
      tensaoDC: isViaAB(tipo) ? correnteGeral.trim() : tensaoDC.trim(),
      observacao: observacao.trim(),
      criadoEm: isEdit ? (editingCriadoEm ?? new Date().toISOString()) : new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    const next = isEdit
      ? records.map((r) => (r.id === editingId ? record : r))
      : [record, ...records];

    const saved = await persist(record, next, isEdit);
    if (!saved) return;
    if (!isEdit) {
      clearDraft();
      draftPending.current = false;
      setPendingDraft(null);
    }
    resetForm();
    setTab("registros");
  }

  async function confirmDelete(id: string) {
    await removeRecord(id);
    setDeleteTarget(null);
    if (viewRecord && viewRecord.id === id) setViewRecord(null);
  }

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (fData && r.data !== fData) return false;
      if (fTipo && r.tipo !== fTipo) return false;
      if (fSite && !r.site.name.toLowerCase().includes(fSite.toLowerCase())) return false;
      if (fSigla && !r.site.sigla.toLowerCase().includes(fSigla.toLowerCase())) return false;
      if (fVia && isViaAB(r.tipo) && r.viaSelecionada && r.viaSelecionada !== fVia) return false;
      return true;
    });
  }, [records, fData, fSite, fTipo, fSigla, fVia]);

  const selectedRecords = records.filter((record) => selectedRecordIds.has(record.id));
  const allFilteredSelected = filteredRecords.length > 0
    && filteredRecords.every((record) => selectedRecordIds.has(record.id));

  function toggleFilteredSelection() {
    setSelectedRecordIds((selected) => {
      const next = new Set(selected);
      filteredRecords.forEach((record) => {
        if (allFilteredSelected) next.delete(record.id);
        else next.add(record.id);
      });
      return next;
    });
  }

  function toggleRecordSelection(id: string) {
    setSelectedRecordIds((selected) => {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function confirmBulkDelete() {
    const ids = selectedRecords.map((record) => record.id);
    if (ids.length === 0 || bulkDeleteInProgress) return;

    setBulkDeleteInProgress(true);
    setBulkDeleteError("");
    try {
      const next = records.filter((record) => !selectedRecordIds.has(record.id));
      if (saveMode === "local") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecords(next);
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1200);
      } else {
        if (!user) {
          setBulkDeleteError("Login necessário para remover registros do Firebase.");
          return;
        }
        setSaveState("saving");
        await deletePreventivas(ids);
        setRecords(next);
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1200);
      }

      setSelectedRecordIds(new Set());
      setBulkDeleteConfirm(false);
      setDeleteTarget(null);
      if (viewRecord && selectedRecordIds.has(viewRecord.id)) setViewRecord(null);
      showToast(`${ids.length} registro(s) removido(s).`);
    } catch (e) {
      console.error("Erro ao remover registros selecionados:", e);
      setBulkDeleteError("Falha ao remover os registros selecionados. Tente novamente.");
      setSaveState("idle");
    } finally {
      setBulkDeleteInProgress(false);
    }
  }

  const stats = useMemo(() => {
    const uniqueSites = new Set(records.map((r) => r.site.sigla)).size;
    const last = records[0];
    return {
      total: records.length,
      sites: uniqueSites,
      ultimaTemp: last ? `${last.temperatura}°C` : "—",
    };
  }, [records]);

  function handleExport() {
    if (records.length === 0) {
      showToast("Nenhum registro para exportar.");
      return;
    }
    exportToJSON(records);
    showToast("Exportação iniciada ✓");
    setShowExportModal(false);
  }

  async function handleImport() {
    if (!importFile) {
      setImportError("Selecione um arquivo primeiro.");
      return;
    }
    try {
      setImportError("");
      const imported = await importFromJSON(importFile);

      if (saveMode === "local") {
        const existentes = new Set(records.map((r: any) => r.id));
        const porId = new Map(records.map((r: any) => [r.id, r]));
        imported.forEach((r: any) => porId.set(r.id, r));
        const idsImportados = new Set(imported.map((r: any) => r.id));
        const novos = [...idsImportados].filter((id) => !existentes.has(id)).length;
        const next = [...idsImportados].map((id) => porId.get(id)).concat(
          records.filter((r: any) => !idsImportados.has(r.id))
        ).sort((a: any, b: any) => createdAtMs(b.criadoEm) - createdAtMs(a.criadoEm));
        await storeLocalRecords(next);
        showToast(`Importados ${idsImportados.size} registros (${novos} novos, ${idsImportados.size - novos} atualizados) ✓`);
      } else {
        if (!user) {
          setImportError("Login necessário para importar no Firebase.");
          return;
        }

        await importPreventivas(imported, user.uid);
        const firebaseRecords = await getPreventivas(user.uid);
        setRecords(firebaseRecords);
        showToast(`Importados ${imported.length} registros no Firebase ✓`);
      }

      setShowImportModal(false);
      setImportFile(null);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Erro desconhecido.");
    }
  }

  function handleImportFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImportFile(file);
    setImportError("");
  }

  async function handleClearAll() {
    if (userRole !== 'admin') {
      showToast('Apenas administradores podem limpar os registros.');
      setShowClearModal(false);
      return;
    }

    if (clearConfirmText.trim() !== "LIMPAR") {
      showToast('Digite "LIMPAR" para confirmar.');
      return;
    }

    try {
      setClearProgress({ total: records.length, done: 0 });

      if (saveMode === "local") {
        await storeLocalRecords([]);
        setClearProgress({ total: records.length, done: records.length });
        showToast(`${records.length} registro(s) apagado(s) localmente.`);
      } else {
        if (!user) {
          showToast("Login necessário para apagar no Firebase.");
          setClearProgress(null);
          return;
        }

        const total = await deleteAllPreventivas(user.uid);
        let apagados = total;
        let falhas = 0;
        if (total === 0 && records.length > 0) {
          for (let i = 0; i < records.length; i++) {
            try {
              await deletePreventiva(records[i].id);
              apagados++;
            } catch {
              falhas++;
            }
            setClearProgress({ total: records.length, done: i + 1 });
          }
        } else {
          setClearProgress({ total: Math.max(total, records.length), done: Math.max(total, records.length) });
        }

        try {
          const refresh = await getPreventivas(user.uid);
          setRecords(refresh);
        } catch {
          setRecords([]);
        }
        showToast(
          falhas > 0
            ? `${apagados} registro(s) apagado(s) do Firebase; ${falhas} falha(s).`
            : `${apagados} registro(s) apagado(s) do Firebase.`
        );
      }

      setTimeout(() => {
        setShowClearModal(false);
        setClearConfirmText("");
        setClearProgress(null);
      }, 600);
    } catch (err) {
      console.error("Erro ao limpar banco:", err);
      showToast("Falha ao limpar banco. Verifique o console.");
      setClearProgress(null);
    }
  }

  const loadPendingInvites = async () => {
    if (userRole !== 'admin') return;
    setPendingInvitesLoading(true);
    setPendingInvitesError('');
    try {
      const invites = await listUnusedInvites();
      setPendingInvites(invites.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      console.error('Erro ao listar convites pendentes:', err);
      setPendingInvites([]);
      setPendingInvitesError('Falha ao listar convites. A regra de listagem precisa estar publicada no Firestore com papel de admin.');
    } finally {
      setPendingInvitesLoading(false);
    }
  };

  const revokePendingInvite = async (token: string) => {
    setPendingInvitesLoading(true);
    try {
      await revokeInvite(token);
      setPendingInvites((prev) => prev.filter((invite) => invite.token !== token));
      showToast('Convite revogado.');
    } catch (err) {
      console.error('Erro ao revogar convite:', err);
      showToast('Falha ao revogar o convite.');
    } finally {
      setRevokeTarget(null);
      setPendingInvitesLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Carregando...</div>;
  if (saveMode === "firebase" && !user) {
    return <Login onSwitchMode={() => setSaveMode('local')} externalError={authError || undefined} allowFirstAdminSignup={firstAdminAvailable} />;
  }

  const userLabel = user ? `${user.email}${userRole === 'admin' ? ' (Administrador)' : ''}` : 'Modo local';

  const handleHeaderAction = () => {
    if (user) {
      logout();
      return;
    }

    showToast('Modo local ativo');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-3">
          <img src={appMark} alt="" className="w-9 h-9 rounded-lg shrink-0" />
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Preventivas Elétricas</h1>
            <p className="text-xs text-slate-400">Medições de tensão e corrente em quadros energizados ({userLabel})</p>
          </div>
          <button
            onClick={handleHeaderAction}
            className={`ml-auto flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${user ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-800/70 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            title={user ? 'Sair' : 'Modo local'}
          >
            <LogOut size={15} />
            <span>{user ? 'Sair' : 'Modo local'}</span>
          </button>
          <div className="flex gap-4 font-mono text-sm ml-4">
            <Readout label="REGISTROS" value={stats.total} />
            <Readout label="SITES" value={stats.sites} />
            <Readout label="ÚLT. TEMP" value={stats.ultimaTemp} accent />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-5 flex gap-1 border-t border-slate-800">
          <TabButton active={tab === "novo"} onClick={() => setTab("novo")}>
            {editingId ? "Editar Registro" : "Novo Registro"}
          </TabButton>
          <TabButton active={tab === "registros"} onClick={() => setTab("registros")}>
            Registros Salvos {records.length > 0 && <span className="text-slate-500">({records.length})</span>}
          </TabButton>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-6">
        {profileWarning && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-800/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span role="status">{profileWarning}</span>
          </div>
        )}

        {pendingDraft && (
          <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
            <span role="status" className="flex items-center gap-2">
              <AlertTriangle size={13} className="shrink-0 text-amber-400" aria-hidden="true" />
              Há um rascunho não salvo
              {pendingDraft.ticket ? ` (ticket ${pendingDraft.ticket})` : ''}
              {pendingDraft.data ? ` — ${formatDateBR(pendingDraft.data)}` : ''}
            </span>
            <span className="ml-auto flex gap-2">
              <button type="button" onClick={restoreDraft}
                className="px-2.5 py-1 rounded border border-emerald-700 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/40">
                Restaurar
              </button>
              <button type="button" onClick={discardDraft}
                className="px-2.5 py-1 rounded border border-slate-700 text-slate-400 hover:bg-slate-800">
                Descartar
              </button>
            </span>
          </div>
        )}

        {unconfirmedSave && (
          <div role="status" className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-amber-900/70 bg-amber-950/25 px-3 py-2 text-xs text-amber-200">
            <span className="flex items-center gap-2">
              <AlertTriangle size={13} className="shrink-0" aria-hidden="true" />
              Sem confirmação do servidor. O registro pode ser enviado quando a conexão voltar.
              Confira a lista antes de enviar de novo.
            </span>
            <span className="ml-auto flex gap-2">
              <button type="button" onClick={continueWaiting}
                className="px-2.5 py-1 rounded border border-slate-700 text-slate-300 hover:bg-slate-800">
                Continuar aguardando
              </button>
              <button type="button" onClick={saveUnconfirmedLocally}
                className="px-2.5 py-1 rounded border border-emerald-700 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/40 flex items-center gap-1.5">
                <Save size={13} aria-hidden="true" /> Salvar neste dispositivo (Modo Local)
              </button>
            </span>
          </div>
        )}

        {saveMode === 'firebase' && localOnlyCount > 0 && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-400">
            <Database size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              {localOnlyCount} registro(s) só neste dispositivo (Modo Local). Para enviá-los:
              Exportar JSON no Modo Local → Importar no Modo Firebase.
            </span>
          </div>
        )}

        {!loaded && <p className="text-slate-500 text-sm">Carregando dados...</p>}

        {loaded && tab === "novo" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex flex-wrap gap-2 items-center text-xs text-slate-400 uppercase tracking-wide">
                <span>Modo de salvamento:</span>
                <button type="button" onClick={() => setSaveMode('local')}
                  className={`rounded-full px-3 py-1 text-xs ${saveMode === 'local' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  Local
                </button>
                <button type="button" onClick={() => setSaveMode('firebase')}
                  className={`rounded-full px-3 py-1 text-xs ${saveMode === 'firebase' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  Firebase
                </button>
              </div>
              <p className="text-xs text-slate-500 sm:ml-auto">
                {saveMode === 'local'
                  ? 'Registros ficam armazenados no dispositivo atual. Exporte seus dados a qualquer momento.'
                  : user
                    ? `Salvando no Firebase como ${user.email}`
                    : 'Será necessário fazer login para salvar no Firebase.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setShowExportModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">
                <Download size={12} /> Exportar JSON
              </button>
              <button type="button" onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700">
                <Upload size={12} /> Importar JSON
              </button>
              {userRole === 'admin' && (
                <button type="button" onClick={() => { setClearConfirmText(""); setClearProgress(null); setShowClearModal(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800">
                  <Trash2 size={12} /> Limpar meus registros
                </button>
              )}
              {userRole === 'admin' && (
                <button type="button" onClick={() => {
                  setInviteError('');
                  setInviteToken('');
                  setShowInviteModal(true);
                }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900 border border-emerald-800">
                  <Plus size={12} /> Gerar convite
                </button>
              )}
              <span className="text-xs text-slate-500 self-center">{records.length} registro(s) salvos</span>
            </div>
            {inviteError && (
              <div className="rounded-lg border border-red-700 bg-red-950/40 p-3 text-xs text-red-200 mt-3">
                {inviteError}
              </div>
            )}
            {userRole === 'admin' && (
              <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-slate-200">Convites pendentes</h3>
                  <div className="flex gap-2">
                    <button type="button"
                      onClick={() => { const next = !showPendingInvites; setShowPendingInvites(next); if (next) void loadPendingInvites(); }}
                      className="px-2.5 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800">
                      {showPendingInvites ? 'Ocultar' : 'Ver lista'}
                    </button>
                    {showPendingInvites && (
                      <button type="button" disabled={pendingInvitesLoading} onClick={() => void loadPendingInvites()}
                        className="px-2.5 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50">
                        {pendingInvitesLoading ? 'Carregando...' : 'Atualizar'}
                      </button>
                    )}
                  </div>
                </div>
                {showPendingInvites && (
                  <div className="mt-2 space-y-1">
                    {pendingInvitesError && <p className="text-xs text-red-300">{pendingInvitesError}</p>}
                    {!pendingInvitesError && !pendingInvitesLoading && pendingInvites.length === 0 && (
                      <p className="text-xs text-slate-500">Nenhum convite sem uso.</p>
                    )}
                    {pendingInvites.map((invite) => (
                      <div key={invite.token} className="flex items-center gap-2 text-xs rounded border border-slate-800 bg-slate-950/60 px-2 py-1.5">
                        <span className="font-mono text-slate-400 truncate" title={invite.token}>{invite.token.slice(0, 12)}…</span>
                        <span className="text-slate-500">{invite.role}</span>
                        <span className="ml-auto shrink-0 text-slate-600">{new Date(invite.createdAt).toLocaleDateString('pt-BR')}</span>
                        {revokeTarget === invite.token ? (
                          <span className="shrink-0">
                            <button type="button" onClick={() => void revokePendingInvite(invite.token)} className="text-red-400 hover:text-red-300 mr-2">Confirmar</button>
                            <button type="button" onClick={() => setRevokeTarget(null)} className="text-slate-500 hover:text-slate-300">Cancelar</button>
                          </span>
                        ) : (
                          <button type="button" disabled={pendingInvitesLoading} onClick={() => setRevokeTarget(invite.token)}
                            className="shrink-0 text-red-400 hover:text-red-300 disabled:opacity-50">
                            Revogar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {editingId && (
              <div className="flex items-center justify-between gap-3 text-sm bg-amber-950/40 border border-amber-900 rounded px-3 py-2 text-amber-200">
                <span>Editando registro existente. Ao salvar, os dados atuais serão substituídos.</span>
                <button type="button" onClick={resetForm} className="text-xs underline text-amber-100 hover:text-white shrink-0">
                  Cancelar edição
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Data da preventiva" icon={<Calendar size={14} />}>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600" />
              </Field>
              <Field label="Nº do Ticket" icon={<Ticket size={14} />}>
                <input type="text" value={ticket} onChange={(e) => setTicket(e.target.value)} placeholder="Ex: 14368780"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600" />
              </Field>
              <Field label="Temperatura do quadro (°C)" icon={<Thermometer size={14} />}>
                <input type="number" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} placeholder="Ex: 25"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Tipo de quadro">
                <div className="flex flex-col sm:flex-row gap-2">
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}
                    className="min-w-[150px] bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600">
                    {PANEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <input type="text" value={tipoComplemento} onChange={(e) => setTipoComplemento(e.target.value)} placeholder="Complemento (ex: 01, 02)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600" />
                </div>
                {tipo === "OUTRO" && (
                  <div className="mt-2">
                    <input type="text" value={tipoOutro} onChange={(e) => setTipoOutro(e.target.value)}
                      placeholder="Tipo específico (ex: QDGE)"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-red-600" />
                    <p className="text-xs text-slate-500 mt-2">Informe o tipo de quadro específico (ex: QDGE).</p>
                  </div>
                )}
                {isViaAB(tipo) && (
                  <div className="mt-3">
                    <label className="text-xs text-slate-400 block mb-1">Via(s) para preencher</label>
                    <div className="flex gap-2">
                      {(["ambas", "A", "B"] as const).map((v) => (
                        <button key={v} type="button" onClick={() => setViaSelecionada(v)}
                          className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                            viaSelecionada === v
                              ? "bg-red-600 border-red-500 text-white"
                              : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800"
                          }`}>
                          {v === "ambas" ? "Ambas" : `Via ${v}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  {isViaAB(tipo)
                    ? "QDF/QDCC: preencha Via A, Via B ou ambas conforme o quadro."
                    : usesTresFases(tipo)
                      ? "PDT/OUTRO: preenche Med. R, S e T. OUTRO inclui campo Nome."
                      : "Outros: preenche Med. R por circuito."}
                </p>
              </Field>

              <Field label="Site / Hub" icon={<Search size={14} />}>
                <div className="relative">
                  <input
                    type="text"
                    value={siteSelected ? `${siteSelected.name} (${siteSelected.sigla})` : siteQuery}
                    onChange={(e) => { setSiteSelected(null); setSiteQuery(e.target.value); setSiteOpen(true); }}
                    onFocus={() => setSiteOpen(true)}
                    placeholder="Buscar por nome ou sigla..."
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {siteOpen && !siteSelected && (
                    <div className="absolute z-10 mt-1 w-full bg-slate-900 border border-slate-700 rounded shadow-lg max-h-56 overflow-y-auto">
                      {filteredSites.length === 0 && <div className="px-3 py-2 text-sm text-slate-500">Nenhum site encontrado</div>}
                      {filteredSites.map((s) => (
                        <button key={s.sigla + s.name} type="button"
                          onClick={() => { setSiteSelected(s); setSiteOpen(false); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-800 flex justify-between items-center">
                          <span>{s.name}</span>
                          <span className="text-xs text-slate-500 font-mono">{s.cat} · {s.sigla}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>
            </div>

            <div className="border border-slate-800 rounded-lg p-4">
              <span className="text-sm font-medium block mb-3">Medição de Corrente do Quadro</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {isViaAB(tipo) ? (
                  <>
                    <Field label="TENSÃO DC (V)">
                      <input type="text" value={tensaoAC} onChange={(e) => setTensaoAC(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Tensão (V) Fase R">
                      <input type="text" value={tensaoR} onChange={(e) => setTensaoR(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
                    </Field>
                    <Field label="Tensão (V) Fase S">
                      <input type="text" value={tensaoS} onChange={(e) => setTensaoS(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
                    </Field>
                    <Field label="Tensão (V) Fase T">
                      <input type="text" value={tensaoT} onChange={(e) => setTensaoT(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
                    </Field>
                    <div className="sm:col-span-full mt-1 mb-1 text-[11px] uppercase tracking-wider text-slate-500">
                      Tensão composta (entre fases)
                    </div>
                    <Field label="Tensão (V) Fase RS">
                      <input type="text" value={tensaoRS} onChange={(e) => setTensaoRS(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
                    </Field>
                    <Field label="Tensão (V) Fase ST">
                      <input type="text" value={tensaoST} onChange={(e) => setTensaoST(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
                    </Field>
                    <Field label="Tensão (V) Fase TR">
                      <input type="text" value={tensaoTR} onChange={(e) => setTensaoTR(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
                    </Field>
                  </>
                )}
                {isViaAB(tipo) ? (
                  <>
                    <div className="sm:col-span-full mt-1 mb-1 text-[11px] uppercase tracking-wider text-slate-500">
                      Correntes (soma automática dos disjuntores)
                    </div>
                    <Field label="Corrente Via A">
                      <input type="number" step="0.1" value={correnteViaA} readOnly
                        aria-label="Corrente da via A"
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                    <Field label="Corrente Via B">
                      <input type="number" step="0.1" value={correnteViaB} readOnly
                        aria-label="Corrente da via B"
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                    <Field label="Geral DC (A+B)">
                      <input type="number" step="0.1" value={correnteGeral} readOnly
                        aria-label="Corrente geral DC (A+B)"
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                  </>
                ) : usesTresFases(tipo) ? (
                  <>
                    <div className="sm:col-span-full mt-1 mb-1 text-[11px] uppercase tracking-wider text-slate-500">
                      Correntes por Fase (soma automática dos disjuntores)
                    </div>
                    <Field label="Fase R">
                      <input type="number" step="0.1" value={correnteR} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                    <Field label="Fase S">
                      <input type="number" step="0.1" value={correnteS} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                    <Field label="Fase T">
                      <input type="number" step="0.1" value={correnteT} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                  </>
                ) : (
                  <Field label="Corrente Total">
                    <input type="number" step="0.1" value={correnteTotal} readOnly
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                  </Field>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {isViaAB(tipo)
                  ? viaSelecionada === "ambas"
                    ? "QDF/QDCC: a corrente geral DC é a soma automática dos disjuntores das vias A e B."
                    : `QDF/QDCC: a corrente geral DC soma sempre as vias A e B; o filtro Via ${viaSelecionada} só define quais vias aparecem nos disjuntores.`
                  : usesTresFases(tipo)
                    ? "PDT/OUTRO: valores de R, S e T são somados automaticamente dos disjuntores."
                    : "Valores de R são somados automaticamente dos disjuntores."}
              </p>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-slate-900 px-4 py-3 border-b border-slate-800">
                <span className="text-sm font-medium">Disjuntores de Distribuição</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Circuitos:</span>
                  <input type="number" min={1} max={maxCircuitos} value={qtdCircuitos}
                    onChange={(e) => handleQtdChange(e.target.value)}
                    className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center font-mono" />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-900 text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="text-left px-4 py-2 w-20">Nº</th>
                      {tipo === "OUTRO" && <th className="text-left px-4 py-2">Nome do Disjuntor</th>}
                      {isViaAB(tipo) ? (
                        <>
                          <th className="text-left px-4 py-2">Via A (A)</th>
                          <th className="text-left px-4 py-2">Via B (A)</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left px-4 py-2">Med. R (A)</th>
                          {usesTresFases(tipo) && <th className="text-left px-4 py-2">Med. S (A)</th>}
                          {usesTresFases(tipo) && <th className="text-left px-4 py-2">Med. T (A)</th>}
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {circuitos.map((c, idx) => (
                      <tr key={c.n} className={idx % 2 ? "bg-slate-900/40" : ""}>
                        <td className="px-4 py-1.5 font-mono text-slate-400">{String(c.n).padStart(2, "0")}</td>
                        {tipo === "OUTRO" && (
                          <td className="px-4 py-1.5">
                            <input type="text" value={c.nome || ""} onChange={(e) => updateCircuit(idx, "nome", e.target.value)}
                              placeholder="Nome"
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-600" />
                          </td>
                        )}
                        {isViaAB(tipo) ? (
                          <>
                            <td className="px-4 py-1.5">
                              {viaSelecionada === "B" ? (
                                <span className="w-24 inline-block text-center font-mono text-slate-600">-</span>
                              ) : (
                                <input type="number" step="0.1" value={c.viaA || ""} onChange={(e) => updateCircuit(idx, "viaA", e.target.value)}
                                  className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-red-400 focus:outline-none focus:ring-1 focus:ring-red-600" />
                              )}
                            </td>
                            <td className="px-4 py-1.5">
                              {viaSelecionada === "A" ? (
                                <span className="w-24 inline-block text-center font-mono text-slate-600">-</span>
                              ) : (
                                <input type="number" step="0.1" value={c.viaB || ""} onChange={(e) => updateCircuit(idx, "viaB", e.target.value)}
                                  className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-red-400 focus:outline-none focus:ring-1 focus:ring-red-600" />
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-1.5">
                              <input type="number" step="0.1" value={c.r || ""} onChange={(e) => updateCircuit(idx, "r", e.target.value)}
                                className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-red-400 focus:outline-none focus:ring-1 focus:ring-red-600" />
                            </td>
                            {usesTresFases(tipo) && (
                              <td className="px-4 py-1.5">
                                <input type="number" step="0.1" value={c.s || ""} onChange={(e) => updateCircuit(idx, "s", e.target.value)}
                                  className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-red-400 focus:outline-none focus:ring-1 focus:ring-red-600" />
                              </td>
                            )}
                            {usesTresFases(tipo) && (
                              <td className="px-4 py-1.5">
                                <input type="number" step="0.1" value={c.t || ""} onChange={(e) => updateCircuit(idx, "t", e.target.value)}
                                  className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-red-400 focus:outline-none focus:ring-1 focus:ring-red-600" />
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Field label="Observação">
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Anotações da preventiva (opcional)"
                aria-label="Observação da preventiva"
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-y min-h-[80px]"
              />
            </Field>

            {formError && (
              <div className="rounded border border-amber-900 bg-amber-950/40 px-3 py-2">
                <div className="flex items-center gap-2 text-sm text-amber-400">
                  <AlertTriangle size={14} /> {formError}
                </div>
                {failedRecord && (
                  <button
                    type="button"
                    onClick={saveFailedRecordLocally}
                    className="mt-2 flex items-center gap-2 px-3 py-1.5 text-xs rounded border border-emerald-700 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/40"
                  >
                    <Save size={13} aria-hidden="true" /> Salvar neste dispositivo (Modo Local)
                  </button>
                )}
              </div>
            )}
            {saveMode === 'firebase' && firebaseSyncError && (
              <div className="text-sm text-red-300 bg-red-950/30 border border-red-900 rounded px-3 py-2">
                {firebaseSyncError}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="px-4 py-2 text-sm rounded border border-slate-700 text-slate-300 hover:bg-slate-900">
                Limpar
              </button>
              <button onClick={handleSave}
                className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 font-medium">
                <Save size={14} /> {editingId ? "Salvar alterações" : "Salvar registro"}
              </button>
            </div>
          </div>
        )}

        {loaded && tab === "registros" && (
          <div className="space-y-4">
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/50">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 uppercase tracking-wide">
                <Filter size={12} /> Filtros
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input type="date" value={fData} onChange={(e) => setFData(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm" />
                <input type="text" placeholder="Site/Hub" value={fSite} onChange={(e) => setFSite(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm" />
                <select value={fTipo} onChange={(e) => { setFTipo(e.target.value); setFVia(""); }}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm">
                  <option value="">Todos os tipos</option>
                  {Array.from(new Set(records.map(r => r.tipo))).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {isViaAB(fTipo) && (
                  <select value={fVia} onChange={(e) => setFVia(e.target.value as "" | "A" | "B" | "ambas")}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm">
                    <option value="">Todas as vias</option>
                    <option value="A">Via A</option>
                    <option value="B">Via B</option>
                    <option value="ambas">Ambas</option>
                  </select>
                )}
                <input type="text" placeholder="Sigla" value={fSigla} onChange={(e) => setFSigla(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleFilteredSelection}
                disabled={filteredRecords.length === 0 || bulkDeleteInProgress}
                aria-pressed={allFilteredSelected}
                className="px-3 py-1.5 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                {allFilteredSelected ? "Desmarcar exibidos" : "Selecionar exibidos"}
              </button>
              <span className="text-xs text-slate-400">
                {selectedRecords.length} registro(s) selecionado(s)
              </span>
              {bulkDeleteConfirm ? (
                <>
                  <span className="text-xs text-red-300">Excluir os {selectedRecords.length} selecionados?</span>
                  <button
                    type="button"
                    onClick={() => void confirmBulkDelete()}
                    disabled={bulkDeleteInProgress || selectedRecords.length === 0}
                    className="px-3 py-1.5 text-xs rounded bg-red-700 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {bulkDeleteInProgress ? "Excluindo..." : "Confirmar exclusão"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBulkDeleteConfirm(false); setBulkDeleteError(""); }}
                    disabled={bulkDeleteInProgress}
                    className="px-3 py-1.5 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => { setBulkDeleteConfirm(true); setBulkDeleteError(""); }}
                  disabled={selectedRecords.length === 0 || bulkDeleteInProgress}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-red-800 bg-red-950/60 text-red-300 hover:bg-red-900 disabled:opacity-50"
                >
                  <Trash2 size={12} /> Excluir selecionados
                </button>
              )}
            </div>
            {bulkDeleteError && (
              <div role="alert" className="rounded border border-red-900 bg-red-950/30 px-3 py-2 text-sm text-red-300">
                {bulkDeleteError}
              </div>
            )}

            {filteredRecords.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-10">Nenhum registro encontrado.</p>
            ) : (
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="text-center px-3 py-2">Selecionar</th>
                      <th className="text-left px-3 py-2">Data</th>
                      <th className="text-left px-3 py-2">Site / Hub</th>
                      <th className="text-left px-3 py-2">Sigla</th>
                      <th className="text-left px-3 py-2">Tipo</th>
                      <th className="text-left px-3 py-2">Ticket</th>
                      <th className="text-left px-3 py-2">Temp.</th>
                      <th className="text-right px-3 py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((r) => (
                      <tr key={r.id} className="border-t border-slate-800 hover:bg-slate-900/40">
                        <td className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedRecordIds.has(r.id)}
                            onChange={() => toggleRecordSelection(r.id)}
                            disabled={bulkDeleteInProgress}
                            aria-label={`Selecionar preventiva de ${r.site.name}, ${formatDateBR(r.data)}`}
                            className="accent-red-600"
                          />
                        </td>
                        <td className="px-3 py-2 font-mono">{formatDateBR(r.data)}</td>
                        <td className="px-3 py-2">{r.site.name}</td>
                        <td className="px-3 py-2 font-mono text-slate-400">{r.site.sigla}</td>
                        <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-slate-800 text-xs font-mono">{r.tipo}{r.tipoComplemento ? ` ${r.tipoComplemento}` : ""}</span></td>
                        <td className="px-3 py-2 font-mono text-slate-400">{r.ticket}</td>
                        <td className="px-3 py-2 font-mono text-red-400">{r.temperatura}°C</td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <button type="button" onClick={() => setViewRecord(r)} className="text-xs text-slate-300 hover:text-white underline mr-3">Ver</button>
                          <button
                            type="button"
                            onClick={() => startEdit(r)}
                            className="text-xs text-slate-300 hover:text-white mr-3 inline-flex items-center gap-1"
                            aria-label={`Editar preventiva de ${r.site.name}`}
                          >
                            <Pencil size={13} /> Editar
                          </button>
                          {deleteTarget === r.id ? (
                            <span className="text-xs">
                              <button onClick={() => confirmDelete(r.id)} className="text-red-400 hover:text-red-300 mr-2">Confirmar</button>
                              <button onClick={() => setDeleteTarget(null)} className="text-slate-500 hover:text-slate-300">Cancelar</button>
                            </span>
                          ) : (
                            <button onClick={() => setDeleteTarget(r.id)} className="text-xs text-slate-500 hover:text-red-400">
                              <Trash2 size={13} className="inline" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="fixed bottom-4 right-4 text-xs text-slate-600 font-mono">
          {saveState === "saving" && "salvando..."}
          {saveState === "saved" && "salvo ✓"}
        </div>

        {showExportModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-20">
            <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Exportar Dados</h3>
                <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Exportar {records.length} registro(s) como arquivo JSON para armazenamento local ou backup.
              </p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowExportModal(false)} className="px-4 py-2 text-sm rounded border border-slate-700 text-slate-300 hover:bg-slate-800">Cancelar</button>
                <button onClick={handleExport} className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-2">
                  <Download size={14} /> Exportar
                </button>
              </div>
            </div>
          </div>
        )}

        {showImportModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-20">
            <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Importar Dados</h3>
                <button onClick={() => { setShowImportModal(false); setImportFile(null); setImportError(""); }} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <p className="text-sm text-slate-400 mb-4">Selecione um arquivo JSON previamente exportado.</p>
              <input type="file" accept=".json" onChange={handleImportFileChange} className="w-full text-sm text-slate-400 mb-3" />
              {importError && (
                <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded px-3 py-2 mb-3">{importError}</div>
              )}
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setShowImportModal(false); setImportFile(null); setImportError(""); }} className="px-4 py-2 text-sm rounded border border-slate-700 text-slate-300 hover:bg-slate-800">Cancelar</button>
                <button onClick={handleImport} className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-2">
                  <Upload size={14} /> Importar
                </button>
              </div>
            </div>
          </div>
        )}

        {showInviteModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-20">
            <div className="bg-slate-900 border border-emerald-700/60 rounded-lg max-w-md w-full p-6 shadow-2xl shadow-emerald-900/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">Gerar convite de usuário</h3>
                  <p className="text-xs text-slate-500">Crie um código temporário para permitir o cadastro de um novo usuário no Firebase.</p>
                </div>
                <button onClick={() => { setShowInviteModal(false); setInviteToken(''); setInviteError(''); setInviteCreatedAt(null); }} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              {inviteError && (
                <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded px-3 py-2 mb-4">{inviteError}</div>
              )}
              {inviteToken ? (
                <div className="rounded-lg border border-emerald-700 bg-emerald-950/40 p-4 text-xs text-emerald-200 mb-4">
                  <div className="font-semibold text-emerald-100 mb-2">Convite criado</div>
                  <div className="font-mono break-all">{inviteToken}</div>
                </div>
              ) : (
                <div className="text-sm text-slate-300 mb-4">
                  Clique em Gerar para criar um novo convite. Copie o token e compartilhe com quem deve se cadastrar.
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setShowInviteModal(false); setInviteToken(''); setInviteError(''); setInviteCreatedAt(null); }} className="px-4 py-2 text-sm rounded border border-slate-700 text-slate-300 hover:bg-slate-800">Cancelar</button>
                <button type="button" disabled={inviteLoading} onClick={async () => {
                  setInviteLoading(true);
                  setInviteError('');
                  try {
                    const token = await createInvite('user', user!.uid);
                    setInviteToken(token);
                    setInviteCreatedAt(Date.now());
                  } catch (err) {
                    console.error('Erro ao gerar convite:', err);
                    setInviteError('Falha ao gerar convite.');
                  } finally {
                    setInviteLoading(false);
                  }
                }} className="px-4 py-2 text-sm rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-60 disabled:cursor-not-allowed">
                  {inviteLoading ? 'Gerando...' : 'Gerar convite'}
                </button>
              </div>
            </div>
          </div>
        )}
        {showClearModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-20">
            <div className="bg-slate-900 border border-red-900/60 rounded-lg max-w-md w-full p-6 shadow-2xl shadow-red-900/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-950 border border-red-800 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-red-100">Limpar meus registros</h3>
                    <p className="text-xs text-slate-500">Modo atual: {saveMode === "local" ? "Local" : user?.email || "Firebase"}</p>
                  </div>
                </div>
                <button onClick={() => { setShowClearModal(false); setClearConfirmText(""); setClearProgress(null); }} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>

              <div className="text-sm text-slate-400 mb-4 space-y-2">
                <p>
                  Esta ação irá <span className="text-red-400 font-semibold">APAGAR TODOS os {records.length} registro(s)</span> existentes
                  {saveMode === "local"
                    ? " no armazenamento LOCAL deste dispositivo."
                    : " no Firebase, somente os registros da sua conta."}
                </p>
                <div className="text-xs bg-slate-950 border border-slate-800 rounded px-3 py-2 text-yellow-400/90">
                  ⚠ Esta ação é irreversível. Recomenda-se EXPORTAR um backup JSON antes de continuar.
                </div>
              </div>

              {clearProgress ? (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Apagando...</span>
                    <span>{clearProgress.done}/{clearProgress.total}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 transition-all duration-200"
                      style={{ width: `${clearProgress.total ? (clearProgress.done / clearProgress.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <label className="block text-xs text-slate-500 uppercase tracking-wide mb-1.5">
                    Confirmação: digite <span className="text-red-400 font-bold">LIMPAR</span> abaixo
                  </label>
                  <input
                    type="text"
                    value={clearConfirmText}
                    onChange={(e) => setClearConfirmText(e.target.value)}
                    placeholder='Digite "LIMPAR"'
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono mb-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 tracking-widest"
                    autoFocus
                  />
                </>
              )}

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowClearModal(false); setClearConfirmText(""); setClearProgress(null); }}
                  disabled={!!clearProgress}
                  className="px-4 py-2 text-sm rounded border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={!!clearProgress || clearConfirmText.trim() !== "LIMPAR"}
                  className="px-4 py-2 text-sm rounded bg-red-700 hover:bg-red-600 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/40"
                >
                  <Trash2 size={14} />
                  {clearProgress ? "Apagando..." : "Apagar TUDO"}
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed top-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-green-400 shadow-lg z-30">
            {toast}
          </div>
        )}

        {viewRecord && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-20">
            <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
                <h2 className="font-medium">{viewRecord.site.name} — {viewRecord.tipo}</h2>
                <button onClick={() => setViewRecord(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <Info label="Data" value={formatDateBR(viewRecord.data)} />
                  <Info label="Sigla" value={viewRecord.site.sigla} />
                  <Info label="Ticket" value={viewRecord.ticket} />
                  <Info label="Temperatura" value={`${viewRecord.temperatura}°C`} />
                </div>
                {viewRecord.observacao && (
                  <div className="border border-slate-800 rounded p-3 text-sm">
                    <div className="text-xs text-slate-500 mb-1">Observação</div>
                    <p className="text-slate-200 whitespace-pre-wrap">{viewRecord.observacao}</p>
                  </div>
                )}

                <div className="border border-slate-800 rounded p-3">
                  <div className="text-xs text-slate-400 uppercase mb-3">Medição Elétrica do Quadro</div>
                  {isViaAB(viewRecord.tipo) ? (
                    <>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Tensão</div>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <Info label="TENSÃO DC" value={`${viewRecord.tensaoAC || "-"} V`} />
                      </div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                        Correntes (soma automática dos disjuntores)
                        {viewRecord.viaSelecionada && viewRecord.viaSelecionada !== "ambas" && (
                          <span className="ml-2 text-slate-400">— Via {viewRecord.viaSelecionada}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        {viewRecord.viaSelecionada !== "B" && (
                          <Info label="Corrente Via A" value={`${viewRecord.medicaoCorrente?.viaA || "-"} A`} />
                        )}
                        {viewRecord.viaSelecionada !== "A" && (
                          <Info label="Corrente Via B" value={`${viewRecord.medicaoCorrente?.viaB || "-"} A`} />
                        )}
                        <Info label="Geral DC (A+B)" value={`${getCorrenteGeralDC(viewRecord) || "-"} A`} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Tensão por Fase</div>
                      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                        <Info label="Fase R" value={`${viewRecord.tensaoR || "-"} V`} />
                        <Info label="Fase S" value={`${viewRecord.tensaoS || "-"} V`} />
                        <Info label="Fase T" value={`${viewRecord.tensaoT || "-"} V`} />
                      </div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                        Tensão composta (entre fases)
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                        <Info label="Fase RS" value={`${viewRecord.tensaoRS || "-"} V`} />
                        <Info label="Fase ST" value={`${viewRecord.tensaoST || "-"} V`} />
                        <Info label="Fase TR" value={`${viewRecord.tensaoTR || "-"} V`} />
                      </div>
                      {viewRecord.medicaoCorrente && (
                        <>
                          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                            Correntes por Fase (soma automática dos disjuntores)
                          </div>
                          {"r" in viewRecord.medicaoCorrente ? (
                            <>
                              <div className="grid grid-cols-3 gap-3 text-sm">
                                <Info label="Fase R" value={`${viewRecord.medicaoCorrente.r || "-"} A`} />
                                <Info label="Fase S" value={`${viewRecord.medicaoCorrente.s || "-"} A`} />
                                <Info label="Fase T" value={`${viewRecord.medicaoCorrente.t || "-"} A`} />
                              </div>
                              {typeof viewRecord.medicaoCorrente.total !== "undefined" && viewRecord.medicaoCorrente.total !== null && (
                                <div className="mt-3 text-xs text-slate-400">
                                  Corrente Total: <span className="font-mono text-red-400">{viewRecord.medicaoCorrente.total || "-"} A</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="grid grid-cols-1 gap-3 text-sm">
                              <Info label="Corrente Total" value={`${viewRecord.medicaoCorrente.total || "-"} A`} />
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                <table className="w-full text-sm mt-2">
                  <thead className="text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="text-left px-2 py-1">Nº</th>
                      {hasNomesRecord(viewRecord) && <th className="text-left px-2 py-1">Nome</th>}
                      {isViaAB(viewRecord.tipo) ? (
                        <>
                          {(viewRecord.viaSelecionada === "A" || viewRecord.viaSelecionada === "ambas" || !viewRecord.viaSelecionada) && (
                            <th className="text-left px-2 py-1">Via A (A)</th>
                          )}
                          {(viewRecord.viaSelecionada === "B" || viewRecord.viaSelecionada === "ambas" || !viewRecord.viaSelecionada) && (
                            <th className="text-left px-2 py-1">Via B (A)</th>
                          )}
                        </>
                      ) : (
                        <>
                          <th className="text-left px-2 py-1">R (A)</th>
                          {usesTresFasesRecord(viewRecord) && <th className="text-left px-2 py-1">S (A)</th>}
                          {usesTresFasesRecord(viewRecord) && <th className="text-left px-2 py-1">T (A)</th>}
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {viewRecord.circuitos.map((c: any) => (
                      <tr key={c.n} className="border-t border-slate-800">
                        <td className="px-2 py-1 font-mono text-slate-500">{String(c.n).padStart(2, "0")}</td>
                        {hasNomesRecord(viewRecord) && <td className="px-2 py-1 text-slate-200">{c.nome || "-"}</td>}
                        {isViaAB(viewRecord.tipo) ? (
                          <>
                            {(viewRecord.viaSelecionada === "A" || viewRecord.viaSelecionada === "ambas" || !viewRecord.viaSelecionada) && (
                              <td className="px-2 py-1 font-mono text-red-400">{c.viaA || "-"}</td>
                            )}
                            {(viewRecord.viaSelecionada === "B" || viewRecord.viaSelecionada === "ambas" || !viewRecord.viaSelecionada) && (
                              <td className="px-2 py-1 font-mono text-red-400">{c.viaB || "-"}</td>
                            )}
                          </>
                        ) : (
                          <>
                            <td className="px-2 py-1 font-mono text-red-400">{c.r || "-"}</td>
                            {usesTresFasesRecord(viewRecord) && <td className="px-2 py-1 font-mono text-red-400">{c.s || "-"}</td>}
                            {usesTresFasesRecord(viewRecord) && <td className="px-2 py-1 font-mono text-red-400">{c.t || "-"}</td>}
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">Baixa um arquivo .html — abra-o no navegador e use "Salvar como PDF" na impressão.</p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(viewRecord)}
                    className="px-4 py-2 text-sm rounded border border-slate-600 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    aria-label="Editar este registro"
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button onClick={() => downloadReport(viewRecord)}
                    className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-2">
                    <FileDown size={14} /> Exportar relatório
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Readout({ label, value, accent }: { label: string, value: any, accent?: boolean }) {
  const isOnline = label === 'ONLINE';

  if (isOnline) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 shadow-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span>{value}</span>
      </div>
    );
  }

  return (
    <div className="text-right">
      <div className="text-[10px] text-slate-500 tracking-wider">{label}</div>
      <div className={`font-mono text-base ${accent ? "text-red-400" : "text-slate-200"}`}>{value}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${active ? "border-red-600 text-white" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
      {children}
    </button>
  );
}

function Field({ label, icon, children }: { label: string, icon?: React.ReactNode, children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">{icon}{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-mono text-slate-200">{value}</div>
    </div>
  );
}
