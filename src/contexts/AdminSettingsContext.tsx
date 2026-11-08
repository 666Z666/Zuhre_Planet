import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AdminSettingsContext - Görsel ve Fonksiyonel Site Ayarları
 * 
 * Admin paneli tarafından kontrol edilen, tüm sitede (Catalog, SeductiveCard vb.)
 * geçerli olan dinamik ayarları yönetir.
 */

interface AdminSettings {
  showPremiumGlow: boolean;
  glowIntensity: 'soft' | 'medium' | 'hard';
  showVerificationBadge: boolean;
  badgePosition: 'top-left' | 'top-right';
  maintenanceMode: boolean;
}

interface AdminSettingsContextType {
  settings: AdminSettings;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AdminSettings = {
  showPremiumGlow: true,
  glowIntensity: 'medium',
  showVerificationBadge: true,
  badgePosition: 'top-left',
  maintenanceMode: false,
};

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined);

export const AdminSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AdminSettings>(() => {
    // LocalStorage'dan yükle (Persistence)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zuhre_admin_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('zuhre_admin_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('zuhre_admin_settings');
  };

  return (
    <AdminSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AdminSettingsContext.Provider>
  );
};

export const useAdminSettings = () => {
  const context = useContext(AdminSettingsContext);
  if (context === undefined) {
    throw new Error('useAdminSettings must be used within an AdminSettingsProvider');
  }
  return context;
};
