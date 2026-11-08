import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Clock, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw,
  XCircle
} from 'lucide-react';
import { LoadingSpinner } from '../AdminShared';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

interface OverviewTabProps {
  stats: any;
  statsLoading: boolean;
  statsError: string | null;
  refetchStats: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  stats, 
  statsLoading, 
  statsError, 
  refetchStats 
}) => {
  const quickStats = useMemo(() => {
    if (!stats) return [];

    return [
      {
        label: 'Toplam Kullanıcı',
        value: stats.totalUsers?.toLocaleString() || '0',
        icon: Users,
        color: 'bg-blue-500/20 text-blue-600',
      },
      {
        label: 'Aktif İlan',
        value: stats.activeListings?.toLocaleString() || '0',
        icon: FileText,
        color: 'bg-green-500/20 text-green-600',
      },
      {
        label: 'Bekleyen İlan',
        value: stats.pendingListings?.toLocaleString() || '0',
        icon: Clock,
        color: 'bg-emerald-500/20 text-emerald-600',
      },
      {
        label: 'Aylık Gelir',
        value: `₺${stats.monthlyRevenue?.toLocaleString() || '0'}`,
        icon: DollarSign,
        color: 'bg-blue-500/20 text-blue-600',
      },
      {
        label: 'Şu An Aktif',
        value: stats.activeNow?.toLocaleString() || '0',
        icon: Activity,
        color: 'bg-emerald-500/20 text-emerald-600',
      },
      {
        label: 'Bekleyen Şikayet',
        value: stats.reportsCount?.toLocaleString() || '0',
        icon: AlertTriangle,
        color: 'bg-red-500/20 text-red-600',
      },
    ];
  }, [stats]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-8 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Veri Yükleme Hatası</h3>
          <p className="text-sm text-muted-foreground mb-4">{statsError}</p>
          <Button onClick={refetchStats}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue and Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Gelir İstatistikleri
            </CardTitle>
            <CardDescription>Aylık gelir grafiği (Simülasyon)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex flex-col justify-end pt-4 gap-2">
              <div className="flex-1 flex items-end justify-between gap-2 px-2">
                {[12, 19, 15, 25, 22, 30].map((val, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-primary">₺{val}K</div>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t-md transition-all duration-500 ease-in-out group-hover:from-blue-500 group-hover:to-emerald-300"
                      style={{ height: `${(val / 30) * 100}%` }}
                    ></div>
                    <div className="text-xs text-muted-foreground font-medium">{'Oca Şub Mar Nis May Haz'.split(' ')[i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Aktivite Özeti
            </CardTitle>
            <CardDescription>Son platform aktiviteleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Yeni ilan', user: 'Ayşe Yılmaz', time: '2 dakika önce', type: 'new_listing' },
                { action: 'Üyelik yükseltme', user: 'Mehmet Demir', time: '5 dakika önce', type: 'membership' },
                { action: 'Şikayet bildirimi', user: 'Sistem', time: '15 dakika önce', type: 'report' },
                { action: 'Fotoğraf onayı', user: 'Admin', time: '1 saat önce', type: 'approval' },
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-transparent hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'report' ? 'bg-red-500' :
                      activity.type === 'approval' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
