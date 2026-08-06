'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, rol, loading } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (loading || redirected.current) return;
    if (!token) {
      redirected.current = true;
      router.replace('/login');
    } else if (rol !== 'admin') {
      redirected.current = true;
      router.replace('/');
    }
  }, [token, rol, loading, router]);

  if (loading || !token || rol !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 pb-24 md:pb-6 bg-gradient-to-b from-[#1a1a2e] to-[#121212]">
        {children}
      </main>
    </div>
  );
}
