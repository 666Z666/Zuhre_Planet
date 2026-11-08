/**
 * Escort Kazanç Raporu Sayfası
 * 
 * Escort'ların kazançlarını takip edebildiği detaylı rapor sayfası.
 * Günlük, haftalık ve aylık gelir istatistikleri ile randevu bazlı kazanç listesi sunar.
 * 
 * @module pages/escort/EarningsReport
 * @category Pages - Escort
 */

import React from 'react';
import { useLocation } from 'wouter';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Download,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EarningsReport() {
  const [, setLocation] = useLocation();

  // Mock data
  const stats = [
    { label: 'Toplam Kazanç', value: '₺45,200', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Bu Ay', value: '₺12,500', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Tamamlanan', value: '48 Randevu', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Bekleyen', value: '₺2,400', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const transactions = [
    { id: '1', date: '12 Mart 2026', client: 'Müşteri #124', amount: '₺1,500', status: 'completed' },
    { id: '2', date: '11 Mart 2026', client: 'Müşteri #098', amount: '₺2,000', status: 'completed' },
    { id: '3', date: '10 Mart 2026', client: 'Müşteri #211', amount: '₺1,200', status: 'completed' },
    { id: '4', date: '09 Mart 2026', client: 'Müşteri #554', amount: '₺3,500', status: 'processing' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/escort/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Panele Dön
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">KAZANÇ RAPORU</h1>
              <p className="text-muted-foreground">Gelirlerinizi ve randevu performansınızı takip edin</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> PDF İndir
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none glass-panel">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="bg-white/5 border-none text-[8px] font-black uppercase tracking-widest">AKTİF</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black italic tracking-tight">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart / Detailed List */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none glass-panel">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" /> SON İŞLEMLER
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-xs">Tümünü Gör</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">{t.client}</p>
                          <p className="text-xs text-muted-foreground">{t.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg">{t.amount}</p>
                        <Badge className={t.status === 'completed' ? 'bg-green-500/20 text-green-500 border-none' : 'bg-amber-500/20 text-amber-500 border-none'}>
                          {t.status === 'completed' ? 'Tamamlandı' : 'İşleniyor'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Analysis */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none glass-panel">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> ÖZET ANALİZ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-muted-foreground uppercase font-black tracking-widest">Performans</span>
                    <span className="text-green-500 font-bold">+12%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Geçen aya göre kazancınızda artış gözlemlendi.</p>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ödeme Günü</span>
                  </div>
                  <p className="text-xs leading-relaxed">Kazançlarınız her hafta Pazartesi günü kayıtlı cüzdanınıza aktarılır.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
