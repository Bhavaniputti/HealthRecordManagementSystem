'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/Header';
import { Loader as Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  const {
    user,
    loading,
    initialize,
    initialized,
  } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!initialized) return;

    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, initialized, router]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const store = useAuthStore.getState();

        if (event === 'SIGNED_IN' && session?.user) {
          store.setUser(session.user);
          await store.fetchProfile(session.user.id);
        }

        if (event === 'SIGNED_OUT') {
          store.setUser(null);
          router.push('/auth/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            Loading HealX AI...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}