/**
 * Credit-Based Chat Component
 * Kredili mesajlaşma sistemi ile entegre chat arayüzü
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Zap,
  AlertCircle,
  Gift,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  creditUsed: number;
  isFreeMessage: boolean;
  isRead: boolean;
}

interface CreditBasedChatProps {
  recipientName: string;
  recipientMemberId: string;
  currentUserTier: 'free' | 'gold' | 'platinum' | 'vip';
  userCredits: number;
  dailyFreeMessagesLeft: number;
  dailyFreeMessagesLimit: number;
  onSendMessage?: (message: string, isFree: boolean) => Promise<void>;
  className?: string;
}

/**
 * Kredi Maliyeti Hesaplaması
 */
const CREDIT_COSTS = {
  free: 1,
  gold: 1, // 0.9x = 1
  platinum: 1, // 0.8x = 1
  vip: 1, // 0.7x = 1
};

export function CreditBasedChat({
  recipientName,
  recipientMemberId,
  currentUserTier,
  userCredits,
  dailyFreeMessagesLeft,
  dailyFreeMessagesLimit,
  onSendMessage,
  className = '',
}: CreditBasedChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'other',
      senderName: recipientName,
      content: 'Merhaba! Nasılsın?',
      timestamp: new Date(Date.now() - 5 * 60000),
      creditUsed: 0,
      isFreeMessage: true,
      isRead: true,
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Sen',
      content: 'İyiyim, teşekkürler!',
      timestamp: new Date(Date.now() - 3 * 60000),
      creditUsed: 0,
      isFreeMessage: true,
      isRead: true,
    },
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [_showCreditWarning, setShowCreditWarning] = useState(false);
  const [selectedMessageType, setSelectedMessageType] = useState<'free' | 'paid'>('free');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const creditCost = CREDIT_COSTS[currentUserTier];
  const canSendFreeMessage = dailyFreeMessagesLeft > 0;
  const canSendPaidMessage = userCredits >= creditCost;
  const canSendMessage = canSendFreeMessage || canSendPaidMessage;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !canSendMessage) {
      return;
    }

    const isFree = selectedMessageType === 'free' && canSendFreeMessage;

    setIsSending(true);

    try {
      await onSendMessage?.(messageInput, isFree);

      // Mesaj ekle
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: 'me',
        senderName: 'Sen',
        content: messageInput,
        timestamp: new Date(),
        creditUsed: isFree ? 0 : creditCost,
        isFreeMessage: isFree,
        isRead: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput('');
      setShowCreditWarning(false);
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-black/20 border border-white/10 rounded-2xl overflow-hidden ${className}`}>
      {/* Başlık */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-b border-white/10 p-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white text-sm">{recipientName}</h2>
          <p className="text-[10px] text-white/40">{recipientMemberId}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <span className="text-emerald-400 font-black text-xs">{userCredits} Kredi</span>
          </div>
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl ${
                  msg.senderId === 'me'
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-white'
                    : 'bg-white/5 border border-white/10 text-white/80'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-white/40">
                  <span>{msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.isFreeMessage && (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500/20 rounded-full">
                      <Gift className="w-2.5 h-2.5 text-green-400" />
                      <span className="text-green-400 font-bold">Ücretsiz</span>
                    </div>
                  )}
                  {msg.creditUsed > 0 && (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-500/20 rounded-full">
                      <Zap className="w-2.5 h-2.5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{msg.creditUsed}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Kredi Bilgisi */}
      <div className="border-t border-white/10 p-4 space-y-3">
        {/* Günlük Ücretsiz Mesaj */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-400" />
              <span className="text-xs font-bold text-green-400">Günlük Ücretsiz Mesaj</span>
            </div>
            <span className="text-xs font-black text-green-400">
              {dailyFreeMessagesLeft}/{dailyFreeMessagesLimit}
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
              style={{
                width: `${(dailyFreeMessagesLeft / dailyFreeMessagesLimit) * 100}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-green-300/70 mt-1.5">
            {dailyFreeMessagesLeft > 0
              ? `${dailyFreeMessagesLeft} ücretsiz mesaj kaldı. Saat 00:00'da sıfırlanır.`
              : 'Günlük ücretsiz mesaj hakkınız tükendi. Kredi kullanarak devam edebilirsiniz.'}
          </p>
        </div>

        {/* Kredi Durumu */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Kredi Bakiyesi</span>
            </div>
            <span className="text-xs font-black text-emerald-400">{userCredits} Kredi</span>
          </div>
          <p className="text-[10px] text-emerald-300/70">
            Her mesaj <span className="font-bold">{creditCost} kredi</span> kullanır.
            {currentUserTier !== 'free' && (
              <>
                {' '}
                <span className="text-green-400 font-bold">
                  ({Math.round((1 - creditCost / 1) * 100)}% indirim)
                </span>
              </>
            )}
          </p>
        </div>

        {/* Uyarılar */}
        {!canSendMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-400">Mesaj Gönderilemez</p>
              <p className="text-[10px] text-red-300/70 mt-0.5">
                {!canSendFreeMessage && !canSendPaidMessage
                  ? 'Ücretsiz mesaj hakkınız tükendi ve kredi yetersiz.'
                  : !canSendFreeMessage
                    ? 'Ücretsiz mesaj hakkınız tükendi. Kredi satın alın.'
                    : 'Kredi yetersiz. Kredi satın alın.'}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mesaj Giriş Alanı */}
      <div className="border-t border-white/10 p-4 space-y-3">
        {/* Mesaj Türü Seçimi */}
        {canSendFreeMessage && canSendPaidMessage && (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMessageType('free')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                selectedMessageType === 'free'
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              <Gift className="w-3 h-3 inline mr-1" />
              Ücretsiz
            </button>
            <button
              onClick={() => setSelectedMessageType('paid')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                selectedMessageType === 'paid'
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              <Zap className="w-3 h-3 inline mr-1" />
              {creditCost} Kredi
            </button>
          </div>
        )}

        {/* Mesaj Input */}
        <div className="flex gap-2">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            rows={2}
            disabled={!canSendMessage || isSending}
            className="flex-1 bg-black/30 border border-white/10 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-white text-sm outline-none transition-all resize-none placeholder:text-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!canSendMessage || !messageInput.trim() || isSending}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isSending ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Bilgi */}
        <div className="text-[10px] text-white/30 flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Shift+Enter = Yeni satır | Enter = Gönder</span>
        </div>
      </div>
    </div>
  );
}

export default CreditBasedChat;
