import React, { useState, useEffect, useMemo } from "react";
import { Zap, Thermometer, Ticket, Search, Plus, Trash2, FileDown, X, Filter, Calendar, ChevronDown, Save, AlertTriangle, LogOut, Download, Upload } from "lucide-react";
import { subscribeToAuthChanges, logout } from './lib/auth';
import { getPreventivas, savePreventiva, deletePreventiva, importPreventivas, deleteAllPreventivas } from './lib/preventivaService';
import { exportToJSON, importFromJSON } from './lib/dataExport';
import { User } from 'firebase/auth';
import Login from './components/Login';
import { STORAGE_KEY, MODE_KEY } from './lib/constants';
import { createInvite, getUserProfile, isFirstAdminAvailable } from './lib/userService';

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
const usesTresFases = (tipo: string) => tipo === "PDT";
const isViaAB = (tipo: string) => tipo === "QDF" || tipo === "QDCC";
const defaultCircuitCount = (tipo: string) => (tipo === "PDT" ? 8 : 13);

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function createCircuit(n: number, tipo: string) {
  if (isViaAB(tipo)) {
    return { n, viaA: "", viaB: "" };
  }

  if (usesTresFases(tipo)) {
    return { n, r: "", s: "", t: "" };
  }

  return { n, r: "" };
}

function parseNumber(value: string) {
  const num = Number(value.replace(',', '.'));
  return Number.isFinite(num) ? num : 0;
}

function formatDateBR(iso: string) {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function buildReportHTML(record: any) {
  const tresFases = usesTresFases(record.tipo);
  const viaAB = isViaAB(record.tipo);
  const rows = record.circuitos
    .map(
      (c: any) => `
      <tr>
        <td>${String(c.n).padStart(2, "0")}</td>
        ${viaAB ? `<td>${c.viaA || "-"}</td><td>${c.viaB || "-"}</td>` : `<td>${c.r || "-"}</td>`}
        ${tresFases ? `<td>${c.s || "-"}</td>` : ""}
        ${tresFases ? `<td>${c.t || "-"}</td>` : ""}
      </tr>`
    )
    .join("");

  const mc = record.medicaoCorrente;
  const correnteRows = mc
    ? viaAB
      ? `
        <tr><td>Corrente Total Via A</td><td>${mc.viaA || "-"} A</td></tr>
        <tr><td>Corrente Total Via B</td><td>${mc.viaB || "-"} A</td></tr>
        <tr><td>Corrente Total Via A + Via B</td><td>${mc.geral || "-"} A</td></tr>`
      : `
        <tr><td>Corrente Total</td><td>${mc.total || "-"} A</td></tr>
        ${tresFases ? `<tr><td>Corrente Fase R</td><td>${mc.r || "-"} A</td></tr>` : `<tr><td>Corrente R</td><td>${mc.r || "-"} A</td></tr>`}
        ${tresFases ? `<tr><td>Corrente Fase S</td><td>${mc.s || "-"} A</td></tr>` : ""}
        ${tresFases ? `<tr><td>Corrente Fase T</td><td>${mc.t || "-"} A</td></tr>` : ""}`
    : "";

  const tensaoRows = viaAB
    ? `
      <tr><td>TENSÃO DC</td><td>${record.tensaoAC || "-"} V</td></tr>
      <tr><td>Corrente Geral DC</td><td>${record.tensaoDC || "-"} V</td></tr>`
    : `
      <tr><td>Tensão Fase R</td><td>${record.tensaoR || "-"} V</td></tr>
      <tr><td>Tensão Fase S</td><td>${record.tensaoS || "-"} V</td></tr>
      <tr><td>Tensão Fase T</td><td>${record.tensaoT || "-"} V</td></tr>
      <tr><td colspan="2" style="font-size:10px;color:#64748b;letter-spacing:1px;padding-top:6px;">TENSÃO COMPOSTA (ENTRE FASES)</td></tr>
      <tr><td>Tensão Fase RS</td><td>${record.tensaoRS || "-"} V</td></tr>
      <tr><td>Tensão Fase ST</td><td>${record.tensaoST || "-"} V</td></tr>
      <tr><td>Tensão Fase TR</td><td>${record.tensaoTR || "-"} V</td></tr>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Preventiva ${record.site.sigla} - ${formatDateBR(record.data)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #111; padding: 32px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  h2 { font-size: 14px; margin: 0 0 8px; }
  .subtitle { color: #555; margin-bottom: 20px; font-size: 14px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
  td, th { border: 1px solid #ccc; padding: 6px 10px; font-size: 13px; text-align: left; }
  th { background: #f2f2f2; }
  .meta td:first-child { font-weight: bold; width: 160px; border: none; padding: 3px 10px 3px 0; }
  .meta td:last-child { border: none; padding: 3px 0; }
  .meta table, .meta { border: none; }
  .corrente td:first-child { font-weight: bold; width: 220px; }
  @media print {
    body { padding: 0; }
  }
</style>
</head>
<body>
  <h1>Relatório de Preventiva Elétrica</h1>
  <div class="subtitle">${record.site.name} (${record.site.sigla}) — Quadro ${record.tipo}${record.tipoComplemento ? ` ${record.tipoComplemento}` : ""}</div>
  <table class="meta">
    <tbody>
      <tr><td>Data</td><td>${formatDateBR(record.data)}</td></tr>
      <tr><td>Nº Ticket</td><td>${record.ticket}</td></tr>
      <tr><td>Temperatura</td><td>${record.temperatura}°C</td></tr>
      <tr><td>Categoria do Site</td><td>${record.site.cat || record.site.categoria || "-"}</td></tr>
      ${record.tipoComplemento ? `<tr><td>Complemento do Quadro</td><td>${record.tipoComplemento}</td></tr>` : ""}
      ${tensaoRows}
    </tbody>
  </table>
  <table class="corrente">
    <tbody>
      ${correnteRows}
    </tbody>
  </table>
  <table>
    <thead>
      <tr>
        <th>Nº</th>
        ${viaAB ? `<th>Via A (A)</th><th>Via B (A)</th>` : `<th>R (A)</th>`}
        ${tresFases ? `<th>S (A)</th><th>T (A)</th>` : ""}
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
  <script>window.onload = function() { setTimeout(function(){ window.print(); }, 300); };</script>
</body>
</html>`;
}


function downloadReport(record: any) {
  const html = buildReportHTML(record);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `preventiva-${record.site.sigla}-${record.data || "sem-data"}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
    const unsubscribe = subscribeToAuthChanges(async (u) => {
      if (!u) {
        setUser(null);
        setUserRole(null);
        setAuthError(null);
        setAuthLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(u.uid);
        if (!profile) {
          await logout();
          setUser(null);
          setUserRole(null);
          setAuthError('Conta não autorizada. Cadastre-se com um convite válido ou peça autorização ao administrador.');
        } else {
          setUser(u);
          setUserRole(profile.role);
          setAuthError(null);
        }
      } catch (e) {
        console.error('Erro ao carregar perfil de usuário:', e);
        await logout();
        setUser(null);
        setUserRole(null);
        setAuthError('Falha ao validar autorização. Tente novamente.');
      } finally {
        setAuthLoading(false);
      }
    });

    refreshFirstAdminAvailable();
    return unsubscribe;
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
  const [viewRecord, setViewRecord] = useState<any>(null);
  const [firebaseSyncError, setFirebaseSyncError] = useState('');
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [inviteToken, setInviteToken] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [firstAdminAvailable, setFirstAdminAvailable] = useState<boolean | null>(null);
  const [inviteCreatedAt, setInviteCreatedAt] = useState<number | null>(null);

  const [data, setData] = useState("");
  const [tipo, setTipo] = useState("PDT");
  const [tipoComplemento, setTipoComplemento] = useState("");
  const [tipoOutro, setTipoOutro] = useState("");
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
  const [formError, setFormError] = useState("");

  const [fData, setFData] = useState("");
  const [fSite, setFSite] = useState("");
  const [fTipo, setFTipo] = useState("");
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
  }, [tipo]);

  useEffect(() => {
    const sumR = circuitos.reduce((acc, c: any) => acc + parseNumber(c.r || ""), 0);
    const sumS = circuitos.reduce((acc, c: any) => acc + parseNumber(c.s || ""), 0);
    const sumT = circuitos.reduce((acc, c: any) => acc + parseNumber(c.t || ""), 0);
    const sumViaA = circuitos.reduce((acc, c: any) => acc + parseNumber(c.viaA || ""), 0);
    const sumViaB = circuitos.reduce((acc, c: any) => acc + parseNumber(c.viaB || ""), 0);

    if (isViaAB(tipo)) {
      setCorrenteViaA(sumViaA ? sumViaA.toFixed(1) : "");
      setCorrenteViaB(sumViaB ? sumViaB.toFixed(1) : "");
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
  }, [circuitos, tipo]);

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

  async function persist(record: any, next: any[]) {
    setSaveState("saving");
    if (saveMode === "local") {
      await storeLocalRecords(next);
      showToast("Registro salvo localmente ✓");
      return;
    }

    if (!user) {
      setFormError("Login necessário para salvar no Firebase.");
      setSaveState("idle");
      return;
    }

    try {
      await savePreventiva({ ...record, uid: user.uid });
      setRecords(next);
      setSaveState("saved");
      showToast("Registro salvo no Firebase ✓");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch (e) {
      console.error("Erro ao salvar no Firebase:", e);
      setFormError("Falha ao salvar no Firebase. Verifique sua conexão.");
      setSaveState("idle");
    }
  }

  async function removeRecord(id: string) {
    if (saveMode === "local") {
      const next = records.filter((r) => r.id !== id);
      await storeLocalRecords(next);
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
      setSaveState("saved");
      showToast("Registro removido.");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch (e) {
      console.error("Erro ao remover do Firebase:", e);
      setFormError("Falha ao remover registro do Firebase.");
      setSaveState("idle");
    }
  }

  function handleQtdChange(val: string) {
    const n = Math.max(1, Math.min(60, Number(val) || 1));
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
    setFormError("");
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
      ? { viaA: correnteViaA.trim(), viaB: correnteViaB.trim(), geral: correnteGeral.trim() }
      : { total: correnteTotal.trim(), r: correnteR.trim(), s: correnteS.trim(), t: correnteT.trim() };

    const record = {
      id: uid(),
      data,
      tipo: finalTipo,
      tipoComplemento: tipoComplemento.trim(),
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
      tensaoDC: tensaoDC.trim(),
      criadoEm: new Date().toISOString(),
    };

    await persist(record, [record, ...records]);
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
      return true;
    });
  }, [records, fData, fSite, fTipo, fSigla]);

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
        const next = [...imported, ...records];
        await storeLocalRecords(next);
        showToast(`Importados ${imported.length} registros com sucesso ✓`);
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
      showToast('Apenas administradores podem limpar o banco de dados.');
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
        if (total === 0 && records.length > 0) {
          for (let i = 0; i < records.length; i++) {
            try {
              await deletePreventiva(records[i].id);
            } catch {}
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
        showToast(`${Math.max(records.length, 0)} registro(s) apagado(s) do Firebase.`);
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
          <div className="w-9 h-9 rounded bg-red-600 flex items-center justify-center shrink-0">
            <Zap size={18} className="text-white" />
          </div>
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
          <TabButton active={tab === "novo"} onClick={() => setTab("novo")}>Novo Registro</TabButton>
          <TabButton active={tab === "registros"} onClick={() => setTab("registros")}>
            Registros Salvos {records.length > 0 && <span className="text-slate-500">({records.length})</span>}
          </TabButton>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-6">
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
                  <Trash2 size={12} /> Limpar Banco
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
                  <p className="text-xs text-slate-500 mt-2">Informe o tipo de quadro específico (ex: QDGE).</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  {isViaAB(tipo)
                    ? "QDF/QDCC: use colunas Via A e Via B nos disjuntores."
                    : usesTresFases(tipo)
                      ? "PDT: preenche Med. R, S e T."
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
                    <Field label="TENSÃO DC">
                      <input type="text" value={tensaoAC} onChange={(e) => setTensaoAC(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-600" />
                    </Field>
                    <Field label="Corrente Geral DC">
                      <input type="text" value={tensaoDC} onChange={(e) => setTensaoDC(e.target.value)}
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
                    <Field label="Corrente Total Via A (A)">
                      <input type="number" step="0.1" value={correnteViaA} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                    <Field label="Corrente Total Via B (A)">
                      <input type="number" step="0.1" value={correnteViaB} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                    <Field label="Corrente Total Via A + Via B (A)">
                      <input type="number" step="0.1" value={correnteGeral} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                  </>
                ) : usesTresFases(tipo) ? (
                  <>
                    <div className="sm:col-span-full mt-1 mb-1 text-[11px] uppercase tracking-wider text-slate-500">
                      Correntes por Fase (soma automática dos disjuntores)
                    </div>
                    <Field label="Fase R (A)">
                      <input type="number" step="0.1" value={correnteR} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                    <Field label="Fase S (A)">
                      <input type="number" step="0.1" value={correnteS} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                    <Field label="Fase T (A)">
                      <input type="number" step="0.1" value={correnteT} readOnly
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                    </Field>
                  </>
                ) : (
                  <Field label="Corrente Total (A)">
                    <input type="number" step="0.1" value={correnteTotal} readOnly
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-red-400" />
                  </Field>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {isViaAB(tipo)
                  ? "QDF/QDCC: valores de Via A e Via B são somados automaticamente dos disjuntores." 
                  : "PDT: valores de R, S e T são somados automaticamente dos disjuntores."}
              </p>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-slate-900 px-4 py-3 border-b border-slate-800">
                <span className="text-sm font-medium">Disjuntores de Distribuição</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">Circuitos:</span>
                  <input type="number" min={1} max={60} value={qtdCircuitos}
                    onChange={(e) => handleQtdChange(e.target.value)}
                    className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center font-mono" />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-slate-900 text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="text-left px-4 py-2 w-20">Nº</th>
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
                        {isViaAB(tipo) ? (
                          <>
                            <td className="px-4 py-1.5">
                              <input type="number" step="0.1" value={c.viaA} onChange={(e) => updateCircuit(idx, "viaA", e.target.value)}
                                className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-red-400 focus:outline-none focus:ring-1 focus:ring-red-600" />
                            </td>
                            <td className="px-4 py-1.5">
                              <input type="number" step="0.1" value={c.viaB} onChange={(e) => updateCircuit(idx, "viaB", e.target.value)}
                                className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 font-mono text-red-400 focus:outline-none focus:ring-1 focus:ring-red-600" />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-1.5">
                              <input type="number" step="0.1" value={c.r} onChange={(e) => updateCircuit(idx, "r", e.target.value)}
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

            {formError && (
              <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-950/40 border border-amber-900 rounded px-3 py-2">
                <AlertTriangle size={14} /> {formError}
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
                <Save size={14} /> Salvar registro
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
                <select value={fTipo} onChange={(e) => setFTipo(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm">
                  <option value="">Todos os tipos</option>
                  {Array.from(new Set(records.map(r => r.tipo))).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="text" placeholder="Sigla" value={fSigla} onChange={(e) => setFSigla(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-sm" />
              </div>
            </div>

            {filteredRecords.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-10">Nenhum registro encontrado.</p>
            ) : (
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
                    <tr>
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
                        <td className="px-3 py-2 font-mono">{formatDateBR(r.data)}</td>
                        <td className="px-3 py-2">{r.site.name}</td>
                        <td className="px-3 py-2 font-mono text-slate-400">{r.site.sigla}</td>
                        <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded bg-slate-800 text-xs font-mono">{r.tipo}</span></td>
                        <td className="px-3 py-2 font-mono text-slate-400">{r.ticket}</td>
                        <td className="px-3 py-2 font-mono text-red-400">{r.temperatura}°C</td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <button onClick={() => setViewRecord(r)} className="text-xs text-slate-300 hover:text-white underline mr-3">Ver</button>
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
                    <h3 className="font-medium text-lg text-red-100">Limpar Banco de Dados</h3>
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
                    : " no BANCO DE DADOS FIREBASE associado à sua conta."}
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

                <div className="border border-slate-800 rounded p-3">
                  <div className="text-xs text-slate-400 uppercase mb-3">Medição Elétrica do Quadro</div>
                  {isViaAB(viewRecord.tipo) ? (
                    <>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Tensões</div>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <Info label="TENSÃO DC" value={`${viewRecord.tensaoAC || "-"} V`} />
                        <Info label="Corrente Geral DC" value={`${viewRecord.tensaoDC || "-"} V`} />
                      </div>
                      {viewRecord.medicaoCorrente && "viaA" in viewRecord.medicaoCorrente && (
                        <>
                          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">
                            Correntes (soma automática dos disjuntores)
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <Info label="Via A" value={`${viewRecord.medicaoCorrente.viaA || "-"} A`} />
                            <Info label="Via B" value={`${viewRecord.medicaoCorrente.viaB || "-"} A`} />
                            <Info label="Via A + Via B" value={`${viewRecord.medicaoCorrente.geral || "-"} A`} />
                          </div>
                        </>
                      )}
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
                      {isViaAB(viewRecord.tipo) ? (
                        <>
                          <th className="text-left px-2 py-1">Via A (A)</th>
                          <th className="text-left px-2 py-1">Via B (A)</th>
                        </>
                      ) : (
                        <>
                          <th className="text-left px-2 py-1">R (A)</th>
                          {usesTresFases(viewRecord.tipo) && <th className="text-left px-2 py-1">S (A)</th>}
                          {usesTresFases(viewRecord.tipo) && <th className="text-left px-2 py-1">T (A)</th>}
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {viewRecord.circuitos.map((c: any) => (
                      <tr key={c.n} className="border-t border-slate-800">
                        <td className="px-2 py-1 font-mono text-slate-500">{String(c.n).padStart(2, "0")}</td>
                        {isViaAB(viewRecord.tipo) ? (
                          <>
                            <td className="px-2 py-1 font-mono text-red-400">{c.viaA || "-"}</td>
                            <td className="px-2 py-1 font-mono text-red-400">{c.viaB || "-"}</td>
                          </>
                        ) : (
                          <>
                            <td className="px-2 py-1 font-mono text-red-400">{c.r || "-"}</td>
                            {usesTresFases(viewRecord.tipo) && <td className="px-2 py-1 font-mono text-red-400">{c.s || "-"}</td>}
                            {usesTresFases(viewRecord.tipo) && <td className="px-2 py-1 font-mono text-red-400">{c.t || "-"}</td>}
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">Baixa um arquivo .html — abra-o no navegador e use "Salvar como PDF" na impressão.</p>
                <button onClick={() => downloadReport(viewRecord)}
                  className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shrink-0">
                  <FileDown size={14} /> Exportar relatório
                </button>
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