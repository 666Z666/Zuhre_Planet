/**
 * Escort Fotoğraf Yönetim Sayfası
 * 
 * Escort'ların profil fotoğraflarını yükleyip yönetebileceği sayfa.
 * Drag & drop, sıralama ve önizleme özellikleri içerir.
 * 
 * @module pages/escort/PhotoManager
 * @category Pages - Escort
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Camera,
  Plus,
  Trash2,
  AlertCircle,
  ArrowLeft,
  Star,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function PhotoManager() {
  const [, setLocation] = useLocation();

  // Mock photos
  const [photos, setPhotos] = useState([
    { id: '1', url: '/brand/placeholders/portrait-4.svg', isPrimary: true, status: 'approved' },
    { id: '2', url: '/brand/placeholders/portrait-1.svg', isPrimary: false, status: 'approved' },
    { id: '3', url: '/brand/placeholders/portrait-5.svg', isPrimary: false, status: 'pending' },
  ]);

  const handleDelete = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
    toast.success('Fotoğraf silindi');
  };

  const handleSetPrimary = (id: string) => {
    setPhotos(photos.map(p => ({
      ...p,
      isPrimary: p.id === id
    })));
    toast.success('Profil fotoğrafı güncellendi');
  };

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
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">FOTOĞRAF YÖNETİMİ</h1>
              <p className="text-muted-foreground">Profilinizdeki görselleri yönetin</p>
            </div>
          </div>
          <Button className="bg-primary">
            <Plus className="w-4 h-4 mr-2" /> Yeni Ekle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none glass-panel overflow-hidden group">
                <CardContent className="p-0 relative aspect-[3/4]">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(photo.id)} className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {!photo.isPrimary && (
                        <Button size="sm" className="bg-white text-black hover:bg-white/90" onClick={() => handleSetPrimary(photo.id)}>
                          Profil Yap
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {photo.isPrimary && (
                      <Badge className="bg-amber-500 text-white border-none">
                        <Star className="w-3 h-3 mr-1 fill-white" /> Ana Fotoğraf
                      </Badge>
                    )}
                    {photo.status === 'pending' && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-none backdrop-blur-md">
                        <Clock className="w-3 h-3 mr-1" /> Onay Bekliyor
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Add New Slot */}
          <button className="aspect-[3/4] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all text-muted-foreground hover:text-primary">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">FOTOĞRAF YÜKLE</span>
          </button>
        </div>

        {/* Info Card */}
        <Card className="mt-12 border-none bg-blue-500/10 border border-blue-500/20">
          <CardContent className="p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-bold text-blue-400">Fotoğraf Kuralları</h3>
              <ul className="text-sm text-blue-400/80 space-y-1 list-disc list-inside">
                <li>Fotoğraflarınız güncel ve size ait olmalıdır.</li>
                <li>Yüzünüzün net göründüğü en az bir fotoğraf zorunludur.</li>
                <li>Müstehcenlik kurallarına uygun görseller yükleyin.</li>
                <li>Yüklenen her görsel AI ve moderatör onayından geçer.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
