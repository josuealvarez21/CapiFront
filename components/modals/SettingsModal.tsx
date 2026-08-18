'use client';

import Modal from './Modal';
import Image from 'next/image';
import type { UserData } from '@/lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  user: UserData;
  profileName: string;
  setProfileName: (name: string) => void;
  profilePicUrl: string;
  setProfilePicUrl: (url: string) => void;
  profilePicFile: File | null;
  setProfilePicFile: (file: File | null) => void;
  isUploading: boolean;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  profileName,
  setProfileName,
  profilePicUrl,
  setProfilePicUrl,
  profilePicFile,
  setProfilePicFile,
  isUploading,
}: SettingsModalProps) {
  const previewSrc =
    profilePicUrl ||
    (profilePicFile ? URL.createObjectURL(profilePicFile) : null) ||
    user.foto_perfil ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=121212&color=fff`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajustes de Perfil">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#22c55e] p-[2px] shadow-lg">
            <Image
              src={previewSrc}
              alt="Preview"
              width={96}
              height={96}
              unoptimized
              className="w-full h-full rounded-full object-cover border-4 border-[#0a0e17]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Tu Nombre
          </label>
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6]"
            placeholder="Tu nombre completo..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            URL de Foto de Perfil
          </label>
          <input
            type="url"
            value={profilePicUrl}
            onChange={(e) => {
              setProfilePicUrl(e.target.value);
              setProfilePicFile(null);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6]"
            placeholder="https://ejemplo.com/mifoto.jpg"
          />
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0a0e17] px-4 text-[10px] font-black text-gray-500 uppercase tracking-[2px]">
              O Sube un Archivo
            </span>
          </div>
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setProfilePicFile(e.target.files[0]);
                setProfilePicUrl('');
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3b82f6] file:text-white hover:file:bg-blue-600 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={
            isUploading || (!profilePicUrl && !profilePicFile && profileName === user.nombre)
          }
          className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white py-4 rounded-xl font-extrabold text-lg mt-6 shadow-lg shadow-blue-900/30 disabled:opacity-50"
        >
          {isUploading ? 'Actualizando...' : 'Guardar Cambios'}
        </button>
      </form>
    </Modal>
  );
}
