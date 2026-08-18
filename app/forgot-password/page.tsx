'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Key, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.auth.forgotPassword(email);
      setIsSent(true);
    } catch (error) {
      if (error instanceof ApiError) {
        alert('No encontramos ninguna cuenta con ese correo');
      } else {
        alert('Error de conexión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] relative overflow-hidden flex items-center justify-center p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#3b82f6] opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#22c55e] opacity-20 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] glass-card rounded-[32px] p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#3b82f6]/10 blur-[80px] rounded-full"></div>

        <div className="relative z-10 text-center mb-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>

          <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#22c55e] rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <Key size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Recuperar Acceso</h1>
          <p className="text-gray-500 font-medium">Te enviaremos una nueva llave a tu correo.</p>
        </div>

        {isSent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl mb-8">
              <p className="text-green-400 font-bold mb-2">¡Email Enviado!</p>
              <p className="text-gray-400 text-sm">
                Revisa tu bandeja de entrada para continuar con la recuperación.
              </p>
            </div>
            <Link href="/login" className="text-white font-black hover:underline">
              Ir al Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-[2px] ml-1">
                Tu Correo Registrado
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#3b82f6] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#3b82f6] focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-700 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#3b82f6] to-[#22c55e] text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
              {!isLoading && <Send size={20} />}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
