import LegalPage, { type LegalSection } from '@/components/content/LegalPage';

export const metadata = {
  title: 'Privacidad | Cápi',
  description: 'Qué datos guarda Cápi, para qué los usa y qué opciones tienes sobre tu información.',
};

const secciones: LegalSection[] = [
  {
    titulo: 'Qué información guardamos',
    parrafos: [
      'Cápi guarda los datos que tú nos entregas para usar la aplicación: nombre, correo electrónico, contraseña cifrada o identificador de tu cuenta de Google cuando eliges ese acceso, y la información financiera que registras.',
      'También guardamos movimientos, categorías, presupuestos, metas de ahorro, historial del asistente y, si decides subirla, tu foto de perfil.',
    ],
    lista: [
      'No pedimos credenciales de banca en línea ni datos de tarjetas.',
      'No mostramos datos de otras cuentas: cada usuario solo ve la información asociada a su cuenta.',
    ],
  },
  {
    titulo: 'Para qué usamos tus datos',
    parrafos: [
      'Usamos la información para mostrar tu dashboard, calcular balances, presupuestos y reportes, mantener tu sesión y permitir que CapiBot responda preguntas sobre tus propios datos.',
      'CapiBot no inventa movimientos ni ejecuta cambios sin que confirmes la acción en la interfaz.',
    ],
  },
  {
    titulo: 'Con quién compartimos información',
    parrafos: [
      'Solo compartimos lo necesario con los proveedores que hacen posible el servicio: alojamiento del backend y la base de datos, envío de correos de recuperación y, si usas Google para entrar, la verificación de tu identidad ante Google.',
      'No vendemos tus datos ni los usamos para publicidad de terceros.',
    ],
  },
  {
    titulo: 'Tus opciones',
    parrafos: [
      'Puedes editar tu perfil, corregir o eliminar movimientos, metas y presupuestos desde la aplicación, y cambiar tu contraseña cuando lo necesites.',
      'Para solicitar la eliminación de tu cuenta o una copia de tus datos, revisa la página de Soporte.',
    ],
  },
  {
    titulo: 'Seguridad',
    parrafos: [
      'Las contraseñas se almacenan con una función de derivación lenta, nunca en texto plano. Las sesiones usan tokens con expiración y revocación, y las fotos de perfil se guardan en la base de datos con un token opaco en lugar de una URL pública.',
      'Cápi es una herramienta de organización personal: no es un banco, no ofrece asesoría financiera certificada y no reemplaza a un profesional.',
    ],
  },
];

export default function PrivacidadPage() {
  return (
    <LegalPage
      titulo="Privacidad"
      resumen="Esta página explica, en lenguaje claro, qué información maneja Cápi y cómo se usa cuando registras movimientos, metas o presupuestos."
      actualizado="26 de noviembre de 2026"
      secciones={secciones}
    />
  );
}
