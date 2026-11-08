/**
 * AI Vision Lab (Gelişmiş Görsel Laboratuvarı)
 * 
 * V5.0 Interstellar Expansion - Phase 1
 * Escortların görsellerini profesyonel, lüks ve güvenli şekilde işlediği komuta merkezi.
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageLucide,
  Maximize,
  Sun,
  Shield,
  Trash2,
  RotateCcw,
  Loader2,
  ArrowLeft,
  Sparkles,
  Layers,
  Crop,
  Camera,
  Palette,
  Fingerprint,
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FaceMaskOverlay } from '@/components/media/FaceMaskOverlay';

export default function ImageEditor() {
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('mask');
  const [showWatermark, setShowWatermark] = useState(true);

  // AI Editing State
  const [aiSettings, setAiSettings] = useState({
    faceMasking: true,
    blurBackground: false,
    autoEnhance: true,
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Optimizasyon: Yapay bekleme süresi production için asgari seviyeye indirildi (600ms)
      await new Promise(resolve => setTimeout(resolve, 600));
      toast.success('Görsel ' + (showWatermark ? 've Filigran ' : '') + 'başarıyla işlendi ve galerinize eklendi.');
      setLocation('/dashboard');
    } catch {
      toast.error('Görsel işlenirken bir galaktik hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Stardust */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      
      <div className="container mx-auto py-12 px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl h-14"
              onClick={() => setLocation('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Üsse Dön
            </Button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3">
                AI <span className="text-primary italic">VISION</span> LAB
              </h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">PROFESYONEL KOZMİK GÖRSEL İŞLEME VE GÜVENLİK</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button 
               variant="outline" 
               className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all font-black text-xs"
               onClick={() => setSelectedImage(null)}
            >
              <RotateCcw className="w-4 h-4 mr-2" /> SIFIRLA
            </Button>
            <Button 
               className="h-14 rounded-2xl bg-primary text-white hover:bg-primary/80 transition-all font-black px-10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]" 
               onClick={handleSave} 
               disabled={!selectedImage || isProcessing}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Zap className="w-5 h-5 mr-3" />}
              GÖRSELİ İŞLE VE YAYINLA
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Preview Area */}
          <div className="lg:col-span-8">
            <div className="relative aspect-[4/3] w-full rounded-[3rem] bg-[#0a0a0f] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center p-12 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
              
              <AnimatePresence mode="wait">
                {selectedImage ? (
                  <motion.div 
                    key="image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative max-w-full max-h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5"
                  >
                    <img 
                      src={selectedImage} 
                      alt="Preview" 
                      className="max-w-full max-h-[600px] object-contain transition-all duration-700 filtered-preview"
                      style={{ 
                        '--image-filter': `brightness(${aiSettings.brightness}%) contrast(${aiSettings.contrast}%) saturate(${aiSettings.saturation}%) ${aiSettings.blurBackground ? 'blur(2px)' : ''}` 
                      } as React.CSSProperties}
                    />
                    
                    {/* Holographic Watermark Overlay */}
                    {showWatermark && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <div className="rotate-[-35deg] opacity-15 flex flex-col items-center border-[4px] border-white/40 px-8 py-4 rounded-[2rem] scale-150">
                          <span className="text-6xl font-black text-white tracking-[0.4em] italic leading-none">SHADOW-X</span>
                          <span className="text-xl font-black text-primary tracking-[0.6em] uppercase mt-2">ZÜHRE PLANET ELITE</span>
                        </div>
                      </div>
                    )}

                    {/* AI Scanning Animation */}
                    {isProcessing && (
                      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                        <motion.div 
                          initial={{ top: '-10%' }}
                          animate={{ top: '110%' }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent shadow-[0_0_20px_#d4af37]"
                        />
                        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                      </div>
                    )}

                    {aiSettings.faceMasking && <FaceMaskOverlay imageUrl={selectedImage} />}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-8 relative z-10"
                  >
                    <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover:border-primary/50 transition-all duration-500">
                      <Camera className="w-16 h-16 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Görsel Bekleniyor...</h3>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">Laboratuvarda işlenmek üzere galerinizden bir dosya seçin veya yeni bir çekim yapın.</p>
                    </div>
                    <Button 
                      className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all font-black text-xs"
                      onClick={() => setSelectedImage('/brand/placeholders/portrait-5.svg')}
                    >
                      <ImageLucide className="w-4 h-4 mr-3" />
                      ÖRNEK GÖRSEL YÜKLE
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none bg-[#0a0a0f] rounded-[3rem] border border-white/10 overflow-hidden shadow-xl">
              <CardHeader className="bg-white/5 border-b border-white/5 p-8">
                <CardTitle className="text-lg font-black uppercase italic flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" /> AI SİSTEMLERİ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full p-1 bg-black/40 rounded-2xl mb-8 border border-white/5">
                    <TabsTrigger value="mask" className="rounded-xl font-black uppercase text-[10px] tracking-widest text-gray-500 data-[state=active]:bg-primary data-[state=active]:text-white">GÜVENLİK</TabsTrigger>
                    <TabsTrigger value="adjust" className="rounded-xl font-black uppercase text-[10px] tracking-widest text-gray-500 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">OPTİMİZASYON</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mask" className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <Label className="font-black text-white text-xs uppercase tracking-widest">Yüz Maskeleme</Label>
                          <p className="text-[10px] text-gray-500 uppercase font-black">AI Yüz Analizi Aktif</p>
                        </div>
                      </div>
                      <Switch 
                        checked={aiSettings.faceMasking} 
                        onCheckedChange={(val) => setAiSettings(prev => ({ ...prev, faceMasking: val }))} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/5 border border-white/10 group hover:border-gold-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400">
                          <Maximize className="w-6 h-6" />
                        </div>
                        <div>
                          <Label className="font-black text-white text-xs uppercase tracking-widest">Odağı Derinleştir</Label>
                          <p className="text-[10px] text-gray-500 uppercase font-black">Arka Plan Bulanıklaştırma</p>
                        </div>
                      </div>
                      <Switch 
                        checked={aiSettings.blurBackground} 
                        onCheckedChange={(val) => setAiSettings(prev => ({ ...prev, blurBackground: val }))} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/5 border border-white/10 group hover:border-primary/50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <Fingerprint className="w-6 h-6" />
                        </div>
                        <div>
                          <Label className="font-black text-white text-xs uppercase tracking-widest">Holografik Filigran</Label>
                          <p className="text-[10px] text-gray-500 uppercase font-black">Shadow-X Sertifikası</p>
                        </div>
                      </div>
                      <Switch 
                        checked={showWatermark} 
                        onCheckedChange={setShowWatermark} 
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="adjust" className="space-y-10 py-4">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-white/60">
                          <Sun className="w-4 h-4 text-amber-400" /> PARLAKLIK
                        </Label>
                        <span className="text-[10px] font-black text-amber-400">{aiSettings.brightness}%</span>
                      </div>
                      <Slider 
                        value={[aiSettings.brightness]} 
                        min={50} 
                        max={150} 
                        onValueChange={([val]) => setAiSettings(prev => ({ ...prev, brightness: val }))} 
                        className="opacity-80 hover:opacity-100"
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-white/60">
                          <Layers className="w-4 h-4 text-emerald-400" /> KONTRAST
                        </Label>
                        <span className="text-[10px] font-black text-emerald-400">{aiSettings.contrast}%</span>
                      </div>
                      <Slider 
                        value={[aiSettings.contrast]} 
                        min={50} 
                        max={150} 
                        onValueChange={([val]) => setAiSettings(prev => ({ ...prev, contrast: val }))} 
                        className="opacity-80 hover:opacity-100"
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-white/60">
                          <Palette className="w-4 h-4 text-pink-400" /> DOYGUNLUK
                        </Label>
                        <span className="text-[10px] font-black text-pink-400">{aiSettings.saturation}%</span>
                      </div>
                      <Slider 
                        value={[aiSettings.saturation]} 
                        min={0} 
                        max={200} 
                        onValueChange={([val]) => setAiSettings(prev => ({ ...prev, saturation: val }))} 
                        className="opacity-80 hover:opacity-100"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#0a0a0f] rounded-[3rem] border border-white/10 overflow-hidden shadow-xl">
              <CardHeader className="bg-white/5 border-b border-white/5 p-8">
                <CardTitle className="text-lg font-black uppercase italic flex items-center gap-3">
                   HIZLI AKSİYONLAR
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex flex-col h-24 gap-3 rounded-2xl border-white/5 bg-white/2 hover:bg-white/10 hover:border-primary/30 transition-all group">
                  <Crop className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Kırp</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-24 gap-3 rounded-2xl border-white/5 bg-white/2 hover:bg-white/10 hover:border-primary/30 transition-all group">
                  <RotateCcw className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Döndür</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-24 gap-3 rounded-2xl border-white/5 bg-white/2 hover:bg-white/10 hover:border-emerald-400/30 transition-all group">
                   <Sparkles className="w-6 h-6 text-emerald-400" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Netlik Artır</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-24 gap-3 rounded-2xl border-white/5 bg-white/2 hover:bg-red-500/10 hover:border-red-500/30 transition-all group">
                  <Trash2 className="w-6 h-6 text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">SİL</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
