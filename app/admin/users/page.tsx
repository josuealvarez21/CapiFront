'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  Pencil,
  X,
  Save,
  Users as UsersIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import type { AdminUserListItem, AdminUserDetail } from '@/lib/types';

const PAGE_SIZE = 15;

function EditUserModal({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUserDetail;
  onClose: () => void;
  onSaved: (updated: AdminUserListItem) => void;
}) {
  const { token } = useAuth();
  const [nombre, setNombre] = useState(user.nombre);
  const [email, setEmail] = useState(user.email);
  const [rol, setRol] = useState(user.rol);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const updated = await api.admin.updateUser(token, user.id_usuario, { nombre, email, rol });
      onSaved(updated);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#0a0e17] px-4 py-3 text-white outline-none transition focus:border-[#3b82f6] focus:ring-4 focus:ring-[#3b82f6]/10 [color-scheme:dark]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl p-5 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.9)] sm:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-[#22c55e] opacity-80" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight neon-text sm:text-2xl">
              Editar Usuario
            </h3>
            <p className="mt-1 text-xs text-gray-500">Actualiza los datos y el rol de la cuenta.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="glass-soft shrink-0 rounded-full p-2 text-gray-400 transition hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div className="flex items-center gap-4 border-b border-white/10 pb-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-2xl font-black text-white shadow-[0_10px_30px_-12px_rgba(59,130,246,0.9)] sm:h-16 sm:w-16">
              {nombre.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-white sm:text-lg">{nombre}</p>
              <p className="truncate text-sm text-gray-400">{email}</p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-gray-500">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-gray-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-gray-500">
              Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className={inputClass}
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="glass-soft rounded-xl p-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              Total Movimientos
            </p>
            <p className="stat-value mt-1 text-xl font-extrabold text-white">
              {user.total_movimientos}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button type="button" onClick={onClose} className="btn-ghost w-full sm:w-auto">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary w-full disabled:opacity-50 sm:w-auto"
            >
              {saving ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#090d16] border-t-transparent motion-reduce:animate-none" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolFilter, setRolFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [editUser, setEditUser] = useState<AdminUserDetail | null>(null);
  const [editLoading, setEditLoading] = useState(false);

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

  const openEdit = async (id: number) => {
    if (!token) return;
    setEditLoading(true);
    try {
      const detail = await api.admin.getUser(token, id);
      setEditUser(detail);
    } catch (e) {
      console.error(e);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSaved = (updated: AdminUserListItem) => {
    setUsers((prev) =>
      prev.map((u) => (u.id_usuario === updated.id_usuario ? updated : u))
    );
  };

  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      animate="show"
    >
      <motion.header
        variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
        className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full glass-soft px-3 py-1.5">
            <UsersIcon size={13} className="text-[#60a5fa]" />
            <span className="eyebrow text-gray-400">Directorio de cuentas</span>
          </div>
          <h2 className="neon-text text-3xl font-black tracking-tight sm:text-4xl">Usuarios</h2>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <div className="glass-soft flex w-fit gap-1 rounded-full p-1">
          {['', 'user', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRolFilter(r)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                rolFilter === r
                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#22c55e] text-[#090d16] shadow-[0_8px_20px_-10px_rgba(59,130,246,0.9)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {r === '' ? 'Todos' : r === 'admin' ? 'Admins' : 'Usuarios'}
            </button>
          ))}
        </div>
      </motion.header>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="glass-card flex flex-col items-center gap-4 rounded-3xl px-10 py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3b82f6] border-t-transparent motion-reduce:animate-none" />
            <p className="eyebrow neon-text">Cargando usuarios</p>
          </div>
        </div>
      ) : (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
          className="glass-card overflow-hidden rounded-3xl"
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-widest text-gray-500 sm:text-xs">
                  <th className="p-4 text-left font-black sm:p-5">Usuario</th>
                  <th className="p-4 text-left font-black sm:p-5">Email</th>
                  <th className="p-4 text-left font-black sm:p-5">Rol</th>
                  <th className="p-4 text-center font-black sm:p-5">Movimientos</th>
                  <th className="p-4 text-right font-black sm:p-5">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id_usuario}
                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="p-4 sm:p-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#22c55e] text-sm font-bold text-white">
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate font-bold text-white">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-400 sm:p-5">{u.email}</td>
                    <td className="p-4 sm:p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                          u.rol === 'admin'
                            ? 'bg-[#22c55e]/10 text-[#4ade80] ring-1 ring-inset ring-[#22c55e]/25'
                            : 'bg-[#3b82f6]/10 text-[#60a5fa] ring-1 ring-inset ring-[#3b82f6]/25'
                        }`}
                      >
                        {u.rol === 'admin' ? <Shield size={14} /> : <User size={14} />}
                        {u.rol}
                      </span>
                    </td>
                    <td className="stat-value p-4 text-center font-bold text-white sm:p-5">
                      {u.total_movimientos}
                    </td>
                    <td className="p-4 text-right sm:p-5">
                      <button
                        type="button"
                        onClick={() => openEdit(u.id_usuario)}
                        aria-label={`Editar a ${u.nombre}`}
                        className="glass-soft inline-flex rounded-lg p-2 text-gray-400 transition-colors hover:text-[#60a5fa]"
                        title="Editar usuario"
                      >
                        <Pencil size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500">
                      No hay usuarios{rolFilter ? ` con rol "${rolFilter}"` : ''}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {!loading && users.length > 0 && (
        <div className="mt-6 flex items-center justify-between px-1">
          <p className="text-sm font-medium text-gray-400">Página {page + 1}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={16} /> <span className="hidden sm:inline">Anterior</span>
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="btn-ghost disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="hidden sm:inline">Siguiente</span> <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {editLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass-card flex flex-col items-center gap-3 rounded-3xl px-8 py-7">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#3b82f6] border-t-transparent motion-reduce:animate-none" />
            <p className="eyebrow neon-text">Cargando usuario</p>
          </div>
        </div>
      )}

      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={handleSaved} />
      )}
    </motion.div>
  );
}
