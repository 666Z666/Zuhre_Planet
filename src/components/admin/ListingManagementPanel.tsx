import React, { useState } from 'react';
import { Trash2, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface Listing {
  id: number;
  stageName: string;
  city: string;
  tier: 'free' | 'gold' | 'platinum' | 'vip';
  isVisible: boolean;
  isBoosted: boolean;
  verificationStatus: 'none' | 'pending_ai' | 'pending_admin' | 'approved' | 'rejected';
  createdAt: Date;
}

interface ListingManagementPanelProps {
  listings: Listing[];
  onApprove?: (listingId: number) => Promise<void>;
  onReject?: (listingId: number, reason: string) => Promise<void>;
  onToggleVisibility?: (listingId: number) => Promise<void>;
  onBoost?: (listingId: number) => Promise<void>;
  onDelete?: (listingId: number) => Promise<void>;
}

/**
 * Admin Paneli - İlan Yönetimi
 * 
 * Escort ilanlarını onaylama, reddetme, görünürlük ve öne çıkarma
 */
export const ListingManagementPanel: React.FC<ListingManagementPanelProps> = ({
  listings,
  onApprove,
  onReject,
  onToggleVisibility,
  onBoost,
  onDelete,
}) => {
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async (listingId: number) => {
    setLoading(true);
    try {
      await onApprove?.(listingId);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (listingId: number) => {
    if (!rejectReason.trim()) return;

    setLoading(true);
    try {
      await onReject?.(listingId, rejectReason);
      setRejectReason('');
      setSelectedListing(null);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      approved: { color: 'var(--success)', icon: <CheckCircle size={14} />, text: 'Onaylı' },
      pending_admin: { color: 'var(--warning)', icon: <AlertCircle size={14} />, text: 'Beklemede' },
      pending_ai: { color: 'var(--info)', icon: <AlertCircle size={14} />, text: 'AI Kontrolü' },
      rejected: { color: 'var(--error)', icon: <AlertCircle size={14} />, text: 'Reddedildi' },
      none: { color: 'var(--text-tertiary)', icon: null, text: 'Kontrol Yok' },
    };

    const badge = badges[status] || badges.none;
    return (
      <span
        className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
        style={{
          backgroundColor: `${badge.color}20`,
          color: badge.color,
        }}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      free: 'var(--text-secondary)',
      gold: 'var(--gold)',
      platinum: 'var(--platinum)',
      vip: 'var(--vip)',
    };

    return (
      <span
        className="text-xs font-semibold px-2 py-1 rounded-full"
        style={{
          backgroundColor: `${colors[tier]}20`,
          color: colors[tier],
        }}
      >
        {tier.toUpperCase()}
      </span>
    );
  };

  return (
    <div
      className="rounded-lg p-6 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        İlan Yönetimi ({listings.length})
      </h3>

      {/* İlanlar Tablosu */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-primary)' }}>
              <th className="text-left py-3 px-4" style={{ color: 'var(--text-primary)' }}>
                Ad
              </th>
              <th className="text-left py-3 px-4" style={{ color: 'var(--text-primary)' }}>
                Şehir
              </th>
              <th className="text-left py-3 px-4" style={{ color: 'var(--text-primary)' }}>
                Seviye
              </th>
              <th className="text-left py-3 px-4" style={{ color: 'var(--text-primary)' }}>
                Durum
              </th>
              <th className="text-left py-3 px-4" style={{ color: 'var(--text-primary)' }}>
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr
                key={listing.id}
                style={{
                  borderBottom: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-primary)',
                }}
              >
                <td className="py-3 px-4">
                  <p style={{ color: 'var(--text-primary)' }} className="font-semibold">
                    {listing.stageName}
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
                    {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </td>
                <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>
                  {listing.city}
                </td>
                <td className="py-3 px-4">
                  {getTierBadge(listing.tier)}
                </td>
                <td className="py-3 px-4">
                  {getVerificationBadge(listing.verificationStatus)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {/* Onay */}
                    {listing.verificationStatus === 'pending_admin' && (
                      <button
                        onClick={() => handleApprove(listing.id)}
                        disabled={loading}
                        className="p-1 rounded transition-colors"
                        style={{
                          backgroundColor: 'var(--success)',
                          color: 'white',
                        }}
                        title="Onayla"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}

                    {/* Reddet */}
                    {listing.verificationStatus === 'pending_admin' && (
                      <button
                        onClick={() => setSelectedListing(listing.id)}
                        className="p-1 rounded transition-colors"
                        style={{
                          backgroundColor: 'var(--error)',
                          color: 'white',
                        }}
                        title="Reddet"
                      >
                        <AlertCircle size={16} />
                      </button>
                    )}

                    {/* Görünürlük */}
                    <button
                      onClick={() => onToggleVisibility?.(listing.id)}
                      className="p-1 rounded transition-colors"
                      style={{
                        backgroundColor: listing.isVisible ? 'var(--info)' : 'var(--text-tertiary)',
                        color: 'white',
                      }}
                      title={listing.isVisible ? 'Gizle' : 'Göster'}
                    >
                      {listing.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>

                    {/* Öne Çıkar */}
                    <button
                      onClick={() => onBoost?.(listing.id)}
                      className="p-1 rounded transition-colors"
                      style={{
                        backgroundColor: listing.isBoosted ? 'var(--gold)' : 'var(--text-tertiary)',
                        color: listing.isBoosted ? '#000' : 'white',
                      }}
                      title="Öne Çıkar"
                    >
                      ⭐
                    </button>

                    {/* Sil */}
                    <button
                      onClick={() => onDelete?.(listing.id)}
                      className="p-1 rounded transition-colors"
                      style={{
                        backgroundColor: 'var(--error)',
                        color: 'white',
                      }}
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reddet Modalı */}
      {selectedListing && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedListing(null)}
        >
          <div
            className="rounded-lg p-6 max-w-md w-full"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              İlanı Reddet
            </h4>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded mb-4"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
              }}
              placeholder="Reddetme sebebini yazın"
              rows={4}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedListing(null)}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                İptal
              </button>
              <button
                onClick={() => handleReject(selectedListing)}
                disabled={loading || !rejectReason.trim()}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--error)',
                  color: 'white',
                }}
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingManagementPanel;
