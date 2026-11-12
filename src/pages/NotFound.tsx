/**
 * Not Found Page (404)
 * 
 * Error page displayed when users navigate to non-existent or invalid routes.
 * Provides friendly error messaging with navigation options to return to main content.
 * Helps users recover from navigation errors with helpful suggestions and links.
 * 
 * @module pages/NotFound
 * @category Pages - Public
 * 
 * Features:
 * - Large 404 error code display with emoji overlay
 * - Friendly error message in Turkish
 * - Return to home button
 * - Go back navigation button
 * - Helpful links to main sections (catalog, favorites, register)
 * - Search suggestions and popular pages
 * - Support contact information
 * - Responsive design for all device sizes
 * - Graceful error handling
 * - Mobile-optimized layout
 * - Quick navigation to key pages
 * 
 * Navigation Options:
 * - Return to home page
 * - Go back to previous page
 * - Browse catalog
 * - View favorites
 * - Register new account
 * - Search by category
 * - Contact support
 * 
 * @example
 * ```tsx
 * // Route: /404
 * // Any non-existent route
 * <NotFound />
 * ```
 */

import { useLocation } from 'wouter';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between pt-32">
      <div className="flex-1 flex items-center justify-center px-4 pb-20">
        <div className="max-w-lg w-full mx-auto text-center">
          {/* 404 Animation/Graphic */}
          <div className="mb-8 relative">
            <div className="text-[140px] md:text-[180px] font-black italic text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-secondary leading-none select-none">
              404
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white mb-3">
            Yörünge Bulunamadı
          </h1>
          <p className="text-sm md:text-base text-white/60 mb-8 font-medium">
            Aradığınız sayfa mevcut değil veya başka bir koordinata taşınmış olabilir.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition shadow-lg shadow-primary/20"
            >
              <Home className="w-4 h-4" />
              Ana Sayfaya Dön
            </button>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri Git
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 glass-panel border border-white/10 rounded-3xl p-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-white/80 mb-4 italic">Hızlı Keşif</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLocation('/catalog')}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left"
              >
                <Search className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-white/80">Katalog</span>
              </button>
              <button
                onClick={() => setLocation('/escorts/istanbul')}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left"
              >
                <Search className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white/80">Şehirlere Göre</span>
              </button>
              <button
                onClick={() => setLocation('/customer/favorites')}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white/80">Favorilerim</span>
              </button>
              <button
                onClick={() => setLocation('/register/client')}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition text-left"
              >
                <Search className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-white/80">Kayıt Ol</span>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 text-xs text-white/40">
            Sorun yaşıyorsanız{' '}
            <button
              type="button"
              onClick={() => setLocation('/contact')}
              className="text-primary hover:underline font-bold"
            >
              İletişim Merkezi
            </button>
            {' '}üzerinden bize ulaşabilirsiniz.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
