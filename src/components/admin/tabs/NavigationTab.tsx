import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Plus, 
  Trash2, 
  GripVertical, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const NavigationTab: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Menu className="w-5 h-5 text-emerald-500" />
                Navigasyon Menüsü Yönetimi
              </CardTitle>
              <CardDescription>Site genelindeki menüler, linkler ve yönlendirme ayarları.</CardDescription>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold px-6 shadow-md shadow-emerald-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Menü Öğesi Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4 mb-4">
               <Button variant="secondary" className="text-xs h-8 px-4 font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">Üst Menü (Header)</Button>
               <Button variant="ghost" className="text-xs h-8 px-4 font-bold opacity-50 hover:opacity-100">Alt Menü (Footer)</Button>
               <Button variant="ghost" className="text-xs h-8 px-4 font-bold opacity-50 hover:opacity-100">Escort Paneli Sidebar</Button>
               <Button variant="ghost" className="text-xs h-8 px-4 font-bold opacity-50 hover:opacity-100">Müşteri Paneli Sidebar</Button>
            </div>

            {/* Menu Items List */}
            <div className="space-y-3">
              {[
                { id: '1', title: 'Anasayfa', url: '/', status: 'active', type: 'internal' },
                { id: '2', title: 'Katalog', url: '/catalog', status: 'active', type: 'internal' },
                { id: '3', title: 'Forum', url: '/forum', status: 'active', type: 'internal' },
                { id: '4', title: 'VIP Üyeler', url: '/escorts?type=vip', status: 'active', type: 'internal' },
                { id: '5', title: 'Blog', url: '/blog', status: 'active', type: 'internal' },
                { id: '6', title: 'Destek Hattı', url: 'https://support.example.com', status: 'active', type: 'external' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/5 transition-all group border-border/50">
                  <div className="flex items-center gap-4">
                     <GripVertical className="w-4 h-4 text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing" />
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-sm text-foreground/90">{item.title}</p>
                           {item.type === 'external' ? (
                              <Badge variant="outline" className="text-[9px] uppercase font-bold py-0.5 border-amber-500/20 text-amber-600 bg-amber-500/5">
                                 DIŞ BAĞLANTI
                              </Badge>
                           ) : (
                              <Badge variant="outline" className="text-[9px] uppercase font-bold py-0.5 border-green-500/20 text-green-600 bg-green-500/5">
                                 DAHİLİ
                              </Badge>
                           )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-1 opacity-70">{item.url}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="sm" className="h-9 hover:bg-muted px-2 flex items-center gap-2 text-xs font-semibold">
                        <ArrowRight className="w-4 h-4 text-emerald-500" />
                        Düzenle
                     </Button>
                     {item.type === 'external' && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 mx-2" />}
                     <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t">
               <div className="space-y-4 p-5 rounded-2xl bg-emerald-50/10 border border-emerald-100/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-emerald-700">
                     <ShieldCheck className="w-4 h-4" />
                     Güvenli Yönlendirmeler
                  </h4>
                  <p className="text-xs text-muted-foreground opacity-80 leading-relaxed">External (dış) linkler için "noreferrer noopener" etiketini otomatik ekle.</p>
                  <div className="flex items-center justify-between pt-2">
                     <span className="text-xs font-bold opacity-60">Aktif</span>
                     <div className="w-10 h-5 bg-emerald-600 rounded-full relative p-1 shadow-inner">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                     </div>
                  </div>
               </div>

               <div className="space-y-4 p-5 rounded-2xl bg-muted/20 border border-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground/70">
                     <Smartphone className="w-4 h-4" />
                     Mobil Navigasyon
                  </h4>
                  <p className="text-xs text-muted-foreground opacity-80 leading-relaxed">Mobil cihazlar için basitleştirilmiş (Hamburger) menü kullan.</p>
                  <div className="flex items-center justify-between pt-2">
                     <span className="text-xs font-bold opacity-60">Aktif</span>
                     <div className="w-10 h-5 bg-primary rounded-full relative p-1 shadow-inner">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
