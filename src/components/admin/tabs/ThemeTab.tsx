import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Type, 
  Monitor, 
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAdminSettings } from '@/contexts/AdminSettingsContext';

import { useLuxuryTheme, LuxuryThemeMode } from '@/contexts/LuxuryThemeContext';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const ThemeTab: React.FC = () => {
  const { settings, updateSettings } = useAdminSettings();
  const { theme, setTheme } = useLuxuryTheme();

  const themes: { id: LuxuryThemeMode; name: string; desc: string; icon: LucideIcon; color: string }[] = [
    { id: 'diamond', name: 'DIAMOND VAULT', desc: 'Güç, Lüks, Altın Işıltısı', icon: Sparkles, color: 'from-amber-400 to-orange-600' },
    { id: 'ocean', name: 'OCEAN DESIRE', desc: 'Gizem, Derinlik, Akışkanlık', icon: Monitor, color: 'from-blue-600 to-emerald-500' },
    { id: 'velvet', name: 'VELVET HEART', desc: 'Tutku, Sıcaklık, Romantizm', icon: Zap, color: 'from-rose-600 to-red-600' },
    { id: 'minimalist', name: 'MINIMALIST MUSE', desc: 'Saflık, Modernlik, Sadelik', icon: Palette, color: 'from-slate-100 to-slate-400' },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
      className="space-y-12"
    >
      {/* SECTION: Global Experience Engine */}
      <Card className="border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-3xl font-black italic uppercase tracking-tighter h-premium">
             <Sparkles className="w-8 h-8 text-primary animate-pulse" />
             DENEYİM MOTORU (GLOBAL)
          </CardTitle>
          <CardDescription className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">Platformun tüm görsel kimliğini anında değiştirin</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {themes.map((t) => (
               <div 
                 key={t.id}
                 onClick={() => {
                   setTheme(t.id);
                   toast.success(`${t.name} Aktif Edildi`);
                 }}
                 className={`group cursor-pointer rounded-[2rem] p-6 border transition-all duration-500 ${
                   theme === t.id 
                   ? `bg-white/5 border-primary/40 shadow-xl shadow-primary/10` 
                   : 'border-white/5 hover:border-white/20 bg-transparent'
                 }`}
               >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                     <t.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className={`text-sm font-black italic uppercase tracking-tighter mb-1 ${theme === t.id ? 'text-primary' : 'text-white'}`}>{t.name}</h4>
                  <p className="text-[10px] font-black italic uppercase tracking-widest text-white/20">{t.desc}</p>
                  
                  {theme === t.id && (
                    <motion.div layoutId="active-theme" className="mt-4 flex items-center gap-2 text-[9px] font-black text-primary uppercase italic tracking-[0.2em]">
                       <ShieldCheck className="w-3 h-3" /> AKTİF DENEYİM
                    </motion.div>
                  )}
               </div>
             ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dynamic Visual Effects Controls */}
        <Card className="lg:col-span-3 border-secondary/20 shadow-xl shadow-secondary/5 bg-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-secondary animate-pulse" />
              Dinamik Görsel Efektler (Admin Kontrolü)
            </CardTitle>
            <CardDescription>
              Üyelik kartları ve doğrulama bröveleri için "Kusursuz" görsel ayarlar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Premium Glow Section */}
              <div className="space-y-6 p-6 glass-panel rounded-[2rem]">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/20 rounded-2xl">
                         <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                         <p className="font-bold">Premium Loş Işık (Glow)</p>
                         <p className="text-xs text-muted-foreground uppercase tracking-widest">VIP / GOLD / PLATINUM</p>
                      </div>
                   </div>
                   <Switch 
                     checked={settings.showPremiumGlow} 
                     onCheckedChange={(checked) => updateSettings({ showPremiumGlow: checked })}
                   />
                </div>

                <div className="space-y-3 opacity-80">
                   <Label className="text-[10px] font-black uppercase tracking-[0.2em] italic">Işık Yoğunluğu (Intensity)</Label>
                   <Select 
                     disabled={!settings.showPremiumGlow}
                     value={settings.glowIntensity} 
                     onValueChange={(val) => updateSettings({ glowIntensity: val as typeof settings.glowIntensity })}
                   >
                     <SelectTrigger className="glass-extreme border-white/10 rounded-xl">
                       <SelectValue placeholder="Yoğunluk Seçin" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="soft">Loş (Soft)</SelectItem>
                       <SelectItem value="medium">Belirgin (Medium)</SelectItem>
                       <SelectItem value="hard">Vurgulu (Cinematic)</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
              </div>

              {/* Verification Badge Section */}
              <div className="space-y-6 p-6 glass-panel rounded-[2rem]">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl">
                         <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                         <p className="font-bold">Onay Brövesi (Badge)</p>
                         <p className="text-xs text-muted-foreground uppercase tracking-widest">DOĞRULANMIŞ ÜYELER</p>
                      </div>
                   </div>
                   <Switch 
                     checked={settings.showVerificationBadge} 
                     onCheckedChange={(checked) => updateSettings({ showVerificationBadge: checked })}
                   />
                </div>

                <div className="space-y-3 opacity-80">
                   <Label className="text-[10px] font-black uppercase tracking-[0.2em] italic">Bröve Konumu (Position)</Label>
                   <Select 
                     disabled={!settings.showVerificationBadge}
                     value={settings.badgePosition} 
                     onValueChange={(val) => updateSettings({ badgePosition: val as typeof settings.badgePosition })}
                   >
                     <SelectTrigger className="glass-extreme border-white/10 rounded-xl">
                       <SelectValue placeholder="Konum Seçin" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="top-left">Sol Üst (Default)</SelectItem>
                       <SelectItem value="top-right">Sağ Üst</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card className="border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Renk Paleti
            </CardTitle>
            <CardDescription>Platformun kurumsal renk kimliği</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { name: 'Ana Renk (Primary)', default: '#d4af37', key: 'primary' },
              { name: 'İkincil Renk (Secondary)', default: '#EC4899', key: 'secondary' },
              { name: 'Vurgu Rengi (Accent)', default: '#F59E0B', key: 'accent' },
              { name: 'Arkaplan (Background)', default: '#000000', key: 'bg' },
            ].map((color) => (
              <div key={color.key} className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-tight opacity-70">{color.name}</Label>
                <div className="flex gap-2 group">
                  <div className="relative w-12 h-10 overflow-hidden rounded-lg border border-border group-hover:scale-105 transition-transform cursor-pointer">
                    <input
                      type="color"
                      defaultValue={color.default}
                      className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                      aria-label={`${color.name} Seçici`}
                    />
                  </div>
                  <Input
                    type="text"
                    defaultValue={color.default}
                    className="flex-1 font-mono text-sm tracking-widest uppercase h-10"
                    aria-label={`${color.name} HEX Kodu`}
                  />
                </div>
              </div>
            ))}
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90 font-bold transition-all active:scale-95 shadow-md shadow-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Temayı Uygula
            </Button>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5 text-emerald-500" />
              Tipografi
            </CardTitle>
            <CardDescription>Yazı tipi ve hiyerarşi ayarları</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Ana Başlık Fontu</Label>
              <Select defaultValue="inter">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Font Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter (Modern & Temiz)</SelectItem>
                  <SelectItem value="poppins">Poppins (Geometrik)</SelectItem>
                  <SelectItem value="roboto">Roboto (Standart)</SelectItem>
                  <SelectItem value="montserrat">Montserrat (Profesyonel)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Gövde Fontu</Label>
              <Select defaultValue="inter">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Font Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="open-sans">Open Sans</SelectItem>
                  <SelectItem value="lato">Lato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <Label className="mb-4 block">Görsel Önem (Visual Weight)</Label>
              <div className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border">
                 <span className="text-xs font-bold opacity-30 italic">Hafif</span>
                 <div className="flex-1 mx-4 h-1.5 bg-muted rounded-full relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md cursor-pointer border-2 border-white"></div>
                 </div>
                 <span className="text-xs font-bold opacity-30 italic">Dolgun</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cinematic & Layout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-emerald-500" />
              Görsel Modlar
            </CardTitle>
            <CardDescription>Efektler ve düzen yapılandırması</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/10 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                 <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                 <div>
                    <p className="text-sm font-bold">Sinematik Efektler</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Glow / Particles</p>
                 </div>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative p-1 shadow-inner">
                 <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Animasyon Hızı</Label>
              <Select defaultValue="normal">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hız Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Galaktik (Hızlı)</SelectItem>
                  <SelectItem value="normal">Normal (Akışında)</SelectItem>
                  <SelectItem value="slow">Derin (Yavaş)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 transition-all h-10 group">
               <LayoutDashboard className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
               Varsayılanlara Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
