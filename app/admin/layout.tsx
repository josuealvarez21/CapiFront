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
      router.replace('/app');
    }
  }, [token, rol, loading, router]);

  if (loading || !token || rol !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16]">
        <div className="glass-card flex flex-col items-center gap-4 rounded-3xl px-10 py-8">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3b82f6] border-t-transparent motion-reduce:animate-none" />
          <p className="eyebrow neon-text">Cápi Admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#090d16] font-sans text-white">
      <AdminSidebar />
      <main className="relative min-h-screen flex-1 overflow-y-auto px-4 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-6 md:pb-8 lg:px-10 lg:pt-8">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.08),transparent_45%)]" />
        </div>
        <div className="relative mx-auto w-full max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
