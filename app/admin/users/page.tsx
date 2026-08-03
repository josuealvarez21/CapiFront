'use client';

import { useEffect, useState } from 'react';
import { Shield, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { AdminUserListItem } from '@/lib/types';

const PAGE_SIZE = 15;

function PlanBadge({ rol }: { rol: string }) {
  if (rol === 'admin') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <Shield size={14} /> Administrador
      </span>
    );
  }
  if (rol === 'pro') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
        <Star size={14} /> Cápi Pro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <User size={14} /> Plan Gratuito
    </span>
  );
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolFilter, setRolFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setPage(0);
  }, [rolFilter]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const skip = page * PAGE_SIZE;
    api.admin.listUsers(token, { ...(rolFilter ? { rol: rolFilter } : {}), skip, limit: PAGE_SIZE + 1 })
      .then((result) => {
        setHasMore(result.length > PAGE_SIZE);
        setUsers(result.slice(0, PAGE_SIZE));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, rolFilter, page]);

  const filterOptions = [
    { id: '', label: 'Todos' },
    { id: 'user', label: 'Gratuito' },
    { id: 'pro', label: 'Cápi Pro' },
    { id: 'admin', label: 'Admins' },
  ];

  return (
    <div>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Consulta de Usuarios
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg">
            Listado general de usuarios y sus planes de pago
          </p>
        </div>
        <div className="flex gap-2 bg-[#121212] p-1.5 rounded-2xl border border-[#2e2e2e]">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setRolFilter(f.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                rolFilter === f.id
                  ? 'bg-[#8b5cf6] text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-[#1e1e1e]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2e2e2e] text-gray-400 text-xs uppercase tracking-wider bg-[#181818]">
                  <th className="text-left p-5 font-bold">Nombre</th>
                  <th className="text-left p-5 font-bold">Email</th>
                  <th className="text-left p-5 font-bold">Plan de Pago / Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e2e2e]">
                {users.map((u) => (
                  <tr key={u.id_usuario} className="hover:bg-[#252525] transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-sm font-bold text-white shadow">
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-semibold">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="p-5 text-gray-300 text-sm">{u.email}</td>
                    <td className="p-5">
                      <PlanBadge rol={u.rol} />
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-gray-500">
                      No hay usuarios registrados{rolFilter ? ` en el filtro "${rolFilter}"` : ''}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && users.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <p className="text-sm text-gray-400">
            Página {page + 1}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#1e1e1e] text-gray-400 hover:bg-[#2e2e2e] border border-[#2e2e2e]"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#1e1e1e] text-gray-400 hover:bg-[#2e2e2e] border border-[#2e2e2e]"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
