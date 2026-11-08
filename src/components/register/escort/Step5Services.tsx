import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FormData } from '@/hooks/useEscortRegisterForm';

interface Step5Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  serviceOptions: string[];
  handleServiceToggle: (service: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step5Services = ({
  formData,
  setFormData,
  serviceOptions,
  handleServiceToggle,
  onNext,
  onBack
}: Step5Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <h2 className="text-xl font-semibold mb-4">Hizmetler</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Hizmet Türleri</label>
        <div className="grid grid-cols-2 gap-3">
          {serviceOptions.map(service => (
            <label key={service} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primary/5 transition">
              <input
                type="checkbox"
                checked={formData.services.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Çalışma Saatleri</label>
        <input
          type="text"
          value={formData.workingHours}
          onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Örn: 10:00 - 22:00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Randevu Türleri</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primary/5">
            <input
              type="checkbox"
              checked={formData.inCall}
              onChange={(e) => setFormData(prev => ({ ...prev, inCall: e.target.checked }))}
              className="w-5 h-5 rounded"
            />
            <span>Ofisime / Kendi Mekanımda</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primary/5">
            <input
              type="checkbox"
              checked={formData.outCall}
              onChange={(e) => setFormData(prev => ({ ...prev, outCall: e.target.checked }))}
              className="w-5 h-5 rounded"
            />
            <span>Müşterinin Mekanına</span>
          </label>
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
