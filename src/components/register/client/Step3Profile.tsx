import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ClientFormData } from '@/hooks/useClientRegisterForm';

interface Step3ProfileProps {
  formData: ClientFormData;
  setFormData: (data: ClientFormData) => void;
  isLoading: boolean;
  errors: Record<string, string>;
  handleReferralCodeCheck: () => void;
  handleSubmit: () => void;
  onPrev: () => void;
}

export const Step3Profile = ({
  formData,
  setFormData,
  isLoading,
  errors,
  handleReferralCodeCheck,
  handleSubmit,
  onPrev,
}: Step3ProfileProps) => {
  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
    'Adana', 'Mersin', 'Konya', 'Gaziantep', 'Eskişehir'
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase px-1">Doğum Tarihi</label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-white"
            aria-label="Doğum Tarihi"
            title="Doğum Tarihi"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase px-1">Şehir</label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-white"
            title="Şehir Seçimi"
            aria-label="Şehir Seçimi"
          >
            <option value="">Şehir Seçin</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-border/30">
        <label className="text-xs font-bold text-muted-foreground uppercase">Referans Kodu</label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={formData.referralCode}
            onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
            onBlur={handleReferralCodeCheck}
            className="flex-grow px-4 py-3 rounded-xl border border-border/50 bg-background/50 text-white"
            placeholder="REFERANS KODU (OPSİYONEL)"
            aria-label="Referans Kodu"
            title="Referans Kodu"
          />
          <Button variant="secondary" onClick={handleReferralCodeCheck}>
            Uygula
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary"
          />
          <span className="text-[11px] text-muted-foreground">Kullanım Koşullarını ve KVKK metnini kabul ediyorum.</span>
        </label>
        {errors.agreeTerms && <p className="text-[11px] text-red-500">{errors.agreeTerms}</p>}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onPrev} className="flex-1 rounded-2xl py-7 text-white">
          Geri
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 rounded-2xl py-7 bg-primary text-white font-black shadow-lg shadow-primary/30"
        >
          {isLoading ? 'Yükleniyor...' : 'YÖRÜNGEYE KATIL'}
        </Button>
      </div>
    </motion.div>
  );
};
