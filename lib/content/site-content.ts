export interface FaqItem {
  question: string;
  answer: string;
}

export const landingFaq: FaqItem[] = [
  {
    question: '¿Qué es Cápi?',
    answer:
      'Cápi es una plataforma de finanzas personales para registrar ingresos y gastos, crear metas de ahorro y controlar presupuestos desde un mismo panel. Incluye un asistente de IA que responde preguntas sobre tus datos.',
  },
  {
    question: '¿Necesito saber de contabilidad para usar Cápi?',
    answer:
      'No. El registro se hace en lenguaje cotidiano: escribes el gasto, eliges la categoría y la fecha. Las guías públicas explican los conceptos básicos paso a paso.',
  },
  {
    question: '¿Cápi es gratuito?',
    answer:
      'El registro y el uso básico son gratuitos. Puedes crear tu cuenta y empezar a registrar movimientos sin tarjeta de crédito.',
  },
  {
    question: '¿Mis datos financieros están protegidos?',
    answer:
      'Cada usuario solo ve sus propios movimientos, metas y presupuestos. La autenticación usa contraseñas cifradas y tokens con vencimiento, y las rutas privadas no son indexables.',
  },
  {
    question: '¿Puedo hablarle al asistente en lugar de escribir?',
    answer:
      'Sí. CapiBot acepta texto y voz. Puedes preguntar por tus gastos del mes o pedir que registre un movimiento; siempre verás una confirmación antes de que se guarde.',
  },
];

export const landingTakeaways = [
  'Registra ingresos y gastos en segundos, desde el móvil o el ordenador.',
  'Controla presupuestos por categoría y recibe alertas visuales de tu progreso.',
  'Crea metas de ahorro con plazos y aportes sugeridos automáticamente.',
  'Pregunta a CapiBot por tus finanzas en lenguaje natural, con texto o voz.',
  'Genera reportes mensuales para entender hacia dónde va tu dinero.',
];

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
}

export interface GuideContent {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  takeaways: string[];
  sections: GuideSection[];
  faq: FaqItem[];
  parent?: string;
}

export const guides: GuideContent[] = [
  {
    slug: '/guia-finanzas-personales',
    title: 'Finanzas personales: guía práctica para ordenar tu dinero | Cápi',
    description:
      'Aprende a organizar tus finanzas personales paso a paso: registra movimientos, define un presupuesto, ahorra con metas y revisa tu progreso cada mes.',
    h1: 'Cómo organizar tus finanzas personales sin complicarte',
    intro:
      'Ordenar tus finanzas personales no requiere ser contador: necesitas un registro claro, un límite de gasto realista y un objetivo de ahorro. Esta guía te muestra el método en cinco pasos y cómo aplicarlo con Cápi.',
    takeaways: [
      'Empieza por anotar cada ingreso y gasto durante 30 días.',
      'Separa gastos fijos de variables para encontrar margen de ahorro.',
      'Define un presupuesto por categoría que puedas cumplir.',
      'Convierte el ahorro en metas concretas con fecha y monto.',
      'Revisa tus datos una vez al mes y ajusta sin culpas.',
    ],
    sections: [
      {
        heading: 'Paso 1: registra tus movimientos',
        paragraphs: [
          'La base de cualquier plan es saber cuánto entra y cuánto sale. Anota el monto, la fecha y una descripción corta. Si usas Cápi, puedes registrar desde el dashboard o pedirle a CapiBot que lo haga por ti.',
        ],
        bullets: [
          'Ingresos: salario, freelancers, ventas o transferencias recibidas.',
          'Gastos fijos: arriendo, servicios, internet y suscripciones.',
          'Gastos variables: comida, transporte, entretenimiento y compras.',
        ],
      },
      {
        heading: 'Paso 2: conoce tu punto de partida',
        paragraphs: [
          'Con 30 días de datos puedes calcular tu balance mensual y tu tasa de ahorro. Resta tus gastos totales de tus ingresos: esa diferencia es el margen con el que trabajarás.',
        ],
        table: {
          headers: ['Concepto', 'Cómo se calcula', 'Para qué sirve'],
          rows: [
            ['Balance mensual', 'Ingresos menos gastos', 'Saber si llegas a fin de mes'],
            ['Tasa de ahorro', 'Ahorro entre ingresos, por cien', 'Medir tu disciplina financiera'],
            ['Gasto por categoría', 'Suma de movimientos de la categoría', 'Detectar fugas de dinero'],
          ],
        },
      },
      {
        heading: 'Paso 3: crea un presupuesto alcanzable',
        paragraphs: [
          'Asigna un límite a cada categoría de gasto variable. Un buen presupuesto no es el más estricto, sino el que puedes sostener. En Cápi puedes crear presupuestos por categoría y mes.',
        ],
        bullets: [
          'Redondea los límites para que sean fáciles de recordar.',
          'Deja un pequeño fondo para imprevistos dentro del presupuesto.',
          'Revisa el progreso cada semana, no solo al final del mes.',
        ],
      },
      {
        heading: 'Paso 4: convierte el ahorro en metas',
        paragraphs: [
          'Una meta con nombre, monto y fecha es más poderosa que la intención de “ahorrar más”. Divide el objetivo entre los meses disponibles y sabrás cuánto debes apartar cada semana.',
        ],
      },
      {
        heading: 'Paso 5: revisa y ajusta cada mes',
        paragraphs: [
          'El reporte mensual te muestra variaciones, categorías que crecieron y tu tasa de ahorro. Ajusta los límites según lo aprendido: la constancia vale más que la perfección.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Cuánto tiempo tardo en ver resultados?',
        answer:
          'Con 30 días de registro ya tienes un panorama real. La mayoría de las personas nota cambios en sus hábitos entre el segundo y tercer mes de revisión mensual.',
      },
      {
        question: '¿Debo anotar los gastos pequeños?',
        answer:
          'Sí, sobre todo al inicio. Los gastos pequeños y repetidos suelen explicar una parte importante del presupuesto y son los más fáciles de ajustar.',
      },
      {
        question: '¿Qué hago si me paso del presupuesto?',
        answer:
          'Revisa la categoría afectada, ajusta el límite del siguiente mes si era irreal y compensa con otra categoría. El objetivo es aprender, no castigarte.',
      },
    ],
  },
  {
    slug: '/guias/presupuestos',
    title: 'Presupuestos por categoría: método simple para no gastar de más | Cápi',
    description:
      'Aprende a crear un presupuesto mensual por categorías, asignar límites realistas y hacer seguimiento semanal con ejemplos prácticos y plantillas.',
    h1: 'Cómo crear un presupuesto mensual que sí puedes cumplir',
    intro:
      'Un presupuesto es un plan de gasto, no una prohibición. La clave es asignar límites por categoría con base en tus datos reales y revisarlos de forma sencilla cada semana.',
    takeaways: [
      'Usa tus últimos tres meses como referencia para fijar límites.',
      'Separa necesidades, gustos y ahorro antes de gastar.',
      'Un límite por categoría es más útil que uno global.',
      'Revisa el avance cada semana para corregir a tiempo.',
      'Cápi calcula el gasto acumulado y muestra el porcentaje usado.',
    ],
    sections: [
      {
        heading: 'Qué necesitas antes de empezar',
        paragraphs: [
          'Reúne tus movimientos de los últimos tres meses y agrúpalos por categoría. Si todavía no los tienes, regístralos durante un mes antes de definir límites.',
        ],
        bullets: ['Ingresos netos mensuales', 'Gastos fijos', 'Gastos variables', 'Ahorro deseado'],
      },
      {
        heading: 'Cómo repartir tu ingreso',
        paragraphs: [
          'Una referencia práctica es dividir el ingreso en necesidades, gustos y ahorro. Ajusta los porcentajes a tu realidad: arriendo y transporte pueden pesar más en algunas ciudades.',
        ],
        table: {
          headers: ['Bloque', 'Referencia', 'Ejemplo con $2.000.000'],
          rows: [
            ['Necesidades', '50 %', '$1.000.000'],
            ['Gustos', '30 %', '$600.000'],
            ['Ahorro y deuda', '20 %', '$400.000'],
          ],
        },
      },
      {
        heading: 'Seguimiento semanal',
        paragraphs: [
          'Cada semana compara gasto acumulado contra el límite. Si vas al 80 % antes de mitad de mes, reduce el ritmo o reasigna desde otra categoría.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Qué categorías debo controlar primero?',
        answer:
          'Empieza por las tres con mayor gasto variable: comida, transporte y entretenimiento. Allí suele estar el margen de mejora más rápido.',
      },
      {
        question: '¿Cada cuánto debo actualizar el presupuesto?',
        answer:
          'Una vez al mes, usando el reporte de gastos. Cambia los límites solo si hay un cambio real de ingresos o de gastos fijos.',
      },
    ],
    parent: '/guia-finanzas-personales',
  },
  {
    slug: '/guias/metas-de-ahorro',
    title: 'Metas de ahorro: cómo fijar plazos y calcular aportes | Cápi',
    description:
      'Define metas de ahorro alcanzables, calcula cuánto necesitas ahorrar por mes y sigue tu progreso con ejemplos claros y una tabla de aportes.',
    h1: 'Cómo fijar metas de ahorro y llegar a ellas',
    intro:
      'Una meta de ahorro convierte un deseo en un plan: nombre, monto, fecha y aporte periódico. Esta guía te muestra cómo calcular el esfuerzo mensual y mantener el rumbo.',
    takeaways: [
      'Escribe la meta con un nombre concreto y una fecha.',
      'Divide el monto total entre los meses disponibles.',
      'Redondea el aporte para facilitar el cumplimiento.',
      'Automatiza la transferencia apenas recibas tus ingresos.',
      'En Cápi puedes registrar aportes parciales y ver el progreso.',
    ],
    sections: [
      {
        heading: 'Cómo calcular el aporte mensual',
        paragraphs: [
          'Resta lo que ya tienes del objetivo y divide el resultado entre los meses que faltan. Si el monto es muy alto, amplía el plazo o reduce otra categoría de gasto.',
        ],
        table: {
          headers: ['Meta', 'Objetivo', 'Plazo', 'Aporte mensual'],
          rows: [
            ['Fondo de emergencia', '$3.000.000', '12 meses', '$250.000'],
            ['Viaje', '$1.800.000', '9 meses', '$200.000'],
            ['Equipo de trabajo', '$1.200.000', '6 meses', '$200.000'],
          ],
        },
      },
      {
        heading: 'Prioriza el fondo de emergencia',
        paragraphs: [
          'Antes de metas de consumo, busca cubrir entre tres y seis meses de gastos fijos. Ese colchón evita que un imprevisto se convierta en deuda.',
        ],
        bullets: [
          'Empieza con un primer objetivo pequeño y alcanzable.',
          'Guarda el fondo en una cuenta separada y de fácil acceso.',
          'Usa aportes automáticos para no depender de la voluntad.',
        ],
      },
      {
        heading: 'Mide el progreso sin obsesionarte',
        paragraphs: [
          'Revisa tu meta una vez al mes. Si un aporte se queda corto, compensa el siguiente; lo importante es mantener la tendencia.',
        ],
      },
    ],
    faq: [
      {
        question: '¿Cuánto debería ahorrar cada mes?',
        answer:
          'Como referencia, busca entre el 10 % y el 20 % de tus ingresos. Si hoy no llegas, empieza con un 5 % y súbelo cuando liberes un gasto.',
      },
      {
        question: '¿Es mejor ahorrar o pagar deudas primero?',
        answer:
          'Cuba un pequeño fondo de emergencia y luego prioriza deudas con intereses altos. Después retoma tus metas de ahorro con más tranquilidad.',
      },
    ],
    parent: '/guia-finanzas-personales',
  },
];

export const guidesBySlug = Object.fromEntries(guides.map((guide) => [guide.slug, guide]));
