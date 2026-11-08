import { motion } from 'framer-motion';
import { Phone, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientFormData } from '@/hooks/useClientRegisterForm';

interface Step2PhoneProps {
  formData: ClientFormData;
  setFormData: (data: ClientFormData) => void;
  errors: Record<string, string>;
  isCodeSent: boolean;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isVerified: boolean;
  codeTimer: number;
  handleSendCode: () => void;
  handleVerifyCode: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Phone = ({
  formData,
  setFormData,
  errors,
  isCodeSent,
  verificationCode,
  setVerificationCode,
  isVerified,
  codeTimer,
  handleSendCode,
  handleVerifyCode,
  onNext,
  onPrev,
}: Step2PhoneProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone className="text-primary" />
        </div>
        <h3 className="text-xl font-bold text-white">Numara Doğrulama</h3>
      </div>

      {!isCodeSent ? (
        <div className="space-y-4">
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+90 5XX XXX XX XX"
            className="w-full px-4 py-3.5 rounded-2xl border border-border/50 bg-background/50 focus:border-primary text-white"
          />
          {errors.phone && <p className="text-[11px] text-red-500">{errors.phone}</p>}
          <Button onClick={handleSendCode} className="w-full rounded-2xl py-6 bg-primary">
            KOD GÖNDER
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={verificationCode[i] || ''}
                onChange={(e) => {
                  const nc = verificationCode.split('');
                  nc[i] = e.target.value;
                  setVerificationCode(nc.join(''));
                }}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-border/50 bg-background/50 text-white"
                aria-label={`Kod ${i + 1}`}
                title={`Karakter ${i + 1}`}
              />
            ))}
          </div>
          {errors.otp && <p className="text-[11px] text-red-500 text-center">{errors.otp}</p>}
          <Button onClick={handleVerifyCode} className="w-full rounded-2xl py-6 bg-primary">
            DOĞRULA
          </Button>
          <div className="text-center">
            {codeTimer > 0 ? (
              <p className="text-xs text-muted-foreground">
                <Rocket className="inline w-3 h-3 mr-1" />
                {codeTimer}s
              </p>
            ) : (
              <Button variant="link" onClick={handleSendCode}>
                Tekrar Gönder
              </Button>
            )}
          </div>
        </div>
      )}

      {isVerified && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-center text-green-500 font-bold">
          ✓ DOĞRULANDI
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev} className="flex-1 rounded-2xl py-6 text-white">
          Geri
        </Button>
        {isVerified && (
          <Button onClick={onNext} className="flex-1 rounded-2xl py-6 bg-primary">
            Son Adım
          </Button>
        )}
      </div>
    </motion.div>
  );
};
