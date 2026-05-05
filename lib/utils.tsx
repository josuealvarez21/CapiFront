import React from 'react';
import { Utensils, Home as HomeIcon, Car, Zap, TrendingUp, ShoppingCart } from 'lucide-react';

/**
 * Format a number as Colombian Peso currency.
 */
export const formatCurrency = (amount: number | string): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(Number(amount));
};

/**
 * Format raw numeric string for display in currency inputs.
 * Strips non-digits and formats as COP with no decimals.
 */
export const formatAmountForDisplay = (value: string): string => {
  if (!value) return '';
  const number = value.replace(/\D/g, '');
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(Number(number));
};

/**
 * Returns the appropriate Lucide icon for a financial category.
 */
export const getCategoryIcon = (category: string): React.ReactElement => {
  const iconMap: Record<string, React.ReactElement> = {
    Comida: <Utensils size={24} />,
    Alquiler: <HomeIcon size={24} />,
    Transporte: <Car size={24} />,
    Servicios: <Zap size={24} />,
    Salario: <TrendingUp size={24} />,
  };
  return iconMap[category] || <ShoppingCart size={24} />;
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
