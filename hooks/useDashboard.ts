'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { api, UnauthorizedError } from '@/lib/api';
import { getTodayISO, getCurrentMonthISO, parseAmountForBackend } from '@/lib/utils';
import type {
  DashboardData,
  TabType,
  ModalMovementType,
  SavingsDistributionMode,
} from '@/lib/types';

const DASHBOARD_QUERY_KEY = ['dashboard'];
const CATEGORIES_QUERY_KEY = ['categories'];

export function useDashboard() {
  const { token, logout, loading: authLoading, setUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Navigation
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalMovementType>('ambos');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile form
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  // null = usar el nombre del servidor; string = nombre editado en el modal.
  const [profileNameDraft, setProfileNameDraft] = useState<string | null>(null);
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);

  // Movement form
  const [formData, setFormData] = useState({
    monto: '0',
    descripcion: '',
    id_categoria: '',
    fecha: getTodayISO(),
  });

  // Goal form
  const [goalFormData, setGoalFormData] = useState({
    nombre: '',
    objetivo: '0',
    fecha: getTodayISO(),
  });

  // Budget form
  const [budgetFormData, setBudgetFormData] = useState({
    id_categoria: '',
    limite: '0',
    fecha_mes: getCurrentMonthISO(),
  });

  // Savings planner
  const [savingsPercentage, setSavingsPercentage] = useState(10);
  const [savingsDistributionMode, setSavingsDistributionMode] =
    useState<SavingsDistributionMode>('equitativa');
  const [manualSavingsAmount, setManualSavingsAmount] = useState('');
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState<string | null>(null);

  // --- Auth redirect ---
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login');
    }
  }, [token, authLoading, router]);

  // --- Data fetching with React Query ---
  const handleApiError = useCallback(
    (error: unknown) => {
      if (error instanceof UnauthorizedError) {
        logout();
      } else {
        console.warn(error);
      }
    },
    [logout],
  );

  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      if (!token) throw new Error('No token');
      return api.dashboard.get(token);
    },
    enabled: !!token && !authLoading,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error instanceof UnauthorizedError) return false;
      return failureCount < 1;
    },
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      if (!token) throw new Error('No token');
      return api.categories.list(token);
    },
    enabled: !!token && !authLoading,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 10,
    retry: (failureCount, error) => {
      if (error instanceof UnauthorizedError) return false;
      return failureCount < 1;
    },
  });

  const getMovementType = useCallback(
    (idCategoria: number) =>
      categoriesData?.find((categoria) => categoria.id_categoria === idCategoria)?.tipo === 'ingreso'
        ? 'ingreso'
        : 'gasto',
    [categoriesData],
  );

  // --- Mutations with Optimistic Updates ---

  // Create Movement
  const createMovementMutation = useMutation({
    mutationFn: async (data: { id_categoria: number; monto: number; descripcion: string; fecha: string }) => {
      if (!token) throw new Error('No token');
      return api.movements.create(token, data);
    },
    onMutate: async (newMovement) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previousDashboard = queryClient.getQueryData<DashboardData>(DASHBOARD_QUERY_KEY);

      queryClient.setQueryData<DashboardData | undefined>(DASHBOARD_QUERY_KEY, (old) => {
        if (!old) return old;
        const tipo = getMovementType(newMovement.id_categoria);
        const tempMovement = {
          id: `temp-${Date.now()}`,
          descripcion: newMovement.descripcion || 'Movimiento',
          monto: newMovement.monto,
          tipo,
          categoria: '',
          fecha: newMovement.fecha,
        };
        return {
          ...old,
          ultimos_movimientos: [tempMovement, ...old.ultimos_movimientos.slice(0, 4)],
          summary: {
            ...old.summary,
            ingresos_mes: tipo === 'ingreso' ? old.summary.ingresos_mes + newMovement.monto : old.summary.ingresos_mes,
            gastos_mes: tipo === 'gasto' ? old.summary.gastos_mes + newMovement.monto : old.summary.gastos_mes,
            balance_total: tipo === 'ingreso'
              ? old.summary.balance_total + newMovement.monto
              : old.summary.balance_total - newMovement.monto,
          },
        };
      });

      return { previousDashboard };
    },
    onError: (err, _newMovement, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previousDashboard);
      }
      handleApiError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Delete Movement
  const deleteMovementMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('No token');
      return api.movements.delete(token, id);
    },
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previousDashboard = queryClient.getQueryData<DashboardData>(DASHBOARD_QUERY_KEY);

      queryClient.setQueryData<DashboardData | undefined>(DASHBOARD_QUERY_KEY, (old) => {
        if (!old) return old;
        const movement = old.ultimos_movimientos.find(m => m.id === idToDelete);
        if (!movement) return old;
        return {
          ...old,
          ultimos_movimientos: old.ultimos_movimientos.filter(m => m.id !== idToDelete),
          summary: {
            ...old.summary,
            ingresos_mes: movement.tipo === 'ingreso' ? old.summary.ingresos_mes - movement.monto : old.summary.ingresos_mes,
            gastos_mes: movement.tipo === 'gasto' ? old.summary.gastos_mes - movement.monto : old.summary.gastos_mes,
            balance_total: movement.tipo === 'ingreso'
              ? old.summary.balance_total - movement.monto
              : old.summary.balance_total + movement.monto,
          },
        };
      });

      return { previousDashboard };
    },
    onError: (err, _id, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previousDashboard);
      }
      handleApiError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
  });

  // Create Goal
  const createGoalMutation = useMutation({
    mutationFn: async (data: { nombre_meta: string; monto_objetivo: number; monto_actual: number; fecha_limite: string }) => {
      if (!token) throw new Error('No token');
      return api.goals.create(token, data);
    },
    onMutate: async (newGoal) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previousDashboard = queryClient.getQueryData<DashboardData>(DASHBOARD_QUERY_KEY);

      queryClient.setQueryData<DashboardData | undefined>(DASHBOARD_QUERY_KEY, (old) => {
        if (!old) return old;
        const tempGoal = {
          id: `temp-${Date.now()}`,
          nombre: newGoal.nombre_meta,
          monto_objetivo: newGoal.monto_objetivo,
          ahorro_actual: 0,
          fecha_limite: newGoal.fecha_limite,
          color: '#f59e0b',
        };
        return {
          ...old,
          metas: [...old.metas, tempGoal],
        };
      });

      return { previousDashboard };
    },
    onError: (err, _newGoal, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previousDashboard);
      }
      handleApiError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Delete Goal
  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('No token');
      return api.goals.delete(token, id);
    },
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previousDashboard = queryClient.getQueryData<DashboardData>(DASHBOARD_QUERY_KEY);

      queryClient.setQueryData<DashboardData | undefined>(DASHBOARD_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          metas: old.metas.filter(m => m.id !== idToDelete),
        };
      });

      return { previousDashboard };
    },
    onError: (err, _id, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previousDashboard);
      }
      handleApiError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  // Create Budget
  const createBudgetMutation = useMutation({
    mutationFn: async (data: { id_categoria: number; monto_limite: number; mes: number; anio: number }) => {
      if (!token) throw new Error('No token');
      return api.budgets.create(token, data);
    },
    onMutate: async (newBudget) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previousDashboard = queryClient.getQueryData<DashboardData>(DASHBOARD_QUERY_KEY);

      queryClient.setQueryData<DashboardData | undefined>(DASHBOARD_QUERY_KEY, (old) => {
        if (!old) return old;
        const tempBudget = {
          id: `temp-${Date.now()}`,
          categoria: '',
          gastado: 0,
          limite: newBudget.monto_limite,
        };
        return {
          ...old,
          presupuestos: [...old.presupuestos, tempBudget],
        };
      });

      return { previousDashboard };
    },
    onError: (err, _newBudget, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previousDashboard);
      }
      handleApiError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Delete Budget
  const deleteBudgetMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('No token');
      return api.budgets.delete(token, id);
    },
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEY });
      const previousDashboard = queryClient.getQueryData<DashboardData>(DASHBOARD_QUERY_KEY);

      queryClient.setQueryData<DashboardData | undefined>(DASHBOARD_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          presupuestos: old.presupuestos.filter(p => p.id !== idToDelete),
        };
      });

      return { previousDashboard };
    },
    onError: (err, _id, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEY, context.previousDashboard);
      }
      handleApiError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });

  // Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      if (!token) throw new Error('No token');
      return api.users.updateProfile(token, formDataToSend);
    },
    onSuccess: (result) => {
      setUser((prev) =>
        prev ? { ...prev, nombre: result?.nombre ?? prev.nombre, foto_perfil: result?.foto_perfil ?? prev.foto_perfil } : prev,
      );
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
      setProfileNameDraft(null);
      setIsUploadingProfilePic(false);
    },
    onError: (err) => {
      handleApiError(err);
      setIsUploadingProfilePic(false);
    },
  });

  // --- Action Handlers ---

  const openMovementModal = (type: ModalMovementType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const monto = parseAmountForBackend(formData.monto);
    if (monto <= 0) {
      showFeedback('El monto debe ser mayor que 0.');
      return;
    }
    setIsSubmitting(true);
    createMovementMutation.mutate({
      id_categoria: parseInt(formData.id_categoria),
      monto,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
    });
    setIsModalOpen(false);
    setFormData({ monto: '0', descripcion: '', id_categoria: '', fecha: getTodayISO() });
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const montoObjetivo = parseAmountForBackend(goalFormData.objetivo);
    if (montoObjetivo <= 0) {
      showFeedback('El objetivo debe ser mayor que 0.');
      return;
    }
    setIsSubmitting(true);
    createGoalMutation.mutate({
      nombre_meta: goalFormData.nombre,
      monto_objetivo: montoObjetivo,
      monto_actual: 0,
      fecha_limite: goalFormData.fecha,
    });
    setIsGoalModalOpen(false);
    setGoalFormData({ nombre: '', objetivo: '0', fecha: getTodayISO() });
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const montoLimite = parseAmountForBackend(budgetFormData.limite);
    if (montoLimite <= 0) {
      showFeedback('El límite debe ser mayor que 0.');
      return;
    }
    setIsSubmitting(true);
    const dateParts = budgetFormData.fecha_mes.split('-');
    createBudgetMutation.mutate({
      id_categoria: parseInt(budgetFormData.id_categoria),
      monto_limite: montoLimite,
      mes: parseInt(dateParts[1]),
      anio: parseInt(dateParts[0]),
    });
    setIsBudgetModalOpen(false);
    setBudgetFormData({ id_categoria: '', limite: '0', fecha_mes: getCurrentMonthISO() });
  };

  const profileName = profileNameDraft ?? dashboardData?.user?.nombre ?? '';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!profilePicUrl && !profilePicFile && profileName === dashboardData?.user?.nombre) return;
    setIsUploadingProfilePic(true);
    const formDataToSend = new FormData();
    if (profilePicFile) formDataToSend.append('file', profilePicFile);
    if (profilePicUrl) formDataToSend.append('url', profilePicUrl);
    if (profileName && profileName !== dashboardData?.user?.nombre) {
      formDataToSend.append('nombre', profileName);
    }
    updateProfileMutation.mutate(formDataToSend);
    setIsSettingsModalOpen(false);
    setProfilePicFile(null);
    setProfilePicUrl('');
  };

  const handleDeleteMovement = async (id: string) => {
    if (!token) return;
    deleteMovementMutation.mutate(id);
  };

  const handleDeleteGoal = async (id: string) => {
    if (!token) return;
    deleteGoalMutation.mutate(id);
  };

  const handleDeleteBudget = async (id: string) => {
    if (!token) return;
    deleteBudgetMutation.mutate(id);
  };

  const showFeedback = (message: string) => {
    setShowSuccessFeedback(message);
    setTimeout(() => setShowSuccessFeedback(null), 4000);
  };

  const isLoading = dashboardLoading || categoriesLoading;

  return {
    // Auth state
    token,
    authLoading,
    logout,
    // Core data
    data: dashboardData,
    loading: isLoading,
    categories: categoriesData || [],
    // Navigation
    currentTab,
    setCurrentTab,
    // Modals
    isModalOpen,
    setIsModalOpen,
    modalType,
    isGoalModalOpen,
    setIsGoalModalOpen,
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isSubmitting: isSubmitting || createMovementMutation.isPending || createGoalMutation.isPending || createBudgetMutation.isPending,
    // Actions
    openMovementModal,
    handleAddMovement,
    handleAddGoal,
    handleAddBudget,
    handleUpdateProfile,
    handleDeleteMovement,
    handleDeleteGoal,
    handleDeleteBudget,
    // Forms
    formData,
    setFormData,
    goalFormData,
    setGoalFormData,
    budgetFormData,
    setBudgetFormData,
    // Profile
    profilePicUrl,
    setProfilePicUrl,
    profilePicFile,
    setProfilePicFile,
    profileName,
    setProfileName: setProfileNameDraft,
    isUploadingProfilePic,
    // Savings
    savingsPercentage,
    setSavingsPercentage,
    savingsDistributionMode,
    setSavingsDistributionMode,
    manualSavingsAmount,
    setManualSavingsAmount,
    selectedGoalIds,
    setSelectedGoalIds,
    showSuccessFeedback,
    setShowSuccessFeedback,
    showFeedback,
    // Refresh (manual refetch)
    fetchData: refetchDashboard,
  };
}