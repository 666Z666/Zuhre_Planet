/**
 * Customer Reviews Page
 *
 * Müşterinin yazdığı yorumları ve değerlendirmeleri görüntüler.
 * Mock verilerle tam işlevsel UI, kozmik tema.
 *
 * @module pages/customer/CustomerReviews
 */

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import {
  Star, ThumbsUp, Award, MessageSquare, Heart,
  Edit2, Trash2, ChevronDown, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '@/pages/SEO';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockEscorts } from '@/data/mockData/escorts';

const mockReviews = [
  {
    id: 'r1',
    escortId: 'esc-001',
    escortName: 'Ayşe',
    escortPhoto: mockEscorts[0]?.profilePhoto,
    rating: 5,
    comment: 'Muhteşem bir deneyimdi. Çok profesyonel ve nazik. Kesinlikle tavsiye ederim. Randevu zamanında geldi ve her konuda çok özenli davrandı.',
    date: '2026-03-22',
    service: 'Akşam Yemeği Eşliği',
    helpfulCount: 12,
    isHelpful: false,
    isEditable: true,
  },
  {
    id: 'r2',
    escortId: 'esc-002',
    escortName: 'Zeynep',
    escortPhoto: mockEscorts[1]?.profilePhoto,
    rating: 4,
    comment: 'Çok güzel bir vakit geçirdik. Biraz geç kaldı ama genel olarak memnun kaldım. Tekrar görüşmek isterim.',
    date: '2026-03-15',
    service: 'Etkinlik Eşliği',
    helpfulCount: 8,
    isHelpful: true,
    isEditable: true,
  },
  {
    id: 'r3',
    escortId: 'esc-003',
    escortName: 'Elif',
    escortPhoto: mockEscorts[2]?.profilePhoto,
    rating: 5,
    comment: 'Harika bir deneyim. Çok sempatik ve eğlenceli. Kesinlikle tekrar görüşeceğiz.',
    date: '2026-02-28',
    service: 'Özel Davet',
    helpfulCount: 5,
    isHelpful: false,
    isEditable: false,
  },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${starSize} ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`}
        />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const { isAdmin } = useAuth();
  const [helpfulIds, setHelpfulIds] = useState<string[]>(
    mockReviews.filter((r) => r.isHelpful).map((r) => r.id)
  );
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const reviews = useMemo(
    () => mockReviews.filter((r) => !deletedIds.includes(r.id)),
    [deletedIds]
  );

  const avgRating = useMemo(
    () => reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1),
    [reviews]
  );

  const toggleHelpful = (id: string) => {
    setHelpfulIds((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  return (
    <ProtectedRoute accessLevel={isAdmin ? 'admin' : 'customer'}>
      <CustomerDashboardLayout>
        <SEO
          title="Değerlendirmelerim | Müşteri Paneli"
          description="Yazdığınız tüm değerlendirmeleri görüntüleyin ve yönetin."
        />

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Başlık */}
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400/30" />
              Değerlendirmelerim
            </h1>
            <p className="text-white/40 text-sm mt-1">Yazdığınız tüm yorumlar</p>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Star, value: reviews.length, label: 'Toplam Yorum', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              { icon: ThumbsUp, value: reviews.reduce((s, r) => s + r.helpfulCount, 0), label: 'Faydalı Oy', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
              { icon: Award, value: reviews.filter((r) => r.rating === 5).length, label: 'Mükemmel Yorum', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { icon: Heart, value: avgRating.toFixed(1), label: 'Ortalama Puan', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${stat.bg} border ${stat.border} rounded-2xl p-4 text-center`}
              >
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-white/40 text-xs mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Yorum Listesi */}
          <AnimatePresence>
            {reviews.length === 0 ? (
              <div className="bg-black/20 border border-white/10 rounded-2xl p-16 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/10" />
                <h3 className="font-black text-xl text-white/60 uppercase italic mb-2">Henüz Yorum Yok</h3>
                <p className="text-white/30 text-sm">
                  Randevularınızı tamamladıktan sonra değerlendirme yazabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-black/20 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Escort Fotoğrafı */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-500/20 shrink-0">
                        <img
                          src={review.escortPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.escortName}`}
                          alt={review.escortName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.escortName}`;
                          }}
                        />
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-bold text-white">{review.escortName}</h4>
                            <p className="text-white/40 text-xs">{review.service}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="text-white/30 text-xs">
                              {new Date(review.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <p className="text-white/70 text-sm leading-relaxed mb-3">{review.comment}</p>

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <button
                            onClick={() => toggleHelpful(review.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              helpfulIds.includes(review.id)
                                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            Faydalı ({review.helpfulCount + (helpfulIds.includes(review.id) && !review.isHelpful ? 1 : 0)})
                          </button>

                          {review.isEditable && (
                            <div className="flex gap-2">
                              <button className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium transition-all hover:bg-blue-500/20 flex items-center gap-1">
                                <Edit2 className="w-3 h-3" />
                                Düzenle
                              </button>
                              <button
                                onClick={() => setDeletedIds((prev) => [...prev, review.id])}
                                className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium transition-all hover:bg-red-500/20 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Sil
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}
