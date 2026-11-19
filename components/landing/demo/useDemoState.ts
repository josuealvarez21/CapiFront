'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEMO_CURRENT_MONTH,
  DEMO_DAY,
  DEMO_GOALS,
  DEMO_MOVEMENTS,
  categoryBreakdown,
  generateReply,
  initialChat,
  initialConfirmation,
  money,
  pctChange,
  previousMonth,
  statsForMonth,
  type DemoConfirmation,
  type DemoGoal,
  type DemoMovement,
} from './demo-data';

interface UseDemoStateOptions {
  reduceMotion: boolean;
}

let contadorIds = 0;
function nextId(prefijo: string): string {
  contadorIds += 1;
  return `${prefijo}-${contadorIds}`;
}

export function useDemoState({ reduceMotion }: UseDemoStateOptions) {
  const [movimientos, setMovimientos] = useState<DemoMovement[]>(DEMO_MOVEMENTS);
  const [goals, setGoals] = useState<DemoGoal[]>(DEMO_GOALS);
  const [selectedMonth, setSelectedMonth] = useState(DEMO_CURRENT_MONTH);
  const [chat, setChat] = useState(initialChat(DEMO_CURRENT_MONTH));
  const [pendingConfirmation, setPendingConfirmation] = useState<DemoConfirmation | null>(
    initialConfirmation(DEMO_CURRENT_MONTH),
  );
  const [typing, setTyping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  const showToast = useCallback(
    (mensaje: string) => {
      setToast(mensaje);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), reduceMotion ? 1600 : 3200);
    },
    [reduceMotion],
  );

  const addMovement = useCallback((confirmacion: DemoConfirmation) => {
    setMovimientos((prev) => [{ ...confirmacion, id: nextId('mv-demo') }, ...prev]);
  }, []);

  const confirmPending = useCallback(() => {
    if (!pendingConfirmation) return;
    const confirmacion = pendingConfirmation;
    addMovement(confirmacion);
    setPendingConfirmation(null);
    setChat((prev) => [
      ...prev,
      {
        id: nextId('demo-b'),
        role: 'bot',
        content: `Listo, registré ${money(confirmacion.monto)} en ${confirmacion.categoria} (${confirmacion.descripcion}). Andá a Reporte: ya está actualizado.`,
      },
    ]);
    showToast('Movimiento registrado');
  }, [addMovement, pendingConfirmation, showToast]);

  const cancelPending = useCallback(() => {
    setPendingConfirmation(null);
    setChat((prev) => [
      ...prev,
      {
        id: nextId('demo-b'),
        role: 'bot',
        content: 'Operación cancelada. No registré ningún movimiento.',
      },
    ]);
    showToast('Operación cancelada');
  }, [showToast]);

  const allocate = useCallback(
    (goalId: string, monto: number) => {
      if (monto <= 0) return;
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;

      const restante = Math.max(0, goal.objetivo - goal.actual);
      const aplicado = Math.min(monto, restante);
      if (aplicado <= 0) {
        showToast('La meta ya está completa');
        return;
      }

      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId ? { ...g, actual: Math.min(g.objetivo, g.actual + aplicado) } : g,
        ),
      );
      addMovement({
        descripcion: `Abono a ${goal.nombre}`,
        categoria: 'Ahorro',
        monto: aplicado,
        fecha: `${selectedMonth}-${DEMO_DAY}`,
        tipo: 'gasto',
      });
      showToast(`Abonaste ${money(aplicado)} a ${goal.nombre}`);
    },
    [addMovement, goals, selectedMonth, showToast],
  );

  const sendMessage = useCallback(
    (texto: string) => {
      const limpio = texto.trim();
      if (!limpio) return;

      setChat((prev) => [...prev, { id: nextId('demo-u'), role: 'user', content: limpio }]);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      setTyping(true);

      typingTimer.current = setTimeout(() => {
        const reply = generateReply(limpio, { movimientos, goals, mes: selectedMonth });
        setChat((prev) => [
          ...prev,
          { id: nextId('demo-b'), role: 'bot', content: reply.content },
        ]);
        if (reply.confirmation) setPendingConfirmation(reply.confirmation);
        setTyping(false);
      }, reduceMotion ? 0 : 650);
    },
    [goals, movimientos, reduceMotion, selectedMonth],
  );

  const selectMonth = useCallback((mes: string) => {
    setSelectedMonth(mes);
    setPendingConfirmation((prev) => (prev ? { ...prev, fecha: `${mes}-${DEMO_DAY}` } : null));
  }, []);

  const reset = useCallback(() => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setMovimientos(DEMO_MOVEMENTS);
    setGoals(DEMO_GOALS);
    setSelectedMonth(DEMO_CURRENT_MONTH);
    setChat(initialChat(DEMO_CURRENT_MONTH));
    setPendingConfirmation(initialConfirmation(DEMO_CURRENT_MONTH));
    setTyping(false);
    setToast(null);
  }, []);

  const stats = useMemo(() => statsForMonth(movimientos, selectedMonth), [movimientos, selectedMonth]);
  const mesAnterior = useMemo(() => previousMonth(selectedMonth), [selectedMonth]);
  const statsAnterior = useMemo(
    () => (mesAnterior ? statsForMonth(movimientos, mesAnterior) : null),
    [mesAnterior, movimientos],
  );
  const ingresosPorCategoria = useMemo(
    () => categoryBreakdown(movimientos, selectedMonth, 'ingreso'),
    [movimientos, selectedMonth],
  );
  const gastosPorCategoria = useMemo(
    () => categoryBreakdown(movimientos, selectedMonth, 'gasto'),
    [movimientos, selectedMonth],
  );
  const variacionIngresos = useMemo(
    () => pctChange(stats.ingresos, statsAnterior?.ingresos ?? null),
    [stats.ingresos, statsAnterior],
  );
  const variacionGastos = useMemo(
    () => pctChange(stats.gastos, statsAnterior?.gastos ?? null),
    [stats.gastos, statsAnterior],
  );

  return {
    movimientos,
    goals,
    selectedMonth,
    chat,
    pendingConfirmation,
    typing,
    toast,
    stats,
    statsAnterior,
    ingresosPorCategoria,
    gastosPorCategoria,
    variacionIngresos,
    variacionGastos,
    addMovement,
    confirmPending,
    cancelPending,
    allocate,
    sendMessage,
    selectMonth,
    showToast,
    reset,
  };
}

export type DemoState = ReturnType<typeof useDemoState>;
