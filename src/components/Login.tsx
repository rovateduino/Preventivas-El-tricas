import React, { useState } from 'react';
import { login, register } from '../lib/auth';
import { Shield, Database, LogIn, UserPlus, Home, Download, Github, ExternalLink, Sparkles } from 'lucide-react';

export default function Login({ onLogin, onSwitchMode }: { onLogin?: () => void; onSwitchMode?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      onLogin?.();
    } catch (err) {
      console.error("Auth error:", err);
      setError(`Erro ao ${isRegistering ? 'registrar' : 'fazer login'}: ${err instanceof Error ? err.message : 'Verifique suas credenciais.'}`);
    } finally {
      setLoading(false);
    }
  };

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
              {error && (
                <div className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded px-3 py-2">
                  {error}
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
              <button type="submit" disabled={loading}
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
              href="https://github.com/rovateduino/Preventivas-El-tricas/releases/download/v1.0.0/Preventivas.Eletricas.1.0.0.Portable.exe"
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-slate-900/85 via-slate-900/75 to-slate-950/85 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-black/40 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_50px_-15px_rgba(16,185,129,0.45)]"
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
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
                    <rect x="0.5" y="4.5" width="2.5" height="7" rx="0.8" fill="#10B981"/>
                    <rect x="4.75" y="2" width="2.5" height="9.5" rx="0.8" fill="#14B8A6"/>
                    <rect x="9" y="5.5" width="2.5" height="6" rx="0.8" fill="#06B6D4"/>
                  </svg>
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">Hospedado no</span>
                    <span className="text-slate-200 font-semibold leading-tight truncate">GitHub Release</span>
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-700/30 bg-emerald-950/20 px-3 py-2.5 flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0 text-emerald-400">
                    <path d="M2.2 6.25 4.85 8.9l4.95-5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="flex flex-col min-w-0">
                    <span className="text-emerald-400/80 text-[10px] uppercase tracking-wider">Segurança</span>
                    <span className="text-emerald-100 font-semibold leading-tight truncate">Assinado digitalmente</span>
                  </div>
                </div>
              </div>

              <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-slate-700/50 pt-4">
                <span
                  role="button"
                  tabIndex={0}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 underline-offset-2 hover:text-emerald-300 hover:underline transition-colors cursor-pointer focus:outline-none focus-visible:text-emerald-300 focus-visible:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open("https://github.com/rovateduino/Preventivas-El-tricas/releases/tag/v1.0.0", "_blank", "noopener,noreferrer");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open("https://github.com/rovateduino/Preventivas-El-tricas/releases/tag/v1.0.0", "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  <Github size={13} className="text-slate-400" />
                  Ver página da release
                  <ExternalLink size={11} className="text-slate-500" />
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300 text-sm sm:text-base transition-transform group-hover:translate-x-1">
                  Baixar agora
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9.5M7.25 3.75 12.5 8l-5.25 4.25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}