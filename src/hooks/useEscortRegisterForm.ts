import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

export interface FormData {
  // Step 1: Account Info
  name: string;
  email: string;
  password: string;

  // Step 2: Phone Verification
  phone: string;

  // Step 3: Basic Info
  age: string;
  city: string;
  district: string;

  // Step 4: Physical
  height: string;
  weight: string;
  bodyType: string;
  hairColor: string;
  eyeColor: string;
  breastSize: string;

  // Step 5: Services
  services: string[];
  workingHours: string;
  inCall: boolean;
  outCall: boolean;
}

export const useEscortRegisterForm = () => {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone verification states
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeTimer, setCodeTimer] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    city: '',
    district: '',
    height: '',
    weight: '',
    bodyType: '',
    hairColor: '',
    eyeColor: '',
    breastSize: '',
    services: [],
    workingHours: '',
    inCall: false,
    outCall: false,
  });

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSendCode = () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError('Geçerli bir telefon numarası girin');
      return;
    }
    setError('');
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
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [codeTimer]);

  const handleVerifyCode = () => {
    if (verificationCode.length === 4) {
      setIsPhoneVerified(true);
      setIsCodeSent(false);
      setError('');
    } else {
      setError('Geçersiz doğrulama kodu');
    }
  };

  const handleSubmit = async () => {
    if (!isPhoneVerified) {
      setError('Telefon doğrulaması gerekli');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'escort',
        phone: formData.phone,
        // Escort special fields can be added here or in a separate profile creation step
        profile: {
          age: parseInt(formData.age),
          city: formData.city,
          district: formData.district,
          physical: {
            height: formData.height,
            weight: formData.weight,
            bodyType: formData.bodyType,
            hairColor: formData.hairColor,
            eyeColor: formData.eyeColor,
            breastSize: formData.breastSize
          },
          services: formData.services,
          workingPreferences: {
            workingHours: formData.workingHours,
            inCall: formData.inCall,
            outCall: formData.outCall
          }
        }
      });
      setLocation('/escort/dashboard');
    } catch (err: unknown) {
      let errorMsg = 'Kayıt başarısız. Lütfen tekrar deneyin.';
      if (err instanceof Error) {
        // Handle common API error structures without 'any'
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMsg = axiosError.response?.data?.message || err.message || errorMsg;
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = useCallback(() => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  }, [currentStep]);

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    isLoading,
    error,
    setError,
    showPassword,
    setShowPassword,
    isCodeSent,
    setIsCodeSent,
    isPhoneVerified,
    setIsPhoneVerified,
    verificationCode,
    setVerificationCode,
    codeTimer,
    formData,
    setFormData,
    handleServiceToggle,
    handleSendCode,
    handleVerifyCode,
    handleSubmit,
    setLocation
  };
};
