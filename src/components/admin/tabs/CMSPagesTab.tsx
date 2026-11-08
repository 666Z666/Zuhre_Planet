import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileEdit, 
  Plus, 
  Eye, 
  Trash2, 
  Search, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Smartphone,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const CMSPagesTab: React.FC = () => {
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
                <FileEdit className="w-5 h-5 text-primary" />
                İçerik Yönetim Sistemi (CMS)
              </CardTitle>
              <CardDescription>Platformdaki tüm statik ve dinamik sayfaların yönetimi.</CardDescription>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 font-bold px-6 shadow-md shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Sayfa Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input placeholder="Sayfa başlığı veya URL ile ara..." className="pl-10 h-10 border-border/60" />
            </div>
            <Button variant="outline" className="h-10 border-border/60">
               Taslaklar (2)
            </Button>
          </div>

          {/* Pages List */}
          <div className="space-y-4">
            {[
              { id: '1', title: 'Hakkımızda', url: '/about', status: 'published', lastUpdate: '2 gün önce', type: 'system' },
              { id: '2', title: 'Güvenlik Rehberi', url: '/safety', status: 'published', lastUpdate: '1 hafta önce', type: 'guide' },
              { id: '3', title: 'VIP Üyelik Avantajları', url: '/premium', status: 'draft', lastUpdate: '1 saat önce', type: 'marketing' },
              { id: '4', title: 'KVKK Bilgilendirme', url: '/kvkk', status: 'published', lastUpdate: '1 ay önce', type: 'legal' },
              { id: '5', title: 'İletişim Kuralları', url: '/contact-terms', status: 'published', lastUpdate: '3 gün önce', type: 'system' },
            ].map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/5 transition-all group border-border/50">
                <div className="flex items-center gap-4">
                   <div className={`p-2 rounded-lg ${
                      page.type === 'legal' ? 'bg-red-500/10 text-red-600' :
                      page.type === 'guide' ? 'bg-green-500/10 text-green-600' :
                      'bg-emerald-500/10 text-emerald-600'
                   }`}>
                      <FileEdit className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <p className="font-bold text-sm text-foreground/90">{page.title}</p>
                         <Badge variant={page.status === 'published' ? 'secondary' : 'outline'} className="text-[10px] uppercase font-bold py-0.5 border-transparent">
                            {page.status === 'published' ? 'YAYINDA' : 'TASLAK'}
                         </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                         <Globe className="w-3 h-3" />
                         {page.url}
                         <span className="mx-1">•</span>
                         <Clock className="w-3 h-3" />
                         {page.lastUpdate} güncellendi
                      </p>
                   </div>
                </div>

                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" className="h-9 hover:bg-muted px-2 flex items-center gap-2 text-xs font-semibold">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      Önizle
                   </Button>
                   <Button variant="ghost" size="sm" className="h-9 hover:bg-muted px-2 flex items-center gap-2 text-xs font-semibold">
                      <Settings className="w-4 h-4 text-primary" />
                      Ayarlar
                   </Button>
                   <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t">
             <h3 className="text-sm font-bold flex items-center gap-2 mb-6 text-foreground/70">
                <Smartphone className="w-4 h-4" />
                SEO & Meta Veri Yapılandırması
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-muted/20 border border-dashed border-border/60">
                <div className="space-y-4">
                   <p className="text-xs font-bold uppercase opacity-50">Global Title</p>
                   <Input defaultValue="Zühre Planet - Galaktik Escort Platformu" className="h-10 text-sm font-semibold" />
                </div>
                <div className="space-y-4">
                   <p className="text-xs font-bold uppercase opacity-50">Global Description</p>
                   <Input defaultValue="Türkiye'nin en seçkin escort ve VIP hizmet platformu." className="h-10 text-sm font-semibold" />
                </div>
                <div className="space-y-4 flex flex-col justify-end">
                   <Button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Meta Verileri Kaydet
                   </Button>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
