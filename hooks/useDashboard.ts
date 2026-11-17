'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { api, UnauthorizedError } from '@/lib/api';
import { getTodayISO, getCurrentMonthISO } from '@/lib/utils';
import type {
  DashboardData,
  CategoriaBackend,
  TabType,
  ModalMovementType,
  SavingsDistributionMode,
} from '@/lib/types';

const DASHBOARD_QUERY_KEY = ['dashboard'];
const CATEGORIES_QUERY_KEY = ['categories'];

export function useDashboard() {
  const { token, logout, loading: authLoading } = useAuth();
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
  const [profileName, setProfileName] = useState('');
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);

  // Movement form
  const [formData, setFormData] = useState({
    monto: '',
    descripcion: '',
    id_categoria: '',
    fecha: getTodayISO(),
  });

  // Goal form
  const [goalFormData, setGoalFormData] = useState({
    nombre: '',
    objetivo: '',
    fecha: getTodayISO(),
  });

  // Budget form
  const [budgetFormData, setBudgetFormData] = useState({
    id_categoria: '',
    limite: '',
    fecha_mes: getCurrentMonthISO(),
  });

  // Savings planner
  const [savingsPercentage, setSavingsPercentage] = useState(10);
  const [savingsDistributionMode, setSavingsDistributionMode] =
    useState<SavingsDistributionMode>('equitativa');
  const [manualSavingsAmount, setManualSavingsAmount] = useState('');
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
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      if (error instanceof UnauthorizedError) return false;
      return failureCount < 1;
    },
  });

  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useQuery({
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

  // Sync profile name from dashboard data
  useEffect(() => {
    if (dashboardData?.user?.nombre) {
      setProfileName(dashboardData.user.nombre);
    }
  }, [dashboardData]);

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
        const tempMovement = {
          id: `temp-${Date.now()}`,
          descripcion: newMovement.descripcion || 'Movimiento',
          monto: newMovement.monto,
          tipo: newMovement.id_categoria <= 6 ? 'gasto' : 'ingreso',
          categoria: '',
          fecha: newMovement.fecha,
        };
        return {
          ...old,
          ultimos_movimientos: [tempMovement, ...old.ultimos_movimientos.slice(0, 4)],
          summary: {
            ...old.summary,
            ingresos_mes: newMovement.id_categoria > 6 ? old.summary.ingresos_mes + newMovement.monto : old.summary.ingresos_mes,
            gastos_mes: newMovement.id_categoria <= 6 ? old.summary.gastos_mes + newMovement.monto : old.summary.gastos_mes,
            balance_total: newMovement.id_categoria > 6
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
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
    setIsSubmitting(true);
    createMovementMutation.mutate({
      id_categoria: parseInt(formData.id_categoria),
      monto: parseFloat(formData.monto),
      descripcion: formData.descripcion,
      fecha: formData.fecha,
    });
    setIsModalOpen(false);
    setFormData({ monto: '', descripcion: '', id_categoria: '', fecha: getTodayISO() });
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    createGoalMutation.mutate({
      nombre_meta: goalFormData.nombre,
      monto_objetivo: parseFloat(goalFormData.objetivo),
      monto_actual: 0,
      fecha_limite: goalFormData.fecha,
    });
    setIsGoalModalOpen(false);
    setGoalFormData({ nombre: '', objetivo: '', fecha: getTodayISO() });
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    const dateParts = budgetFormData.fecha_mes.split('-');
    createBudgetMutation.mutate({
      id_categoria: parseInt(budgetFormData.id_categoria),
      monto_limite: parseFloat(budgetFormData.limite),
      mes: parseInt(dateParts[1]),
      anio: parseInt(dateParts[0]),
    });
    setIsBudgetModalOpen(false);
    setBudgetFormData({ id_categoria: '', limite: '', fecha_mes: getCurrentMonthISO() });
  };

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
    if (!token || !confirm('¿Estás seguro de eliminar este movimiento?')) return;
    deleteMovementMutation.mutate(id);
  };

  const handleDeleteGoal = async (id: string) => {
    if (!token || !confirm('¿Estás seguro de eliminar esta meta?')) return;
    deleteGoalMutation.mutate(id);
  };

  const handleDeleteBudget = async (id: string) => {
    if (!token || !confirm('¿Estás seguro de eliminar este presupuesto?')) return;
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
    setProfileName,
    isUploadingProfilePic,
    // Savings
    savingsPercentage,
    setSavingsPercentage,
    savingsDistributionMode,
    setSavingsDistributionMode,
    manualSavingsAmount,
    setManualSavingsAmount,
    showSuccessFeedback,
    showFeedback,
    // Refresh (manual refetch)
    fetchData: refetchDashboard,
  };
}