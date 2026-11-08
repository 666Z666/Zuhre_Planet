/**
 * Interactions Center Component
 * Escort'lar için mesajlar, bildirimler ve müşteri etkileşimleri merkezi.
 */

import React, { useState, useMemo } from 'react';
import { MessageCircle, Bell, Star, Calendar, User, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  customerId: string;
  customerName: string;
  customerPhoto: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'message' | 'booking_request' | 'review' | 'payment';
}

interface InteractionsCenterProps {
  escortId: string;
  className?: string;
}

const mockMessages: Message[] = [
  {
    id: 'm1',
    customerId: 'cust-001',
    customerName: 'Ahmet K.',
    customerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet',
    content: 'Merhaba, bu hafta sonu müsait misiniz?',
    timestamp: '2026-04-03T14:30:00Z',
    isRead: false,
    type: 'message',
  },
  {
    id: 'm2',
    customerId: 'cust-002',
    customerName: 'Mehmet Y.',
    customerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mehmet',
    content: 'Randevu talebiniz onaylandı',
    timestamp: '2026-04-03T12:15:00Z',
    isRead: true,
    type: 'booking_request',
  },
  {
    id: 'm3',
    customerId: 'cust-003',
    customerName: 'Fatih D.',
    customerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatih',
    content: 'Harika bir deneyimdi! 5 yıldız veriyorum.',
    timestamp: '2026-04-02T18:45:00Z',
    isRead: true,
    type: 'review',
  },
];

export function InteractionsCenter({ escortId, className = '' }: InteractionsCenterProps) {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'booking' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return mockMessages.filter((msg) => {
      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'unread' && !msg.isRead) ||
        (filterType === 'booking' && msg.type === 'booking_request') ||
        (filterType === 'review' && msg.type === 'review');

      const matchesSearch =
        msg.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.content.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [filterType, searchQuery]);

  const unreadCount = useMemo(() => mockMessages.filter((m) => !m.isRead).length, []);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'booking_request':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-400" />;
      default:
        return <MessageCircle className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'booking_request':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'review':
        return 'bg-amber-500/10 border-amber-500/20';
      default:
        return 'bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Başlık ve İstatistikler */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            Etkileşimler
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {unreadCount} okunmamış mesaj
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
              <span className="text-red-400 font-black text-sm">{unreadCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
          <input
            type="text"
            placeholder="Müşteri adı veya mesaj ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none transition-all placeholder:text-white/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'unread', 'booking', 'review'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filterType === f
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              {f === 'all' ? 'Tümü' : f === 'unread' ? 'Okunmamış' : f === 'booking' ? 'Randevu' : 'Yorum'}
            </button>
          ))}
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-black/20 border border-white/10 rounded-2xl p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-white/10" />
            <p className="text-white/30 font-bold uppercase italic">Mesaj bulunamadı</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedMessage(message.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedMessage === message.id
                    ? `${getMessageColor(message.type)} border-opacity-100`
                    : 'bg-black/20 border-white/10 hover:border-white/20'
                } ${!message.isRead ? 'ring-1 ring-emerald-500/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-emerald-500/20 to-blue-500/20 shrink-0">
                    <img
                      src={message.customerPhoto}
                      alt={message.customerName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm">{message.customerName}</h4>
                      <div className="flex items-center gap-1.5">
                        {getMessageIcon(message.type)}
                        {!message.isRead && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-white/60 text-xs truncate">{message.content}</p>
                    <p className="text-white/30 text-[10px] mt-1">
                      {new Date(message.timestamp).toLocaleDateString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Seçili Mesaj Detayı */}
      {selectedMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 border border-white/10 rounded-2xl p-6"
        >
          {(() => {
            const msg = mockMessages.find((m) => m.id === selectedMessage);
            return msg ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{msg.customerName}</h3>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-white/40 hover:text-white/70 text-sm"
                  >
                    Kapat
                  </button>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{msg.content}</p>
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase transition-all hover:bg-emerald-500/30">
                    Yanıtla
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase transition-all hover:bg-white/10">
                    Arşivle
                  </button>
                </div>
              </div>
            ) : null;
          })()}
        </motion.div>
      )}
    </div>
  );
}

export default InteractionsCenter;
