/**
 * Customer Favorites Page
 *
 * Müşterinin favori escort profillerini görüntüler ve yönetir.
 * Mock verilerle tam işlevsel UI.
 *
 * @module pages/customer/CustomerFavorites
 */

import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockEscorts } from '@/data/mockData/escorts';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import { Heart, Star, MapPin, Clock, Trash2, MessageCircle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '@/pages/SEO';

export default function CustomerFavorites() {
  const { isAdmin } = useAuth();
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  // Mock favorite escorts (ilk 8 escort)
  const allFavorites = useMemo(() => mockEscorts.slice(0, 8), []);
  const favorites = useMemo(
    () => allFavorites.filter((e) => !removedIds.includes(e.id)),
    [allFavorites, removedIds]
  );

  const handleRemove = (id: string) => {
    setRemovedIds((prev) => [...prev, id]);
  };

  return (
    <ProtectedRoute accessLevel={isAdmin ? 'admin' : 'customer'}>
      <CustomerDashboardLayout>
        <SEO
          title="Favorilerim | Müşteri Paneli"
          description="Favori escort profillerinizi görüntüleyin ve yönetin."
        />

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Başlık */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
                <Heart className="w-8 h-8 text-pink-500 fill-pink-500/30" />
                Favorilerim
              </h1>
              <p className="text-white/40 text-sm mt-1">
                {favorites.length} favori escort
              </p>
            </div>
            <Link href="/escorts">
              <Button
                variant="outline"
                className="border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl"
              >
                Yeni Keşfet
              </Button>
            </Link>
          </div>

          {/* Favoriler Grid */}
          <AnimatePresence>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favorites.map((escort, idx) => (
                  <motion.div
                    key={escort.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative bg-black/30 border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all duration-300"
                  >
                    {/* Fotoğraf */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gold-500/10 to-pink-500/10">
                      <img
                        src={escort.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${escort.displayName}`}
                        alt={escort.displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${escort.displayName}`;
                        }}
                      />

                      {/* Üst Rozetler */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {escort.isVip && (
                          <Badge className="bg-amber-500/90 text-black text-[10px] font-black px-2 py-0.5 border-0">
                            VIP
                          </Badge>
                        )}
                        {escort.isOnline && (
                          <div className="flex items-center gap-1 bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            Çevrimiçi
                          </div>
                        )}
                      </div>

                      {/* Favoriden Çıkar Butonu */}
                      <button
                        onClick={() => handleRemove(escort.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                        title="Favorilerden çıkar"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>

                      {/* Alt Gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Puan */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-white text-xs font-bold">{escort.stats.averageRating.toFixed(1)}</span>
                        <span className="text-white/50 text-[10px]">({escort.stats.totalReviews})</span>
                      </div>
                    </div>

                    {/* Bilgi */}
                    <div className="p-3 space-y-2">
                      <div>
                        <h3 className="font-bold text-white text-sm truncate">{escort.displayName}</h3>
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{escort.city}, {escort.district}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-white/40">
                          <Clock className="w-3 h-3" />
                          <span>{escort.workingHours.start} - {escort.workingHours.end}</span>
                        </div>
                        <span className="text-amber-400 font-bold">₺{escort.hourlyRate.toLocaleString()}/sa</span>
                      </div>

                      {/* Aksiyon Butonları */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link href={`/messages?escort=${escort.id}`}>
                          <button className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            Mesaj
                          </button>
                        </Link>
                        <Link href={`/escort/${escort.id}`}>
                          <button className="w-full py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/20 text-pink-400 hover:text-pink-300 text-xs font-medium transition-all flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Randevu
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-black/20 border border-white/10 rounded-2xl p-16 text-center"
              >
                <Heart className="w-16 h-16 mx-auto mb-4 text-white/10" />
                <h3 className="font-black text-xl text-white/60 uppercase italic mb-2">Favori Escort Yok</h3>
                <p className="text-white/30 text-sm mb-6">
                  İlanları gezin ve beğendiğiniz escortları favorilerinize ekleyin!
                </p>
                <Link href="/escorts">
                  <Button className="bg-gradient-to-r from-pink-600 to-gold-600 hover:from-pink-500 hover:to-gold-500 text-white border-0 rounded-xl font-bold">
                    İlanlara Göz At
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}
