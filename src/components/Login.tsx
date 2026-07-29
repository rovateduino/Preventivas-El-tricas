import React, { useState } from 'react';
import { login, register } from '../lib/auth';
import { Shield, Database, LogIn, UserPlus, Home } from 'lucide-react';

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

        <p className="text-center text-xs text-slate-600">
          Modo local: dados salvos apenas neste dispositivo. Exporte seus arquivos para backup.
        </p>
      </div>
    </div>
  );
}