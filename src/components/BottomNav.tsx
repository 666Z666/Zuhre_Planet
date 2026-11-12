/**
 * BottomNav Component
 * 
 * Mobile-responsive bottom navigation bar for quick access to main features.
 */

import { Link, useLocation } from 'wouter';
import { Home, Search, Heart, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES, getDashboardRouteByRole } from '@/constants/routes';

export function BottomNav() {
  const [location] = useLocation();
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isDark = theme === 'dark';

  const profileHref = isAuthenticated ? getDashboardRouteByRole(user?.role) : ROUTES.LOGIN;

  const navItems = [
    { href: ROUTES.HOME, icon: Home, label: 'ANA SAYFA', match: (loc: string) => loc === '/' },
    { href: ROUTES.CATALOG, icon: Search, label: 'KEŞFET', match: (loc: string) => loc.startsWith('/catalog') || loc.startsWith('/escorts') },
    { href: '/favorites', icon: Heart, label: 'FAVORİLER', match: (loc: string) => loc.includes('favorites') },
    { href: '/messages', icon: MessageCircle, label: 'MESAJLAR', match: (loc: string) => loc.includes('messages') },
    { href: profileHref, icon: User, label: isAuthenticated ? 'PANELİM' : 'GİRİŞ', match: (loc: string) => loc.startsWith('/login') || loc.includes('dashboard') },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pt-2 transition-colors duration-500
      ${isDark ? 'bg-[#020617]/95' : 'bg-[#fff7ed]/95'} backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]`}>
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = item.match(location);
          const Icon = item.icon;

          return (
            <Link key={item.label} href={item.href}>
              <div className="flex flex-col items-center justify-center relative px-2 py-1 cursor-pointer group">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-white/60 group-hover:text-white'}`} />
                <span className={`text-[9px] mt-1.5 font-black tracking-wider transition-colors duration-300 ${isActive ? 'text-primary' : 'text-white/60 group-hover:text-white'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
