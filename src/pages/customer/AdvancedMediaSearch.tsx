/**
 * Advanced Media Search Page
 *
 * Müşteriler için gelişmiş medya arama ve filtreleme sayfası.
 * Fotoğraf ve videoları kategori, tarih ve popülerliğe göre listeler.
 *
 * @module pages/customer/AdvancedMediaSearch
 * @category Pages - Customer Dashboard
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Image as ImageIcon,
  Flame,
  Clock,
  LayoutGrid,
  List,
  Eye,
  Heart,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import { SEO } from '@/pages/SEO';
import { cn } from '@/lib/utils';

/** Media item interface */
interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  duration?: string;
  createdAt: string;
  isPremium: boolean;
}

/** Mock media data */
const mockMedia: MediaItem[] = [
  {
    id: '1',
    type: 'video',
    title: 'Galaksi Turu - Özel Çekim',
    thumbnail: '/brand/placeholders/portrait-1.svg',
    views: 1240,
    likes: 450,
    duration: '02:45',
    createdAt: '2026-01-10',
    isPremium: true,
  },
  {
    id: '2',
    type: 'photo',
    title: 'Yıldız Tozu Portresi',
    thumbnail: '/brand/placeholders/portrait-6.svg',
    views: 890,
    likes: 120,
    createdAt: '2026-01-08',
    isPremium: false,
  },
  // ... more items
];

export default function AdvancedMediaSearch() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all');

  const filterTypes = [
    { id: 'all', label: 'Tümü', icon: Flame },
    { id: 'photo', label: 'Fotoğraflar', icon: ImageIcon },
    { id: 'video', label: 'Videolar', icon: Video },
  ] as const;

  return (
    <CustomerDashboardLayout>
      <SEO 
        title="Medya Keşfi | Zühre Planet"
        description="En popüler fotoğraf ve videoları keşfedin."
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-orbitron text-white">Medya Keşfi</h1>
            <p className="text-muted-foreground text-sm">Galaksinin en popüler içeriklerini keşfedin</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-black/40 border border-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'list' ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3">
          {filterTypes.map((type) => (
            <Button
              key={type.id}
              variant={filterType === type.id ? 'default' : 'outline'}
              onClick={() => setFilterType(type.id)}
              className={cn(
                "glass border-white/10 h-11 px-6 font-bold",
                filterType === type.id 
                ? "bg-blue-600 border-transparent text-white shadow-lg shadow-blue-600/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <type.icon className="w-4 h-4 mr-2" />
              {type.label}
            </Button>
          ))}
        </div>

        {/* Result Grid */}
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {mockMedia
            .filter(item => filterType === 'all' || item.type === filterType)
            .map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="glass border-white/10 group overflow-hidden hover:border-blue-500/30 transition-all">
                  <CardContent className="p-0 relative">
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                         <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
                            Görüntüle
                         </Button>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {item.isPremium && (
                          <Badge className="bg-yellow-500 text-black font-black text-[10px] border-none">PREMIUM</Badge>
                        )}
                        {item.type === 'video' && (
                          <Badge className="bg-red-600 text-white font-black text-[10px] border-none flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {item.duration}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {item.likes}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.createdAt}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
