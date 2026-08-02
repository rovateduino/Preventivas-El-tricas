import React, { useState, useEffect } from 'react';
import { FirebaseError } from 'firebase/app';
import { login, register } from '../lib/auth';
import { createUserProfile, getInvite, markInviteAsUsed, markFirstAdminCreated } from '../lib/userService';
import {
  Shield, Database, LogIn, UserPlus, Home, Download, Sparkles,
  X, Info, Zap, FileCheck, Cloud, Lock, FolderOpen, Smartphone, Wrench, Award, CheckCircle2
} from 'lucide-react';

type LoginProps = {
  onLogin?: () => void;
  onSwitchMode?: () => void;
  externalError?: string;
  allowFirstAdminSignup?: boolean | null;
};

export default function Login({ onLogin, onSwitchMode, externalError, allowFirstAdminSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    if (!showAbout) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setShowAbout(false); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [showAbout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        if (allowFirstAdminSignup === null) {
          setError('Aguarde a validação do primeiro administrador antes de tentar cadastrar.');
          return;
        }

        if (!allowFirstAdminSignup) {
          if (!inviteToken.trim()) {
            setError('Informe o token de convite enviado pelo administrador.');
            return;
          }

          const invite = await getInvite(inviteToken.trim());
          if (!invite || invite.used) {
            setError('Token inválido ou já utilizado. Peça um novo convite ao administrador.');
            return;
          }

          const credential = await register(email, password);
          await createUserProfile(credential.user.uid, invite.role, inviteToken.trim(), email);
          await markInviteAsUsed(inviteToken.trim(), credential.user.uid, email);
        } else {
          const credential = await register(email, password);
          await createUserProfile(credential.user.uid, 'admin', null, email);
          await markFirstAdminCreated(credential.user.uid);
        }
      } else {
        await login(email, password);
      }

      onLogin?.();
    } catch (err) {
      console.error('Auth error:', err);
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/email-already-in-use') {
          setError('Erro ao registrar: este e-mail já está em uso. Use outro e-mail ou recupere a senha.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Erro ao registrar: e-mail inválido. Verifique o endereço informado.');
        } else if (err.code === 'auth/weak-password') {
          setError('Erro ao registrar: a senha é muito fraca. Use pelo menos 6 caracteres.');
        } else {
          setError(`Erro ao ${isRegistering ? 'registrar' : 'fazer login'}: ${err.message}`);
        }
      } else {
        setError(`Erro ao ${isRegistering ? 'registrar' : 'fazer login'}: ${err instanceof Error ? err.message : 'Verifique suas credenciais.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const openAbout = () => setShowAbout(true);
  const downloadUrl = 'https://github.com/rovateduino/Preventivas-El-tricas/releases/download/v1.0.0/Preventivas.Eletricas.1.0.0.Portable.exe';

  const appFeatures = [
    { icon: Zap, color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/10", ring: "ring-amber-400/20", title: "Cálculo Automático", desc: "Soma total de correntes por via ou fase em tempo real, conforme tipo de quadro." },
    { icon: FileCheck, color: "text-emerald-400", bg: "from-emerald-500/20 to-teal-500/10", ring: "ring-emerald-400/20", title: "Relatório Profissional", desc: "Imprima ou salve em PDF o relatório completo com layout técnico elegante." },
    { icon: Cloud, color: "text-cyan-400", bg: "from-cyan-500/20 to-sky-500/10", ring: "ring-cyan-400/20", title: "Nuvem ou Local", desc: "Use Firebase Firestore por usuário ou armazene apenas neste computador." },
    { icon: Lock, color: "text-rose-400", bg: "from-rose-500/20 to-red-500/10", ring: "ring-rose-400/20", title: "Segurança Total", desc: "Executável assinado digitalmente e autenticação por usuário UID." },
    { icon: FolderOpen, color: "text-violet-400", bg: "from-violet-500/20 to-purple-500/10", ring: "ring-violet-400/20", title: "Backup JSON", desc: "Exporte e importe todos os registros com 1 clique, incluindo disjuntores." },
    { icon: Wrench, color: "text-blue-400", bg: "from-blue-500/20 to-indigo-500/10", ring: "ring-blue-400/20", title: "Multi-quadro", desc: "QDF, QDCC, PDT e OUTRO com campos de tensão dinâmicos (AC/DC ou R/S/T + compostas)." },
    { icon: Smartphone, color: "text-pink-400", bg: "from-pink-500/20 to-fuchsia-500/10", ring: "ring-pink-400/20", title: "Portátil", desc: "Executável único — sem instalação, clique e use em qualquer Windows x64." },
    { icon: Award, color: "text-yellow-400", bg: "from-yellow-500/20 to-amber-500/10", ring: "ring-yellow-400/20", title: "Campos Ilimitados", desc: "Tabela com 1 a 60 disjuntores, multi-empresa e multi-site configuráveis." },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-slate-100">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/fundo-site.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/85 to-slate-900/90" aria-hidden="true" />
      <div className="absolute inset-0 backdrop-blur-[2px] bg-slate-950/50" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(220,38,38,0.08),_transparent_60%),radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.07),_transparent_55%)]" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl px-4 py-10 sm:py-12">
        <div className="grid items-start gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1.18fr)]">

          <div className="w-full max-w-md mx-auto lg:mx-0 lg:justify-self-end space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-600 mb-4 shadow-lg shadow-red-950/50 ring-1 ring-red-400/30">
                <Shield size={28} className="text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Preventivas Elétricas</h1>
              <p className="text-sm text-slate-400 mt-1">Sistema de medição e manutenção preventiva</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-800 shadow-2xl shadow-black/40 space-y-4">
              <h2 className="text-lg font-semibold text-center">{isRegistering ? 'Criar conta' : 'Entrar na conta'}</h2>
              {(error || externalError) && (
                <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded px-3 py-2">
                  {error || externalError}
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent" required />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Senha</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent" required />
              </div>
              {isRegistering && (
                <div>
                  {allowFirstAdminSignup === null ? (
                    <div className="rounded-lg border border-slate-700/30 bg-slate-900/70 p-3 text-xs text-slate-300 mb-3">
                      Verificando disponibilidade do primeiro administrador... Aguarde alguns segundos antes de continuar.
                    </div>
                  ) : allowFirstAdminSignup ? (
                    <div className="rounded-lg border border-emerald-700/30 bg-emerald-950/20 p-3 text-xs text-emerald-200 mb-3">
                      Primeiro administrador disponível. Faça o cadastro inicial e seu usuário será promovido a administrador.
                    </div>
                  ) : (
                    <>
                      <label className="block text-xs text-slate-400 mb-1">Token de convite</label>
                      <input type="password" placeholder="Token enviado pelo administrador" value={inviteToken} onChange={(e) => setInviteToken(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent" required />
                      <p className="text-[10px] text-slate-500 mt-1">Use o token que o administrador gerou para você. Ele valida seu cadastro no Firebase.</p>
                    </>
                  )}
                </div>
              )}
              <button type="submit" disabled={loading || (isRegistering && allowFirstAdminSignup === null)}
                className="w-full py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-950/30">
                <LogIn size={14} /> {loading ? 'Aguarde...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
              </button>
              <button type="button" onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-sm text-slate-400 hover:text-slate-200 py-1 transition-colors">
                {isRegistering ? 'Já tem conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
              </button>
            </form>

            {onSwitchMode && (
              <button type="button" onClick={onSwitchMode}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm text-slate-300 bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-xl hover:bg-slate-800 hover:text-white transition-colors shadow-lg shadow-black/20">
                <Home size={16} />
                <span className="font-medium">Usar modo local (sem login)</span>
                <Database size={14} className="text-slate-500" />
              </button>
            )}

            <p className="text-center text-xs text-slate-500">
              Modo local: dados salvos apenas neste dispositivo. Exporte seus arquivos para backup.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto lg:mx-0 lg:justify-self-start lg:self-center lg:mt-4">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Baixar o aplicativo Preventivas Elétricas"
              className="block w-full group text-left relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-slate-900/85 via-slate-900/75 to-slate-950/85 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-black/40 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_50px_-15px_rgba(16,185,129,0.45)]"
            >
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl transition-opacity group-hover:opacity-90" />
              <div className="absolute -left-16 -bottom-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/[0.07] via-teal-600/[0.05] to-cyan-600/[0.06] pointer-events-none" />

              <div className="relative flex items-start gap-4 sm:gap-5">
                <div className="flex h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-950/50 ring-1 ring-emerald-300/35">
                  <Download size={32} className="text-white" strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-400/25">
                      <Sparkles size={10} /> Download
                    </span>
                    <span className="inline-flex items-center rounded-md bg-cyan-500/12 px-2 py-0.5 text-[10px] font-mono font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-400/25">
                      v1.0.0
                    </span>
                    <span className="inline-flex items-center rounded-md bg-slate-800/70 px-2 py-0.5 text-[10px] font-semibold text-slate-300 ring-1 ring-inset ring-slate-600/50">
                      Portable · 621 MB
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight tracking-tight">
                    Baixar Preventivas Elétricas
                  </h3>
                  <p className="text-sm text-slate-400 mt-1.5 leading-snug">
                    Executável portátil para Windows — instalação zero, clique e use.
                  </p>
                </div>
              </div>

              <div className="relative mt-5 grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
                <div className="rounded-xl border border-slate-700/60 bg-slate-950/40 px-3 py-2.5 flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/25 to-indigo-500/10 ring-1 ring-violet-400/20">
                    <Smartphone size={13} className="text-violet-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">Formato</span>
                    <span className="text-slate-200 font-semibold leading-tight truncate">Portátil Windows</span>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-700/30 bg-emerald-950/20 px-3 py-2.5 flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/30 to-teal-500/10 ring-1 ring-emerald-400/20">
                    <CheckCircle2 size={13} className="text-emerald-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-emerald-400/80 text-[10px] uppercase tracking-wider">Segurança</span>
                    <span className="text-emerald-100 font-semibold leading-tight truncate">Assinado digitalmente</span>
                  </div>
                </div>
              </div>

              <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-slate-700/50 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openAbout();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-800/60 border border-slate-700/70 hover:bg-slate-700/70 hover:text-white hover:border-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                >
                  <Info size={13} className="text-emerald-400" />
                  Sobre o App
                </button>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300 text-sm sm:text-base transition-transform group-hover:translate-x-1">
                  Baixar agora
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9.5M7.25 3.75 12.5 8l-5.25 4.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </a>
          </div>

        </div>
      </div>

      {showAbout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:py-10"
          onClick={() => setShowAbout(false)}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" aria-hidden="true" />
          <div
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-black/60 ring-1 ring-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-x-0 top-0 h-48 rounded-t-3xl bg-cover bg-center opacity-25 pointer-events-none"
              style={{ backgroundImage: "url('/fundo-site.png')" }}
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 top-0 h-48 rounded-t-3xl bg-gradient-to-b from-emerald-900/40 via-slate-900/70 to-slate-900 pointer-events-none" aria-hidden="true" />

            <div className="relative px-5 sm:px-8 py-6 sm:py-8">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-950/50 ring-1 ring-emerald-300/30">
                    <Shield size={30} className="text-white" strokeWidth={2.1} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="inline-flex items-center rounded-sm bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-red-300 ring-1 ring-inset ring-red-400/25">
                        Elétrica
                      </span>
                      <span className="inline-flex items-center rounded-md bg-cyan-500/12 px-2 py-0.5 text-[10px] font-mono font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-400/25">
                        v1.0.0
                      </span>
                      <span className="inline-flex items-center rounded-md bg-slate-800/70 px-2 py-0.5 text-[10px] font-semibold text-slate-300 ring-1 ring-inset ring-slate-600/50">
                        Build · Jul 2026
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                      Preventivas Elétricas
                    </h2>
                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed max-w-xl">
                      Sistema desktop profissional para cadastro, medição e relatórios de manutenção preventiva
                      em quadros elétricos. Controle disjuntores, tensões, correntes e documentação técnica completa.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAbout(false)}
                  aria-label="Fechar"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 px-2.5 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Tipos de Quadro</div>
                  <div className="text-xl font-black text-emerald-300 leading-tight">4</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">QDF / QDCC / PDT / OUTRO</div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 px-2.5 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Disjuntores</div>
                  <div className="text-xl font-black text-cyan-300 leading-tight">1–60</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">por registro dinâmico</div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 px-2.5 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Armazenamento</div>
                  <div className="text-xl font-black text-amber-300 leading-tight">2</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Nuvem · Local</div>
                </div>
                <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 px-2.5 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Compatibilidade</div>
                  <div className="text-xl font-black text-rose-300 leading-tight">Win x64</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">10 · 11</div>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="h-[2px] w-8 rounded bg-gradient-to-r from-emerald-500 to-transparent" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Recursos Principais
                  </h3>
                </div>
                <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
                  {appFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-950/40 p-3 sm:p-3.5 hover:border-slate-600/70 hover:bg-slate-900/60 transition-colors"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${f.bg} ring-1 ring-inset ${f.ring}`}>
                        <f.icon size={17} className={f.color} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-100 leading-snug">{f.title}</h4>
                        <p className="text-[12px] text-slate-400 mt-0.5 leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-emerald-700/25 bg-gradient-to-br from-emerald-950/30 via-slate-900/80 to-teal-950/20 p-4 sm:p-5 shadow-inner shadow-emerald-950/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/10 ring-1 ring-emerald-300/20">
                      <Award size={22} className="text-emerald-300" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-emerald-400/80 font-bold">Garantia de Qualidade</div>
                      <div className="text-sm font-bold text-emerald-100 mt-0.5">Executável assinado · Relatórios técnicos · Backup sempre</div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowAbout(false)}
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-colors shadow-lg shadow-emerald-950/40"
                    >
                      <CheckCircle2 size={15} /> Entendi
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAbout(false)}
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-200 rounded-xl border border-slate-600/70 bg-slate-800/60 hover:bg-slate-700/70 hover:text-white transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
