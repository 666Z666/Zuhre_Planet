/**
 * Escort Registration Page
 * 
 * Comprehensive multi-step registration flow for new escort service providers.
 * Refactored to use modular step components and a custom hook for state management.
 */

import { motion } from 'framer-motion';
import { User, Phone, Check, FileText, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Footer } from '@/components/Footer';

// Hook
import { useEscortRegisterForm } from '@/hooks/useEscortRegisterForm';

// Components
import { RegisterProgress } from '@/components/register/escort/RegisterProgress';
import { Step1AccountInfo } from '@/components/register/escort/Step1AccountInfo';
import { Step2PhoneVerification } from '@/components/register/escort/Step2PhoneVerification';
import { Step3BasicInfo } from '@/components/register/escort/Step3BasicInfo';
import { Step4PhysicalFeatures } from '@/components/register/escort/Step4PhysicalFeatures';
import { Step5Services } from '@/components/register/escort/Step5Services';
import { Step6ReviewConfirm } from '@/components/register/escort/Step6ReviewConfirm';

export default function EscortRegister() {
  const {
    currentStep,
    nextStep,
    prevStep,
    isLoading,
    error,
    showPassword,
    setShowPassword,
    isCodeSent,
    isPhoneVerified,
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
  } = useEscortRegisterForm();

  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya',
    'Adana', 'Mersin', 'Konya', 'Gaziantep', 'Eskişehir'
  ];

  const serviceOptions = [
    'Masaj', 'Fantezi', 'Geyşa Masajı', 'Mutlu Son',
    'Vücut Masajı', 'Aromaterapi', 'Taş Masajı',
    'Spa Masajı', 'Thai Masajı', 'Balinese Masajı'
  ];

  const bodyTypes = ['Zayıf', 'Orta', 'Dolgun', 'Atletik', 'Balık Etli'];
  const hairColors = ['Sarı', 'Kahverengi', 'Siyah', 'Kızıl', 'Diğer'];
  const eyeColors = ['Mavi', 'Yeşil', 'Kahverengi', 'Ela', 'Siyah'];

  const steps = [
    { number: 1, title: 'Hesap', icon: User },
    { number: 2, title: 'Telefon', icon: Phone },
    { number: 3, title: 'Temel', icon: User },
    { number: 4, title: 'Fiziksel', icon: User },
    { number: 5, title: 'Hizmetler', icon: FileText },
    { number: 6, title: 'Onayla', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-transparent relative w-full overflow-hidden flex flex-col pt-12">
      <div className="relative z-10 py-16">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <button
              onClick={() => setLocation('/escort/login')}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş sayfasına dön
            </button>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-sensual text-shadow-3d-white">Escort Kayıt Ol</h1>
            <p className="text-white/70 italic tracking-wide text-shadow-premium">Profilinizi adım adım oluşturun ve galakside parlamaya başlayın</p>
          </motion.div>

          {/* Progress Indicator */}
          <RegisterProgress currentStep={currentStep} steps={steps} />

          {/* Error Display */}
          {error && (
            <Card className="border-red-500/30 bg-red-500/10 mb-6">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Form Content */}
          <Card className="card-premium">
            <CardContent className="p-6 md:p-8">
              {currentStep === 1 && (
                <Step1AccountInfo
                  formData={formData}
                  setFormData={setFormData}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  onNext={nextStep}
                  onCancel={() => setLocation('/escort/login')}
                />
              )}

              {currentStep === 2 && (
                <Step2PhoneVerification
                  formData={formData}
                  setFormData={setFormData}
                  isCodeSent={isCodeSent}
                  isPhoneVerified={isPhoneVerified}
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                  codeTimer={codeTimer}
                  handleSendCode={handleSendCode}
                  handleVerifyCode={handleVerifyCode}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {currentStep === 3 && (
                <Step3BasicInfo
                  formData={formData}
                  setFormData={setFormData}
                  cities={cities}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {currentStep === 4 && (
                <Step4PhysicalFeatures
                  formData={formData}
                  setFormData={setFormData}
                  bodyTypes={bodyTypes}
                  hairColors={hairColors}
                  eyeColors={eyeColors}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {currentStep === 5 && (
                <Step5Services
                  formData={formData}
                  setFormData={setFormData}
                  serviceOptions={serviceOptions}
                  handleServiceToggle={handleServiceToggle}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}

              {currentStep === 6 && (
                <Step6ReviewConfirm
                  formData={formData}
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                  onBack={prevStep}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
