import React, { useState } from 'react';
import { Star, MapPin, Clock, DollarSign, Heart, Share2, MessageCircle, ChevronLeft, ChevronRight, Shield, Award, Zap, Facebook, Instagram, Twitter, Phone, Mail, Globe } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

interface EscortProfileData {
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
  responseTime: string;
  averageRating: number;
  bannerImage?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  languages?: string[];
  specialties?: string[];
}

interface EnhancedEscortProfileProps {
  profile: EscortProfileData;
  isOwnProfile?: boolean;
  onMessageClick?: () => void;
  onBookClick?: () => void;
  onLikeClick?: () => void;
  isLiked?: boolean;
}

/**
 * Geliştirilmiş Escort Profil Sayfası
 * 
 * Banner, sosyal medya, interaktif bileşenler ve premium tasarım
 */
export const EnhancedEscortProfile: React.FC<EnhancedEscortProfileProps> = ({
  profile,
  isOwnProfile = false,
  onMessageClick,
  onBookClick,
  onLikeClick,
  isLiked = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'about' | 'services' | 'reviews' | 'gallery'>('about');
  const [showShareMenu, setShowShareMenu] = useState(false);

  const tabs = ['about', 'services', 'gallery', 'reviews'] as const;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % profile.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + profile.images.length) % profile.images.length);
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

  const tierColor = getTierColor(profile.tier);

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #f0f4ff 100%)',
      }}
    >
      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-gold-400 via-pink-400 to-red-400 overflow-hidden">
        {profile.bannerImage && (
          <img
            src={profile.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Tier Badge */}
        <div
          className={`absolute top-6 left-6 px-6 py-3 rounded-full font-bold backdrop-blur-md border border-white/20 ${tierColor.bg} ${tierColor.text} text-lg`}
        >
          {tierColor.icon} {profile.tier.toUpperCase()}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={onLikeClick}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? 'bg-red-500/80 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all"
            >
              <Share2 size={24} />
            </button>
            {showShareMenu && (
              <div
                className="absolute right-0 top-full mt-2 rounded-lg shadow-xl z-50 min-w-max"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <button className="w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center gap-2 text-sm text-gray-700">
                  <Facebook size={16} />
                  Facebook'ta Paylaş
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center gap-2 text-sm text-gray-700 border-t border-white/20">
                  <Instagram size={16} />
                  Instagram'da Paylaş
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center gap-2 text-sm text-gray-700 border-t border-white/20">
                  <Twitter size={16} />
                  Twitter'da Paylaş
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 py-8 relative -mt-20 z-20">
        <div
          className="rounded-2xl p-8 backdrop-blur-xl border border-white/20 mb-8"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Profile Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-gray-900">
                      {profile.stageName}
                    </h1>
                    {profile.isVerified && (
                      <Shield size={32} className="text-blue-600" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={18} />
                      <span>{profile.city}</span>
                    </div>
                    <span>•</span>
                    <span>{profile.age} yaş</span>
                  </div>

                  {/* Languages & Specialties */}
                  {(profile.languages || profile.specialties) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.languages?.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                        >
                          🗣️ {lang}
                        </span>
                      ))}
                      {profile.specialties?.map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700"
                        >
                          ✨ {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 pb-6 border-b border-white/30">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.round(profile.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {profile.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({profile.reviewCount} yorum)
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div
                  className="p-4 rounded-lg backdrop-blur-md border border-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock size={18} />
                    <span className="text-sm font-semibold">Yanıt Süresi</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {profile.responseTime}
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg backdrop-blur-md border border-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Zap size={18} />
                    <span className="text-sm font-semibold">Hizmet</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {profile.services.length}+ Hizmet
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg backdrop-blur-md border border-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Award size={18} />
                    <span className="text-sm font-semibold">Tier</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {profile.tier.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Contact & Social */}
            <div className="space-y-4">
              {/* Contact Info */}
              {(profile.contactInfo?.phone || profile.contactInfo?.email) && (
                <div
                  className="rounded-xl p-4 backdrop-blur-xl border border-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <h3 className="font-bold text-gray-900 mb-3">İletişim</h3>
                  {profile.contactInfo?.phone && (
                    <a
                      href={`tel:${profile.contactInfo.phone}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors mb-2"
                    >
                      <Phone size={16} />
                      <span className="text-sm">{profile.contactInfo.phone}</span>
                    </a>
                  )}
                  {profile.contactInfo?.email && (
                    <a
                      href={`mailto:${profile.contactInfo.email}`}
                      className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors"
                    >
                      <Mail size={16} />
                      <span className="text-sm">{profile.contactInfo.email}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Social Links */}
              {profile.socialLinks && (
                <div
                  className="rounded-xl p-4 backdrop-blur-xl border border-white/20"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <h3 className="font-bold text-gray-900 mb-3">Sosyal Medya</h3>
                  <div className="flex gap-3">
                    {profile.socialLinks.facebook && (
                      <a
                        href={profile.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <Facebook size={18} />
                      </a>
                    )}
                    {profile.socialLinks.instagram && (
                      <a
                        href={profile.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                    {profile.socialLinks.twitter && (
                      <a
                        href={profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                      >
                        <Twitter size={18} />
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isOwnProfile && (
                <div className="space-y-3">
                  <button
                    onClick={onMessageClick}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold hover:from-emerald-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle size={18} />
                    Mesaj Gönder
                  </button>
                  <button
                    onClick={onBookClick}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-gold-600 to-pink-600 text-white font-semibold hover:from-gold-700 hover:to-pink-700 transition-all shadow-lg"
                  >
                    Randevu Al
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/30 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${
                selectedTab === tab
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'about' && 'Hakkında'}
              {tab === 'services' && 'Hizmetler'}
              {tab === 'gallery' && 'Galeri'}
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
              {profile.description}
            </p>
          </div>
        )}

        {selectedTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl p-6 backdrop-blur-xl border border-white/20 hover:shadow-lg transition-all group"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {service.name}
                  </h3>
                  <DollarSign size={20} className="text-emerald-600" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/30">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={16} />
                    <span className="text-sm">{service.duration} dakika</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    ₺{service.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'gallery' && (
          <div>
            <div className="relative h-96 bg-gray-900 rounded-2xl overflow-hidden mb-6">
              <img
                src={profile.images[currentImageIndex]}
                alt={`Gallery ${currentImageIndex}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {profile.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white text-sm font-semibold">
                {currentImageIndex + 1} / {profile.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-4">
              {profile.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    idx === currentImageIndex
                      ? 'border-emerald-600 shadow-lg'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div
            className="rounded-2xl p-8 backdrop-blur-xl border border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            <p className="text-gray-600 text-center py-8">Henüz yorum yok</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedEscortProfile;
