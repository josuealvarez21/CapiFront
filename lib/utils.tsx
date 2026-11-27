import React from 'react';
import { Utensils, Home as HomeIcon, Car, Zap, TrendingUp, ShoppingCart, Users, Wallet } from 'lucide-react';

/**
 * Format a number as Colombian Peso currency.
 */
export const formatCurrency = (amount: number | string): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

export const normalizeAmountInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '0';
  return String(Number(digits));
};

export const formatAmountForInput = (value: string): string => {
  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0,
  }).format(Number(normalizeAmountInput(value)));
};

export const formatAmountForDisplay = (value: string): string => formatAmountForInput(value);

export const parseAmountForBackend = (value: string): number => {
  return Number(normalizeAmountInput(value));
};

export const getAmountCaretPosition = (value: string): number => {
  const formatted = formatAmountForInput(value);
  const digitCount = normalizeAmountInput(value).replace(/\D/g, '').length;
  let seenDigits = 0;

  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index])) seenDigits += 1;
    if (seenDigits >= digitCount) return index + 1;
  }

  return formatted.length;
};

/**
 * Returns the appropriate Lucide icon for a financial category.
 */
export const getCategoryIcon = (category: string, size = 24): React.ReactElement => {
  const iconMap: Record<string, React.ReactElement> = {
    Comida: <Utensils size={size} />,
    Alquiler: <HomeIcon size={size} />,
    Transporte: <Car size={size} />,
    Servicios: <Zap size={size} />,
    'Apoyo familiar': <Users size={size} />,
    Subsidios: <Wallet size={size} />,
    Dividendos: <TrendingUp size={size} />,
    Ventas: <ShoppingCart size={size} />,
  };
  return iconMap[category] || <ShoppingCart size={size} />;
};

/**
 * Returns the TailwindCSS classes for a category badge based on movement type.
 */
export const getCategoryBadgeClass = (tipo: string): string => {
  return tipo === 'ingreso'
    ? 'bg-[#1C542D] text-[#22c55e]'
    : 'bg-red-950 text-red-400 border border-red-900';
};

/**
 * Get today's date in ISO format (YYYY-MM-DD).
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get current month in YYYY-MM format.
 */
export const getCurrentMonthISO = (): string => {
  return new Date().toISOString().slice(0, 7);
};

/**
 * Nombres de los meses en español, indexados por mes - 1 (Enero = 0).
 */
export const MESES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
