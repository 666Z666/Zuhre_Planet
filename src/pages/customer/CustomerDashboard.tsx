/**
 * Müşteri Paneli — Genel Bakış (gerçek veri).
 * Favoriler: favorites.list · Puan: loyalty.getMyStatus · Sohbetler: messaging.getConversations
 * Platform randevu almadığı için randevu bölümleri kaldırıldı.
 *
 * @module pages/customer/CustomerDashboard
 */
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Crown, Wallet, Heart, MessageCircle, Search, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import { SEO } from '@/pages/SEO';
import { trpc } from '@/lib/trpc';
import { SeductiveCard } from '@/components/ui/SeductiveCard';
import { mapApiProfile, type ApiProfileRow } from '@/services/apiListingService';

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Heart; label: string; value: string; tone: string }) {
  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${tone}`}><Icon className="w-6 h-6" /></div>
          <div>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboard() {
  const { isAdmin } = useAuth();
  const favQ = trpc.favorites.list.useQuery({ limit: 6 }, { retry: false });
  const loyaltyQ = trpc.loyalty.getMyStatus.useQuery(undefined, { retry: false });
  const convQ = trpc.messaging.getConversations.useQuery({ limit: 5 }, { retry: false });

  const favorites = (favQ.data ?? []).map((r) => mapApiProfile(r as ApiProfileRow));
  const points = loyaltyQ.data?.points;
  const dash = (v: number | undefined) => (v === undefined ? '—' : v.toLocaleString('tr-TR'));

  return (
    <ProtectedRoute accessLevel={isAdmin ? 'admin' : 'customer'}>
      <CustomerDashboardLayout>
        <SEO title="Müşteri Paneli | Zühre Planet" description="Favorilerinizi, mesajlarınızı ve üyeliğinizi yönetin." />

        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Genel Bakış</h1>
            <Link href="/membership">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 gap-2">
                <Crown className="w-4 h-4" /> Elite Üyelik
              </Button>
            </Link>
          </div>

          {/* Üyelik + puan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-900/40 via-yellow-900/10 to-amber-900/40 border border-amber-500/20 p-8"
            >
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white italic tracking-tight">ELITE ÜYELİK</h2>
                    <p className="text-amber-200/50 text-[10px] font-bold uppercase tracking-widest mt-1">Ayrıcalıklar ve öncelik</p>
                  </div>
                </div>
                <Link href="/membership">
                  <Button className="px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[9px]">İncele</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-primary/5 to-emerald-400/10 border border-primary/20 p-8"
            >
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white italic tracking-tight">
                      {dash(points)} <span className="text-primary italic">puan</span>
                    </h2>
                    <p className="text-primary/50 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {loyaltyQ.data ? `Rütbe: ${loyaltyQ.data.rank}` : 'Sadakat puanınız'}
                    </p>
                  </div>
                </div>
                <Link href="/customer/loyalty">
                  <Button className="px-6 py-4 rounded-xl bg-primary hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[9px]">Ayrıntılar</Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sayılar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Heart} label="Favoriler" value={favQ.data ? String(favQ.data.length >= 6 ? '6+' : favQ.data.length) : '—'} tone="bg-pink-500/10 text-pink-400" />
            <StatCard icon={MessageCircle} label="Sohbetler" value={convQ.data ? String(convQ.data.length) : '—'} tone="bg-blue-500/10 text-blue-400" />
            <StatCard icon={Star} label="Sadakat puanı" value={dash(points)} tone="bg-amber-500/10 text-amber-400" />
          </div>

          {/* Hızlı işlemler */}
          <Card className="glass">
            <CardHeader><CardTitle>Hızlı İşlemler</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link href="/catalog"><Button variant="outline" className="w-full justify-start"><Search className="w-4 h-4 mr-2" />İlan Ara</Button></Link>
                <Link href="/favorites"><Button variant="outline" className="w-full justify-start"><Heart className="w-4 h-4 mr-2" />Favorilerim</Button></Link>
                <Link href="/messages"><Button variant="outline" className="w-full justify-start"><MessageCircle className="w-4 h-4 mr-2" />Mesajlar</Button></Link>
              </div>
            </CardContent>
          </Card>

          {/* Son sohbetler */}
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son Sohbetler</CardTitle>
                <Link href="/messages"><Button variant="link" className="text-blue-400 p-0">Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" /></Button></Link>
              </div>
            </CardHeader>
            <CardContent>
              {convQ.error && <p className="text-sm text-white/50">Sohbetler şu an yüklenemedi.</p>}
              {convQ.data && convQ.data.length === 0 && <p className="text-sm text-white/50">Henüz sohbetiniz yok.</p>}
              <div className="space-y-3">
                {convQ.data?.map((c) => (
                  <Link key={c.id} href="/messages">
                    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                      <MessageCircle className="w-5 h-5 text-white/40 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/70 truncate">{c.lastMessage?.content ?? 'Mesaj yok'}</p>
                        <span className="text-xs text-white/40">{c.updatedAt ? new Date(c.updatedAt).toLocaleString('tr-TR') : ''}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Favoriler önizleme */}
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Favoriler</CardTitle>
                <Link href="/favorites"><Button variant="link" className="text-blue-400 p-0">Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" /></Button></Link>
              </div>
            </CardHeader>
            <CardContent>
              {favQ.error && <p className="text-sm text-white/50">Favoriler şu an yüklenemedi.</p>}
              {favQ.data && favorites.length === 0 && (
                <p className="text-sm text-white/50">Henüz favori ilanınız yok. İlan kartlarındaki kalp simgesiyle ekleyebilirsiniz.</p>
              )}
              {favorites.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((p) => <SeductiveCard key={p.id} profile={p} />)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}
