import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Eye, 
  XCircle, 
  LayoutDashboard, 
  ImageIcon, 
  Save 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

interface ShowcaseTabProps {
  featuredEscorts: any[];
  navigate: (path: string) => void;
}

export const ShowcaseTab: React.FC<ShowcaseTabProps> = ({
  featuredEscorts,
  navigate
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
    >
      <div className="space-y-6">
        {/* Featured Escorts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Öne Çıkan Escortlar
              </CardTitle>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Vitrin Ekle
              </Button>
            </div>
            <CardDescription>Anasayfada ve katalogda öne çıkan yıldız isimler.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(featuredEscorts || [
                { id: '1', name: 'Ayşe Yılmaz', location: 'İstanbul', badge: 'VIP', image: null },
                { id: '2', name: 'Zeynep Kaya', location: 'Ankara', badge: 'Yeni', image: null },
                { id: '3', name: 'Elif Şahin', location: 'İzmir', badge: 'Premium', image: null },
              ]).map((escort: any) => (
                <div key={escort.id} className="p-4 border rounded-xl hover:shadow-md transition-all group border-border/50 bg-muted/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-gold-500/20 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-700 group-hover:scale-105 transition-transform overflow-hidden">
                      {escort.image ? (
                        <img src={escort.image} alt={escort.name} className="w-full h-full object-cover" />
                      ) : (
                        escort.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground/90 truncate">{escort.name}</p>
                      <p className="text-xs text-muted-foreground">{escort.location}</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] uppercase font-bold py-0.5">
                      {escort.badge}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs h-8 hover:bg-emerald-50"
                      onClick={() => navigate(`/escort/${escort.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1.5" />
                      Yönet
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hero Banner CMS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-emerald-500" />
              Hero Banner Yapılandırması
            </CardTitle>
            <CardDescription>Ana sayfada karşılama bölümünün içeriğini düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-tight">Banner Ana Başlık (H1)</Label>
              <Input
                defaultValue="Türkiye'nin En Güvenilir ve Seçkin Platformu"
                className="w-full h-10"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-tight">Alt Açıklama</Label>
              <Input
                defaultValue="Galaktik bir deneyim için hayallerinizdeki isimler burada."
                className="w-full h-10"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-tight">Banner Arkaplan Medyası</Label>
              <div className="border-2 border-dashed rounded-2xl p-10 text-center hover:bg-muted/10 transition-colors cursor-pointer group border-border/60">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-bold text-foreground/80 mb-1">Yeni Medya Yükleyin</p>
                <p className="text-xs text-muted-foreground">Sürükle bırak veya tıklayarak seçin</p>
                <p className="text-[10px] text-muted-foreground/60 mt-4 uppercase font-mono tracking-widest italic">ÖNERİLEN: 1920x800px • WEBP/MP4</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold px-8 shadow-md shadow-emerald-500/20">
                <Save className="w-4 h-4 mr-2" />
                Vitrini Güncelle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
