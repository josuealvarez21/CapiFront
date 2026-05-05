// =============================================
// Shared TypeScript types for the Cápi frontend
// =============================================

export interface UserData {
  nombre: string;
  foto_perfil?: string;
}

export interface SummaryData {
  balance_total: number;
  ingresos_mes: number;
  gastos_mes: number;
}

export interface CategoriaDistribucion {
  nombre: string;
  valor: string | number;
  color: string;
}

export interface Transaccion {
  id: string;
  descripcion: string;
  monto: number;
  tipo: string;
  categoria: string;
  fecha: string;
}

export interface Meta {
  id: string;
  nombre: string;
  monto_objetivo: number;
  ahorro_actual: number;
  fecha_limite?: string;
  ahorro_automatico?: boolean;
  color?: string;
}

export interface Presupuesto {
  id: string;
  categoria: string;
  gastado: number;
  limite: number;
}

export interface DashboardData {
  user: UserData;
  summary: SummaryData;
  distribucion_gastos: CategoriaDistribucion[];
  ultimos_movimientos: Transaccion[];
  metas: Meta[];
  presupuestos: Presupuesto[];
}

export interface CategoriaBackend {
  id_categoria: number;
  nombre_categoria: string;
  tipo: string;
}

export type TabType = 'dashboard' | 'ingresos' | 'gastos' | 'metas' | 'presupuestos';
export type ModalMovementType = 'ambos' | 'ingreso' | 'gasto';
export type SavingsDistributionMode = 'equitativa' | 'prioridad';
