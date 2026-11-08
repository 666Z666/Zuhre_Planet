import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/hooks/useEscortRegisterForm';

interface Step6Props {
  formData: FormData;
  isLoading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export const Step6ReviewConfirm = ({
  formData,
  isLoading,
  onSubmit,
  onBack
}: Step6Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <h2 className="text-xl font-semibold mb-4">Özet ve Onay</h2>

      <Card className="bg-muted/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ad:</span>
            <span className="font-medium">{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">E-posta:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Telefon:</span>
            <span className="font-medium">{formData.phone} ✓</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Yaş:</span>
            <span className="font-medium">{formData.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Konum:</span>
            <span className="font-medium">{formData.city}, {formData.district}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Boy/Kilo:</span>
            <span className="font-medium">{formData.height}cm / {formData.weight}kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hizmetler:</span>
            <span className="font-medium">{formData.services.length} seçili</span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Önemli Bilgi</p>
            <p className="text-amber-600 dark:text-amber-300">
              Profiliniz admin onayından sonra yayınlanacaktır. Onay süreci 24-48 saat sürebilir.
            </p>
          </div>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors">
        <input
          type="checkbox"
          id="terms-escort"
          className="w-5 h-5 rounded border-border mt-0.5 flex-shrink-0"
          required
        />
        <span className="text-sm">
          <a href="#" className="text-primary font-bold hover:underline">KVKK Aydınlatma Metni'ni</a>,{' '}
          <a href="#" className="text-primary font-bold hover:underline">Kullanım Koşullarını</a> ve{' '}
          <a href="#" className="text-primary font-bold hover:underline">Gizlilik Politikasını</a> okudum, galaksideki sorumluluklarımı kabul ediyorum. <span className="text-primary">*</span>
        </span>
      </label>

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
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-primary to-accent"
        >
          {isLoading ? 'Kaydediliyor...' : 'Kaydı Tamamla'}
        </Button>
      </div>
    </motion.div>
  );
};
