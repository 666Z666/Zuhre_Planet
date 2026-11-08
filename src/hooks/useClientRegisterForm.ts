import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAuth, AppUserRole } from '@/contexts/AuthContext';
import { registerSchema, sanitizeInput, validateInput, formatValidationErrors } from '@/lib/security/validation';

export type Step = 1 | 2 | 3;

export interface ClientFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthDate: string;
  city: string;
  agreeTerms: boolean;
  referralCode: string;
}

/**
 * Hook for managing Client Registration form state and logic.
 * Handles multi-step navigation, validation, and phone verification.
 */
export const useClientRegisterForm = () => {
  const [, setLocation] = useLocation();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Phone verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    city: '',
    agreeTerms: false,
    referralCode: '',
  });

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  }, [formData.password]);

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return 'bg-red-500';
    if (strength <= 50) return 'bg-orange-500';
    if (strength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSendCode = () => {
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setErrors({ phone: 'Lütfen geçerli bir telefon numarası girin' });
      return;
    }
    setErrors({});
    setIsCodeSent(true);
    setCodeTimer(60);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (codeTimer > 0) {
      timer = setInterval(() => {
        setCodeTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [codeTimer]);

  const handleVerifyCode = () => {
    if (verificationCode.length === 4) {
      setIsVerified(true);
      setIsCodeSent(false);
      setErrors({});
    } else {
      setErrors({ otp: 'Geçersiz doğrulama kodu' });
    }
  };

  const handleReferralCodeCheck = () => {
    if (!formData.referralCode || formData.referralCode.length < 4) {
      return;
    }
    // Logic for referral check can be expanded here if needed
  };

  const nextStep = useCallback(() => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setErrors({ form: 'Lütfen tüm zorunlu alanları doldurun' });
        return;
      }
      if (passwordStrength < 50) {
        setErrors({ password: 'Şifreniz çok zayıf. Lütfen daha güçlü bir şifre seçin.' });
        return;
      }
    }
    setErrors({});
    setCurrentStep((prev) => (prev + 1) as Step);
  }, [currentStep, formData, passwordStrength]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev - 1) as Step);
  }, []);

  const handleSubmit = async () => {
    if (!isVerified) {
      setErrors({ form: 'Lütfen telefon numaranızı doğrulayın' });
      return;
    }
    if (!formData.agreeTerms) {
      setErrors({ agreeTerms: 'Kullanım koşullarını kabul etmelisiniz' });
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const sanitizedData = {
        firstName: sanitizeInput(formData.name.split(' ')[0] || ''),
        lastName: sanitizeInput(formData.name.split(' ').slice(1).join(' ') || '-'),
        email: sanitizeInput(formData.email),
        password: formData.password,
        phone: sanitizeInput(formData.phone),
        termsAccepted: formData.agreeTerms
      };

      const result = validateInput(registerSchema, sanitizedData);
      if (!result.success) {
        setErrors(formatValidationErrors(result.error));
        setIsLoading(false);
        return;
      }

      await register({
        name: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
        email: sanitizedData.email,
        password: sanitizedData.password,
        role: 'customer' as AppUserRole
      });
      setLocation('/');
    } catch (err) {
      console.error('Kayıt hatası:', err);
      setErrors({ form: 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edip tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    isLoading,
    errors,
    setErrors,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    verificationCode,
    setVerificationCode,
    isCodeSent,
    isVerified,
    codeTimer,
    passwordStrength,
    getStrengthColor,
    handleSendCode,
    handleVerifyCode,
    handleReferralCodeCheck,
    handleSubmit,
    setLocation
  };
};
