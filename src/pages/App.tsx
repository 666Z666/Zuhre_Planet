/**
 * App Root Router Page
 * Zühre Planet V4.0 — Shadow Diamond Edition
 *
 * Architecture: wouter router + React.lazy code splitting
 * Provider Chain: TRPCProvider > ThemeProvider > LanguageProvider >
 *                 AdminSettingsProvider > LuxuryThemeProvider >
 *                 NotificationProvider > TooltipProvider > AuthProvider >
 *                 WebSocketProvider
 *
 * Security: PanicProtocol (double-ESC => Google redirect)
 * Age Gate: AgeGateOverlay enforces 18+ consent
 */

import React, { Suspense, lazy, useRef, useEffect } from 'react';

// ─── Context Providers ───────────────────────────────────────────────────────
import { TRPCProvider } from "@/lib/trpc";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AdminSettingsProvider } from "@/contexts/AdminSettingsContext";
import { LuxuryThemeProvider } from "@/contexts/LuxuryThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";

// ─── UI Infrastructure ───────────────────────────────────────────────────────
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NotificationToast, NotificationCenter } from "@/components/Notifications";
import { AgeGateOverlay } from "@/components/AgeGateOverlay";
import { Header } from "@/components/Header";
import { BackgroundScene } from "@/components/3d/BackgroundScene";
import CommandCenter from "@/components/scout/CommandCenter";

// ─── Router ──────────────────────────────────────────────────────────────────
import { Route, Switch, Redirect } from "wouter";
import NotFound from "@/pages/NotFound";
import { ROUTES } from "@/constants/routes";

// ═══════════════════════════════════════════════════════════════════════════════
// LAZY-LOADED PAGES — All routes code-split for performance
// ═══════════════════════════════════════════════════════════════════════════════

// Public Pages
const Home = lazy(() => import("@/pages/Home"));
const Catalog = lazy(() => import("@/pages/Catalog"));
const EscortList = lazy(() => import("@/pages/EscortList"));
const EscortProfile = lazy(() => import("@/pages/EscortProfile"));
const LocationListings = lazy(() => import("@/pages/LocationListings"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));

// Auth
const CustomerLogin = lazy(() => import("@/pages/auth/CustomerLogin"));
const EscortLogin = lazy(() => import("@/pages/auth/EscortLogin"));
const AdminLogin = lazy(() => import("@/pages/auth/AdminLogin"));
const ClientRegister = lazy(() => import("@/pages/ClientRegister"));
const EscortRegister = lazy(() => import("@/pages/EscortRegister"));

// Customer Dashboard & Feature Pages
const CustomerDashboard = lazy(() => import("@/pages/customer/CustomerDashboard"));
const CustomerFavorites = lazy(() => import("@/pages/customer/CustomerFavorites"));
const CustomerAppointments = lazy(() => import("@/pages/customer/CustomerAppointments"));
const CustomerReviews = lazy(() => import("@/pages/customer/CustomerReviews"));
const CustomerMessages = lazy(() => import('@/pages/customer/CustomerMessages'));
const LoyaltyDashboard = lazy(() => import("@/pages/customer/LoyaltyDashboard"));
const Wallet = lazy(() => import("@/pages/customer/Wallet"));

// Escort Dashboard & Sub-Pages
const EscortDashboard = lazy(() => import("@/pages/dashboard/EscortDashboard"));
const ProfileEditor = lazy(() => import("@/pages/dashboard/ProfileEditor"));
const ImageEditor = lazy(() => import("@/pages/dashboard/ImageEditor"));
const ScheduleManager = lazy(() => import("@/pages/dashboard/ScheduleManager"));
const InteractionsCenter = lazy(() => import("@/pages/dashboard/InteractionsCenter"));
const EscortLoyalty = lazy(() => import("@/pages/dashboard/EscortLoyalty"));
const CustomerIntel = lazy(() => import("@/pages/dashboard/CustomerIntel"));

// Admin
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

// Membership
const EscortStore = lazy(() => import("@/pages/membership/EscortStore"));
const CustomerMembership = lazy(() => import("@/pages/membership/CustomerMembership"));
const RedRoom = lazy(() => import("@/pages/membership/RedRoom"));

// General Pages
const Blog = lazy(() => import("@/pages/general/Blog"));
const About = lazy(() => import("@/pages/general/About"));
const Pricing = lazy(() => import("@/pages/general/Pricing"));
const Contact = lazy(() => import("@/pages/general/Contact"));
const TermsOfService = lazy(() => import("@/pages/general/TermsOfService"));
const PrivacyPolicy = lazy(() => import("@/pages/general/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@/pages/general/CookiePolicy"));
const KVKK = lazy(() => import("@/pages/general/KVKK"));
const Safety = lazy(() => import("@/pages/general/Safety"));
// Previously missing pages (exist on disk but had no routes)
const FAQ = lazy(() => import("@/pages/general/FAQ"));
const Support = lazy(() => import("@/pages/general/Support"));
const HowItWorks = lazy(() => import("@/pages/general/HowItWorks"));
const Settings = lazy(() => import("@/pages/Settings"));

// Elite Ecosystem Pages

// Forum
const ForumHome = lazy(() => import("@/pages/forum/ForumHome"));
const ForumNewTopic = lazy(() => import("@/pages/forum/ForumNewTopic"));
const ForumCategory = lazy(() => import("@/pages/forum/ForumCategory"));
const ForumTopic = lazy(() => import("@/pages/forum/ForumTopic"));

// Misc
const BrandIdentityGallery = lazy(() => import("@/pages/BrandIdentityGallery"));

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE LOADING FALLBACK
// ═══════════════════════════════════════════════════════════════════════════════
function RouteLoading() {
  return (
    <div className="fixed inset-0 z-[200] bg-[#080810] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-t-2 border-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-b-2 border-white/20 animate-[spin_1.5s_linear_infinite_reverse]" />
        </div>
      </div>
      <div className="mt-8 space-y-2">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic">Zühre Planet</div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-primary animate-pulse italic">
          YILDIZLAR HİZALANIYOR...
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANIC PROTOCOL — Double-ESC quick exit for privacy
// ═══════════════════════════════════════════════════════════════════════════════
function PanicProtocol() {
  const lastEscPress = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscPress.current < 400) {
          window.location.href = 'https://www.google.com';
        }
        lastEscPress.current = now;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROUTER — All routes defined here
// ═══════════════════════════════════════════════════════════════════════════════
function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoading />}>
        <Switch>
          {/* ── Public ── */}
          <Route path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.CATALOG} component={Catalog} />
          <Route path="/escorts" component={EscortList} />
          {/* /escort/:id'den ÖNCE: aksi halde /escort/login ve /escort/dashboard profil sanılıyordu */}
          <Route path={ROUTES.ESCORT_LOGIN} component={EscortLogin} />
          <Route path={ROUTES.ESCORT_DASHBOARD} component={EscortDashboard} />
          <Route path="/escort/forgot-password"><Redirect to="/forgot-password" /></Route>
          <Route path="/escort/settings"><Redirect to="/settings" /></Route>
          <Route path={ROUTES.ESCORT_PROFILE} component={EscortProfile} />
          <Route path="/escort/:id" component={EscortProfile} />
          <Route path="/konum/:city/:district?" component={LocationListings} />

          {/* ── Auth ── */}
          <Route path={ROUTES.LOGIN} component={CustomerLogin} />
          <Route path="/login-escort" component={EscortLogin} />
          <Route path={ROUTES.ADMIN_LOGIN} component={AdminLogin} />
          <Route path={ROUTES.REGISTER} component={ClientRegister} />
          <Route path={ROUTES.REGISTER_CLIENT} component={ClientRegister} />
          <Route path={ROUTES.REGISTER_ESCORT} component={EscortRegister} />
          <Route path="/register/escort" component={EscortRegister} />

          {/* ── Dashboards ── */}
          <Route path={ROUTES.CUSTOMER_DASHBOARD} component={CustomerDashboard} />
          <Route path="/dashboard" component={CustomerDashboard} />
          <Route path="/escort/dashboard/private" component={EscortDashboard} />
          <Route path={ROUTES.ADMIN_DASHBOARD} component={AdminDashboard} />

          {/* ── Escort Sub-Pages ── */}
          <Route path="/dashboard/profile" component={ProfileEditor} />
          <Route path="/escort/dashboard/profile" component={ProfileEditor} />
          <Route path="/dashboard/gallery" component={ImageEditor} />
          <Route path="/escort/dashboard/gallery" component={ImageEditor} />
          <Route path="/dashboard/schedule" component={ScheduleManager} />
          <Route path="/dashboard/interactions" component={InteractionsCenter} />
          <Route path="/dashboard/loyalty" component={EscortLoyalty} />
          <Route path="/dashboard/intel" component={CustomerIntel} />

          {/* ── Customer Features ── */}
          <Route path={ROUTES.MESSAGES} component={CustomerMessages} />
          <Route path={ROUTES.FAVORITES} component={CustomerFavorites} />
          <Route path={ROUTES.APPOINTMENTS} component={CustomerAppointments} />
          <Route path={ROUTES.REVIEWS} component={CustomerReviews} />
          <Route path="/customer/loyalty" component={LoyaltyDashboard} />
          <Route path="/dashboard/wallet" component={Wallet} />

          {/* ── Membership ── */}
          <Route path="/membership" component={CustomerMembership} />
          <Route path="/dashboard/store" component={EscortStore} />
          <Route path={ROUTES.RED_ROOM} component={RedRoom} />

          {/* ── Elite Ecosystem ── */}
          {/* Turneler / Ajanslar / Gece Hayatı kaldırıldı (TCK m.227 "aracılık / yer temini" riski) */}
          <Route path="/tours"><Redirect to={ROUTES.CATALOG} /></Route>
          <Route path="/agencies"><Redirect to={ROUTES.CATALOG} /></Route>
          <Route path="/nightlife"><Redirect to={ROUTES.CATALOG} /></Route>

          {/* ── Forum ── */}
          <Route path={ROUTES.FORUM} component={ForumHome} />
          <Route path={ROUTES.FORUM_NEW_TOPIC} component={ForumNewTopic} />
          <Route path={ROUTES.FORUM_CATEGORY} component={ForumCategory} />
          <Route path={ROUTES.FORUM_TOPIC} component={ForumTopic} />

          {/* ── Legal & Info ── */}
          <Route path={ROUTES.BLOG} component={Blog} />
          <Route path="/about" component={About} />
          <Route path={ROUTES.PRICING} component={Pricing} />
          <Route path={ROUTES.CONTACT} component={Contact} />
          <Route path={ROUTES.FAQ} component={FAQ} />
          <Route path={ROUTES.SUPPORT} component={Support} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path={ROUTES.TERMS} component={TermsOfService} />
          <Route path={ROUTES.PRIVACY} component={PrivacyPolicy} />
          <Route path={ROUTES.COOKIE_POLICY} component={CookiePolicy} />
          <Route path={ROUTES.KVKK} component={KVKK} />
          <Route path={ROUTES.SAFETY} component={Safety} />
          <Route path="/brand-identity" component={BrandIdentityGallery} />

          {/* ── Settings ── */}
          <Route path={ROUTES.SETTINGS} component={Settings} />

          {/* ── 404 ── */}
          {/* Şifre sıfırlama */}
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route path={ROUTES.RESET_PASSWORD} component={ResetPassword} />

          {/* Eski/kısa bağlantılar → doğru sayfalar (sitede bu adreslere bağlantılar var) */}
          <Route path="/privacy"><Redirect to={ROUTES.PRIVACY} /></Route>
          <Route path="/cookies"><Redirect to={ROUTES.COOKIE_POLICY} /></Route>
          <Route path="/terms"><Redirect to={ROUTES.TERMS} /></Route>
          <Route path={ROUTES.VIP}><Redirect to="/membership" /></Route>
          <Route path={ROUTES.MARKET}><Redirect to="/dashboard/store" /></Route>
          <Route path={ROUTES.ANALYTICS}><Redirect to={ROUTES.ESCORT_DASHBOARD} /></Route>
          <Route path={ROUTES.REPORTS}><Redirect to={ROUTES.SUPPORT} /></Route>
          <Route path="/customer/wallet"><Redirect to="/dashboard/wallet" /></Route>
          <Route path="/customer/settings"><Redirect to={ROUTES.SETTINGS} /></Route>
          <Route path="/customer/analytics"><Redirect to={ROUTES.CUSTOMER_DASHBOARD} /></Route>
          <Route path={ROUTES.ADMIN_SETTINGS}><Redirect to={ROUTES.ADMIN_DASHBOARD} /></Route>

          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP — Provider tree wrapping entire application
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <TRPCProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AdminSettingsProvider>
            <LuxuryThemeProvider>
              <NotificationProvider>
                <TooltipProvider>
                  <AuthProvider>
                    <WebSocketProvider url={import.meta.env.VITE_WS_URL || 'ws://localhost:4000/ws'}>
                      <div className="min-h-screen font-sans antialiased relative selection:bg-secondary/30 text-foreground overflow-x-hidden">
                        {/* Cinematic film grain overlay */}
                        <div className="film-grain" />

                        {/* Privacy & Security */}
                        <PanicProtocol />

                        {/* 3D Background & Dev Tools */}
                        <BackgroundScene />
                        <CommandCenter />

                        {/* Age Gate */}
                        <AgeGateOverlay />

                        {/* Navigation */}
                        <Header />

                        {/* Main Content */}
                        <div className="relative z-10 min-h-screen flex flex-col">
                          <main className="flex-grow pointer-events-auto">
                            <AppRouter />
                          </main>
                          <div className="relative z-50 pointer-events-auto">
                            <NotificationCenter />
                            <NotificationToast />
                            <Toaster position="top-right" />
                          </div>
                        </div>
                      </div>
                    </WebSocketProvider>
                  </AuthProvider>
                </TooltipProvider>
              </NotificationProvider>
            </LuxuryThemeProvider>
          </AdminSettingsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TRPCProvider>
  );
}
