import LegalPage, { type LegalSection } from '@/components/content/LegalPage';

export const metadata = {
  title: 'Tratamiento de datos personales | Cápi',
  description: 'Finalidad, conservación y derechos sobre los datos personales que trata Cápi.',
};

const secciones: LegalSection[] = [
  {
    titulo: 'Responsable y alcance',
    parrafos: [
      'El responsable del tratamiento es el operador de Cápi. Esta política describe únicamente el tratamiento que ocurre dentro de la aplicación y de sus servicios necesarios.',
      'Cápi está dirigido a personas mayores de 18 años. No solicita información de menores de forma deliberada.',
    ],
  },
  {
    titulo: 'Finalidad y base del tratamiento',
    parrafos: [
      'Tratamos tus datos para crear y mantener tu cuenta, mostrar tus finanzas personales, enviar correos de recuperación de acceso y responder tus consultas al asistente.',
      'La base del tratamiento es el uso que tú haces de la aplicación y el consentimiento que das al crear tu cuenta y registrar información.',
    ],
  },
  {
    titulo: 'Conservación',
    parrafos: [
      'Conservamos tu información mientras tu cuenta esté activa. Los registros de auditoría de eventos importantes se conservan para detectar accesos no autorizados y resolver incidencias.',
      'Cuando eliminas movimientos, metas o presupuestos, dejan de mostrarse en tu cuenta. La eliminación definitiva de la cuenta se gestiona desde Soporte.',
    ],
  },
  {
    titulo: 'Destinatarios',
    parrafos: [
      'Solo intervienen proveedores necesarios para operar el servicio: alojamiento, base de datos, envío de correo y verificación de identidad con Google cuando usas ese acceso.',
      'No cedemos tus datos a terceros para fines comerciales propios o ajenos.',
    ],
  },
  {
    titulo: 'Tus derechos',
    parrafos: [
      'Puedes consultar, corregir y eliminar la información que registras desde la propia aplicación. Para pedir una copia de tus datos o la eliminación de tu cuenta, consulta la página de Soporte, donde se publicará el canal de contacto directo cuando esté habilitado.',
      'Cápi no promete certificaciones ni controles que no hayan sido verificados públicamente. Esta política se actualizará si el tratamiento de información cambia.',
    ],
  },
];

export default function TratamientoDatosPage() {
  return (
    <LegalPage
      titulo="Tratamiento de datos personales"
      resumen="Cómo usa Cápi la información que registras, durante cuánto tiempo y qué puedes pedir sobre ella."
      actualizado="26 de noviembre de 2026"
      secciones={secciones}
    />
  );
}
