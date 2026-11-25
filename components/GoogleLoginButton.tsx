'use client';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Globe } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function GoogleLoginButton({
  setIsLoading,
}: {
  setIsLoading: (v: boolean) => void;
}) {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.auth.googleLogin(tokenResponse.access_token);
        login(data.access_token, data.refresh_token);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : 'No pudimos iniciar sesión con Google. Inténtalo de nuevo.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('No pudimos iniciar sesión con Google. Inténtalo de nuevo.'),
  });

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => googleLogin()}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 text-lg font-black text-black transition-all hover:bg-gray-100 active:scale-[0.98]"
      >
        <Globe size={22} /> Google
      </button>
      {error && (
        <p role="alert" className="text-center text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
