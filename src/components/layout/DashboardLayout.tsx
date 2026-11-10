/**
 * Dashboard Layout
 * 
 * Escort ve Üye panelleri için ortak yerleşim düzeni.
 * Sol sidebar, üst header ve içerik alanını yönetir.
 * "Deep Space" temasına uygun glassmorphism tasarımı.
 */

import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, User, Settings, 
  LogOut, Shield, Bell, Calendar, Users,
  Trophy, Package, ShieldAlert
} from 'lucide-react';
import { DashboardAuthGuard } from '@/components/DashboardAuthGuard';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'escort' | 'customer' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  userRole = 'escort' 
}) => {
  const [location] = useLocation();

  // DASHBOARD MENÜLERİ
  const menus = {
    escort: [
      { icon: LayoutDashboard, label: 'Genel Bakış', href: '/dashboard' },
      { icon: User, label: 'Profil Düzenle', href: '/dashboard/profile' },
      { icon: Calendar, label: 'Takvim & Müsaitlik', href: '/dashboard/schedule' },
      { icon: Users, label: 'Etkileşim Üssu', href: '/dashboard/interactions' },
      { icon: Trophy, label: 'Sadakat & Rütbe', href: '/dashboard/loyalty' },
      { icon: ShieldAlert, label: 'Müşteri İstihbaratı', href: '/dashboard/intel' },
      { icon: Package, label: 'Pro Mağaza', href: '/dashboard/store' },
      { icon: Settings, label: 'Ayarlar', href: '/dashboard/settings' },
    ],
    customer: [
      { icon: LayoutDashboard, label: 'Genel Bakış', href: '/customer/dashboard' },
      { icon: User, label: 'Hesabım', href: '/customer/profile' },
      { icon: Trophy, label: 'Z-Puan & Sadakat', href: '/customer/loyalty' },
      { icon: Bell, label: 'Bildirimler', href: '/customer/notifications' },
      { icon: Settings, label: 'Ayarlar', href: '/customer/settings' },
    ],
    admin: [
       { icon: LayoutDashboard, label: 'Komuta Merkezi', href: '/admin/dashboard' },
       { icon: Shield, label: 'Moderasyon', href: '/admin/approvals' },
       { icon: Users, label: 'Kullanıcılar', href: '/admin/users' },
       { icon: Package, label: 'Mağaza & Ekonomi', href: '/admin/economy' },
       { icon: Settings, label: 'Sistem Ayarları', href: '/admin/settings' },
    ]
  };

  const menuItems = menus[userRole] || menus.escort;

  return (
    <DashboardAuthGuard requiredRole={userRole}>
      <div className="min-h-screen bg-[#020205] text-white flex">
        {/* --- SIDEBAR --- */}
        <aside className="w-64 hidden lg:flex flex-col border-r border-white/10 bg-black/20 backdrop-blur-xl fixed inset-y-0 z-50">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-gold-600 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-black font-orbitron text-xl tracking-tighter italic">GALAXY</h1>
            <span className="text-[9px] text-primary font-black uppercase tracking-[0.3em]">COMMAND CENTER</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  relative flex items-center gap-3 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-500 group
                  ${isActive 
                    ? 'bg-primary/20 text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] border border-primary/30' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }
                `}>
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                  <span className={`font-black uppercase text-[10px] tracking-widest ${isActive ? 'italic' : ''}`}>{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-[-2px] w-1 h-8 bg-primary rounded-r-full shadow-[0_0_15px_#d4af37]"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8">
        {/* Header (Mobile Toggle & User Info) */}
        <header className="flex justify-between items-center mb-8 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <h2 className="text-xl font-bold font-orbitron">
             {menuItems.find(m => m.href === location)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Bildirimler"
              aria-label="Bildirim merkezini aç"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-black text-white italic uppercase tracking-widest">ELARA MOON</div>
                <div className="text-[9px] text-primary font-black uppercase tracking-widest">PULSAR ELITE</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 p-[1px] group rotate-[-5deg]">
                 <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-all">
                    <img src="/brand/placeholders/portrait-3.svg" alt="Profil" className="w-full h-full object-cover" />
                 </div>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
    </DashboardAuthGuard>
  );
};

export default DashboardLayout;
