'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import FeatureBento from '@/components/landing/FeatureBento';
import HowItWorks from '@/components/landing/HowItWorks';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
import FinalCTA from '@/components/landing/FinalCTA';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Landing() {
  const reduceMotion = useReducedMotion() ?? false;
  const { token, loading, clearSession } = useAuth();

  // Abrir la landing cierra la sesión: para volver al dashboard siempre se pide login.
  useEffect(() => {
    if (!loading && token) {
      clearSession();
    }
  }, [loading, token, clearSession]);

  return (
    <div className="min-h-screen bg-[#090d16] font-sans text-white">
      <LandingNav />
      <main>
        <Hero reduceMotion={reduceMotion} />
        <FeatureBento reduceMotion={reduceMotion} />
        <HowItWorks reduceMotion={reduceMotion} />
        <InteractiveDemo reduceMotion={reduceMotion} />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
