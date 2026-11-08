import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Camera,
  Slash, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { usePendingPhotos, useApprovePhoto, useRejectPhoto } from '@/hooks/useAdminData';
import type { PhotoApproval } from '@/types/admin';

/**
 * Admin Media Approvals Page
 *
 * Yönetim panelinde bekleyen medya öğelerini (resim, video) gözden geçirme,
 * orijinal ve AI ile işlenmiş hallerini karşılaştırma ve onaylama/reddetme
 * işlemleri için kullanılır.
 */
export default function AdminMediaApprovals() {
  const { data: pendingPhotos = [], isLoading, refetch } = usePendingPhotos();
  const approvePhoto = useApprovePhoto();
  const rejectPhoto = useRejectPhoto();

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const handleApprove = async (id: string) => {
    try {
      await approvePhoto.execute(id);
      setSelectedMediaId(null);
      setRejectionReason('');
      await refetch();
      toast.success('Medya onaylandı');
    } catch (error) {
      toast.error('Fotoğraf onaylanırken hata oluştu');
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Reddetme nedeni belirtmelisiniz.');
      return;
    }

    try {
      await rejectPhoto.execute(id, rejectionReason);
      setSelectedMediaId(null);
      setRejectionReason('');
      await refetch();
      toast.success('Medya reddedildi');
    } catch (error) {
      toast.error('Fotoğraf reddedilirken hata oluştu');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Camera className="w-8 h-8 text-emerald-400" /> Medya Onay Bekleyenler
          </h1>
          <p className="text-white/60 mt-2">
            Escortların yüklediği orijinal ve AI işlenmiş medyaları gözden geçirin.
          </p>
        </div>
        <Button variant="outline" className="border-white/10 text-white" onClick={() => refetch()}>
          Yenile
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : pendingPhotos.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white">Bekleyen Medya Yok</h2>
          <p className="text-white/40 mt-2">Şu an onay bekleyen herhangi bir medya öğesi bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPhotos.map((photo: PhotoApproval) => (
            <div key={photo.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all group">
              <div className="relative aspect-square bg-black/40">
                <img
                  src={photo.photoUrl}
                  alt="Bekleyen Medya"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {photo.processedUrl && (
                  <div className="absolute top-2 right-2 bg-gold-600/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI ile işlendi
                  </div>
                )}
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Profil: {photo.escortName}</span>
                  <span className="text-white/40">{new Date(photo.uploadedAt).toLocaleDateString('tr-TR')}</span>
                </div>

                {selectedMediaId === photo.id && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor={`rejection-${photo.id}`} className="text-white/80">Reddetme Nedeni</Label>
                    <Textarea
                      id={`rejection-${photo.id}`}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Medyayı neden reddettiğinizi belirtin..."
                      className="bg-white/5 border-white/10 text-white mb-3"
                    />
                    <Button
                      onClick={() => handleReject(photo.id)}
                      className="w-full bg-red-600 hover:bg-red-500 text-white"
                      disabled={rejectPhoto.isLoading}
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Reddet
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  {selectedMediaId !== photo.id && (
                    <Button
                      onClick={() => handleApprove(photo.id)}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                      disabled={approvePhoto.isLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Onayla
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedMediaId(selectedMediaId === photo.id ? null : photo.id)}
                    variant={selectedMediaId === photo.id ? 'default' : 'outline'}
                    className={`flex-1 ${selectedMediaId === photo.id ? 'bg-red-600 hover:bg-red-500' : 'border-red-500/50 text-red-400 hover:bg-red-500/10'}`}
                  >
                    {selectedMediaId === photo.id ? (
                      <>
                        <Slash className="w-4 h-4 mr-2" /> Vazgeç
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" /> Reddet
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
