import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  User, 
  Calendar, 
  Camera, 
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  History,
  Loader2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { PendingContactsCard } from '@/components/contact/PendingContactsCard';
import { SafetySignalsCard } from '@/components/admin/SafetySignalsCard';
import { usePendingPhotos, useApprovePhoto, useRejectPhoto } from '@/hooks/useAdminData';

export const ApprovalsTab = () => {
  const [rejectionTarget, setRejectionTarget] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // --- Photo Approval State ---
  const { data: pendingPhotos = [], isLoading: photosLoading, refetch: refetchPhotos } = usePendingPhotos();
  const approvePhoto = useApprovePhoto();
  const rejectPhoto = useRejectPhoto();

  // --- Profile Update Approval State ---
  const profileUpdatesQuery = trpc.admin.getPendingProfileUpdates.useQuery({ limit: 20, offset: 0 });
  const approveProfileMutation = trpc.admin.approveProfileUpdate.useMutation({
    onSuccess: () => {
      toast.success('Profil güncellemesi onaylandı');
      profileUpdatesQuery.refetch();
    },
    onError: (err) => toast.error(`Hata: ${err.message}`)
  });

  const pendingProfiles = profileUpdatesQuery.data || [];
  const isLoading = photosLoading || profileUpdatesQuery.isLoading;
  const totalPending = pendingPhotos.length + pendingProfiles.length;

  const handleApprovePhoto = async (id: string) => {
    const result = await approvePhoto.execute(id);
    if (result.success) {
      setRejectionTarget(null);
      setRejectionReason('');
      await refetchPhotos();
    }
  };

  const handleRejectPhoto = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Reddetme nedeni belirtmelisiniz.');
      return;
    }
    const result = await rejectPhoto.execute(id, rejectionReason);
    if (result.success) {
      setRejectionTarget(null);
      setRejectionReason('');
      await refetchPhotos();
    }
  };

  const handleApproveProfile = (profileId: number) => {
    approveProfileMutation.mutate({ profileId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <SafetySignalsCard />
      <PendingContactsCard />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black font-orbitron text-white flex items-center gap-3 italic">
            <ShieldCheck className="w-8 h-8 text-green-500" />
            MODERASYON <span className="text-green-500 italic">KUYRUĞU</span>
          </h2>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">
            Bekleyen Profil Güncellemeleri ve Medya Onayları
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="h-10 px-6 rounded-xl border-green-500/20 text-green-500 font-black text-xs uppercase italic bg-green-500/5">
            {totalPending} BEKLEYEN
          </Badge>
          <Button 
            variant="ghost" 
            className="h-10 text-gray-500 font-black text-[10px] uppercase tracking-widest"
            onClick={() => { refetchPhotos(); profileUpdatesQuery.refetch(); }}
          >
            <History className="w-4 h-4 mr-2" /> YENİLE
          </Button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {totalPending === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <CheckCircle2 className="w-16 h-16 text-green-500/20 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white italic">KUYRUK TEMİZ</h3>
          <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest mt-2">
            Onay bekleyen içerik bulunmuyor.
          </p>
        </motion.div>
      )}

      {/* PENDING PHOTOS SECTION */}
      {pendingPhotos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gold-400 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Bekleyen Medya ({pendingPhotos.length})
          </h3>
          <AnimatePresence>
            {pendingPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="border-white/5 bg-[#0a0a0f] rounded-[2.5rem] overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-x divide-white/5">
                    
                    {/* INFO SECTION */}
                    <div className="p-8 bg-white/5">
                      <div className="flex flex-col h-full justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-gold-500/10 border-gold-500/20 text-gold-400">
                              <Camera className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">MEDYA YÜKLEME</p>
                              <h4 className="text-sm font-black text-white italic uppercase">{photo.escortName}</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                            <Calendar className="w-3 h-3" /> 
                            {photo.uploadedAt ? new Date(photo.uploadedAt).toLocaleString('tr-TR') : '—'}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 space-y-2">
                          {rejectionTarget !== photo.id ? (
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleApprovePhoto(photo.id)} 
                                disabled={approvePhoto.isLoading}
                                className="flex-1 h-12 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black italic shadow-lg shadow-green-600/10 uppercase text-[10px]"
                              >
                                {approvePhoto.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ONAYLA'}
                              </Button>
                              <Button 
                                onClick={() => setRejectionTarget(photo.id)} 
                                className="flex-1 h-12 bg-red-900/50 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white rounded-2xl font-black italic uppercase text-[10px]"
                              >
                                REDDET
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Label className="text-gray-400 text-[10px] uppercase font-black">Reddetme Nedeni:</Label>
                              <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Neden reddediyorsunuz?"
                                className="bg-white/5 border-white/10 text-white text-xs rounded-xl resize-none"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleRejectPhoto(photo.id)}
                                  disabled={rejectPhoto.isLoading}
                                  className="flex-1 h-10 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-[10px] uppercase"
                                >
                                  ONAYLA REDDET
                                </Button>
                                <Button
                                  onClick={() => { setRejectionTarget(null); setRejectionReason(''); }}
                                  variant="ghost"
                                  className="h-10 px-4 rounded-xl text-gray-500 font-black text-[10px] uppercase"
                                >
                                  VAZGEÇ
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PHOTO COMPARISON */}
                    <div className="md:col-span-3 p-8">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-8 text-[9px] font-black text-gray-700 tracking-widest italic uppercase">
                          <span>ORİJİNAL ÇEKİM</span>
                          <span className="text-gold-500 flex items-center gap-1"><Sparkles className="w-3 h-3" />AI İŞLENMİŞ (GİZLİLİK)</span>
                        </div>
                        <div className="flex gap-6 items-center">
                          <div className="flex-1 aspect-video rounded-2xl bg-black border border-white/5 overflow-hidden">
                            {photo.originalUrl ? (
                              <img src={photo.originalUrl} alt="Orijinal" className="w-full h-full object-cover opacity-80" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                          <ArrowRight className="w-6 h-6 text-gold-500 shrink-0" />
                          <div className="flex-1 aspect-video rounded-2xl bg-black border border-gold-500/30 overflow-hidden shadow-2xl shadow-gold-500/10">
                            {photo.processedUrl ? (
                              <img src={photo.processedUrl} alt="İşlenmiş" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-4">
                                <span>İşlenmemiş<br/>(Yeni)</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {photo.imageProcessingOptions && (
                          <div className="flex gap-4 text-[10px]">
                            <span className={`flex items-center gap-1 ${photo.imageProcessingOptions.faceMaskingEnabled ? 'text-green-400' : 'text-gray-600'}`}>
                              {photo.imageProcessingOptions.faceMaskingEnabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              Yüz Maskeleme
                            </span>
                            <span className={`flex items-center gap-1 ${photo.imageProcessingOptions.blurBackground ? 'text-green-400' : 'text-gray-600'}`}>
                              {photo.imageProcessingOptions.blurBackground ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              Arka Plan Bulanık
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* PENDING PROFILE UPDATES SECTION */}
      {pendingProfiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
            <User className="w-4 h-4" /> Bekleyen Profil Güncellemeleri ({pendingProfiles.length})
          </h3>
          <AnimatePresence>
            {pendingProfiles.map((profile) => {
              const pending = profile.pendingDataParsed || {};
              const fields = Object.entries(pending).filter(([k]) => 
                ['displayName', 'bio', 'biography', 'slogan', 'city', 'district', 'age'].includes(k)
              );
              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="border-white/5 bg-[#0a0a0f] rounded-[2.5rem] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-x divide-white/5">
                      
                      {/* INFO */}
                      <div className="p-8 bg-white/5">
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-blue-500/10 border-blue-500/20 text-blue-400">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">PROFİL GÜNCELLEME</p>
                                <h4 className="text-sm font-black text-white italic uppercase">
                                  {profile.displayName || profile.stageName || `Profil #${profile.id}`}
                                </h4>
                              </div>
                            </div>
                          </div>
                          <div className="pt-6 flex gap-2">
                            <Button 
                              onClick={() => handleApproveProfile(profile.id)} 
                              disabled={approveProfileMutation.isPending}
                              className="flex-1 h-12 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black italic shadow-lg shadow-green-600/10 uppercase text-[10px]"
                            >
                              {approveProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ONAYLA'}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* DIFF VIEW */}
                      <div className="md:col-span-3 p-8">
                        {fields.length > 0 ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-8 text-[9px] font-black text-gray-700 tracking-widest italic uppercase">
                              <span>MEVCUT VERİ</span>
                              <span className="text-amber-500">YENİ TALEP</span>
                            </div>
                            <div className="space-y-3">
                              {fields.map(([key, newVal]) => (
                                <div key={key} className="flex items-start gap-4">
                                  <div className="w-24 shrink-0">
                                    <Badge variant="outline" className="text-[8px] font-black italic border-white/10 text-gray-500">{key}</Badge>
                                  </div>
                                  <div className="flex-1 p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-500 italic line-through">
                                  {String((profile as Record<string, unknown>)[key] ?? '—')}
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 mt-2" />
                                  <div className="flex-1 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[11px] text-white italic font-medium">
                                    {String(newVal)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm italic">Görüntülenecek değişiklik detay bilgisi yok.</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* FOOTER INFO */}
      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 flex items-center gap-6 italic">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-amber-500" />
        </div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
          Sistem Karşılaştırmalı Moderasyon modundadır. Onay vermediğiniz hiçbir güncelleme son kullanıcıya yansımaz. <br />
          <span className="text-white">Görseller AI filtrelerinden geçtikten sonra otomatik olarak bu kuyruğa aktarılır.</span>
        </p>
      </div>
    </div>
  );
};
