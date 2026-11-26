import LegalPage, { type LegalSection } from '@/components/content/LegalPage';

export const metadata = {
  title: 'Términos de uso | Cápi',
  description: 'Condiciones para usar Cápi y limitaciones del asistente financiero.',
};

const secciones: LegalSection[] = [
  {
    titulo: 'Uso permitido',
    parrafos: [
      'Puedes usar Cápi para registrar y revisar tus finanzas personales. Debes registrar información veraz y no utilizar la aplicación para hostigar, engañar o afectar a otras personas.',
      'Cada usuario es responsable de la información que ingresa y de mantener segura su contraseña.',
    ],
  },
  {
    titulo: 'CapiBot',
    parrafos: [
      'CapiBot consulta únicamente los datos de la cuenta autenticada y responde con información real de esa cuenta. Antes de crear, editar o eliminar cualquier registro, muestra una confirmación; si cancelas, no se realiza el cambio.',
      'El asistente puede cometer errores al interpretar lenguaje natural. Revisa siempre el monto, la categoría y la fecha en la tarjeta de confirmación.',
    ],
  },
  {
    titulo: 'No es asesoría financiera',
    parrafos: [
      'Cápi y CapiBot son herramientas de organización personal. No son un banco, no ofrecen recomendaciones de inversión y no sustituyen a un asesor financiero certificado.',
      'Las cifras que muestra la aplicación se basan en los movimientos que tú registras.',
    ],
  },
  {
    titulo: 'Disponibilidad y cambios',
    parrafos: [
      'El servicio puede cambiar o interrumpirse para mantenimiento. Podemos actualizar estas condiciones cuando las funcionalidades o el tratamiento de información cambien.',
      'Si usas la aplicación después de una actualización, aceptas la versión publicada en esta página.',
    ],
  },
];

export default function TerminosPage() {
  return (
    <LegalPage
      titulo="Términos de uso"
      resumen="Reglas básicas para usar Cápi y límites claros sobre lo que el asistente puede hacer."
      actualizado="26 de noviembre de 2026"
      secciones={secciones}
    />
  );
}
