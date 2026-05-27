'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

export function useDashboard() {
  const { token, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  // Core data
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoriaBackend[]>([]);

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

  // --- Data fetching ---
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

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const backendData = await api.dashboard.get(token);
      setData(backendData);
      if (backendData.user?.nombre) {
        setProfileName(backendData.user.nombre);
      }
    } catch (error) {
      handleApiError(error);
    }
  }, [token, handleApiError]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const cats = await api.categories.list(token);
      setCategories(cats);
    } catch (error) {
      handleApiError(error);
    }
  }, [token, handleApiError]);

  useEffect(() => {
    if (!authLoading && token) {
      const init = async () => {
        setLoading(true);
        await fetchCategories();
        await fetchData();
        setLoading(false);
      };
      init();
    }
  }, [token, authLoading, fetchData, fetchCategories]);

  // --- Actions ---
  const openMovementModal = (type: ModalMovementType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      await api.movements.create(token, {
        id_categoria: parseInt(formData.id_categoria),
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion,
        fecha: formData.fecha,
      });
      setIsModalOpen(false);
      setFormData({ monto: '', descripcion: '', id_categoria: '', fecha: getTodayISO() });
      await fetchData();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      await api.goals.create(token, {
        nombre_meta: goalFormData.nombre,
        monto_objetivo: parseFloat(goalFormData.objetivo),
        monto_actual: 0,
        fecha_limite: goalFormData.fecha,
      });
      setIsGoalModalOpen(false);
      setGoalFormData({ nombre: '', objetivo: '', fecha: getTodayISO() });
      await fetchData();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    try {
      const dateParts = budgetFormData.fecha_mes.split('-');
      await api.budgets.create(token, {
        id_categoria: parseInt(budgetFormData.id_categoria),
        monto_limite: parseFloat(budgetFormData.limite),
        mes: parseInt(dateParts[1]),
        anio: parseInt(dateParts[0]),
      });
      setIsBudgetModalOpen(false);
      setBudgetFormData({ id_categoria: '', limite: '', fecha_mes: getCurrentMonthISO() });
      await fetchData();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!profilePicUrl && !profilePicFile && profileName === data?.user?.nombre) return;
    setIsUploadingProfilePic(true);
    try {
      const formDataToSend = new FormData();
      if (profilePicFile) formDataToSend.append('file', profilePicFile);
      if (profilePicUrl) formDataToSend.append('url', profilePicUrl);
      if (profileName && profileName !== data?.user?.nombre) {
        formDataToSend.append('nombre', profileName);
      }
      await api.users.updateProfile(token, formDataToSend);
      setIsSettingsModalOpen(false);
      setProfilePicFile(null);
      setProfilePicUrl('');
      await fetchData();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUploadingProfilePic(false);
    }
  };

  const handleDeleteMovement = async (id: string) => {
    if (!token || !confirm('¿Estás seguro de eliminar este movimiento?')) return;
    try {
      await api.movements.delete(token, id);
      await fetchData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!token || !confirm('¿Estás seguro de eliminar esta meta?')) return;
    try {
      await api.goals.delete(token, id);
      await fetchData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!token || !confirm('¿Estás seguro de eliminar este presupuesto?')) return;
    try {
      await api.budgets.delete(token, id);
      await fetchData();
    } catch (error) {
      handleApiError(error);
    }
  };

  const showFeedback = (message: string) => {
    setShowSuccessFeedback(message);
    setTimeout(() => setShowSuccessFeedback(null), 4000);
  };

  return {
    // Auth state
    token,
    authLoading,
    logout,
    // Core data
    data,
    loading,
    categories,
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
    isSubmitting,
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
    // Refresh
    fetchData,
  };
}
