import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Upload, 
  Camera, 
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface VerificationWizardProps {
  onComplete: () => void;
  onClose: () => void;
}

export function VerificationWizard({ onComplete, onClose }: VerificationWizardProps) {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<{ id?: File, selfie?: File }>({});
  const [isUploading, setIsUploading] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      toast.success(`${type === 'id' ? 'Kimlik' : 'Selfie'} fotoğrafı seçildi.`);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsUploading(true);
    // Simüle edilen API çağrısı
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    toast.success("Doğrulama belgeleriniz başarıyla gönderildi. Admin onayı bekleniyor.");
    onComplete();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-500" /> KİMLİK DOĞRULAMA
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <Progress value={progress} className="h-1 bg-white/5" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" /> Neden Doğrulama yapmalıyım?
              </h3>
              <p className="text-sm text-blue-200/60 leading-relaxed">
                Doğrulanmış profiller, diğer kullanıcılara göre <span className="text-white font-bold">%300 daha fazla</span> güven ve randevu talebi alır. Mavi kalkan rozeti profilinizde parlar.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block p-8 border-2 border-dashed border-white/10 rounded-3xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer text-center group">
                <input type="checkbox" className="hidden" />
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="font-bold text-white uppercase tracking-tighter">Kimlik Fotoğrafı Yükle</h4>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">Ön yüzün net göründüğünden emin olun</p>
                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'id')} accept="image/*" />
              </label>
            </div>

            <Button 
              onClick={nextStep} 
              disabled={!files.id}
              className="w-full py-8 text-lg font-black bg-blue-600 hover:bg-blue-700 rounded-2xl mt-4"
            >
              SONRAKİ ADIM <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gold-500/10 border border-gold-500/20 rounded-2xl text-center">
              <Camera className="w-12 h-12 text-gold-400 mx-auto mb-4" />
              <h3 className="font-bold text-gold-400 mb-2 uppercase italic tracking-tighter">KİMLİKLE SELFİE</h3>
              <p className="text-sm text-gold-200/60 leading-relaxed">
                Elinizde kimliğinizi tutarken bir selfie çekin. Yüzünüz ve kimlik bilgileriniz aynı anda net görünmelidir.
              </p>
            </div>

            <label className="block p-8 border-2 border-dashed border-white/10 rounded-3xl hover:border-gold-500/50 hover:bg-gold-500/5 transition-all cursor-pointer text-center group">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-gold-500" />
              </div>
              <h4 className="font-bold text-white uppercase tracking-tighter">Selfie Fotoğrafı Seç</h4>
              <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'selfie')} accept="image/*" />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={prevStep} className="py-8 rounded-2xl border-white/10">
                <ArrowLeft className="w-5 h-5 mr-2" /> GERİ
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={!files.selfie}
                className="py-8 font-black bg-blue-600 hover:bg-blue-700 rounded-2xl"
              >
                SON ADIM <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-8"
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">HAZIRSINIZ!</h3>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto uppercase text-xs font-black tracking-widest leading-loose">
              Tüm belgeleriniz admin ekibimiz tarafından incelenecektir. Ortalama onay süresi <span className="text-white">2-12 saattir.</span>
            </p>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleSubmit} 
                disabled={isUploading}
                className="w-full py-8 font-black bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-3xl shadow-2xl shadow-blue-500/20"
              >
                {isUploading ? "GÖNDERİLİYOR..." : "DOĞRULAMAYI TAMAMLA"}
              </Button>
              <Button variant="ghost" onClick={prevStep} disabled={isUploading} className="text-white/40">
                BELGELERİ KONTROL ET
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
