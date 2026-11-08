import React, { useState } from 'react';
import { Ban, Unlink, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BannedUser {
  id: number;
  fullName?: string;
  email: string;
  banExpiresAt?: Date;
  reason?: string;
}

interface ModerationPanelProps {
  bannedUsers: BannedUser[];
  onBanUser?: (userId: number, reason: string, duration: number) => Promise<void>;
  onUnbanUser?: (userId: number) => Promise<void>;
  onRemoveBans?: () => Promise<void>;
}

/**
 * Admin Paneli - Moderasyon Yönetimi
 * 
 * Ceza sistemi, kullanıcı bloklama ve moderasyon işlemleri
 */
export const ModerationPanel: React.FC<ModerationPanelProps> = ({
  bannedUsers,
  onBanUser,
  onUnbanUser,
  onRemoveBans,
}) => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState(24);
  const [loading, setLoading] = useState(false);

  const handleBan = async () => {
    if (!selectedUser || !banReason.trim()) return;

    setLoading(true);
    try {
      await onBanUser?.(selectedUser, banReason, banDuration);
      setBanReason('');
      setBanDuration(24);
      setSelectedUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUnban = async (userId: number) => {
    setLoading(true);
    try {
      await onUnbanUser?.(userId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-lg p-6 border bg-[var(--bg-secondary)] border-[var(--border-primary)]"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
        <AlertTriangle size={20} />
        Moderasyon Yönetimi
      </h3>

      {/* Yasaklı Kullanıcılar */}
      <div className="mb-6 pb-6 border-b border-[var(--border-primary)]">
        <h4 className="font-semibold mb-3 text-[var(--text-primary)]">
          Yasaklı Kullanıcılar ({bannedUsers.length})
        </h4>

        {bannedUsers.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)]">
            Yasaklı kullanıcı yok
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {bannedUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 rounded-lg flex items-center justify-between bg-[var(--bg-primary)] border-l-4 border-l-[var(--error)]"
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[var(--text-primary)]">
                    {user.fullName || 'Kullanıcı'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {user.email}
                  </p>
                  {user.banExpiresAt && (
                    <p className="text-xs mt-1 text-[var(--text-tertiary)]">
                      Sona eriş: {new Date(user.banExpiresAt).toLocaleDateString('tr-TR')}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleUnban(user.id)}
                  disabled={loading}
                  className="ml-2 px-3 py-1 rounded text-xs font-semibold transition-colors bg-[var(--success)] text-white"
                >
                  <Unlink size={14} className="inline mr-1" />
                  Kaldır
                </button>
              </div>
            ))}
          </div>
        )}

        {bannedUsers.length > 0 && (
          <button
            onClick={onRemoveBans}
            disabled={loading}
            className="mt-3 text-sm px-3 py-1 rounded transition-colors bg-[var(--bg-primary)] text-[var(--success)] border border-[var(--success)]"
          >
            Süresi Dolan Yasakları Kaldır
          </button>
        )}
      </div>

      {/* Yeni Ceza */}
      <div>
        <h4 className="font-semibold mb-3 text-[var(--text-primary)]">
          Yeni Ceza Uygula
        </h4>

        <div className="space-y-3">
          {/* Kullanıcı Seçimi */}
          <div>
            <label className="text-sm text-[var(--text-secondary)]">
              Kullanıcı ID
            </label>
            <input
              type="number"
              value={selectedUser || ''}
              onChange={(e) => setSelectedUser(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full mt-1 px-3 py-2 rounded bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)]"
              placeholder="Kullanıcı ID girin"
            />
          </div>

          {/* Sebep */}
          <div>
            <label className="text-sm text-[var(--text-secondary)]">
              Ceza Sebebi
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)]"
              placeholder="Ceza sebebini yazın"
              rows={3}
            />
          </div>

          {/* Süre */}
          <div>
            <label className="text-sm text-[var(--text-secondary)]">
              Ceza Süresi (Saat)
            </label>
            <select
              value={banDuration}
              onChange={(e) => setBanDuration(parseInt(e.target.value))}
              className="w-full mt-1 px-3 py-2 rounded bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)]"
              title="Ceza Süresi"
            >
              <option value={24}>1 Gün</option>
              <option value={72}>3 Gün</option>
              <option value={168}>1 Hafta</option>
              <option value={720}>1 Ay</option>
              <option value={0}>Kalıcı</option>
            </select>
          </div>

          {/* Uygula Butonu */}
          <button
            onClick={handleBan}
            disabled={loading || !selectedUser || !banReason.trim()}
            className={cn(
              "w-full py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-white",
              loading ? "bg-[var(--text-tertiary)]" : "bg-[var(--error)]"
            )}
          >
            <Ban size={16} className="inline mr-2" />
            Ceza Uygula
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModerationPanel;
