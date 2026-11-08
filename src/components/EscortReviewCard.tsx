import React from 'react';
import { Star, User, Calendar, MessageCircle } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  comment?: string;
  reviewer: {
    id: number;
    fullName?: string;
  };
  createdAt: Date;
  visibility: 'public' | 'private';
}

interface EscortReviewCardProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  isApprovedCustomer?: boolean;
}

/**
 * Escort Profil Sayfası - Yorum ve Puanlama Bileşeni
 * 
 * Escort'un aldığı yorumları ve ortalama puanlamayı gösterir
 */
export const EscortReviewCard: React.FC<EscortReviewCardProps> = ({
  reviews,
  averageRating,
  reviewCount,
  isApprovedCustomer = false,
}) => {
  // Yıldız oluştur
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-lg p-6 border bg-secondary border-primary">
      {/* Ortalama Puanlama Özeti */}
      <div className="mb-6 pb-6 border-b border-primary">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          Müşteri Yorumları
        </h3>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-gold">
              {averageRating.toFixed(1)}
            </div>
            <div className="mt-2">
              {renderStars(averageRating)}
            </div>
            <div className="text-sm mt-2 text-secondary">
              {reviewCount} yorum
            </div>
          </div>

          <div className="flex-1">
            {/* Puan dağılımı */}
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter(r => r.rating === stars).length;
              const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-2 mb-2">
                  <span className="text-sm w-8 text-secondary">
                    {stars}★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-primary-border">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-gold"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm w-8 text-right text-secondary">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Yorumlar Listesi */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center py-8 text-secondary">
            Henüz yorum yok
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-lg border bg-primary border-primary"
            >
              {/* Yorum Başlığı */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary">
                    <User size={20} className="text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        {review.reviewer.fullName || 'Anonim'}
                      </span>
                      {isApprovedCustomer && (
                        <span className="badge badge-verified text-xs">Onaylı Müşteri</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-secondary">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-tertiary">
                  <Calendar size={14} />
                  {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </div>

              {/* Yorum Metni */}
              {review.comment && (
                <p className="text-sm leading-relaxed text-secondary">
                  {review.comment}
                </p>
              )}

              {/* Gizlilik Göstergesi */}
              {review.visibility === 'private' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-tertiary">
                  <MessageCircle size={12} />
                  Sadece Escort tarafından görülebilir
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EscortReviewCard;
