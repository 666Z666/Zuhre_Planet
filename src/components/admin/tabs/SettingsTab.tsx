import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  FileEdit, 
  Save, 
  Globe, 
  Mail, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const SettingsTab: React.FC = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Site Ayarları
          </CardTitle>
          <CardDescription>
            Platform genel ayarları, iletişim bilgileri ve finansal yapılandırma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* General Site Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 border p-4 rounded-xl border-border/50 bg-muted/10">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  Genel Bilgiler
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Adı</Label>
                  <Input id="site_name" defaultValue="Zühre Planet" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_url">Site URL</Label>
                  <Input id="site_url" defaultValue="https://zuhreplanet.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">İletişim E-posta</Label>
                  <Input id="contact_email" defaultValue="admin@zuhreplanet.com" />
                </div>
              </div>

              <div className="space-y-4 border p-4 rounded-xl border-border/50 bg-muted/10">
                <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Finansal Ayarlar
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="currency">Varsayılan Para Birimi</Label>
                  <Input id="currency" defaultValue="TRY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Komisyon Oranı (%)</Label>
                  <Input id="commission" type="number" defaultValue="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_payout">Minimum Ödeme Tutarı</Label>
                  <Input id="min_payout" type="number" defaultValue="500" />
                </div>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-6 border rounded-xl border-orange-100 bg-orange-50/10">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <ShieldCheck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-orange-900">Bakım Modu</p>
                  <p className="text-sm text-orange-700/70">Etkinleştirildiğinde siteyi sadece yöneticiler görebilir.</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                 <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100/50">
                   Etkinleştir
                 </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t gap-3">
              <Button variant="ghost">Değişiklikleri Sıfırla</Button>
              <Button className="bg-primary hover:bg-primary/90 font-bold px-8 transition-all hover:scale-105">
                <Save className="w-4 h-4 mr-2" />
                Ayarları Kaydet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
