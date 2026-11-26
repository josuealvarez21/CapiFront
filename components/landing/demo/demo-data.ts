export type DemoTipo = 'ingreso' | 'gasto';

export interface DemoMovement {
  id: string;
  descripcion: string;
  categoria: string;
  tipo: DemoTipo;
  monto: number;
  fecha: string;
}

export interface DemoGoal {
  id: string;
  nombre: string;
  actual: number;
  objetivo: number;
  color: string;
  fechaLimite: string;
}

export interface DemoConfirmation {
  descripcion: string;
  categoria: string;
  monto: number;
  fecha: string;
  tipo: DemoTipo;
}

export interface DemoChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export interface DemoMonth {
  value: string;
  label: string;
  short: string;
}

export interface DemoStats {
  ingresos: number;
  gastos: number;
  balance: number;
  total: number;
}

export interface DemoCategoriaResumen {
  nombre: string;
  monto: number;
  pct: number;
}

export const DEMO_MONTHS: DemoMonth[] = [
  { value: '2026-09', label: 'Septiembre 2026', short: 'Sep' },
  { value: '2026-10', label: 'Octubre 2026', short: 'Oct' },
  { value: '2026-11', label: 'Noviembre 2026', short: 'Nov' },
];

export const DEMO_DAY = '18';
export const DEMO_CURRENT_MONTH = DEMO_MONTHS[DEMO_MONTHS.length - 1].value;

export const DEMO_MOVEMENTS: DemoMovement[] = [
  { id: 'mv-01', descripcion: 'Nómina quincenal', categoria: 'Salario', tipo: 'ingreso', monto: 1800000, fecha: '2026-11-15' },
  { id: 'mv-02', descripcion: 'Nómina quincenal', categoria: 'Salario', tipo: 'ingreso', monto: 1500000, fecha: '2026-11-30' },
  { id: 'mv-03', descripcion: 'Proyecto de diseño', categoria: 'Freelance', tipo: 'ingreso', monto: 900000, fecha: '2026-11-22' },
  { id: 'mv-04', descripcion: 'Arriendo del mes', categoria: 'Alquiler', tipo: 'gasto', monto: 650000, fecha: '2026-11-05' },
  { id: 'mv-05', descripcion: 'Mercado de la semana', categoria: 'Comida', tipo: 'gasto', monto: 185000, fecha: '2026-11-18' },
  { id: 'mv-06', descripcion: 'Gasolina y transporte', categoria: 'Transporte', tipo: 'gasto', monto: 120000, fecha: '2026-11-12' },
  { id: 'mv-07', descripcion: 'Luz, agua e internet', categoria: 'Servicios', tipo: 'gasto', monto: 250000, fecha: '2026-11-10' },
  { id: 'mv-08', descripcion: 'Cine y salidas', categoria: 'Entretenimiento', tipo: 'gasto', monto: 145000, fecha: '2026-11-20' },
  { id: 'mv-09', descripcion: 'Control médico', categoria: 'Salud', tipo: 'gasto', monto: 300000, fecha: '2026-11-08' },
  { id: 'mv-10', descripcion: 'Curso de finanzas', categoria: 'Educación', tipo: 'gasto', monto: 200000, fecha: '2026-11-25' },
  { id: 'mv-11', descripcion: 'Nómina quincenal', categoria: 'Salario', tipo: 'ingreso', monto: 1800000, fecha: '2026-10-15' },
  { id: 'mv-12', descripcion: 'Nómina quincenal', categoria: 'Salario', tipo: 'ingreso', monto: 1500000, fecha: '2026-10-30' },
  { id: 'mv-13', descripcion: 'Trabajo extra', categoria: 'Freelance', tipo: 'ingreso', monto: 436000, fecha: '2026-10-24' },
  { id: 'mv-14', descripcion: 'Arriendo del mes', categoria: 'Alquiler', tipo: 'gasto', monto: 650000, fecha: '2026-10-05' },
  { id: 'mv-15', descripcion: 'Mercado del mes', categoria: 'Comida', tipo: 'gasto', monto: 560000, fecha: '2026-10-18' },
  { id: 'mv-16', descripcion: 'Gasolina y transporte', categoria: 'Transporte', tipo: 'gasto', monto: 130000, fecha: '2026-10-12' },
  { id: 'mv-17', descripcion: 'Luz, agua e internet', categoria: 'Servicios', tipo: 'gasto', monto: 260000, fecha: '2026-10-10' },
  { id: 'mv-18', descripcion: 'Concierto', categoria: 'Entretenimiento', tipo: 'gasto', monto: 180000, fecha: '2026-10-20' },
  { id: 'mv-19', descripcion: 'Control médico', categoria: 'Salud', tipo: 'gasto', monto: 129000, fecha: '2026-10-08' },
  { id: 'mv-20', descripcion: 'Nómina quincenal', categoria: 'Salario', tipo: 'ingreso', monto: 1800000, fecha: '2026-09-15' },
  { id: 'mv-21', descripcion: 'Nómina quincenal', categoria: 'Salario', tipo: 'ingreso', monto: 1400000, fecha: '2026-09-30' },
  { id: 'mv-22', descripcion: 'Arriendo del mes', categoria: 'Alquiler', tipo: 'gasto', monto: 650000, fecha: '2026-09-05' },
  { id: 'mv-23', descripcion: 'Mercado del mes', categoria: 'Comida', tipo: 'gasto', monto: 620000, fecha: '2026-09-18' },
  { id: 'mv-24', descripcion: 'Luz, agua e internet', categoria: 'Servicios', tipo: 'gasto', monto: 280000, fecha: '2026-09-10' },
  { id: 'mv-25', descripcion: 'Gasolina y transporte', categoria: 'Transporte', tipo: 'gasto', monto: 150000, fecha: '2026-09-12' },
  { id: 'mv-26', descripcion: 'Salidas', categoria: 'Entretenimiento', tipo: 'gasto', monto: 200000, fecha: '2026-09-20' },
  { id: 'mv-27', descripcion: 'Control médico', categoria: 'Salud', tipo: 'gasto', monto: 100000, fecha: '2026-09-08' },
];

export const DEMO_GOALS: DemoGoal[] = [
  {
    id: 'goal-1',
    nombre: 'Viaje a Cartagena',
    actual: 1800000,
    objetivo: 2500000,
    color: 'from-[#3b82f6] to-[#22c55e]',
    fechaLimite: '2027-03-15',
  },
  {
    id: 'goal-2',
    nombre: 'Fondo de emergencia',
    actual: 900000,
    objetivo: 2000000,
    color: 'from-[#3b82f6] to-[#60a5fa]',
    fechaLimite: '2027-06-30',
  },
];

export function money(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

export function statsForMonth(movimientos: DemoMovement[], mes: string): DemoStats {
  const delMes = movimientos.filter((m) => m.fecha.startsWith(mes));
  const ingresos = delMes
    .filter((m) => m.tipo === 'ingreso')
    .reduce((total, m) => total + m.monto, 0);
  const gastos = delMes
    .filter((m) => m.tipo === 'gasto')
    .reduce((total, m) => total + m.monto, 0);

  return { ingresos, gastos, balance: ingresos - gastos, total: delMes.length };
}

export function previousMonth(mes: string): string | null {
  const indice = DEMO_MONTHS.findIndex((m) => m.value === mes);
  return indice > 0 ? DEMO_MONTHS[indice - 1].value : null;
}

export function monthLabel(mes: string): string {
  return DEMO_MONTHS.find((m) => m.value === mes)?.label ?? mes;
}

export function pctChange(actual: number, anterior: number | null): number | null {
  if (anterior === null || anterior <= 0) return null;
  return ((actual - anterior) / anterior) * 100;
}

export function categoryBreakdown(
  movimientos: DemoMovement[],
  mes: string,
  tipo: DemoTipo,
): DemoCategoriaResumen[] {
  const agrupado = new Map<string, number>();
  movimientos
    .filter((m) => m.fecha.startsWith(mes) && m.tipo === tipo)
    .forEach((m) => agrupado.set(m.categoria, (agrupado.get(m.categoria) ?? 0) + m.monto));

  const total = [...agrupado.values()].reduce((suma, valor) => suma + valor, 0);
  return [...agrupado.entries()]
    .map(([nombre, monto]) => ({ nombre, monto, pct: total > 0 ? (monto / total) * 100 : 0 }))
    .sort((a, b) => b.monto - a.monto);
}

export function initialChat(mes: string): DemoChatMessage[] {
  const comida =
    categoryBreakdown(DEMO_MOVEMENTS, mes, 'gasto').find((c) => c.nombre === 'Comida')?.monto ?? 0;

  return [
    { id: 'demo-u-1', role: 'user', content: '¿Cuánto gasté en comida este mes?' },
    {
      id: 'demo-b-1',
      role: 'bot',
      content: `Gastaste ${money(comida)} en Comida en ${monthLabel(mes)}. ¿Quieres que registre otro movimiento?`,
    },
  ];
}

export function initialConfirmation(mes: string): DemoConfirmation {
  return {
    descripcion: 'Mercado de la semana',
    categoria: 'Comida',
    monto: 85000,
    fecha: `${mes}-${DEMO_DAY}`,
    tipo: 'gasto',
  };
}

export interface DemoReply {
  content: string;
  confirmation?: DemoConfirmation;
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function detectarCategoria(texto: string): string {
  if (/comida|mercado|restaurante|almuerzo|desayuno/.test(texto)) return 'Comida';
  if (/salario|nomina|ingreso/.test(texto)) return 'Salario';
  if (/transporte|gasolina|taxi|bus/.test(texto)) return 'Transporte';
  if (/alquiler|arriendo/.test(texto)) return 'Alquiler';
  if (/servicio|luz|agua|internet/.test(texto)) return 'Servicios';
  return 'Otros';
}

export function generateReply(
  texto: string,
  ctx: { movimientos: DemoMovement[]; goals: DemoGoal[]; mes: string },
): DemoReply {
  const t = normalizar(texto);
  const etiqueta = monthLabel(ctx.mes);

  if (/registr|agregar|agrega|anadir/.test(t)) {
    const coincide = texto.match(/\d[\d.,]*/);
    const monto = coincide ? Number(coincide[0].replace(/[.,]/g, '')) : 0;

    if (monto > 0) {
      const categoria = detectarCategoria(t);
      const descripcion =
        texto
          .replace(/^(registra|registrar|agrega|agregar|anade|anadir)\s+/i, '')
          .replace(/[.!?]+$/, '')
          .slice(0, 70) || categoria;

      return {
        content: `Preparé el registro de ${money(monto)} en ${categoria}. Confírmalo en la tarjeta de abajo.`,
        confirmation: {
          descripcion,
          categoria,
          monto,
          fecha: `${ctx.mes}-${DEMO_DAY}`,
          tipo: /salario|nomina|ingreso/.test(t) ? 'ingreso' : 'gasto',
        },
      };
    }

    return { content: 'Dime el monto, por ejemplo: “Registra $85.000 en comida”.' };
  }

  if (/comida|mercado|gaste|gasto|gastar/.test(t)) {
    const comida =
      categoryBreakdown(ctx.movimientos, ctx.mes, 'gasto').find((c) => c.nombre === 'Comida')?.monto ?? 0;
    return {
      content: `En ${etiqueta} gastaste ${money(comida)} en Comida. Si quieres, dime “registra $85.000 en comida” y lo agrego.`,
    };
  }

  if (/balance|cuanto tengo|total|ingresos/.test(t)) {
    const stats = statsForMonth(ctx.movimientos, ctx.mes);
    return {
      content: `Tu balance en ${etiqueta} es ${money(stats.balance)}: ${money(stats.ingresos)} de ingresos y ${money(stats.gastos)} de gastos.`,
    };
  }

  if (/meta|ahorro/.test(t)) {
    const meta = ctx.goals[0];
    if (!meta) return { content: 'Todavía no hay metas cargadas en la demo.' };
    const porcentaje = Math.round((meta.actual / meta.objetivo) * 100);
    return {
      content: `Vas en ${porcentaje}% de “${meta.nombre}”: ${money(meta.actual)} de ${money(meta.objetivo)}. Prueba el planificador de metas en la otra pestaña.`,
    };
  }

  if (/presupuesto|limite/.test(t)) {
    return {
      content: 'Tus límites están bajo control. En la demo puedes cambiar de mes en la pestaña Reporte para comparar.',
    };
  }

  return {
    content: 'Puedo ayudarte con tus gastos, tu balance o tus metas. Prueba: “¿cuánto gasté en comida?” o “registra $85.000 en comida”.',
  };
}
