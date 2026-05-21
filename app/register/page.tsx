'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Sparkles, LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errores, setErrores] = useState<{
    nombre?: string;
    email?: string;
    password?: string;
    confirmarPassword?: string;
  }>({});
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const router = useRouter();

  const validarCampoNombre = (valor: string): string | undefined => {
    if (valor !== valor.trim()) return 'No se permiten espacios en blanco al inicio ni al final';
    if (!valor) return 'El nombre es obligatorio';
    if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(valor))
      return 'El nombre solo debe contener letras y espacios';
    return undefined;
  };

  const validarCampoEmail = (valor: string): string | undefined => {
    if (valor.includes(' ')) return 'El correo electrónico no puede contener espacios en blanco';
    if (!valor) return 'El correo es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor))
      return 'Ingresa un correo electrónico válido';
    return undefined;
  };

  const validarCampoPassword = (valor: string): string | undefined => {
    if (!valor) return 'La contraseña es obligatoria';
    if (/[<>'"\\`]/.test(valor))
      return 'La contraseña contiene caracteres no permitidos (< > \' " \\ `)';
    if (valor !== valor.trim()) return 'La contraseña no puede tener espacios al inicio ni al final';
    if (valor.length < 8 || !/[A-Z]/.test(valor) || !/[a-z]/.test(valor) || !/[^a-zA-Z0-9]/.test(valor))
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un símbolo (ej. . , @ _)';
    return undefined;
  };

  const validarCampoConfirmar = (valor: string): string | undefined => {
    if (valor !== valor.trim()) return 'La contraseña no puede tener espacios al inicio ni al final';
    if (password !== valor) return 'Las contraseñas no coinciden';
    return undefined;
  };

  const validarFormulario = (): boolean => {
    const nuevos: typeof errores = {};

    const errNombre = validarCampoNombre(nombre);
    if (errNombre) nuevos.nombre = errNombre;

    const errEmail = validarCampoEmail(email);
    if (errEmail) nuevos.email = errEmail;

    const errPassword = validarCampoPassword(password);
    if (errPassword) nuevos.password = errPassword;

    const errConfirmar = validarCampoConfirmar(confirmarPassword);
    if (errConfirmar) nuevos.confirmarPassword = errConfirmar;

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
      await api.auth.signup(nombre.trim(), email.trim(), password);
      setExito(true);
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

  if (exito) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[480px] bg-[#121212] border border-[#1e1e1e] rounded-[32px] p-10 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#22c55e] to-[#1C542D] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-green-500/20">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">¡Cuenta creada con éxito!</h2>
          <p className="text-gray-400 mb-8">Ya puedes iniciar sesión con tu correo y contraseña.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white py-4 px-8 rounded-2xl font-black text-lg transition-all hover:shadow-[0_8px_24px_-8px_rgba(34,197,94,0.5)] active:scale-[0.98]"
          >
            Ir a Iniciar Sesión
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_50%)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] bg-[#121212] border border-[#1e1e1e] rounded-[32px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 blur-[80px] rounded-full group-hover:bg-green-500/20 transition-colors duration-700"></div>

        <div className="relative z-10 text-center mb-10">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="w-20 h-20 bg-gradient-to-br from-[#22c55e] to-[#1C542D] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-green-500/20"
          >
            <ShieldCheck size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Nueva Identidad</h1>
          <p className="text-gray-500 font-medium">Únete a la élite financiera de Cápi.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {errorGeneral && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-400 text-sm font-medium text-center">{errorGeneral}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
              Nombre Completo
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#22c55e] transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => {
                  const val = e.target.value;
                  setNombre(val);
                  const err = validarCampoNombre(val);
                  setErrores((prev) => {
                    const next = { ...prev };
                    if (err) next.nombre = err;
                    else delete next.nombre;
                    return next;
                  });
                  setErrorGeneral(null);
                }}
                onBlur={() => {
                  const err = validarCampoNombre(nombre);
                  setErrores((prev) => {
                    const next = { ...prev };
                    if (err) next.nombre = err;
                    else delete next.nombre;
                    return next;
                  });
                }}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#22c55e] focus:ring-4 focus:ring-green-500/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-700 font-medium"
              />
              {errores.nombre && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errores.nombre}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
              Correo Electrónico
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#22c55e] transition-colors">
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
                className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#22c55e] focus:ring-4 focus:ring-green-500/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-700 font-medium"
              />
              {errores.email && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errores.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
              Contraseña de Bóveda
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#22c55e] transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={mostrarPassword ? 'text' : 'password'}
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
                  const errP = validarCampoPassword(password);
                  setErrores((prev) => {
                    const next = { ...prev };
                    if (errP) next.password = errP;
                    else delete next.password;
                    return next;
                  });
                  if (confirmarPassword) {
                    const errC = validarCampoConfirmar(confirmarPassword);
                    setErrores((prev) => {
                      const next = { ...prev };
                      if (errC) next.confirmarPassword = errC;
                      else delete next.confirmarPassword;
                      return next;
                    });
                  }
                }}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#22c55e] focus:ring-4 focus:ring-green-500/10 rounded-2xl py-4 pl-12 pr-12 text-white outline-none transition-all placeholder:text-gray-700 font-medium"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-white transition-colors"
              >
                {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errores.password && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errores.password}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
              Confirmar Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#22c55e] transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={mostrarConfirmarPassword ? 'text' : 'password'}
                required
                value={confirmarPassword}
                onChange={(e) => {
                  const val = e.target.value;
                  setConfirmarPassword(val);
                  const err = validarCampoConfirmar(val);
                  setErrores((prev) => {
                    const next = { ...prev };
                    if (err) next.confirmarPassword = err;
                    else delete next.confirmarPassword;
                    return next;
                  });
                  setErrorGeneral(null);
                }}
                onBlur={() => {
                  const err = validarCampoConfirmar(confirmarPassword);
                  setErrores((prev) => {
                    const next = { ...prev };
                    if (err) next.confirmarPassword = err;
                    else delete next.confirmarPassword;
                    return next;
                  });
                }}
                placeholder="Repite la contraseña"
                className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#22c55e] focus:ring-4 focus:ring-green-500/10 rounded-2xl py-4 pl-12 pr-12 text-white outline-none transition-all placeholder:text-gray-700 font-medium"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-white transition-colors"
              >
                {mostrarConfirmarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errores.confirmarPassword && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errores.confirmarPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || Object.keys(errores).length > 0}
            className="w-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:shadow-[0_8px_24px_-8px_rgba(34,197,94,0.5)] text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? 'Creando Acceso...' : 'Sellar Mi Registro'}
            {!isLoading && (
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-500 text-sm font-medium">
          ¿Ya tienes una llave?{' '}
          <Link
            href="/login"
            className="text-white font-black hover:text-[#3b82f6] transition-colors inline-flex items-center gap-1 group"
          >
            Inicia sesión{' '}
            <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
