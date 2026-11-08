import React, { useState } from 'react';
import { Settings, Bell, Lock, User, Save, X, Shield, Zap, AlertCircle } from 'lucide-react';

interface SettingsData {
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'verified_only';
    showOnlineStatus: boolean;
    allowMessages: boolean;
    allowReviews: boolean;
    blockList: string[];
  };
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    messageNotifications: boolean;
    appointmentReminders: boolean;
    promotionalEmails: boolean;
    reviewNotifications: boolean;
  };
  userPreferences: {
    language: 'tr' | 'en';
    theme: 'light' | 'dark' | 'auto';
    currency: 'TRY' | 'USD' | 'EUR';
    twoFactorAuth: boolean;
  };
}

interface EnhancedProfileSettingsProps {
  settings: SettingsData;
  onSave?: (settings: SettingsData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  userType?: 'customer' | 'escort';
}

type SettingsTab = 'privacy' | 'notifications' | 'preferences' | 'security';

/**
 * Geliştirilmiş Profil Ayarları Sayfası
 * 
 * Gizlilik, bildirimler, tercihler ve güvenlik
 */
export const EnhancedProfileSettings: React.FC<EnhancedProfileSettingsProps> = ({
  settings: initialSettings,
  onSave,
  onCancel,
  isLoading = false,
  userType = 'customer',
}) => {
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [activeTab, setActiveTab] = useState<SettingsTab>('privacy');
  const [newBlockedUser, setNewBlockedUser] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const userTypeLabel = userType === 'escort' ? 'İlan Sahibi Hesabı' : 'Müşteri Hesabı';
  const tabOptions: Array<{ id: SettingsTab; label: string; icon: JSX.Element }> = [
    { id: 'privacy', label: 'Gizlilik', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Bildirimler', icon: <Bell size={18} /> },
    { id: 'preferences', label: 'Tercihler', icon: <User size={18} /> },
    { id: 'security', label: 'Güvenlik', icon: <Shield size={18} /> },
  ];

  const handleSave = async () => {
    try {
      await onSave?.(settings);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Ayarları kaydetme hatası:', err);
    }
  };

  const updatePrivacy = <K extends keyof SettingsData['privacySettings']>(
    key: K,
    value: SettingsData['privacySettings'][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [key]: value,
      },
    }));
  };

  const updateNotifications = <K extends keyof SettingsData['notificationSettings']>(
    key: K,
    value: SettingsData['notificationSettings'][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [key]: value,
      },
    }));
  };

  const updatePreferences = <K extends keyof SettingsData['userPreferences']>(
    key: K,
    value: SettingsData['userPreferences'][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        [key]: value,
      },
    }));
  };

  const addBlockedUser = () => {
    const normalizedUser = newBlockedUser.trim();
    if (normalizedUser && !settings.privacySettings.blockList.includes(normalizedUser)) {
      setSettings((prev) => ({
        ...prev,
        privacySettings: {
          ...prev.privacySettings,
          blockList: [...prev.privacySettings.blockList, normalizedUser],
        },
      }));
      setNewBlockedUser('');
    }
  };

  const removeBlockedUser = (user: string) => {
    setSettings((prev) => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        blockList: prev.privacySettings.blockList.filter((u) => u !== user),
      },
    }));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #f0f4ff 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div
          className="rounded-2xl p-8 backdrop-blur-xl border border-white/20 mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings size={32} className="text-emerald-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
                <p className="text-sm text-gray-500">{userTypeLabel}</p>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-8 p-4 rounded-lg bg-green-100 border border-green-300 text-green-700 font-semibold flex items-center gap-2">
            <Zap size={18} />
            Ayarlar başarıyla kaydedildi!
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/30 overflow-x-auto">
          {tabOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className="rounded-2xl p-8 backdrop-blur-xl border border-white/20 mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gizlilik Ayarları</h2>

              {/* Profile Visibility */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  Profil Görünürlüğü
                </label>
                <div className="space-y-2">
                  {[
                    {
                      value: 'public',
                      label: 'Herkese Açık',
                      description: 'Herkes profilinizi görebilir ve arama sonuçlarında çıkabilir',
                      icon: '🌍',
                    },
                    {
                      value: 'verified_only',
                      label: 'Sadece Doğrulanmış Üyeler',
                      description: 'Sadece doğrulanmış üyeler profilinizi görebilir',
                      icon: '✓',
                    },
                    {
                      value: 'private',
                      label: 'Özel',
                      description: 'Sadece sizin seçtiğiniz kişiler görebilir',
                      icon: '🔒',
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-4 rounded-lg hover:bg-white/50 cursor-pointer transition-colors border border-white/30"
                    >
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option.value}
                        checked={settings.privacySettings.profileVisibility === option.value}
                        onChange={(e) =>
                          updatePrivacy(
                            'profileVisibility',
                            e.target.value as SettingsData['privacySettings']['profileVisibility']
                          )
                        }
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                          <span>{option.icon}</span>
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3 border-t border-white/30 pt-6">
                {[
                  {
                    key: 'showOnlineStatus',
                    label: 'Çevrimiçi Durumunu Göster',
                    description: 'Diğer kullanıcılar çevrimiçi olup olmadığınızı görebilir',
                  },
                  {
                    key: 'allowMessages',
                    label: 'Mesaj Almaya İzin Ver',
                    description: 'Diğer kullanıcılar size mesaj gönderebilir',
                  },
                  {
                    key: 'allowReviews',
                    label: 'Yorum Almaya İzin Ver',
                    description: 'Diğer kullanıcılar size yorum yapabilir',
                  },
                ].map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-white/50 cursor-pointer transition-colors border border-white/30"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.privacySettings[option.key as keyof typeof settings.privacySettings])}
                      onChange={(e) =>
                        updatePrivacy(option.key as keyof typeof settings.privacySettings, e.target.checked)
                      }
                      className="w-5 h-5"
                    />
                  </label>
                ))}
              </div>

              {/* Block List */}
              <div className="border-t border-white/30 pt-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle size={18} />
                  Engellenen Kullanıcılar
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBlockedUser}
                      onChange={(e) => setNewBlockedUser(e.target.value)}
                      placeholder="Kullanıcı adı girin..."
                      className="flex-1 px-4 py-2 rounded-lg border border-white/30 bg-white/50 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={addBlockedUser}
                      className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all"
                    >
                      Engelle
                    </button>
                  </div>

                  {settings.privacySettings.blockList.length > 0 && (
                    <div className="space-y-2">
                      {settings.privacySettings.blockList.map((user) => (
                        <div
                          key={user}
                          className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200"
                        >
                          <span className="text-gray-900 font-semibold">{user}</span>
                          <button
                            onClick={() => removeBlockedUser(user)}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm"
                          >
                            Engeli Kaldır
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bildirim Ayarları</h2>

              <div className="space-y-3">
                {[
                  {
                    key: 'emailNotifications',
                    label: 'E-posta Bildirimleri',
                    description: 'Önemli etkinlikler hakkında e-posta alın',
                    icon: '📧',
                  },
                  {
                    key: 'pushNotifications',
                    label: 'Push Bildirimleri',
                    description: 'Tarayıcı push bildirimleri alın',
                    icon: '🔔',
                  },
                  {
                    key: 'messageNotifications',
                    label: 'Mesaj Bildirimleri',
                    description: 'Yeni mesajlar hakkında bildirim alın',
                    icon: '💬',
                  },
                  {
                    key: 'appointmentReminders',
                    label: 'Randevu Hatırlatıcıları',
                    description: 'Yaklaşan randevular hakkında hatırlatıcı alın',
                    icon: '📅',
                  },
                  {
                    key: 'reviewNotifications',
                    label: 'Yorum Bildirimleri',
                    description: 'Yeni yorumlar hakkında bildirim alın',
                    icon: '⭐',
                  },
                  {
                    key: 'promotionalEmails',
                    label: 'Promosyonel E-postalar',
                    description: 'Özel teklifler ve promosyonlar hakkında bilgi alın',
                    icon: '🎁',
                  },
                ].map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-white/50 cursor-pointer transition-colors border border-white/30"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <span>{option.icon}</span>
                        {option.label}
                      </p>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notificationSettings[option.key as keyof typeof settings.notificationSettings]}
                      onChange={(e) =>
                        updateNotifications(option.key as keyof typeof settings.notificationSettings, e.target.checked)
                      }
                      className="w-5 h-5"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kullanıcı Tercihleri</h2>

              {/* Language */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  🗣️ Dil
                </label>
                <select
                  value={settings.userPreferences.language}
                  onChange={(e) =>
                    updatePreferences('language', e.target.value as SettingsData['userPreferences']['language'])
                  }
                  className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/50 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Theme */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  🎨 Tema
                </label>
                <select
                  value={settings.userPreferences.theme}
                  onChange={(e) =>
                    updatePreferences('theme', e.target.value as SettingsData['userPreferences']['theme'])
                  }
                  className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/50 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                  <option value="light">Açık</option>
                  <option value="dark">Koyu</option>
                  <option value="auto">Otomatik</option>
                </select>
              </div>

              {/* Currency */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  💰 Para Birimi
                </label>
                <select
                  value={settings.userPreferences.currency}
                  onChange={(e) =>
                    updatePreferences('currency', e.target.value as SettingsData['userPreferences']['currency'])
                  }
                  className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/50 text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                  <option value="TRY">Türk Lirası (₺)</option>
                  <option value="USD">Amerikan Doları ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Güvenlik Ayarları</h2>

              {/* Two Factor Auth */}
              <label className="flex items-center justify-between p-4 rounded-lg hover:bg-white/50 cursor-pointer transition-colors border border-white/30">
                <div>
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield size={18} />
                    İki Faktörlü Doğrulama
                  </p>
                  <p className="text-sm text-gray-600">
                    Hesabınızı ek bir güvenlik katmanı ile koruyun
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.userPreferences.twoFactorAuth}
                  onChange={(e) => updatePreferences('twoFactorAuth', e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              {/* Password Change */}
              <div className="p-4 rounded-lg border border-white/30 hover:bg-white/50 transition-colors">
                <p className="font-semibold text-gray-900 mb-2">🔐 Şifre Değiştir</p>
                <p className="text-sm text-gray-600 mb-3">
                  Hesabınızın güvenliğini artırmak için şifrenizi düzenli olarak değiştirin
                </p>
                <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all">
                  Şifre Değiştir
                </button>
              </div>

              {/* Active Sessions */}
              <div className="p-4 rounded-lg border border-white/30 hover:bg-white/50 transition-colors">
                <p className="font-semibold text-gray-900 mb-2">📱 Aktif Oturumlar</p>
                <p className="text-sm text-gray-600 mb-3">
                  Diğer cihazlardaki oturumlarınızı yönetin
                </p>
                <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all">
                  Oturumları Görüntüle
                </button>
              </div>

              {/* Account Deletion */}
              <div className="p-4 rounded-lg border border-red-300 bg-red-50">
                <p className="font-semibold text-red-700 mb-2">⚠️ Hesabı Sil</p>
                <p className="text-sm text-red-600 mb-3">
                  Hesabınızı kalıcı olarak silin. Bu işlem geri alınamaz.
                </p>
                <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all">
                  Hesabı Sil
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Save size={20} />
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-lg bg-white/50 text-gray-900 font-semibold hover:bg-white/70 transition-all border border-white/30 flex items-center justify-center gap-2"
          >
            <X size={20} />
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfileSettings;
