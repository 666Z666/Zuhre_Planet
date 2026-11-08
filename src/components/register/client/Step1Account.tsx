import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientFormData } from '@/hooks/useClientRegisterForm';

interface Step1AccountProps {
  formData: ClientFormData;
  setFormData: (data: ClientFormData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  passwordStrength: number;
  getStrengthColor: (strength: number) => string;
  onNext: () => void;
  onCancel: () => void;
}

export const Step1Account = ({
  formData,
  setFormData,
  errors,
  setErrors,
  showPassword,
  setShowPassword,
  passwordStrength,
  getStrengthColor,
  onNext,
  onCancel,
}: Step1AccountProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground/80">
          Ad Soyad <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.firstName) setErrors({});
            }}
            placeholder="Adınız Soyadınız"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border/50 bg-background/50 focus:border-primary transition-all text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground/80">
          E-posta Adresi <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({});
            }}
            placeholder="ornek@email.com"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border/50 bg-background/50 focus:border-primary transition-all text-white"
          />
        </div>
        {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-foreground/80">
          Şifre <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({});
            }}
            placeholder="En az 8 karakter"
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border/50 bg-background/50 focus:border-primary transition-all text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {/* Strength Indicator */}
        <div className="mt-3 space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-bold text-muted-foreground uppercase">Şifre Gücü</span>
            <span className={`text-[11px] font-black uppercase ${getStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
              {passwordStrength <= 25 ? 'Zayıf' : passwordStrength <= 50 ? 'Orta' : 'Güçlü'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div animate={{ width: `${passwordStrength}%` }} className={`h-full ${getStrengthColor(passwordStrength)}`} />
          </div>
        </div>
        {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1 rounded-2xl py-6">
          İptal
        </Button>
        <Button onClick={onNext} className="flex-1 rounded-2xl py-6 bg-primary shadow-lg shadow-primary/20">
          Devam Et
        </Button>
      </div>
    </motion.div>
  );
};
