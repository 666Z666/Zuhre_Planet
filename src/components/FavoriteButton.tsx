import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Favoriye ekle/çıkar. Girişsiz kullanıcıyı giriş sayfasına yönlendirir.
 * Durum `favorites.ids` sorgusundan gelir (tek sorgu, tüm kartlar paylaşır).
 */
export function FavoriteButton({ profileId, className = '' }: { profileId: number | string; className?: string }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const id = Number(profileId);
  const ids = trpc.favorites.ids.useQuery(undefined, { enabled: isAuthenticated, retry: false, staleTime: 60_000 });
  const isFav = ids.data?.includes(id) ?? false;

  const toggle = trpc.favorites.toggle.useMutation({
    onMutate: async () => {
      await utils.favorites.ids.cancel();
      const prev = utils.favorites.ids.getData();
      utils.favorites.ids.setData(undefined, (old = []) => (old.includes(id) ? old.filter((x) => x !== id) : [...old, id]));
      return { prev };
    },
    onError: (e, _v, c) => {
      utils.favorites.ids.setData(undefined, c?.prev);
      toast.error(e.message);
    },
    onSuccess: (r) => {
      toast.success(r.favorited ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.');
      void utils.favorites.list.invalidate();
    },
  });

  if (!Number.isInteger(id) || id <= 0) return null;

  return (
    <button
      type="button"
      aria-pressed={isFav}
      aria-label={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      title={isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      disabled={toggle.isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
          toast.info('Favorilere eklemek için giriş yapın.');
          setLocation('/login');
          return;
        }
        toggle.mutate({ profileId: id });
      }}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 hover:border-pink-400/60 transition-colors ${className}`}
    >
      <Heart className={`w-5 h-5 ${isFav ? 'text-pink-500 fill-pink-500' : 'text-white/70'}`} />
    </button>
  );
}
