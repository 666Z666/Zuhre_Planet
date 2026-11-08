import React from 'react';
import { useLocation } from 'wouter';
import { CustomerLoginPage } from '@/components/auth/CustomerLoginPage';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { DevCredentialsPanel } from '@/components/auth/DevCredentialsPanel';

export default function CustomerLogin() {
  const { login, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = async (email: string, pass: string) => {
    await login(email, pass);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-32 gap-6">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-md z-10 relative">
        <CustomerLoginPage
          onLogin={handleLogin}
          isLoading={isLoading}
          onSignUpClick={() => setLocation(ROUTES.REGISTER_CLIENT)}
        />
        {/* Dev panel — compact, integrated under the form */}
        <DevCredentialsPanel
          activeRole="customer"
          onQuickLogin={handleLogin}
        />
      </div>
    </div>
  );
}
