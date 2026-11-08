import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { 
  Users, 
  FileText, 
  Star, 
  AlertTriangle, 
  Settings, 
  BarChart3, 
  RefreshCw, 
  Download,
  Shield,
  Home,
  Palette,
  Sparkles,
  LayoutGrid,
  ShoppingBag,
  Trophy,
  ShieldCheck,
  CheckSquare,
  Crown
} from 'lucide-react';
import { LuxuryText } from '@/components/ui/LuxuryText';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { DashboardAuthGuard } from '@/components/DashboardAuthGuard';

// Modular Hooks
import { 
  useAdminStats, 
  useAdminUsers, 
  useAdminListings, 
  useAdminReviews, 
  useAdminReports,
  useBanUser,
  useVerifyUser,
  useApproveListing,
  useRejectListing,
  useDeleteListing,
  useApproveReview,
  useRejectReview,
  useHideReview,
  useDeleteReview,
  useUpdateReportStatus,
  useApprovePhoto,
  useRejectPhoto,
  usePendingPhotos,
  useFeaturedEscorts,
} from '@/hooks/useAdminData';

// MODULAR TABS IMPORTS
import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { UsersTab } from '@/components/admin/tabs/UsersTab';
import { ListingsTab } from '@/components/admin/tabs/ListingsTab';
import { ReviewsTab } from '@/components/admin/tabs/ReviewsTab';
import { ReportsTab } from '@/components/admin/tabs/ReportsTab';
import { SettingsTab } from '@/components/admin/tabs/SettingsTab';
import { ThemeTab } from '@/components/admin/tabs/ThemeTab';
import { ShowcaseTab } from '@/components/admin/tabs/ShowcaseTab';
import { CMSPagesTab } from '@/components/admin/tabs/CMSPagesTab';
import { NavigationTab } from '@/components/admin/tabs/NavigationTab';
import { IntelTab } from '@/components/admin/tabs/IntelTab';
import { EconomyTab } from '@/components/admin/tabs/EconomyTab';
import { StoreTab } from '@/components/admin/tabs/StoreTab';
import { ApprovalsTab } from '@/components/admin/tabs/ApprovalsTab';
import { AdSlotTab } from '@/components/admin/tabs/AdSlotTab';
import AdminMediaApprovals from '@/pages/admin/AdminMediaApprovals';

import type {
  AdminTab,
  AdminQuickActionHandler,
  UserFilters,
  ListingFilters,
} from '@/types/admin';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  
  // State
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  const [userFilters, setUserFilters] = useState<UserFilters>({ role: 'all', status: 'all', page: 1 });
  const [listingFilters, setListingFilters] = useState<ListingFilters>({ status: 'all', page: 1 });
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [banReason, setBanReason] = useState('');

  // Hooks
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useAdminStats();
  const { data: usersDataRaw, isLoading: usersLoading, refetch: refetchUsers, total: usersTotal, totalPages: usersTotalPages } = useAdminUsers(userFilters, userSearch);
  const { data: listingsDataRaw, isLoading: listingsLoading, refetch: refetchListings, total: listingsTotal, totalPages: listingsTotalPages } = useAdminListings(listingFilters, listingSearch);
  const {
    data: reviewsItems,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
    total: reviewsTotal,
    totalPages: reviewsTotalPages,
    page: reviewsPage,
    goToPage: setReviewsPage,
  } = useAdminReviews({ page: 1, limit: 10 });
  const {
    data: reportsItems,
    isLoading: reportsLoading,
    refetch: refetchReports,
    total: reportsTotal,
    totalPages: reportsTotalPages,
    page: reportsPage,
    goToPage: setReportsPage,
  } = useAdminReports({ page: 1, limit: 10 });
  const { refetch: refetchPhotos } = usePendingPhotos();
  const { data: featuredEscorts = [] } = useFeaturedEscorts();

  const usersData = useMemo(() => ({
    data: usersDataRaw,
    total: usersTotal,
    totalPages: usersTotalPages
  }), [usersDataRaw, usersTotal, usersTotalPages]);

  const listingsData = useMemo(() => ({
    data: listingsDataRaw,
    total: listingsTotal,
    totalPages: listingsTotalPages
  }), [listingsDataRaw, listingsTotal, listingsTotalPages]);
  const reviewsData = useMemo(() => ({
    data: reviewsItems,
    total: reviewsTotal,
    totalPages: reviewsTotalPages,
  }), [reviewsItems, reviewsTotal, reviewsTotalPages]);
  const reportsData = useMemo(() => ({
    data: reportsItems,
    total: reportsTotal,
    totalPages: reportsTotalPages,
  }), [reportsItems, reportsTotal, reportsTotalPages]);

  // Mutations
  const banUser = useBanUser();
  const verifyUser = useVerifyUser();
  const approveListing = useApproveListing();
  const rejectListing = useRejectListing();
  const deleteListing = useDeleteListing();
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();
  const hideReview = useHideReview();
  const deleteReview = useDeleteReview();
  const updateReport = useUpdateReportStatus();
  const approvePhoto = useApprovePhoto();
  const rejectPhoto = useRejectPhoto();

  // Handlers
  const handleBanUser = useCallback(async () => {
    if (!selectedUser) return;
    const result = await banUser.execute(selectedUser.id, banReason);
    if (result.success) {
      setBanDialogOpen(false);
      setBanReason('');
      setSelectedUser(null);
      refetchUsers();
    }
  }, [selectedUser, banReason, banUser, refetchUsers]);

  const handleQuickAction = useCallback<AdminQuickActionHandler>(async (
    action,
    type,
    id: string,
    reason?: string
  ) => {
    let result;
    switch (type) {
      case 'user':
        if (action === 'verify') result = await verifyUser.execute(id);
        else if (action === 'ban' && reason) result = await banUser.execute(id, reason);
        break;
      case 'listing':
        if (action === 'approve') result = await approveListing.execute(id);
        else if (action === 'reject' && reason) result = await rejectListing.execute(id, reason);
        else if (action === 'delete') result = await deleteListing.execute(id);
        break;
      case 'review':
        if (action === 'approve') result = await approveReview.execute(id);
        else if (action === 'reject') result = await rejectReview.execute(id, reason);
        else if (action === 'delete') result = await deleteReview.execute(id);
        else if (action === 'hide') result = await hideReview.execute(id);
        break;
      case 'photo':
        if (action === 'approve') result = await approvePhoto.execute(id);
        else if (action === 'reject' && reason) result = await rejectPhoto.execute(id, reason);
        break;
      case 'report':
        if (action === 'resolve') result = await updateReport.execute(id, 'resolved');
        else if (action === 'dismiss') result = await updateReport.execute(id, 'dismissed');
        break;
    }

    if (result?.success) {
      if (type === 'user') refetchUsers();
      if (type === 'listing') refetchListings();
      if (type === 'review') refetchReviews();
      if (type === 'photo') refetchPhotos();
      if (type === 'report') refetchReports();
    }
    return result;
  }, [verifyUser, banUser, approveListing, rejectListing, deleteListing, approveReview, rejectReview, deleteReview, hideReview, approvePhoto, rejectPhoto, updateReport, refetchUsers, refetchListings, refetchReviews, refetchPhotos, refetchReports]);

  return (
    <DashboardAuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background text-white">
        <header className="relative bg-black/60 backdrop-blur-3xl border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
          <div className="container relative py-12 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 shadow-lg">
                    <Home className="w-6 h-6 text-white" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-6 mb-3">
                    <LuxuryText as="h1" className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-shadow-premium">
                      YÖNETİCİ PANELİ
                    </LuxuryText>
                    <Badge className="bg-red-500 text-white border-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-red-500/20">
                      <Shield className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                      ADMIN SECURE
                    </Badge>
                  </div>
                  <p className="text-white/60 text-xs font-black uppercase tracking-[0.3em] italic text-shadow-premium">Platform Yönetimi & Kozmik Kontrol Merkezi</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest italic transition-all"
                  onClick={() => { refetchStats(); toast.success('Veriler yenilendi'); }} 
                  disabled={statsLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-3 ${statsLoading ? 'animate-spin' : ''}`} /> Yenile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest italic transition-all"
                >
                  <Download className="w-4 h-4 mr-3" /> Dışa Aktar
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container py-10">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)}>
            <div className="overflow-x-auto pb-6">
              <TabsList className="inline-flex w-full justify-start rounded-[2rem] bg-white/5 p-2 border border-white/5 backdrop-blur-3xl">
                {[
                  { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
                  { id: 'users', label: 'Kullanıcılar', icon: Users },
                  { id: 'listings', label: 'İlanlar', icon: FileText },
                  { id: 'reviews', label: 'Değerlendirmeler', icon: Star },
                  { id: 'reports', label: 'Şikayetler', icon: AlertTriangle },
                  { id: 'theme', label: 'Tema', icon: Palette },
                  { id: 'showcase', label: 'Vitrin', icon: Sparkles },
                  { id: 'media-approvals', label: 'Medya Onayları', icon: ShieldCheck },
                  { id: 'approvals', label: 'Onay Kuyruğu', icon: CheckSquare },
                  { id: 'pages', label: 'Sayfalar', icon: FileText },
                  { id: 'navigation', label: 'Navigasyon', icon: LayoutGrid },
                  { id: 'economy', label: 'Ekonomi', icon: Trophy },
                  { id: 'store', label: 'Mağaza', icon: ShoppingBag },
                  { id: 'settings', label: 'Ayarlar', icon: Settings },
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="h-12 px-8 rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/40 text-[10px] font-black uppercase tracking-widest italic transition-all text-white/50 hover:text-white"
                  >
                    <tab.icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="mt-10">
              <TabsContent value="overview">
                <OverviewTab stats={stats} statsLoading={statsLoading} statsError={statsError} refetchStats={refetchStats} />
              </TabsContent>
              <TabsContent value="users">
                <UsersTab usersData={usersData} usersLoading={usersLoading} userFilters={userFilters} setUserFilters={setUserFilters} userSearch={userSearch} setUserSearch={setUserSearch} handleQuickAction={handleQuickAction} navigate={navigate} />
              </TabsContent>
              <TabsContent value="listings">
                <ListingsTab listingsData={listingsData} listingsLoading={listingsLoading} listingFilters={listingFilters} setListingFilters={setListingFilters} listingSearch={listingSearch} setListingSearch={setListingSearch} handleQuickAction={handleQuickAction} navigate={navigate} />
              </TabsContent>
              <TabsContent value="reviews">
                <ReviewsTab 
                  reviewsData={reviewsData} 
                  reviewsLoading={reviewsLoading} 
                  handleQuickAction={handleQuickAction} 
                  page={reviewsPage}
                  setPage={setReviewsPage}
                />
              </TabsContent>
              <TabsContent value="reports">
                <ReportsTab 
                  reportsData={reportsData} 
                  reportsLoading={reportsLoading} 
                  handleQuickAction={handleQuickAction} 
                  page={reportsPage}
                  setPage={setReportsPage}
                />
              </TabsContent>
              <TabsContent value="settings">
                <SettingsTab />
              </TabsContent>
              <TabsContent value="theme">
                <ThemeTab />
              </TabsContent>
              <TabsContent value="showcase">
                <ShowcaseTab featuredEscorts={featuredEscorts} navigate={navigate} />
              </TabsContent>
              <TabsContent value="media-approvals">
                <motion.div initial="hidden" animate="visible" exit="exit" variants={fadeInVariants}>
                  <AdminMediaApprovals />
                </motion.div>
              </TabsContent>
              <TabsContent value="pages">
                <CMSPagesTab />
              </TabsContent>
              <TabsContent value="navigation">
                <NavigationTab />
              </TabsContent>
              <TabsContent value="intel">
                <IntelTab />
              </TabsContent>
              <TabsContent value="economy">
                <EconomyTab />
              </TabsContent>
              <TabsContent value="store">
                <StoreTab />
              </TabsContent>
              <TabsContent value="approvals">
                <ApprovalsTab />
              </TabsContent>
              <TabsContent value="ad-slots">
                <AdSlotTab />
              </TabsContent>
              <TabsContent value="members">
                <Card className="glass-panel border-none rounded-[3rem] overflow-hidden">
                  <CardContent className="p-20 text-center">
                    <Crown className="w-16 h-16 mx-auto mb-8 text-primary animate-bounce" />
                    <h2 className="text-3xl font-black mb-4 uppercase italic tracking-tighter text-white">Üye Yönetimi V3.1</h2>
                    <p className="text-white/60 mb-10 font-bold uppercase tracking-widest italic">Müşteri ve Escort profilleri başarıyla ayrıştırıldı.</p>
                    <Button onClick={() => setActiveTab('users')} className="h-16 px-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest italic shadow-xl shadow-primary/20">Kullanıcı Listesine Git</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/10 rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">Kullanıcıyı Engelle</DialogTitle>
            <DialogDescription className="text-white/60 font-bold uppercase tracking-widest text-[10px]">{selectedUser?.name} kullanıcısını engellemek için bir sebep belirtin.</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Label htmlFor="ban-reason" className="text-white/90 text-[10px] font-black uppercase tracking-widest mb-2 block">Engelleme Sebebi</Label>
            <Input id="ban-reason" value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="Örn: Uygunsuz davranış..." className="bg-white/5 border-white/10 h-14 rounded-xl" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)} className="rounded-xl border-white/10">İptal</Button>
            <Button variant="destructive" onClick={handleBanUser} disabled={!banReason} className="rounded-xl shadow-lg shadow-red-500/20">Engelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardAuthGuard>
  );
}
