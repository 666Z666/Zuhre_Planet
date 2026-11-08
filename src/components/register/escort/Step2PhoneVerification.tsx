import { motion } from 'framer-motion';
import { Phone, Shield, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormData } from '@/hooks/useEscortRegisterForm';

interface Step2Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isCodeSent: boolean;
  isPhoneVerified: boolean;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  codeTimer: number;
  handleSendCode: () => void;
  handleVerifyCode: () => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2PhoneVerification = ({
  formData,
  setFormData,
  isCodeSent,
  isPhoneVerified,
  verificationCode,
  setVerificationCode,
  codeTimer,
  handleSendCode,
  handleVerifyCode,
  onNext,
  onBack
}: Step2Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Telefon Doğrulama</h3>
        <p className="text-muted-foreground text-sm">
          Güvenliğiniz için telefon numaranızı doğrulamanız gerekiyor
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-primary mb-2">🔒 Gizlilik Garantisi</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Telefon numaranız hiçbir yerde paylaşılmayacak</li>
              <li>• SMS'de site adı geçmeyecek, tamamen gizli kalacak</li>
              <li>• Mesaj bildirim merkezi numaramızdan gelecek</li>
              <li>• Sadece "Merhaba... [KOD]" formatında mesaj alacaksınız</li>
              <li>• Kod harici hiçbir içerik görmeyeceksiniz, içiniz rahat olsun :)</li>
            </ul>
          </div>
        </div>
      </div>

      {!isCodeSent ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Telefon Numarası *</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="+90 555 123 4567"
                required
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSendCode}
            disabled={!formData.phone || formData.phone.length < 10}
            className="w-full bg-gradient-to-r from-primary to-accent"
          >
            Doğrulama Kodu Gönder
          </Button>
        </>
      ) : (
        <>
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {formData.phone} numarasına 4 haneli kod gönderildi
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-center">Doğrulama Kodu *</label>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={verificationCode[index] || ''}
                  onChange={(e) => {
                    const newCode = verificationCode.split('');
                    newCode[index] = e.target.value;
                    setVerificationCode(newCode.join(''));
                  }}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-border/50 bg-background focus:border-primary focus:ring-2 focus:ring-primary/20"
                  aria-label={`Doğrulama Kodu ${index + 1}`}
                  title={`Karakter ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleVerifyCode}
            disabled={verificationCode.length !== 4}
            className="w-full bg-gradient-to-r from-primary to-accent"
          >
            Doğrula
          </Button>

          {codeTimer > 0 ? (
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Kod tekrar {codeTimer} saniye sonra gönderilebilir
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSendCode}
              className="w-full"
            >
              Kodu Tekrar Gönder
            </Button>
          )}
        </>
      )}

      {isPhoneVerified && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
          <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="font-semibold text-green-700 dark:text-green-400">Telefon Doğrulandı!</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Geri
        </Button>
        {isPhoneVerified && (
          <Button
            type="button"
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-primary to-accent"
          >
            İleri
          </Button>
        )}
      </div>
    </motion.div>
  );
};
