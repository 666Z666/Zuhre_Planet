/**
 * Müşteri — Favorilerim (gerçek veri: favorites.list).
 * Yalnız hâlâ yayında olan ilanlar listelenir; kaldırılan ilanlar kendiliğinden düşer.
 *
 * @module pages/customer/CustomerFavorites
 */
import { Link } from 'wouter';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import { SEO } from '@/pages/SEO';
import { trpc } from '@/lib/trpc';
import { SeductiveCard } from '@/components/ui/SeductiveCard';
import { QueryState } from '@/components/ui/QueryState';
import { mapApiProfile, type ApiProfileRow } from '@/services/apiListingService';

export default function CustomerFavorites() {
  const { isAdmin } = useAuth();
  const q = trpc.favorites.list.useQuery({ limit: 100 });
  const favorites = (q.data ?? []).map((r) => mapApiProfile(r as ApiProfileRow));

  return (
    <ProtectedRoute accessLevel={isAdmin ? 'admin' : 'customer'}>
      <CustomerDashboardLayout>
        <SEO title="Favorilerim | Müşteri Paneli" description="Favori ilanlarınızı görüntüleyin ve yönetin." />

        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
                <Heart className="w-8 h-8 text-pink-500 fill-pink-500/30" />
                Favorilerim
              </h1>
              {q.data && <p className="text-white/40 text-sm mt-1">{favorites.length} favori ilan</p>}
            </div>
            <Link href="/catalog">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl">
                İlanlara göz at
              </Button>
            </Link>
          </div>

          {(q.isLoading || q.error) && (
            <QueryState isLoading={q.isLoading} error={q.error} onRetry={() => void q.refetch()} loadingText="Favoriler yükleniyor…" />
          )}

          {q.data && favorites.length === 0 && (
            <div className="glass-panel rounded-3xl p-10 text-center space-y-3">
              <Heart className="w-10 h-10 text-white/20 mx-auto" />
              <p className="text-white/70 font-bold">Henüz favori ilanınız yok.</p>
              <p className="text-white/40 text-sm">İlan kartlarındaki kalp simgesiyle favorilerinize ekleyebilirsiniz.</p>
            </div>
          )}

          {favorites.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((p) => (
                <SeductiveCard key={p.id} profile={p} />
              ))}
            </div>
          )}
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}
