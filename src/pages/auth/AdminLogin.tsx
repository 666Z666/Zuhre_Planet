import React from 'react';
import { useLocation } from 'wouter';
import { AdminLoginPage } from '@/components/auth/AdminLoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { DevCredentialsPanel } from '@/components/auth/DevCredentialsPanel';

export default function AdminLogin() {
  const { login, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = async (email: string, pass: string) => {
    const user = await login(email, pass);
    if (user && (user.role === 'admin' || user.isSuperAdmin)) {
      setLocation(ROUTES.ADMIN_DASHBOARD);
    } else {
      throw new Error('Sadece yöneticiler bu alana erişebilir.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-32 gap-6">
      {/* Ambient glow — red for admin */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-md z-10 relative">
        <AdminLoginPage
          onLogin={handleLogin}
          isLoading={isLoading}
        />
        <DevCredentialsPanel
          activeRole="admin"
          onQuickLogin={handleLogin}
        />
      </div>
    </div>
  );
}
