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

// --- Reporte Mensual Types ---
export interface ReportePeriodo {
  mes: number;
  anio: number;
  etiqueta: string;
}

export interface ReporteTotales {
  ingresos: number;
  gastos: number;
  balance: number;
}

export interface ReporteVariacion {
  ingresos_pct: number | null;
  gastos_pct: number | null;
  balance_pct: number | null;
}

export interface ReporteResumen {
  ingresos: number;
  gastos: number;
  balance: number;
  tasa_ahorro: number;
  total_movimientos: number;
  mes_anterior: ReporteTotales | null;
  variacion: ReporteVariacion | null;
}

export interface ReporteCategoria {
  nombre: string;
  tipo: 'ingreso' | 'gasto';
  ingresos: number;
  gastos: number;
  balance: number;
  movimientos: number;
  peso_pct: number;
  color: string;
}

export interface ReporteMovimiento {
  id: string;
  descripcion: string;
  monto: number;
  tipo: 'gasto' | 'ingreso';
  categoria: string;
  fecha: string; // ISO date string
}

export interface ReporteMensual {
  periodo: ReportePeriodo;
  resumen: ReporteResumen;
  categorias: ReporteCategoria[];
  movimientos: ReporteMovimiento[];
}

export type TabType = 'dashboard' | 'ingresos' | 'gastos' | 'metas' | 'presupuestos' | 'reporte';
export type ModalMovementType = 'ambos' | 'ingreso' | 'gasto';
export type SavingsDistributionMode = 'equitativa' | 'prioridad';

// --- Admin Types ---
export interface AdminStats {
  total_usuarios: number;
  usuarios_admin: number;
  total_movimientos: number;
}

export interface AdminUserListItem {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_registro: string | null;
  total_movimientos: number;
}

export interface AdminUserDetail {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
  foto_perfil: string | null;
  fecha_registro: string | null;
  total_movimientos: number;
}

export interface AdminUserUpdate {
  nombre?: string;
  email?: string;
  rol?: string;
}

export type AdminTabType = 'dashboard' | 'users';

// --- Chat Types ---
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConfirmationRequest {
  tool: string;
  args: Record<string, unknown>;
  temp_id: string;
}

export interface SSEEvent {
  type: 'token' | 'confirmation_required' | 'done' | 'error' | 'result';
  content?: string;
  tool?: string;
  args?: Record<string, unknown>;
  temp_id?: string;
}
