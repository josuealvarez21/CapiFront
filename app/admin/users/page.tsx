'use client';

import { useEffect, useState } from 'react';
import { Shield, User, ChevronLeft, ChevronRight, Pencil, X, Save } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Editar Usuario</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-[#2e2e2e]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-2xl font-bold text-white">
              {nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{nombre}</p>
              <p className="text-sm text-gray-400">{email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] transition"
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="bg-[#121212] rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Movimientos</p>
            <p className="text-white font-bold mt-1">{user.total_movimientos}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-[#2e2e2e] text-gray-300 hover:bg-[#3e3e3e] transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-[#8b5cf6] text-white hover:bg-[#7c3aed] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Save size={18} /> Guardar Cambios</>
              )}
            </button>
          </div>
        </div>
      </div>
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
    <div>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
            Usuarios
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <div className="flex gap-3">
          {['', 'user', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRolFilter(r)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                rolFilter === r
                  ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-900/20'
                  : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#2e2e2e] border border-[#2e2e2e]'
              }`}
            >
              {r === '' ? 'Todos' : r === 'admin' ? 'Admins' : 'Usuarios'}
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
                <tr className="border-b border-[#2e2e2e] text-gray-400 text-sm uppercase tracking-wider">
                  <th className="text-left p-5 font-semibold">Usuario</th>
                  <th className="text-left p-5 font-semibold">Email</th>
                  <th className="text-left p-5 font-semibold">Rol</th>
                  <th className="text-center p-5 font-semibold">Movimientos</th>
                  <th className="text-right p-5 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id_usuario} className="border-b border-[#2e2e2e] hover:bg-[#252525] transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-sm font-bold text-white">
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="p-5 text-gray-300">{u.email}</td>
                    <td className="p-5">
                      <span className={`flex items-center gap-2 text-sm font-medium ${u.rol === 'admin' ? 'text-purple-400' : 'text-blue-400'}`}>
                        {u.rol === 'admin' ? <Shield size={16} /> : <User size={16} />}
                        {u.rol}
                      </span>
                    </td>
                    <td className="p-5 text-center text-white font-medium">{u.total_movimientos}</td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => openEdit(u.id_usuario)}
                        className="p-2 bg-[#2e2e2e] hover:bg-[#3e3e3e] rounded-lg text-gray-400 hover:text-white transition"
                        title="Editar usuario"
                      >
                        <Pencil size={18} />
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

      {editLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}
