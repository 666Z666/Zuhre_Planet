import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormData } from '@/hooks/useEscortRegisterForm';

interface Step1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const Step1AccountInfo = ({
  formData,
  setFormData,
  showPassword,
  setShowPassword,
  onNext,
  onCancel
}: Step1Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <h2 className="text-xl font-semibold mb-4">Hesap Bilgileri</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Ad / Takma Ad *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Örn: Ayşe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">E-posta *</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="ornek@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Şifre *</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="En az 6 karakter"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          İptal
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!formData.name || !formData.email || !formData.password}
          className="flex-1 bg-gradient-to-r from-primary to-accent"
        >
          İleri
        </Button>
      </div>
    </motion.div>
  );
};
