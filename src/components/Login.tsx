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
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
      <div className="w-full max-w-sm space-y-4 px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-600 mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Preventivas Elétricas</h1>
          <p className="text-sm text-slate-400 mt-1">Sistema de medição e manutenção preventiva</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xl space-y-4">
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
            className="w-full py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <LogIn size={14} /> {loading ? 'Aguarde...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
          </button>
          <button type="button" onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-sm text-slate-400 hover:text-slate-200 py-1 transition-colors">
            {isRegistering ? 'Já tem conta? Entre aqui' : 'Não tem conta? Cadastre-se'}
          </button>
        </form>

        {onSwitchMode && (
          <button type="button" onClick={onSwitchMode}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm text-slate-300 bg-slate-900/60 border border-slate-700 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <Home size={16} />
            <span className="font-medium">Usar modo local (sem login)</span>
            <Database size={14} className="text-slate-500" />
          </button>
        )}

        <a
          href="https://github.com/rovateduino/Preventivas-El-tricas/releases/download/App_Preventiva/Preventivas.Eletricas.1.0.0.Portable.exe"
          target="_blank"
          rel="noopener noreferrer"
          className="block group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600/10 via-teal-600/10 to-cyan-600/10 p-4 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/40 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)]"
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-opacity group-hover:opacity-80" />
          <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl transition-opacity group-hover:opacity-80" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-300/30">
              <Download size={26} className="text-white" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                  <Sparkles size={10} /> Download
                </span>
                <span className="inline-flex items-center rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-400/20">
                  v1.0.0
                </span>
                <span className="inline-flex items-center rounded-md bg-slate-700/40 px-2 py-0.5 text-[10px] font-semibold text-slate-300 ring-1 ring-inset ring-slate-500/30">
                  Portable · ~620 MB
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-tight">
                Baixar Preventivas Elétricas
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                Executável portátil para Windows — instalação zero, clique e use.
              </p>
            </div>
            <div className="hidden shrink-0 flex-col items-end gap-0.5 sm:flex">
              <ExternalLink size={14} className="text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <Github size={12} className="text-slate-500" />
            </div>
          </div>
          <div className="relative mt-3 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-3 text-slate-500">
              <span className="inline-flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="0.5" y="3.5" width="2" height="6" rx="0.5" fill="#10B981"/><rect x="4" y="1.5" width="2" height="8" rx="0.5" fill="#14B8A6"/><rect x="7.5" y="4.5" width="2" height="5" rx="0.5" fill="#06B6D4"/></svg>
                GitHub Release Oficial
              </span>
              <span className="text-emerald-400/80">✓ Assinado digitalmente</span>
            </div>
            <span className="font-medium text-emerald-300 transition-transform group-hover:translate-x-1">
              Baixar agora →
            </span>
          </div>
        </a>

        <p className="text-center text-xs text-slate-600">
          Modo local: dados salvos apenas neste dispositivo. Exporte seus arquivos para backup.
        </p>
      </div>
    </div>
  );
}