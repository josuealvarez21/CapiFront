'use client';
import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Globe,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Fingerprint,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { api, ApiError } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import { validatePasswordForLogin } from '@/lib/validation';
import TurnstileField from '@/components/security/TurnstileField';

const GoogleLoginButton = lazy(() => import('@/components/GoogleLoginButton'));

const hasGoogleId = !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errores, setErrores] = useState<{ email?: string; password?: string }>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const { login } = useAuth();

  const validarCampoEmail = (valor: string): string | undefined => {
    if (valor.includes(' ')) return 'El correo electrónico no puede contener espacios en blanco';
    if (!valor) return 'El correo es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor))
      return 'Ingresa un correo electrónico válido';
    return undefined;
  };

  const validarCampoPassword = (valor: string): string | undefined =>
    validatePasswordForLogin(valor);

  const validarFormulario = (): boolean => {
    const nuevos: typeof errores = {};

    const errEmail = validarCampoEmail(email);
    if (errEmail) nuevos.email = errEmail;

    const errPassword = validarCampoPassword(password);
    if (errPassword) nuevos.password = errPassword;

    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral(null);

    if (!validarFormulario()) return;

    setIsLoading(true);
    setErrores({});

    try {
      const data = await api.auth.login(email.trim(), password, {
        honeypot,
        turnstileToken,
      });
      trackEvent('login_success', { method: 'password' });
      login(data.access_token, data.refresh_token);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorGeneral(error.message);
      } else {
        setErrorGeneral('Error de conexión con el servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 rounded-2xl py-4 pl-12 pr-4 text-base text-white outline-none transition-all placeholder:text-gray-700 font-medium [color-scheme:dark]';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090d16] px-4 py-10 sm:px-6">
      {/* Fondo ambiental con el degradado azul → verde del landing */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.16),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(34,197,94,0.13),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px]" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-[#3b82f6]/20 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-[#22c55e]/20 blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card relative z-10 w-full max-w-[440px] overflow-hidden rounded-[28px] p-5 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.9)] sm:rounded-[32px] sm:p-9"
      >
        {/* Línea de luz azul → verde en el borde superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-[#22c55e] opacity-80" />
        <div className="absolute -top-28 -left-24 h-56 w-56 rounded-full bg-[#3b82f6]/10 blur-[80px]" />
        <div className="absolute -bottom-28 -right-24 h-56 w-56 rounded-full bg-[#22c55e]/10 blur-[80px]" />

        <div className="relative z-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 rounded-full glass-soft px-3 py-1.5 text-xs font-bold text-gray-400 transition-colors hover:text-[#22c55e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3b82f6] sm:mb-7"
          >
            <ArrowLeft size={14} /> Volver al inicio
          </Link>

          <div className="mb-9 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#3b82f6] to-[#22c55e] shadow-[0_16px_45px_-12px_rgba(59,130,246,0.8)]"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent" />
              <Fingerprint size={40} className="relative text-white" />
            </motion.div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.9)] motion-safe:animate-pulse" />
              <span className="eyebrow text-gray-400">Cápi</span>
            </div>
            <h1 className="neon-text text-3xl font-black tracking-tight sm:text-4xl">
              Bienvenido a Cápi
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Controla tu destino financiero hoy.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="hidden"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
            <TurnstileField onToken={setTurnstileToken} />
            {errorGeneral && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4"
                role="alert"
              >
                <p className="text-center text-sm font-medium text-red-400">{errorGeneral}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="ml-1 text-[11px] font-black uppercase tracking-[2px] text-gray-500">
                Email de Acceso
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-600 transition-colors group-focus-within:text-[#3b82f6]">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    const err = validarCampoEmail(val);
                    setErrores((prev) => {
                      const next = { ...prev };
                      if (err) next.email = err;
                      else delete next.email;
                      return next;
                    });
                    setErrorGeneral(null);
                  }}
                  onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
                  onBlur={() => {
                    const err = validarCampoEmail(email);
                    setErrores((prev) => {
                      const next = { ...prev };
                      if (err) next.email = err;
                      else delete next.email;
                      return next;
                    });
                  }}
                  placeholder="tu@correo.com"
                  className={inputClass}
                />
                {errores.email && (
                  <p className="ml-1 mt-1 text-xs text-red-400">{errores.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[11px] font-black uppercase tracking-[2px] text-gray-500">
                  Llave de Seguridad
                </label>
                <Link
                  href="/forgot-password"
                  title="recuperar"
                  className="text-[11px] font-black uppercase tracking-[1px] text-[#60a5fa] transition-colors hover:text-[#22c55e] hover:underline"
                >
                  ¿Olvidaste la llave?
                </Link>
              </div>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-600 transition-colors group-focus-within:text-[#3b82f6]">
                  <Lock size={20} />
                </div>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    const err = validarCampoPassword(val);
                    setErrores((prev) => {
                      const next = { ...prev };
                      if (err) next.password = err;
                      else delete next.password;
                      return next;
                    });
                    setErrorGeneral(null);
                  }}
                  onBlur={() => {
                    const err = validarCampoPassword(password);
                    setErrores((prev) => {
                      const next = { ...prev };
                      if (err) next.password = err;
                      else delete next.password;
                      return next;
                    });
                  }}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 transition-colors hover:text-white"
                >
                  {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errores.password && (
                  <p className="ml-1 mt-1 text-xs text-red-400">{errores.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || Object.keys(errores).length > 0}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#22c55e] py-4 text-base font-black text-white shadow-[0_14px_34px_-12px_rgba(59,130,246,0.9)] transition-all duration-300 hover:shadow-[0_18px_40px_-12px_rgba(34,197,94,0.85)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-full" />
              <span className="relative flex items-center justify-center gap-3">
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                {!isLoading && (
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4">
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0f172a]/80 px-4 text-[10px] font-black uppercase tracking-[2px] text-gray-600">
                  O continúa con
                </span>
              </div>
            </div>

            {hasGoogleId ? (
              <Suspense fallback={null}>
                <GoogleLoginButton setIsLoading={setIsLoading} />
              </Suspense>
            ) : (
              <button
                type="button"
                disabled
                className="glass-soft flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl py-4 text-base font-black text-gray-500"
                title="Configurar Google Client ID en .env.local"
              >
                <Globe size={22} /> Google
              </button>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[1px] text-gray-600">
            <ShieldCheck size={13} className="text-[#22c55e]" /> Sesión protegida con token
          </div>

          <p className="mt-5 text-center text-sm font-medium text-gray-500">
            ¿No tienes acceso todavía?{' '}
            <Link
              href="/register"
              className="group inline-flex items-center gap-1 font-black text-white transition-colors hover:text-[#22c55e]"
            >
              Crea tu cuenta{' '}
              <UserPlus size={16} className="transition-transform group-hover:scale-110" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
