'use client';
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const data = await api.auth.googleLogin(tokenResponse.access_token);
        login(data.access_token);
      } catch (error) {
        if (error instanceof ApiError) {
          alert(error.message);
        } else {
          alert('Error al iniciar sesión con Google');
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => alert('Error al iniciar sesión con Google'),
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      className="w-full bg-white text-black hover:bg-gray-100 py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
    >
      <Globe size={22} /> Google
    </button>
  );
}
