import { motion } from 'framer-motion';
import { TrendingUp, Crown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/hooks/useEscortRegisterForm';

interface Step4Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  bodyTypes: string[];
  hairColors: string[];
  eyeColors: string[];
  onNext: () => void;
  onBack: () => void;
}

export const Step4PhysicalFeatures = ({
  formData,
  setFormData,
  bodyTypes,
  hairColors,
  eyeColors,
  onNext,
  onBack
}: Step4Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <h2 className="text-xl font-semibold mb-4">Fiziksel Özellikler</h2>

      {/* Info Cards - Visibility Benefits */}
      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">📈 Görünürlük Garantisi</p>
            <p className="text-blue-600 dark:text-blue-300">
              Ne kadar çok bilgi girerseniz, profiliniz o kadar üst sıralarda çıkar. Müşteriler detaylı profiller tercih eder!
            </p>
          </div>
        </div>
      </div>

      {/* VIP Benefits Card */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Crown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-semibold text-amber-700 dark:text-amber-400 mb-2">👑 VIP Üyelik Ayrıcalıkları</p>
            <ul className="text-amber-600 dark:text-amber-300 space-y-1">
              <li>✨ Her listenin en üstünde görünürsünüz</li>
              <li>🔥 Profilinizde özel VIP rozeti</li>
              <li>📸 Sınırsız fotoğraf ve video yükleme</li>
              <li>⚡ Öncelikli müşteri desteği</li>
              <li>🎯 Gelişmiş filtrelerde her zaman ilk sıralarda</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Verified Member Benefits Card */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-semibold text-green-700 dark:text-green-400 mb-2">✅ Onaylı Üye Ayrıcalıkları</p>
            <ul className="text-green-600 dark:text-green-300 space-y-1">
              <li>🛡️ Profilinizde onaylı rozet</li>
              <li>👁️ Güvenilir görünüm - %70 daha fazla tıklama</li>
              <li>📊 Aramalarda öncelikli sıralama</li>
              <li>🔒 Kimliğiniz gizli tutulur, sadece onaylandı görünür</li>
            </ul>
          </div>
        </div>
      </div>

      {/* VIP Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Standart</p>
            <p className="text-2xl font-bold">Ücretsiz</p>
            <p className="text-xs text-muted-foreground mt-2">10 fotoğraf</p>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5 ring-2 ring-primary/20">
          <CardContent className="p-4 text-center relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              POPÜLER
            </div>
            <p className="text-xs text-primary mb-1">Premium</p>
            <p className="text-2xl font-bold text-primary">₺499<span className="text-sm text-muted-foreground">/ay</span></p>
            <p className="text-xs text-muted-foreground mt-2">20 fotoğraf + 5 video</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 ring-2 ring-amber-500/20">
          <CardContent className="p-4 text-center relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" />
              EN İYİ
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">VIP</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">₺999<span className="text-sm text-muted-foreground">/ay</span></p>
            <p className="text-xs text-muted-foreground mt-2">Sınırsız içerik + Öncelik</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Boy (cm) *</label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="165"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Kilo (kg) *</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="55"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Vücut Tipi *</label>
        <div className="flex flex-wrap gap-2">
          {bodyTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, bodyType: type }))}
              className={`px-4 py-2 rounded-full border-2 transition ${formData.bodyType === type
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 hover:border-primary/50'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Saç Rengi *</label>
        <div className="flex flex-wrap gap-2">
          {hairColors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, hairColor: color }))}
              className={`px-4 py-2 rounded-full border-2 transition ${formData.hairColor === color
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 hover:border-primary/50'
                }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Göz Rengi *</label>
        <div className="flex flex-wrap gap-2">
          {eyeColors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, eyeColor: color }))}
              className={`px-4 py-2 rounded-full border-2 transition ${formData.eyeColor === color
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 hover:border-primary/50'
                }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Geri
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-primary to-accent"
        >
          İleri
        </Button>
      </div>
    </motion.div>
  );
};
