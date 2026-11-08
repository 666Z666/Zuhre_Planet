/**
 * Unverified Membership Warning Component
 * Onaylanmamış üyelikler için uyarı ve 3 görsel kısıtlaması
 */

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnverifiedMembershipWarningProps {
  userStatus: 'guest' | 'pending' | 'approved';
  userTier: 'free' | 'gold' | 'platinum' | 'vip';
  totalMediaCount: number;
  visibleMediaCount: number; // Genellikle 3
  registrationDate?: Date;
  onCompleteProfile?: () => void;
  onUpgrade?: () => void;
  className?: string;
}

interface ProfileCompletionStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
}

export function UnverifiedMembershipWarning({
  userStatus,
  userTier,
  totalMediaCount,
  visibleMediaCount,
  registrationDate,
  onCompleteProfile,
  onUpgrade,
  className = '',
}: UnverifiedMembershipWarningProps) {
  const [showDetails, setShowDetails] = useState(true);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // Profil tamamlama adımları (örnek)
  const profileSteps: ProfileCompletionStep[] = [
    {
      id: 'email',
      title: 'E-posta Doğrulama',
      description: 'E-posta adresinizi doğrulayın',
      completed: true,
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
    },
    {
      id: 'phone',
      title: 'Telefon Doğrulama',
      description: 'Telefon numaranızı doğrulayın',
      completed: false,
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
    },
    {
      id: 'identity',
      title: 'Kimlik Doğrulama',
      description: 'Kimlik belgenizi yükleyin',
      completed: false,
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
    },
    {
      id: 'profile',
      title: 'Profil Bilgileri',
      description: 'Profil bilgilerinizi tamamlayın',
      completed: false,
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
    },
  ];

  const completionPercentage = (profileSteps.filter((s) => s.completed).length / profileSteps.length) * 100;
  const daysRemaining = registrationDate
    ? Math.max(0, 30 - Math.floor((Date.now() - registrationDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 30;

  // Onaylanmamış üyelik değilse gösterme
  if (userStatus !== 'pending') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-4 ${className}`}
    >
      {/* Ana Uyarı Kartı */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-white mb-1">⏳ Profiliniz Onay Beklemede</h3>
            <p className="text-yellow-300/70 text-sm mb-3">
              Profiliniz tamamen onaylanana kadar bazı özellikler kısıtlıdır. Profil tamamlama adımlarını tamamlayarak onay sürecini hızlandırabilirsiniz.
            </p>

            {/* Tamamlama Çubuğu */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-yellow-300/70">Profil Tamamlama</span>
                <span className="text-yellow-400 font-bold">{Math.round(completionPercentage)}%</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                />
              </div>
            </div>

            {/* Kalan Gün */}
            <p className="text-xs text-yellow-300/60 mt-2">
              ⏱️ Onay için {daysRemaining} gün kaldı
            </p>
          </div>
        </div>
      </div>

      {/* Medya Kısıtlama Uyarısı */}
      {totalMediaCount > visibleMediaCount && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-4 flex items-start gap-3"
        >
          <Zap className="w-5 h-5 text-gold-400 mt-1 flex-shrink-0" />
          <div>
            <p className="text-gold-300 text-sm font-bold mb-1">📸 Medya Kısıtlaması</p>
            <p className="text-gold-300/70 text-xs">
              Onaylanmamış üyelikler olarak sadece <span className="font-bold">{visibleMediaCount} fotoğraf</span> görebilirsiniz.
              Profiliniz onaylandığında <span className="font-bold">{totalMediaCount} fotoğrafın tamamını</span> görebileceksiniz.
            </p>
          </div>
        </motion.div>
      )}

      {/* Profil Tamamlama Adımları */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-2"
        >
          <h4 className="font-bold text-white text-sm mb-3">✓ Profil Tamamlama Adımları</h4>
          {profileSteps.map((step) => (
            <motion.div
              key={step.id}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              className="p-3 rounded-lg border border-white/10 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {step.icon}
                  <div>
                    <p className={`text-sm font-bold ${
                      step.completed ? 'text-green-400' : 'text-white'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-white/40">{step.description}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedStep === step.id ? 180 : 0 }}
                >
                  <ArrowRight className="w-4 h-4 text-white/40" />
                </motion.div>
              </div>

              {/* Detaylar */}
              <AnimatePresence>
                {expandedStep === step.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-white/10 text-xs text-white/60 space-y-2"
                  >
                    {step.id === 'email' && (
                      <p>✓ E-posta adresiniz başarıyla doğrulanmıştır.</p>
                    )}
                    {step.id === 'phone' && (
                      <div>
                        <p>Telefon numaranızı doğrulamak için:</p>
                        <ol className="list-decimal list-inside space-y-1 mt-2">
                          <li>Ayarlar → Telefon Doğrulama</li>
                          <li>SMS kodunu girin</li>
                          <li>Doğrulama tamamlanır</li>
                        </ol>
                        <button className="mt-3 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase hover:bg-emerald-500/30 transition-all">
                          Doğrula
                        </button>
                      </div>
                    )}
                    {step.id === 'identity' && (
                      <div>
                        <p>Kimlik doğrulaması için:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          <li>Pasaport veya Kimlik Kartı</li>
                          <li>Açık ve net fotoğraf</li>
                          <li>Her iki tarafı da yükleyin</li>
                        </ul>
                        <button className="mt-3 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase hover:bg-emerald-500/30 transition-all">
                          Yükle
                        </button>
                      </div>
                    )}
                    {step.id === 'profile' && (
                      <div>
                        <p>Profil bilgilerinizi tamamlayın:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          <li>Profil fotoğrafı</li>
                          <li>Biyografi</li>
                          <li>Konum bilgileri</li>
                          <li>İletişim tercihleri</li>
                        </ul>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompleteProfile?.();
                          }}
                          className="mt-3 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase hover:bg-emerald-500/30 transition-all"
                        >
                          Tamamla
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tier Yükseltme Önerisi */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3"
      >
        <Zap className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-emerald-300 text-sm font-bold mb-2">💎 Tier Yükselterek Avantajlar Kazanın</p>
          <p className="text-emerald-300/70 text-xs mb-3">
            Gold tier veya üzeri ile tüm medyalara erişim, iletişim seçenekleri ve daha fazla özellik açılacaktır.
          </p>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white text-xs font-bold uppercase transition-all"
          >
            Gold Tier'e Yükselt
          </button>
        </div>
      </motion.div>

      {/* Detayları Gizle/Göster */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase hover:bg-white/10 transition-all"
      >
        {showDetails ? '▼ Detayları Gizle' : '▶ Detayları Göster'}
      </button>
    </motion.div>
  );
}

export default UnverifiedMembershipWarning;


