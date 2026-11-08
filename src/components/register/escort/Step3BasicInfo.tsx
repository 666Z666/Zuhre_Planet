import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormData } from '@/hooks/useEscortRegisterForm';

interface Step3Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  cities: string[];
  onNext: () => void;
  onBack: () => void;
}

export const Step3BasicInfo = ({
  formData,
  setFormData,
  cities,
  onNext,
  onBack
}: Step3Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <h2 className="text-xl font-semibold mb-4">Temel Bilgiler</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Yaş *</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="18+"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Şehir *</label>
          <select
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
            required
            title="Şehir Seçimi"
            aria-label="Şehir Seçimi"
          >
            <option value="">Seçiniz</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">İlçe *</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={formData.district}
            onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Örn: Kadıköy"
            required
          />
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
          disabled={!formData.age || !formData.city || !formData.district}
          className="flex-1 bg-gradient-to-r from-primary to-accent"
        >
          İleri
        </Button>
      </div>
    </motion.div>
  );
};
