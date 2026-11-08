/**
 * Client Registration Page
 * Multi-step registration flow for new customers to create platform accounts.
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, AlertCircle, ArrowLeft, Sparkles, Crown } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useClientRegisterForm } from '@/hooks/useClientRegisterForm';
import { Step1Account } from '@/components/register/client/Step1Account';
import { Step2Phone } from '@/components/register/client/Step2Phone';
import { Step3Profile } from '@/components/register/client/Step3Profile';

export default function ClientRegister() {
  const {
    currentStep,
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
  } = useClientRegisterForm();

  const steps = [
    { number: 1, title: 'Hesap Bilgileri' },
    { number: 2, title: 'Telefon Doğrulama' },
    { number: 3, title: 'Profil Bilgileri' },
  ];

  return (
    <div className="min-h-screen bg-transparent relative w-full overflow-hidden flex flex-col pt-12">
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 py-24">
        <div className="w-full max-w-xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <button
              onClick={() => setLocation('/login')}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Giriş sayfasına dön
            </button>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-black text-white text-3d-premium">Müşteri Kayıt Ol</h1>
            </div>
            <p className="text-white/60 font-black uppercase tracking-wider text-[10px] italic text-glow">Ücretsiz üyelik oluşturun ve aramaya başlayın</p>
          </motion.div>

          {/* Progress Steps */}
          <Card className="card-premium mb-6 bg-black/40 border-primary/20 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                        ${currentStep > step.number ? 'bg-green-500 text-white' : ''}
                        ${currentStep === step.number ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : ''}
                        ${currentStep < step.number ? 'bg-muted text-muted-foreground' : ''}`}
                      >
                        {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                      </div>
                      <span
                        className={`text-xs mt-1 hidden sm:block ${
                          currentStep === step.number ? 'text-primary font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 rounded-full transition-colors ${
                          currentStep > step.number ? 'bg-green-500' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card className="card-premium bg-black/40 border-primary/20 backdrop-blur-md overflow-hidden">
            <CardContent className="p-6 md:p-8">
              {errors.form && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-400">{errors.form}</p>
                </div>
              )}

              {currentStep === 1 && (
                <Step1Account
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  setErrors={setErrors}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  passwordStrength={passwordStrength}
                  getStrengthColor={getStrengthColor}
                  onNext={nextStep}
                  onCancel={() => setLocation('/login')}
                />
              )}

              {currentStep === 2 && (
                <Step2Phone
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  isCodeSent={isCodeSent}
                  verificationCode={verificationCode}
                  setVerificationCode={setVerificationCode}
                  isVerified={isVerified}
                  codeTimer={codeTimer}
                  handleSendCode={handleSendCode}
                  handleVerifyCode={handleVerifyCode}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}

              {currentStep === 3 && (
                <Step3Profile
                  formData={formData}
                  setFormData={setFormData}
                  isLoading={isLoading}
                  errors={errors}
                  handleReferralCodeCheck={handleReferralCodeCheck}
                  handleSubmit={handleSubmit}
                  onPrev={prevStep}
                />
              )}
            </CardContent>
          </Card>

          {/* VIP CTA */}
          <Card className="mt-12 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30">
            <CardContent className="p-8 text-center text-white">
              <Crown className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black mb-2">VIP Gezgin Olun</h3>
              <p className="text-sm text-gray-400 mb-6">Ayrıcalıklı dünyamıza katılın.</p>
              <Button variant="outline" className="border-emerald-500/50 text-emerald-400 px-8 rounded-xl h-12">
                KEŞFET
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
