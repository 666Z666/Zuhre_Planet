import React, { useState } from 'react';
import { Star, MapPin, Clock, Heart, Share2, MessageCircle, ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: Date;
  isVerified: boolean;
}

interface DetailedListingData {
  id: number;
  stageName: string;
  age: number;
  city: string;
  rating: number;
  reviewCount: number;
  tier: 'free' | 'gold' | 'platinum' | 'vip';
  isVerified: boolean;
  description: string;
  images: string[];
  services: Service[];
  reviews: Review[];
  responseTime: string;
  availability: string;
}

interface DetailedListingPageProps {
  listing: DetailedListingData;
  onMessageClick?: () => void;
  onBookClick?: (serviceId: number) => void;
  onLikeClick?: () => void;
  isLiked?: boolean;
}

/**
 * Zenginleştirilmiş Detaylı İlan Sayfası
 * 
 * Tam ekran galeri, hizmetler ve rezervasyon paneli
 */
export const DetailedListingPage: React.FC<DetailedListingPageProps> = ({
  listing,
  onMessageClick,
  onBookClick,
  onLikeClick,
  isLiked = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'about' | 'services' | 'reviews'>('about');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      free: { bg: 'bg-gray-200', text: 'text-gray-800', icon: '⭐' },
      gold: { bg: 'bg-yellow-200', text: 'text-yellow-800', icon: '🏆' },
      platinum: { bg: 'bg-slate-300', text: 'text-slate-900', icon: '💎' },
      vip: { bg: 'bg-pink-200', text: 'text-pink-800', icon: '👑' },
    };
    return colors[tier] || colors.free;
  };

  const tierColor = getTierColor(listing.tier);

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #f0f4ff 100%)',
      }}
    >
      {/* Galeri Section */}
      <div className="relative h-screen bg-gray-900 overflow-hidden">
        <img
          src={listing.images[currentImageIndex]}
          alt={listing.stageName}
          className="w-full h-full object-cover"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Navigation Buttons */}
        {listing.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              title="Önceki Görsel"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all z-10 group"
            >
              <ChevronLeft size={32} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={nextImage}
              title="Sonraki Görsel"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all z-10 group"
            >
              <ChevronRight size={32} className="group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-black/50 backdrop-blur-md text-white text-sm font-semibold z-10">
          {currentImageIndex + 1} / {listing.images.length}
        </div>

        {/* Tier Badge */}
        <div
          className={`absolute top-8 left-8 px-6 py-3 rounded-full font-bold backdrop-blur-md border border-white/20 ${tierColor.bg} ${tierColor.text} text-lg z-10`}
        >
          {tierColor.icon} {listing.tier.toUpperCase()}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-8 right-8 flex gap-3 z-10">
          <button
            onClick={onLikeClick}
            title={isLiked ? "Beğenmekten Vazgeç" : "Beğen"}
            className={`p-4 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? 'bg-red-500/80 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button 
            title="Paylaş"
            className="p-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all"
          >
            <Share2 size={24} />
          </button>
        </div>

        {/* Thumbnail Gallery */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10 max-w-2xl overflow-x-auto px-4">
          {listing.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              title={`Görsel ${idx + 1}`}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                idx === currentImageIndex
                  ? 'border-white shadow-lg'
                  : 'border-white/30 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative -mt-20 z-20">
        {/* Header Card */}
        <div
          className="rounded-2xl p-8 backdrop-blur-xl border border-white/20 mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {listing.stageName}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={18} />
                      <span>{listing.city}</span>
                    </div>
                    <span>•</span>
                    <span>{listing.age} yaş</span>
                  </div>
                </div>
                {listing.isVerified && (
                  <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center gap-2">
                    ✓ Onaylı
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 pb-6 border-b border-white/30">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.round(listing.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {listing.rating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({listing.reviewCount} yorum)
                </span>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-100 to-blue-100">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock size={18} />
                    <span className="text-sm font-semibold">Yanıt Süresi</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {listing.responseTime}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-gold-100 to-pink-100">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar size={18} />
                    <span className="text-sm font-semibold">Uygunluk</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {listing.availability}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Users size={18} />
                    <span className="text-sm font-semibold">Hizmetler</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {listing.services.length}+ Seçenek
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Reservation Panel */}
            <div
              className="rounded-xl p-6 backdrop-blur-xl border border-white/20 h-fit sticky top-8"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hızlı Rezervasyon</h3>

              {selectedService ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-sm text-gray-600">Seçili Hizmet</p>
                    <p className="font-bold text-gray-900">{selectedService.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedService.duration} dakika • ₺{selectedService.price}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Tarih Seçin
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded-lg border border-white/30 bg-white/50 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Saat Seçin
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 rounded-lg border border-white/30 bg-white/50 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      onBookClick?.(selectedService.id);
                      setSelectedService(null);
                    }}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all"
                  >
                    Rezervasyon Yap
                  </button>

                  <button
                    onClick={() => setSelectedService(null)}
                    className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Hizmet seçerek başlayın</p>
                  {listing.services.slice(0, 3).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="w-full p-3 rounded-lg border border-white/30 hover:bg-emerald-50 hover:border-emerald-300 transition-all text-left"
                    >
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-600">
                          {service.duration} dakika
                        </span>
                        <span className="font-bold text-emerald-600">₺{service.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-white/30 space-y-3">
                <button
                  onClick={onMessageClick}
                  className="w-full py-2 rounded-lg border-2 border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/30">
          {(['about', 'services', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 font-semibold transition-all border-b-2 ${
                selectedTab === tab
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab === 'about' && 'Hakkında'}
              {tab === 'services' && 'Hizmetler'}
              {tab === 'reviews' && 'Yorumlar'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'about' && (
          <div
            className="rounded-2xl p-8 backdrop-blur-xl border border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hakkında</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
        )}

        {selectedTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listing.services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl p-6 backdrop-blur-xl border border-white/20 hover:shadow-lg transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={16} />
                    <span className="text-sm">{service.duration} dakika</span>
                  </div>
                  <button
                    onClick={() => setSelectedService(service)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all"
                  >
                    Seç
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div className="space-y-4">
            {listing.reviews.length === 0 ? (
              <div
                className="rounded-2xl p-8 backdrop-blur-xl border border-white/20 text-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <p className="text-gray-600">Henüz yorum yok</p>
              </div>
            ) : (
              listing.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl p-6 backdrop-blur-xl border border-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{review.author}</p>
                        {review.isVerified && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                            Onaylı
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(review.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedListingPage;
