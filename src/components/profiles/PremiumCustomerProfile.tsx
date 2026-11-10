import React, { useState } from 'react';
import { Mail, Phone, Calendar, Shield, Award, Heart, Settings, Edit2, LogOut, MapPin, Zap, TrendingUp, Share2, Facebook, Instagram, Twitter } from 'lucide-react';

interface Appointment {
  id: number;
  escortName: string;
  date: Date;
  duration: number;
  status: 'completed' | 'cancelled' | 'upcoming';
  rating?: number;
}

interface CustomerProfileData {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  joinDate: Date;
  isApprovedCustomer: boolean;
  loyaltyPoints: number;
  tier: 'free' | 'gold' | 'platinum' | 'vip';
  subscriptionEndsAt?: Date;
  appointments: Appointment[];
  badges: string[];
  bannerImage?: string;
  bio?: string;
  location?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  membershipBenefits?: string[];
}

interface EnhancedCustomerProfileProps {
  profile: CustomerProfileData;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

/**
 * Geliştirilmiş Müşteri Profil Sayfası
 * 
 * Banner, sosyal medya, premium özellikler ve interaktif bileşenler
 */
export const EnhancedCustomerProfile: React.FC<EnhancedCustomerProfileProps> = ({
  profile,
  isOwnProfile = false,
  onEditClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  const [selectedTab, setSelectedTabState] = useState<'overview' | 'appointments' | 'badges' | 'benefits'>('overview');
  const [showShareMenu, setShowShareMenu] = useState(false);

  const tabs = ['overview', 'appointments', 'badges', 'benefits'] as const;

  const getTierColor = (tier: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      free: { bg: 'from-gray-400 to-gray-600', text: 'text-gray-900', icon: '⭐' },
      gold: { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-900', icon: '🏆' },
      platinum: { bg: 'from-slate-300 to-slate-500', text: 'text-slate-900', icon: '💎' },
      vip: { bg: 'from-pink-400 to-pink-600', text: 'text-pink-900', icon: '👑' },
    };
    return colors[tier] || colors.free;
  };

  const tierColor = getTierColor(profile.tier);

  const loyaltyLevel = Math.floor(profile.loyaltyPoints / 1000);
  const loyaltyProgress = (profile.loyaltyPoints % 1000) / 10;

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #f0f4ff 100%)',
      }}
    >
      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-emerald-400 via-blue-400 to-gold-400 overflow-hidden">
        {profile.bannerImage && (
          <img
            src={profile.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all"
            >
              <Share2 size={24} />
            </button>
            {showShareMenu && (
              <div
                className="absolute right-0 top-full mt-2 rounded-lg shadow-xl z-50 min-w-max"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <button className="w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center gap-2 text-sm text-gray-700">
                  <Facebook size={16} />
                  Facebook'ta Paylaş
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center gap-2 text-sm text-gray-700 border-t border-white/20">
                  <Instagram size={16} />
                  Instagram'da Paylaş
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center gap-2 text-sm text-gray-700 border-t border-white/20">
                  <Twitter size={16} />
                  Twitter'da Paylaş
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div
          className="rounded-2xl p-8 backdrop-blur-xl border border-white/20 mb-8 relative -mt-20 z-20"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <div className="flex items-start justify-between mb-6">
            {/* Profile Info */}
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.fullName}
                  </h1>
                  {profile.isApprovedCustomer && (
                    <Shield size={28} className="text-green-600" fill="currentColor" />
                  )}
                </div>

                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} />
                      <span>{profile.phoneNumber}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>
                      Üye olundu: {new Date(profile.joinDate).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-gray-700 italic">{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex gap-3">
                <button
                  onClick={onEditClick}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Edit2 size={18} />
                  Düzenle
                </button>
                <button
                  onClick={onSettingsClick}
                  className="px-4 py-2 rounded-lg bg-white/50 text-gray-900 font-semibold hover:bg-white/70 transition-all flex items-center gap-2 border border-white/30"
                >
                  <Settings size={18} />
                  Ayarlar
                </button>
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Çıkış
                </button>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-6 border-t border-white/30">
            {/* Tier */}
            <div
              className={`p-4 rounded-lg bg-gradient-to-br ${tierColor.bg} text-white`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getTierColor(profile.tier).icon}</span>
              </div>
              <p className="text-sm opacity-80 font-semibold">Üyelik</p>
              <p className="text-lg font-bold">{profile.tier.toUpperCase()}</p>
            </div>

            {/* Loyalty Points */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={18} />
              </div>
              <p className="text-sm opacity-80 font-semibold">Sadakat</p>
              <p className="text-lg font-bold">{profile.loyaltyPoints.toLocaleString('tr-TR')}</p>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${Math.min(loyaltyProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Appointments */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-gold-400 to-pink-500 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} />
              </div>
              <p className="text-sm opacity-80 font-semibold">Randevular</p>
              <p className="text-lg font-bold">
                {profile.appointments.filter((a) => a.status === 'completed').length}
              </p>
            </div>

            {/* Badges */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Award size={18} />
              </div>
              <p className="text-sm opacity-80 font-semibold">Rozetler</p>
              <p className="text-lg font-bold">{profile.badges.length}</p>
            </div>

            {/* Status */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} />
              </div>
              <p className="text-sm opacity-80 font-semibold">Durum</p>
              <p className="text-lg font-bold">
                {profile.isApprovedCustomer ? 'Onaylı' : 'Beklemede'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/30 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTabState(tab)}
              className={`px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${
                selectedTab === tab
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && 'Genel Bakış'}
              {tab === 'appointments' && 'Randevular'}
              {tab === 'badges' && 'Rozetler'}
              {tab === 'benefits' && 'Üyelik Avantajları'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Membership Info */}
            <div
              className="rounded-2xl p-6 backdrop-blur-xl border border-white/20"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Üyelik Bilgileri</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className="font-semibold text-gray-900">
                    {profile.tier.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Onaylı Müşteri:</span>
                  <span className="font-semibold text-gray-900">
                    {profile.isApprovedCustomer ? '✓ Evet' : '✗ Hayır'}
                  </span>
                </div>
                {profile.subscriptionEndsAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sona Eriş:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(profile.subscriptionEndsAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div
              className="rounded-2xl p-6 backdrop-blur-xl border border-white/20"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                İstatistikler
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Randevu:</span>
                  <span className="font-semibold text-gray-900">
                    {profile.appointments.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tamamlanan:</span>
                  <span className="font-semibold text-green-600">
                    {profile.appointments.filter((a) => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">İptal Edilen:</span>
                  <span className="font-semibold text-red-600">
                    {profile.appointments.filter((a) => a.status === 'cancelled').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sadakat Seviyesi:</span>
                  <span className="font-semibold text-emerald-600">
                    Seviye {loyaltyLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'appointments' && (
          <div className="space-y-4">
            {profile.appointments.length === 0 ? (
              <div
                className="rounded-2xl p-8 backdrop-blur-xl border border-white/20 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <p className="text-gray-600">Henüz randevu yok</p>
              </div>
            ) : (
              profile.appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl p-6 backdrop-blur-xl border border-white/20 hover:shadow-lg transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{appointment.escortName}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString('tr-TR')} •{' '}
                        {appointment.duration} dakika
                      </p>
                      {appointment.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={
                                i < (appointment.rating ?? 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        appointment.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {appointment.status === 'completed' && 'Tamamlandı'}
                      {appointment.status === 'cancelled' && 'İptal Edildi'}
                      {appointment.status === 'upcoming' && 'Yaklaşan'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {selectedTab === 'badges' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.badges.length === 0 ? (
              <div
                className="col-span-full rounded-2xl p-8 backdrop-blur-xl border border-white/20 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <p className="text-gray-600">Henüz rozet yok</p>
              </div>
            ) : (
              profile.badges.map((badge, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 backdrop-blur-xl border border-white/20 text-center hover:shadow-lg transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <div className="text-4xl mb-2">{badge}</div>
                  <p className="text-sm font-semibold text-gray-900">Rozet {index + 1}</p>
                </div>
              ))
            )}
          </div>
        )}

        {selectedTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.membershipBenefits && profile.membershipBenefits.length > 0 ? (
              profile.membershipBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 backdrop-blur-xl border border-white/20 hover:shadow-lg transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-100 to-blue-100">
                      <Zap size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{benefit}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {profile.tier.toUpperCase()} üyeliğinin özel avantajı
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="col-span-full rounded-2xl p-8 backdrop-blur-xl border border-white/20 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <p className="text-gray-600">Avantaj bilgisi mevcut değil</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCustomerProfile;
