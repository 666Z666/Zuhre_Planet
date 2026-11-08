/**
 * Contact Request Manager Component
 * Escort iletişim gizliliği ve iletişim istekleri
 */

import React, { useState } from 'react';
import { MessageSquare, Phone, MessageCircle, Send, Check, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactRequestManagerProps {
  escortId: string;
  escortName: string;
  userTier: 'free' | 'gold' | 'platinum' | 'vip';
  userStatus: 'guest' | 'pending' | 'approved';
  escortPrivacySettings: {
    hidePhoneNumber: boolean;
    allowPhoneContact: boolean;
    allowWhatsAppContact: boolean;
    allowTelegramContact: boolean;
    allowSiteMessageOnly: boolean;
  };
  onRequestSend?: (method: string, message: string) => Promise<void>;
  className?: string;
}

type ContactMethod = 'phone' | 'whatsapp' | 'telegram' | 'site_message';
type RequestStatus = 'idle' | 'pending' | 'accepted' | 'rejected' | 'expired';

interface ContactRequest {
  id: string;
  method: ContactMethod;
  message: string;
  status: RequestStatus;
  createdAt: Date;
  expiresAt: Date;
  response?: string;
}

export function ContactRequestManager({
  escortId,
  escortName,
  userTier,
  userStatus,
  escortPrivacySettings,
  onRequestSend,
  className = '',
}: ContactRequestManagerProps) {
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Erişim kontrolü
  const canRequestContact = userStatus === 'approved' && userTier !== 'free';
  const canAccessPhone = userTier === 'platinum' || userTier === 'vip';
  const canAccessWhatsApp = userTier === 'gold' || userTier === 'platinum' || userTier === 'vip';
  const canAccessTelegram = userTier === 'gold' || userTier === 'platinum' || userTier === 'vip';

  // İletişim seçenekleri
  const contactOptions = [
    {
      method: 'phone' as ContactMethod,
      label: 'Telefon',
      icon: Phone,
      available: canAccessPhone && escortPrivacySettings.allowPhoneContact,
      requiresTier: 'platinum',
      color: 'from-green-500 to-emerald-500',
    },
    {
      method: 'whatsapp' as ContactMethod,
      label: 'WhatsApp',
      icon: MessageCircle,
      available: canAccessWhatsApp && escortPrivacySettings.allowWhatsAppContact,
      requiresTier: 'gold',
      color: 'from-green-400 to-emerald-400',
    },
    {
      method: 'telegram' as ContactMethod,
      label: 'Telegram',
      icon: Send,
      available: canAccessTelegram && escortPrivacySettings.allowTelegramContact,
      requiresTier: 'gold',
      color: 'from-blue-500 to-emerald-500',
    },
    {
      method: 'site_message' as ContactMethod,
      label: 'Site Mesajı',
      icon: MessageSquare,
      available: true,
      requiresTier: 'free',
      color: 'from-gold-500 to-pink-500',
    },
  ];

  const handleSendRequest = async () => {
    if (!selectedMethod || !message.trim()) {
      alert('Lütfen iletişim yöntemini seçin ve mesaj yazın');
      return;
    }

    setIsLoading(true);
    try {
      await onRequestSend?.(selectedMethod, message);

      // İstek listesine ekle
      const newRequest: ContactRequest = {
        id: `req-${Date.now()}`,
        method: selectedMethod,
        message,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
      };
      setRequests([newRequest, ...requests]);

      // Formu sıfırla
      setSelectedMethod(null);
      setMessage('');
      setShowForm(false);
    } catch (error) {
      console.error('İstek gönderme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Erişim reddi mesajı
  if (!canRequestContact) {
    return (
      <div className={`bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 ${className}`}>
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-white mb-2">İletişim İsteği Gönderilemiyor</h3>
            {userStatus !== 'approved' && (
              <p className="text-yellow-300/70 text-sm mb-3">
                İletişim istekleri göndermek için profiliniz onaylanmalıdır.
              </p>
            )}
            {userTier === 'free' && (
              <p className="text-yellow-300/70 text-sm mb-3">
                İletişim istekleri göndermek için en az Gold tier gereklidir.
              </p>
            )}
            <button className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase hover:bg-yellow-500/30 transition-all">
              Tier Yükselt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Başlık */}
      <div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-gold-400" />
          İletişim İsteği Gönder
        </h2>
        <p className="text-white/40 text-sm mt-1">{escortName} ile iletişime geç</p>
      </div>

      {/* İletişim Seçenekleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contactOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMethod === option.method;
          const isDisabled = !option.available;

          return (
            <motion.button
              key={option.method}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={() => !isDisabled && setSelectedMethod(option.method)}
              disabled={isDisabled}
              className={`relative px-4 py-3 rounded-xl font-bold text-sm uppercase transition-all ${
                isSelected
                  ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                  : isDisabled
                  ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 inline mr-2" />
              {option.label}
              {isDisabled && (
                <span className="absolute top-1 right-1 text-xs bg-red-500/20 border border-red-500/30 text-red-300 px-2 py-1 rounded">
                  {option.requiresTier}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Gizlilik Bilgisi */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-2">
        <p className="text-blue-300 text-xs font-bold">🔒 Gizlilik Bilgisi</p>
        <ul className="text-blue-300/70 text-xs space-y-1">
          {escortPrivacySettings.hidePhoneNumber && (
            <li>• Telefon numarası gizlidir - İstek göndererek iletişim kurabilirsiniz</li>
          )}
          {escortPrivacySettings.allowSiteMessageOnly && (
            <li>• Escort sadece site mesajlaşması aracılığıyla iletişim kurmayı tercih ediyor</li>
          )}
          <li>• İletişim istekleri 7 gün içinde yanıtlanacaktır</li>
          <li>• Mesajlarınız gizli tutulacaktır</li>
        </ul>
      </div>

      {/* İstek Formu */}
      <AnimatePresence>
        {showForm && selectedMethod && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3"
          >
            <h3 className="font-bold text-white text-sm">İletişim İsteği</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mesajınızı yazın (isteğe bağlı)..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 font-bold text-sm uppercase hover:bg-white/10 transition-all"
              >
                İptal
              </button>
              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-pink-500 hover:from-gold-400 hover:to-pink-400 text-white font-bold text-sm uppercase disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gönder Butonu */}
      {!showForm && selectedMethod && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-pink-500 hover:from-gold-400 hover:to-pink-400 text-white font-bold text-sm uppercase transition-all"
        >
          <Send className="w-4 h-4 inline mr-2" />
          İstek Gönder
        </button>
      )}

      {/* İstek Geçmişi */}
      {requests.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm">İstek Geçmişi</h3>
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/20 border border-white/10 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    request.status === 'accepted' ? 'bg-green-500' :
                    request.status === 'rejected' ? 'bg-red-500' :
                    request.status === 'pending' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="text-xs font-bold text-white/60 uppercase">
                    {request.method === 'site_message' ? 'Site Mesajı' : request.method}
                  </span>
                </div>
                <span className="text-xs text-white/40">
                  {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
              {request.message && (
                <p className="text-xs text-white/60 italic">\"{ request.message}\"</p>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className={`text-xs font-bold uppercase ${
                  request.status === 'accepted' ? 'text-green-400' :
                  request.status === 'rejected' ? 'text-red-400' :
                  request.status === 'pending' ? 'text-yellow-400' :
                  'text-white/40'
                }`}>
                  {request.status === 'accepted' ? '✓ Kabul Edildi' :
                   request.status === 'rejected' ? '✗ Reddedildi' :
                   request.status === 'pending' ? '⏳ Bekleniyor' :
                   '⏱️ Süresi Doldu'}
                </span>
                {request.response && (
                  <span className="text-xs text-white/40">Yanıt: {request.response}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContactRequestManager;


