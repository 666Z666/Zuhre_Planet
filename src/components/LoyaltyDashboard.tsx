/**
 * LoyaltyDashboard Component
 * 
 * Comprehensive loyalty program dashboard for escorts showing points, levels, and rewards.
 * Gamification features to encourage engagement and profile quality.
 * 
 * @module components/LoyaltyDashboard
 * @category Components - Gamification
 * 
 * Features:
 * - Loyalty level display with progress
 * - Points balance and earning history
 * - Referral program tracking
 * - Profile completeness score
 * - Reward redemption options
 * - Visibility multiplier benefits
 * - Achievement badges
 * - Leaderboard (planned)
 * 
 * Loyalty Levels:
 * - Bronze (0-999 points)
 * - Silver (1000-2999 points)
 * - Gold (3000-5999 points)
 * - Platinum (6000-9999 points)
 * - Diamond (10000+ points)
 * 
 * Points Earning:
 * - Profile completion: 100 points
 * - First booking: 50 points
 * - 5-star review: 25 points
 * - Referral: 200 points
 * 
 * @example
 * ```tsx
 * <LoyaltyDashboard
 *   userId="escort-123"
 *   currentPoints={2500}
 *   level="silver"
 * />
 * ```
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Crown, Star, Gift, Users,
  CheckCircle2, Copy,
  Eye, Award, Sparkles,
  Shield, ShoppingCart
} from 'lucide-react';
import {
  LOYALTY_LEVELS,
  VISIBILITY_MULTIPLIERS,
  POINTS_SPENDING,
} from '@/types/loyalty';

interface LoyaltyDashboardProps {
  currentPoints: number;
  lifetimePoints: number;
  level: keyof typeof LOYALTY_LEVELS;
  referralCode?: string;
  profileCompleteness: number;
  isVerified: boolean;
}

type LoyaltyDashboardTab = 'overview' | 'earn' | 'spend' | 'referral';

export function LoyaltyDashboard({
  currentPoints,
  lifetimePoints,
  level,
  referralCode = 'ESCORT2024',
  profileCompleteness,
  isVerified
}: LoyaltyDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<LoyaltyDashboardTab>('overview');

  const currentLevel = LOYALTY_LEVELS[level];
  const nextLevelKey = Object.keys(LOYALTY_LEVELS)[
    Object.keys(LOYALTY_LEVELS).indexOf(level) + 1
  ] as keyof typeof LOYALTY_LEVELS | undefined;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressToNext = nextLevelKey
    ? ((currentPoints - LOYALTY_LEVELS[level].minPoints) /
      (LOYALTY_LEVELS[nextLevelKey].minPoints - LOYALTY_LEVELS[level].minPoints)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Points Overview Card */}
      <Card className="card-premium bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Current Level */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${currentLevel.color} mb-3 shadow-lg`}>
                <span className="text-4xl">{currentLevel.icon}</span>
              </div>
              <Badge className={`mb-2 ${currentLevel.bgColor} ${currentLevel.textColor} ${currentLevel.border}`}>
                {currentLevel.name}
              </Badge>
              <p className="text-2xl font-black">{currentPoints}</p>
              <p className="text-xs text-muted-foreground">Güncel Puan</p>
            </div>

            {/* Lifetime Points */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <p className="text-2xl font-black">{lifetimePoints}</p>
              <p className="text-xs text-muted-foreground">Toplam Puan</p>
            </div>

            {/* Profile Completeness */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-2xl font-black">%{profileCompleteness}</p>
              <p className="text-xs text-muted-foreground">Profil Tamamlanması</p>
            </div>

            {/* Verified Status */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${isVerified ? 'bg-blue-500/10' : 'bg-muted/10'} mb-3`}>
                <Shield className="w-8 h-8" />
              </div>
              <p className="text-2xl font-black">{isVerified ? '✓' : '○'}</p>
              <p className="text-xs text-muted-foreground">Onaylı Üye</p>
            </div>
          </div>

          {/* Progress to Next Level */}
          {nextLevelKey && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Sonraki Seviye: {LOYALTY_LEVELS[nextLevelKey].name}</span>
                <span className="font-bold">{Math.round(progressToNext)}%</span>
              </div>
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${currentLevel.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LoyaltyDashboardTab)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="earn">Puan Kazan</TabsTrigger>
          <TabsTrigger value="spend">Puan Harca</TabsTrigger>
          <TabsTrigger value="referral">Arkadaş Getir</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Benefits */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                {currentLevel.name} Seviyesi Ayrıcalıkları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentLevel.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Visibility Info */}
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Görünürlük Çarpanlarınız
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Sadakat Seviyesi</span>
                    <Badge variant="secondary">x{VISIBILITY_MULTIPLIERS.loyalty_level.multipliers[level]}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Kalıcı görünürlük bonusu</p>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Profil Tamamlanması</span>
                    <Badge variant="secondary" className={profileCompleteness >= 100 ? 'bg-green-500/20 text-green-500' : ''}>
                      x{profileCompleteness >= 100 ? '1.5' : '1.0'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {profileCompleteness >= 100 ? '%50 bonus aktif!' : 'Eksiksiz profil yapın'}
                  </p>
                </div>

                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Onaylı Üye</span>
                    <Badge variant={isVerified ? 'default' : 'secondary'}>
                      {isVerified ? 'x2.0' : 'x1.0'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isVerified ? '%100 bonus aktif!' : 'Onay alın'}
                  </p>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">Puan Boost</span>
                    <Badge className="bg-primary text-white">
                      x{Math.floor(currentPoints / 100) * 0.1 + 1}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Her 100 puan = %10 bonus (maks. x3)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Earn Points Tab */}
        <TabsContent value="earn" className="space-y-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Puan Kazanma Yöntemleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Review Points */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <span>💬</span> Yorum Puanları
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Yorum Yap</span>
                      <Badge className="bg-blue-500 text-white">+25</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Müşteri yorumu yazın</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-gold-500/10 to-pink-500/10 rounded-lg border border-gold-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Detaylı Yorum</span>
                      <Badge className="bg-gold-500 text-white">+50</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">100+ karakter yorum</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Yorum Yanıtı</span>
                      <Badge className="bg-amber-500 text-white">+15</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Yoruma cevap verin</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-lg border border-red-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">5 Yıldız</span>
                      <Badge className="bg-red-500 text-white">+30</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Her 5 yıldızlı yorum</p>
                  </div>
                </div>
              </div>

              {/* Appointment Points */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <span>✅</span> Randevu Puanları
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Başarılı Randevu</span>
                      <Badge className="bg-green-500 text-white">+50</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Müşteri memnuniyeti</p>
                  </div>
                  <div className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">İlk Randevu</span>
                      <Badge className="bg-teal-500 text-white">+100</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Yeni müşteri bonusu</p>
                  </div>
                </div>
              </div>

              {/* Profile Points */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <span>📸</span> Profil Puanları
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 bg-gold-500/10 rounded-lg border border-gold-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Eksiksiz Profil</span>
                      <Badge className="bg-gold-500 text-white">+200</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">%100 tamamlanma</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Onaylı Üye</span>
                      <Badge className="bg-emerald-500 text-white">+500</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Admin onayı</p>
                  </div>
                </div>
              </div>

              {/* Daily Points */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <span>📅</span> Günlük Puanlar
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Günlük Giriş</span>
                      <Badge className="bg-pink-500 text-white">+5</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Her gün giriş yapın</p>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Haftalık Seri</span>
                      <Badge className="bg-orange-500 text-white">+50</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">7 gün üst üste</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spend Points Tab */}
        <TabsContent value="spend" className="space-y-6">
          <Card className="card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-pink-500" />
                Puanlarınızı Harcayın
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(POINTS_SPENDING).map(([key, item]) => (
                  <Card key={key} className="border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h4 className="font-bold mb-2">{item.benefit}</h4>
                      <div className="text-2xl font-black text-primary mb-1">{item.cost} puan</div>
                      <Button
                        className="w-full group-hover:bg-primary"
                        disabled={currentPoints < item.cost}
                        variant={currentPoints < item.cost ? 'outline' : 'default'}
                      >
                        {currentPoints < item.cost ? 'Yetersiz Puan' : 'Harcayın'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referral Tab */}
        <TabsContent value="referral" className="space-y-6">
          <Card className="card-premium bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                Arkadaş Davet Sistemi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Referral Code */}
              <div className="text-center p-6 bg-background rounded-xl">
                <p className="text-sm text-muted-foreground mb-3">Size Özel Davet Kodu</p>
                <div className="flex items-center gap-3 max-w-md mx-auto">
                  <div className="flex-1 p-4 bg-muted rounded-lg font-mono text-2xl font-bold text-center">
                    {referralCode}
                  </div>
                  <Button
                    size="icon"
                    className="h-14 w-14"
                    onClick={copyReferralCode}
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
                {copied && (
                  <p className="text-sm text-green-500 mt-2">Kopyalandı!</p>
                )}
              </div>

              {/* Rewards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-green-500" />
                    Sizin Kazancınız
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <span>Üye Olunca</span>
                      <Badge className="bg-green-500 text-white">+500 puan</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <span>İlk Randevu</span>
                      <Badge className="bg-green-500 text-white">+1000 puan</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Arkadaşınızın Kazancı
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <span>İndirim</span>
                      <Badge className="bg-blue-500 text-white">%15</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <span>Karşılama</span>
                      <Badge className="bg-blue-500 text-white">+100 puan</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 bg-background rounded-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Davet Edilen</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Üye Olan</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground">Toplam Kazanç</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

