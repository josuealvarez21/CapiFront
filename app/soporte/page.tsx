import Link from 'next/link';
import LegalPage, { type LegalSection } from '@/components/content/LegalPage';

export const metadata = {
  title: 'Soporte | Cápi',
  description: 'Dónde encontrar ayuda para tu cuenta, tu acceso y tus datos en Cápi.',
};

const secciones: LegalSection[] = [
  {
    titulo: 'Problemas para entrar',
    parrafos: [
      'Si olvidaste tu contraseña, usa la pantalla de recuperación. El enlace se envía al correo asociado a tu cuenta.',
      'Si entraste con Google, asegúrate de usar la misma cuenta de Google con la que te registraste.',
    ],
  },
  {
    titulo: 'Tus datos y tu cuenta',
    parrafos: [
      'Puedes corregir tu perfil y eliminar movimientos, metas o presupuestos desde la aplicación. El canal de contacto directo para solicitudes de copia o eliminación de cuenta se habilitará próximamente y se publicará en esta página.',
      'Antes de escribir, revisa las preguntas frecuentes de la página principal: muchas dudas sobre registro y uso básico están respondidas allí.',
    ],
  },
  {
    titulo: 'Alcance del soporte',
    parrafos: [
      'Cápi no ofrece soporte bancario ni asesoría financiera. Para productos financieros o decisiones de inversión, acude a tu entidad o a un profesional habilitado.',
    ],
  },
];

export default function SoportePage() {
  return (
    <>
      <LegalPage
        titulo="Soporte"
        resumen="Acciones disponibles cuando necesitas ayuda con tu acceso o con la información de tu cuenta."
        actualizado="26 de noviembre de 2026"
        secciones={secciones}
      />
      <div className="mx-auto -mt-8 max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <Link
          href="/forgot-password"
          className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-200 transition hover:border-[#3b82f6]/50 hover:text-white"
        >
          Recuperar acceso
        </Link>
      </div>
    </>
  );
}
