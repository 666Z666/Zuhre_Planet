/**
 * Profile Editor (Dashboard)
 * 
 * Escort kullanıcılarının profil bilgilerini düzenlediği sayfa.
 * KRİTİK: Yapılan değişiklikler anında yayına girmez, 'Pending' (Onay Bekliyor)
 * statüsüne alınır ve Admin onayına sunulur.
 * 
 * @module pages/dashboard/ProfileEditor
 * @category Pages - Dashboard
 */

import { useState, useEffect } from 'react';
import { ContactSettingsCard } from '@/components/contact/ContactSettingsCard';
import { motion } from 'framer-motion';
import { 
  User, 
  Camera, 
  Save, 
  Info, 
  FileText, 
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { VerificationWizard } from '@/components/escort/VerificationWizard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  displayName: string;
  slogan?: string;
  age: number;
  city: string;
  biography: string;
  hourlyRate: number;
  mediaPrivacySettings: {
    faceMaskingEnabled: boolean;
    blurBackground: boolean;
    customMaskId?: string;
    brightnessAdjustment: number;
    contrastAdjustment: number;
  };
  rates: {
    hourly: number;
    currency: string;
  };
}

export default function ProfileEditor() {
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    mediaPrivacySettings: {
      faceMaskingEnabled: false,
      blurBackground: false,
      brightnessAdjustment: 0,
      contrastAdjustment: 0,
    },
    rates: {
      hourly: 0,
      currency: 'TRY'
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Demo amaçlı statik state

  useEffect(() => {
    // API'den profil verilerini çekme simülasyonu
    const fetchProfile = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ProfileData = {
        id: '1',
        displayName: 'Ayla Yıldız',
        slogan: 'Galaksinin en parlak yıldızı...',
        age: 24,
        city: 'İstanbul',
        biography: 'Profesyonel modellik yapıyorum. Detaylar için mesaj atın.',
        hourlyRate: 1500,
        mediaPrivacySettings: {
          faceMaskingEnabled: true,
          blurBackground: false,
          customMaskId: 'zuhre-planet-logo',
          brightnessAdjustment: 0.1,
          contrastAdjustment: 0,
        },
        rates: {
          hourly: 1500,
          currency: 'TRY'
        }
      };

      setFormData(mockData);
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name.startsWith('mediaPrivacySettings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mediaPrivacySettings: {
          ...prev.mediaPrivacySettings!,
          [settingName]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.startsWith('mediaPrivacySettings.')) {
      const settingName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mediaPrivacySettings: {
          ...prev.mediaPrivacySettings!,
          [settingName]: value,
        }
      }));
    }
  };

  const handleSave = async () => {
    // Burada API'ye "Update Request" atılır
    // Simülasyon:
    setHasPendingChanges(true);
    setShowSuccessMessage(true);
    
    // 5 saniye sonra başarı mesajını gizle
    setTimeout(() => setShowSuccessMessage(false), 5000);
    
    toast.success('Değişiklikleriniz moderasyon kuyruğuna alındı.');
  };

  const handleUnpublish = async () => {
     // İlanı anında gizler
     setFormData(prev => ({ ...prev, status: 'rejected' })); // Simulation
     toast.warning('İlanınız yayından kaldırıldı.');
  };

  if (isLoading) return <div className="text-white p-10 font-orbitron animate-pulse">Veriler yükleniyor...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* --- DURUM BİLDİRİMİ --- */}
        {hasPendingChanges && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-4 animate-in slide-in-from-top-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-amber-400 font-bold mb-1">Onay Bekleyen Değişiklikler Var</h3>
              <p className="text-amber-200/60 text-sm">
                Profilinizde yaptığınız son düzenlemeler şu an admin onayındadır. 
                Onaylanana kadar profilinizde eski bilgileriniz görüntülenmeye devam edecektir.
              </p>
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-4 fixed top-8 right-8 z-[100] shadow-2xl backdrop-blur-md">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <div className="text-green-400 font-bold">Değişiklikler başarıyla onaya gönderildi!</div>
          </div>
        )}

        <ContactSettingsCard />

        {/* --- KİMLİK DOĞRULAMA BANNER --- */}
        {!isVerified && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-blue-500/20 rounded-[2rem] flex items-center justify-center border border-blue-500/30 shadow-inner group">
                <Shield className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Kimlik Doğrulama</h2>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-none font-bold uppercase text-[9px] tracking-widest px-2 py-0.5">ÖNERİLEN</Badge>
                </div>
                <p className="text-blue-200/60 text-sm max-w-md uppercase font-black tracking-tighter leading-relaxed">
                  Güvenilirliğinizi kanıtlayın ve <span className="text-white font-black underline decoration-blue-500 underline-offset-4">%300 daha fazla</span> müşteri talebi alın.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsVerificationOpen(true)}
              className="relative z-10 px-10 py-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] italic shadow-2xl shadow-blue-500/40 transition-all flex items-center gap-3"
            >
              ŞİMDİ DOĞRULA <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon: Temel Bilgiler */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Kart 1: Kimlik Bilgileri */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold font-orbitron mb-6 flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-gold-400" />
                Kimlik Bilgileri
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Görünen İsim (Sahne Adı)</label>
                  <Input 
                    name="displayName"
                    value={formData.displayName || ''} 
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white focus:border-gold-500 h-12"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Slogan (Kart Üzerinde Görünür)</label>
                  <Input 
                    name="slogan"
                    value={formData.slogan || ''} 
                    onChange={handleChange}
                    placeholder="Örn: Galaksinin en parlak yıldızı..."
                    className="bg-white/5 border-white/10 text-white focus:border-gold-500 h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Yaş</label>
                    <Input 
                      name="age"
                      type="number"
                      value={formData.age || ''} 
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Şehir</label>
                    <Input 
                      name="city"
                      value={formData.city || ''} 
                      onChange={handleChange}
                      className="bg-white/5 border-white/10 text-white h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kart 2: Biyografi */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold font-orbitron mb-6 flex items-center gap-2 text-white">
                <FileText className="w-5 h-5 text-blue-400" />
                Biyografi & Detaylar
              </h3>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kendinizi Tanıtın</label>
                <textarea 
                  name="biography"
                  rows={6}
                  value={formData.biography || ''} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-gold-500 transition-colors placeholder:text-gray-600"
                  placeholder="Müşterilerinize kendinizden bahsedin..."
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3 text-blue-400" />
                  Biyografinizde telefon numarası veya dış bağlantı paylaşmak yasaktır.
                </p>
              </div>
            </div>

            {/* Kart 3: AI Destekli Medya Ayarları */}
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold font-orbitron mb-6 flex items-center gap-2 text-white">
                <Camera className="w-5 h-5 text-green-400" />
                AI Destekli Medya Ayarları
              </h3>
              
              <div className="space-y-4">
                {/* Yüz Maskeleme */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Yüz Maskeleme</label>
                    <p className="text-xs text-gray-500">
                      Görsellerinizdeki yüzler otomatik olarak maskelenir.
                    </p>
                  </div>
                  <button 
                    name="mediaPrivacySettings.faceMaskingEnabled"
                    role="switch"
                    aria-checked={formData.mediaPrivacySettings?.faceMaskingEnabled || false}
                    onClick={() => handleSelectChange('mediaPrivacySettings.faceMaskingEnabled', String(!formData.mediaPrivacySettings?.faceMaskingEnabled))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 ${formData.mediaPrivacySettings?.faceMaskingEnabled ? 'bg-gold-600' : 'bg-gray-700'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.mediaPrivacySettings?.faceMaskingEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {/* Arka Plan Bulanıklaştırma */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Arka Plan Bulanıklaştırma</label>
                    <p className="text-xs text-gray-500">
                      Görsellerinizin arka planı otomatik olarak bulanıklaştırılır.
                    </p>
                  </div>
                  <button 
                    name="mediaPrivacySettings.blurBackground"
                    role="switch"
                    aria-checked={formData.mediaPrivacySettings?.blurBackground || false}
                    onClick={() => handleSelectChange('mediaPrivacySettings.blurBackground', String(!formData.mediaPrivacySettings?.blurBackground))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-600 focus:ring-offset-2 ${formData.mediaPrivacySettings?.blurBackground ? 'bg-gold-600' : 'bg-gray-700'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.mediaPrivacySettings?.blurBackground ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {/* Özel Maske Seçimi */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Özel Maske Seçimi</label>
                  <Select 
                    name="mediaPrivacySettings.customMaskId"
                    value={formData.mediaPrivacySettings?.customMaskId || ''} 
                    onValueChange={(value) => handleSelectChange('mediaPrivacySettings.customMaskId', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-gold-500">
                      <SelectValue placeholder="Maske Seçin" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0f] border-white/10 text-white">
                      <SelectItem value="none">Maske Yok</SelectItem>
                      <SelectItem value="zuhre-planet-logo">Zuhre Planet Logo</SelectItem>
                      <SelectItem value="galaxy-blur">Galaksi Blur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Parlaklık Ayarı */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" /> Parlaklık ({formData.mediaPrivacySettings?.brightnessAdjustment || 0})
                  </label>
                  <Input
                    name="mediaPrivacySettings.brightnessAdjustment"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={formData.mediaPrivacySettings?.brightnessAdjustment || 0}
                    onChange={handleChange}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                </div>

                {/* Kontrast Ayarı */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-gray-500" /> Kontrast ({formData.mediaPrivacySettings?.contrastAdjustment || 0})
                  </label>
                  <Input
                    name="mediaPrivacySettings.contrastAdjustment"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.1"
                    value={formData.mediaPrivacySettings?.contrastAdjustment || 0}
                    onChange={handleChange}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Sağ Kolon: Fiyat ve Aksiyon */}
          <div className="space-y-6">
            
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-xl sticky top-8">
              <h3 className="text-lg font-bold font-orbitron mb-6 text-green-400">
                Fiyatlandırma
              </h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Saatlik Ücret</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
                    <Input 
                        name="hourlyRate"
                        type="number"
                        value={formData.rates?.hourly || ''} 
                        onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rates: { ...prev.rates!, hourly: Number(e.target.value), currency: 'TRY' }
                        }))}
                        className="bg-white/5 border-white/10 text-white pl-8 font-bold text-lg h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <Button 
                  onClick={handleSave}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-gold-600 to-pink-600 hover:from-gold-500 hover:to-pink-500 shadow-lg shadow-gold-900/40 border-none"
                >
                  <Save className="w-5 h-5 mr-2" />
                  ONAYA GÖNDER
                </Button>
                <p className="text-xs text-center text-gray-500">
                  Değişiklikler admin onayından sonra yayınlanır.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Verification Wizard Dialog */}
      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="max-w-2xl bg-slate-950/95 backdrop-blur-3xl border-white/5 p-10 rounded-[3rem] shadow-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200]">
          <VerificationWizard 
            onClose={() => setIsVerificationOpen(false)}
            onComplete={() => {
              setIsVerified(true);
              setIsVerificationOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
