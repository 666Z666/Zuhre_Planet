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
import type { PlatformStats } from '@/types/admin';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

type OverviewStats = Pick<PlatformStats, 'totalUsers' | 'activeListings' | 'pendingListings' | 'monthlyRevenue' | 'activeNow' | 'reportsCount'>;

interface OverviewTabProps {
  stats: OverviewStats | null;
  statsLoading: boolean;
  statsError: string | null;
  refetchStats: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ stats, statsLoading, statsError, refetchStats }) => {
  const quickStats = useMemo(() => {
    if (!stats) return [];
    return [
      { label: 'Toplam Kullanıcı', value: stats.totalUsers.toLocaleString('tr-TR'), icon: Users, color: 'bg-blue-500/20 text-blue-600' },
      { label: 'Aktif İlan', value: stats.activeListings.toLocaleString('tr-TR'), icon: FileText, color: 'bg-green-500/20 text-green-600' },
      { label: 'Bekleyen İlan', value: stats.pendingListings.toLocaleString('tr-TR'), icon: Clock, color: 'bg-emerald-500/20 text-emerald-600' },
      { label: 'Aylık Gelir', value: stats.monthlyRevenue == null ? 'Yapılandırılmadı' : `₺${stats.monthlyRevenue.toLocaleString('tr-TR')}`, icon: DollarSign, color: 'bg-blue-500/20 text-blue-600' },
      { label: 'Şu An Aktif', value: stats.activeNow == null ? 'Ölçülmüyor' : stats.activeNow.toLocaleString('tr-TR'), icon: Activity, color: 'bg-emerald-500/20 text-emerald-600' },
      { label: 'Bekleyen Şikayet', value: stats.reportsCount.toLocaleString('tr-TR'), icon: AlertTriangle, color: 'bg-red-500/20 text-red-600' },
    ];
  }, [stats]);

  if (statsLoading) {
    return <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  if (statsError) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-8 text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Veri Yükleme Hatası</h3>
          <p className="text-sm text-muted-foreground mb-4">{statsError}</p>
          <Button onClick={refetchStats}><RefreshCw className="w-4 h-4 mr-2" />Tekrar Dene</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeInVariants} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}><Icon className="w-5 h-5" /></div>
                  <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />Gelir İstatistikleri</CardTitle>
            <CardDescription>Ödeme kaynağı henüz yapılandırılmadı; gelir verisi gösterilmiyor.</CardDescription>
          </CardHeader>
          <CardContent><p className="py-16 text-center text-sm text-muted-foreground">Gerçek ödeme işlemleri ve tarih aralığı tanımlandığında rapor etkinleştirilecek.</p></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" />Aktivite Özeti</CardTitle>
            <CardDescription>Canlı aktivite akışı henüz yapılandırılmadı.</CardDescription>
          </CardHeader>
          <CardContent><p className="py-16 text-center text-sm text-muted-foreground">Denetlenebilir bir olay kaynağı eklenene kadar örnek aktivite gösterilmez.</p></CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
