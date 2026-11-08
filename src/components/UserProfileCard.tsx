import React from 'react';
import { User, Mail, Phone, Calendar, Shield, Award, Heart } from 'lucide-react';

interface UserProfile {
  id: number;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  isApprovedCustomer: boolean;
  loyaltyPoints: number;
  userRank: string;
  createdAt: Date;
  role: 'customer' | 'escort' | 'admin';
}

interface UserProfileCardProps {
  user: UserProfile;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
}

/**
 * Kullanıcı Profil Kartı
 * 
 * Kullanıcı bilgilerini, onaylı müşteri rozetini ve sadakat puanlarını gösterir
 */
export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  isOwnProfile = false,
  onEditClick,
}) => {
  // Rank rengini belirle
  const getRankColor = (rank: string) => {
    const rankColors: Record<string, string> = {
      'Bronz': '#CD7F32',
      'Gümüş': '#C0C0C0',
      'Altın': 'var(--gold)',
      'Platin': 'var(--platinum)',
      'VIP': 'var(--vip)',
    };
    return rankColors[rank] || 'var(--text-secondary)';
  };

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      {/* Profil Başlığı */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <User size={32} style={{ color: 'var(--text-secondary)' }} />
          </div>

          {/* Bilgiler */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {user.fullName || 'Kullanıcı'}
              </h2>
              {user.isApprovedCustomer && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                  style={{
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    color: '#2196f3',
                  }}
                >
                  <Shield size={12} />
                  Onaylı Müşteri
                </span>
              )}
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {user.role === 'customer' ? 'Müşteri' : user.role === 'escort' ? 'Escort' : 'Admin'}
            </p>
          </div>
        </div>

        {/* Düzenle Butonu */}
        {isOwnProfile && onEditClick && (
          <button
            onClick={onEditClick}
            className="px-4 py-2 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
            }}
          >
            Düzenle
          </button>
        )}
      </div>

      {/* İletişim Bilgileri */}
      <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          İletişim Bilgileri
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
          </div>

          {user.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>{user.phoneNumber}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>
              Üye olundu: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
      </div>

      {/* Sadakat ve Rank */}
      <div className="grid grid-cols-2 gap-4">
        {/* Rank */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: `2px solid ${getRankColor(user.userRank)}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Award size={18} style={{ color: getRankColor(user.userRank) }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Rank
            </span>
          </div>
          <p className="text-lg font-bold" style={{ color: getRankColor(user.userRank) }}>
            {user.userRank}
          </p>
        </div>

        {/* Sadakat Puanları */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: `2px solid var(--gold)`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart size={18} style={{ color: 'var(--gold)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Sadakat Puanları
            </span>
          </div>
          <p className="text-lg font-bold" style={{ color: 'var(--gold)' }}>
            {user.loyaltyPoints.toLocaleString('tr-TR')}
          </p>
        </div>
      </div>

      {/* Ek Bilgiler */}
      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {user.loyaltyPoints > 0 ? Math.floor(user.loyaltyPoints / 100) : 0}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Seviye
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {user.isApprovedCustomer ? '✓' : '✗'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Onaylı
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Gün
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
