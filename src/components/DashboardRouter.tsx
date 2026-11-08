/**
 * Dashboard Router Component
 *
 * Role-based dashboard router that redirects users to their appropriate dashboard.
 * Shows unified dashboard pages with role-specific content.
 *
 * @module components/DashboardRouter
 * @category Components - Dashboard
 */

import { useEffect, useMemo, memo } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Calendar,
  MessageSquare,
  Heart,
  Star,
  BarChart3,
  Settings,
  Crown,
  Shield,
  TrendingUp,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Camera,
  FileEdit,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants/routes';

// --- TYPES ---

interface DashboardAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  badge?: number;
  primary?: boolean;
}

interface CustomerStats {
  favorites: number;
  upcomingAppointments: number;
  unreadMessages: number;
  totalBookings: number;
  spent: string;
}

interface EscortStats {
  views: number;
  revenue: string;
  appointments: number;
  rating: number;
  unreadMessages: number;
}

interface AdminStats {
  totalUsers: number;
  activeListings: number;
  pendingReviews: number;
  revenue: string;
}

type DashboardStats = CustomerStats | EscortStats | AdminStats;

interface DashboardRouterProps {
  customerDashboard?: React.ComponentType;
  escortDashboard?: React.ComponentType;
  adminDashboard?: React.ComponentType;
}

// --- CONSTANTS ---

const CUSTOMER_ACTIONS: DashboardAction[] = [
  {
    title: 'İlanlara Göz At',
    description: 'Yeni escort profillerini keşfet',
    icon: User,
    href: ROUTES.CATALOG,
    color: 'bg-pink-500/10 text-pink-600',
  },
  {
    title: 'Favorilerim',
    description: 'Kaydedilen escort profillerini gör',
    icon: Heart,
    href: ROUTES.FAVORITES,
    color: 'bg-red-500/10 text-red-600',
    badge: 12,
  },
  {
    title: 'Randevularım',
    description: 'Yaklaşan ve geçmiş randevular',
    icon: Calendar,
    href: ROUTES.APPOINTMENTS,
    color: 'bg-blue-500/10 text-blue-600',
    badge: 3,
  },
  {
    title: 'Mesajlar',
    description: 'Escortlar ile konuşun',
    icon: MessageSquare,
    href: ROUTES.MESSAGES,
    color: 'bg-gold-500/10 text-gold-600',
    badge: 5,
  },
  {
    title: 'Değerlendirmelerim',
    description: 'Yaptığınız değerlendirmeleri görün',
    icon: Star,
    href: ROUTES.REVIEWS,
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    title: 'Analitik',
    description: 'Aktivite ve harcama istatistikleri',
    icon: BarChart3,
    href: ROUTES.ANALYTICS,
    color: 'bg-green-500/10 text-green-600',
  },
  {
    title: 'Şikayetlerim',
    description: 'Yaptığınız şikayetleri takip edin',
    icon: Shield,
    href: ROUTES.REPORTS,
    color: 'bg-orange-500/10 text-orange-600',
  },
];

const ESCORT_ACTIONS: DashboardAction[] = [
  {
    title: 'Profilim',
    description: 'Profil bilgilerinizi yönetin',
    icon: User,
    href: ROUTES.ESCORT_DASHBOARD,
    color: 'bg-blue-500/10 text-blue-600',
    primary: true,
  },
  {
    title: 'Galeri',
    description: 'Fotoğraflarınızı yönetin',
    icon: Camera,
    href: `${ROUTES.ESCORT_DASHBOARD}?tab=gallery`,
    color: 'bg-gold-500/10 text-gold-600',
  },
  {
    title: 'Randevular',
    description: 'Randevu taleplerini yönetin',
    icon: Calendar,
    href: `${ROUTES.ESCORT_DASHBOARD}?tab=appointments`,
    color: 'bg-green-500/10 text-green-600',
    badge: 3,
  },
  {
    title: 'Mesajlar',
    description: 'Müşteriler ile konuşun',
    icon: MessageSquare,
    href: ROUTES.MESSAGES,
    color: 'bg-emerald-500/10 text-emerald-600',
    badge: 8,
  },
  {
    title: 'Değerlendirmeler',
    description: 'Hakkınızdaki yorumları okuyun',
    icon: Star,
    href: ROUTES.REVIEWS,
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    title: 'Analitik',
    description: 'Performans metriklerinizi görün',
    icon: BarChart3,
    href: ROUTES.ANALYTICS,
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    title: 'İlanı Yükselt',
    description: 'Daha fazla görünür olun',
    icon: TrendingUp,
    href: ROUTES.MARKET,
    color: 'bg-orange-500/10 text-orange-600',
  },
];

const ADMIN_ACTIONS: DashboardAction[] = [
  {
    title: 'Yönetici Paneli',
    description: 'Platform yönetimi',
    icon: Shield,
    href: ROUTES.ADMIN_DASHBOARD,
    color: 'bg-red-500/10 text-red-600',
    primary: true,
  },
  {
    title: 'Kullanıcılar',
    description: 'Kullanıcı hesaplarını yönetin',
    icon: User,
    href: `${ROUTES.ADMIN_DASHBOARD}?tab=users`,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'İlanlar',
    description: 'İlan onay ve kontrolü',
    icon: FileEdit,
    href: `${ROUTES.ADMIN_DASHBOARD}?tab=listings`,
    color: 'bg-gold-500/10 text-gold-600',
  },
  {
    title: 'Şikayetler',
    description: 'Bildirimleri inceleyin',
    icon: Shield,
    href: `${ROUTES.ADMIN_DASHBOARD}?tab=reports`,
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    title: 'Ayarlar',
    description: 'Sistem konfigürasyonu',
    icon: Settings,
    href: `${ROUTES.ADMIN_DASHBOARD}?tab=settings`,
    color: 'bg-gray-500/10 text-gray-600',
  },
];

// --- SUB-COMPONENTS ---

const QuickStatCard = memo(
  ({
    label,
    value,
    icon: Icon,
    color,
  }: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
  }) => (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  )
);
QuickStatCard.displayName = 'QuickStatCard';

const ActionCard = memo(
  ({
    action,
    index,
  }: {
    action: DashboardAction;
    index: number;
  }) => {
    const Icon = action.icon;

    return (
      <motion.div
        key={action.href}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={action.href}>
          <Card
            className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
              action.primary ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${action.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
                {action.badge && <Badge className="mt-2">{action.badge}</Badge>}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }
);
ActionCard.displayName = 'ActionCard';

const VIPUpgradeCTA = memo(
  ({ isEscort }: { isEscort: boolean }) => {
    return (
      <Card className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
        <CardContent className="p-8 text-center">
          <Crown className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h3 className="text-2xl font-bold mb-2">VIP Üyeliğe Geçin</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isEscort
              ? 'Profilinizi öne çıkarın, daha fazla randevu alın ve gelirinizi artırın'
              : 'Sınırsız mesajlaşma, VIP escortlara erişim ve özel ayrıcalıklar'}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500">
                <Crown className="w-4 h-4 mr-2" />
                VIP'e Geç
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
);
VIPUpgradeCTA.displayName = 'VIPUpgradeCTA';

const ProfileCompletenessWarning = memo(() => {
  return (
    <Card className="mt-8 border-blue-200 bg-blue-50/50 dark:bg-blue-900/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Profilinizi Tamamlayın</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Profiliniz %70 tamamlandı. Daha fazla randevu almak için galerinizi ve
              profil bilgilerinizi güncelleyin.
            </p>
            <div className="flex gap-2">
              <Link href="/escort/dashboard?tab=gallery">
                <Button size="sm" variant="outline">
                  <Camera className="w-4 h-4 mr-1" />
                  Galeri
                </Button>
              </Link>
              <Link href="/escort/dashboard?tab=profile">
                <Button size="sm">
                  <FileEdit className="w-4 h-4 mr-1" />
                  Profili Düzenle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
ProfileCompletenessWarning.displayName = 'ProfileCompletenessWarning';

// --- MAIN COMPONENT ---

export function DashboardRouter(_props: DashboardRouterProps) {
  const { user, userRole, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation(ROUTES.LOGIN);
      return;
    }
  }, [isAuthenticated, setLocation]);

  const { isEscort, isAdmin, actions, stats } = useMemo(() => {
    const role = userRole || 'customer';
    const isEscortValue = role === 'escort';
    const isAdminValue = role === 'admin';

    const actionsList = isAdminValue
      ? ADMIN_ACTIONS
      : isEscortValue
        ? ESCORT_ACTIONS
        : CUSTOMER_ACTIONS;

    const statsValue: DashboardStats = isAdminValue
      ? ({
            totalUsers: 15420,
            activeListings: 723,
            pendingReviews: 28,
            revenue: '₺185,000',
          } as AdminStats)
      : isEscortValue
        ? ({
              views: 1250,
              revenue: '₺12,500',
              appointments: 12,
              rating: 4.8,
              unreadMessages: 8,
            } as EscortStats)
        : ({
              favorites: 12,
              upcomingAppointments: 2,
              unreadMessages: 5,
              totalBookings: 24,
              spent: '₺4,500',
            } as CustomerStats);

    return {
      isEscort: isEscortValue,
      isAdmin: isAdminValue,
      actions: actionsList,
      stats: statsValue,
    };
  }, [userRole]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border/50">
        <div className="container py-8 mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold shadow-xl"
                role="img"
                aria-label={`${user?.name || 'Kullanıcı'} avatarı`}
              >
                {user?.name?.charAt(0) || <User className="w-8 h-8" />}
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                  Hoş Geldin, {user?.name || 'Kullanıcı'} <span className="animate-bounce">👋</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={
                      isAdmin
                        ? 'bg-red-500 text-white'
                        : isEscort
                          ? 'bg-gold-500 text-white'
                          : 'bg-blue-500 text-white'
                    }
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {isAdmin ? 'Admin' : isEscort ? 'Escort' : 'Müşteri'}
                  </Badge>
                  {user?.membership === 'vip' && (
                    <Badge className="bg-amber-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => setLocation(ROUTES.SETTINGS)}>
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </Button>
              {isEscort && (
                <Button
                  className="bg-gradient-to-r from-primary to-accent"
                  onClick={() => setLocation(ROUTES.MARKET)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  İlanı Yükselt
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isEscort ? (
              <>
                <QuickStatCard label="Görüntülenme" value={(stats as EscortStats).views} icon={User} color="bg-blue-500/10 text-blue-600" />
                <QuickStatCard label="Bu Ay Gelir" value={(stats as EscortStats).revenue} icon={TrendingUp} color="bg-green-500/10 text-green-600" />
                <QuickStatCard label="Randevu" value={(stats as EscortStats).appointments} icon={Calendar} color="bg-gold-500/10 text-gold-600" />
                <QuickStatCard label="Puan" value={(stats as EscortStats).rating} icon={Star} color="bg-yellow-500/10 text-yellow-600" />
              </>
            ) : (
              <>
                <QuickStatCard label="Favori" value={(stats as CustomerStats).favorites} icon={Heart} color="bg-red-500/10 text-red-600" />
                <QuickStatCard label="Gelecek Randevu" value={(stats as CustomerStats).upcomingAppointments} icon={Calendar} color="bg-blue-500/10 text-blue-600" />
                <QuickStatCard label="Mesaj" value={(stats as CustomerStats).unreadMessages} icon={MessageSquare} color="bg-gold-500/10 text-gold-600" />
                <QuickStatCard label="Toplam Randevu" value={(stats as CustomerStats).totalBookings} icon={CheckCircle2} color="bg-green-500/10 text-green-600" />
              </>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-1">
            {isAdmin ? 'Yönetici Paneli' : isEscort ? 'Escort Paneli' : 'Müşteri Paneli'}
          </h2>
          <p className="text-muted-foreground">
            Platformdaki tüm aktivitenizi buradan takip edin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action, index) => (
            <ActionCard key={action.href} action={action} index={index} />
          ))}
        </div>

        {user?.membership !== 'vip' && <VIPUpgradeCTA isEscort={isEscort} />}
        {isEscort && <ProfileCompletenessWarning />}
      </div>
    </div>
  );
}

export default DashboardRouter;
