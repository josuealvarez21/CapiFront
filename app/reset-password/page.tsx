'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { PASSWORD_MIN_LENGTH, validatePassword } from '@/lib/validation';

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordError = validatePassword(password);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.auth.resetPassword(token, password);
      trackEvent('password_reset_completed', {});
      setDone(true);
      setTimeout(() => router.replace('/login'), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090d16] px-4 text-white">
      <div className="glass-card w-full max-w-md rounded-3xl p-8">
        <h1 className="text-2xl font-black">Nueva contraseña</h1>
        <p className="mt-2 text-sm text-gray-400">Elige una contraseña larga y única.</p>
        {done ? (
          <p className="mt-6 text-sm text-[#4ade80]">Contraseña actualizada. Redirigiendo…</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            {error && <p className="text-sm text-red-400">{error}</p>}
            <input
              type="password"
              minLength={PASSWORD_MIN_LENGTH}
              required
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(null);
              }}
              placeholder="Nueva contraseña"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#22c55e]"
            />
            {passwordError && password.length > 0 && (
              <p className="-mt-2 text-xs text-red-400">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={loading || !token || !!passwordError}
              className="w-full rounded-2xl bg-[#22c55e] px-4 py-3 text-sm font-black text-[#090d16] disabled:opacity-50"
            >
              {loading ? 'Guardando…' : 'Guardar contraseña'}
            </button>
            <Link href="/login" className="block text-center text-xs text-gray-400 hover:text-white">
              Volver al inicio de sesión
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090d16]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
