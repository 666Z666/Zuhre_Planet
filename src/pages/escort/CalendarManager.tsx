/**
 * Escort Takvim Yönetim Sayfası
 * 
 * Escort'ların çalışma saatlerini ve müsaitlik durumlarını yönetebildiği takvim sayfası.
 * Haftalık çalışma planı ve özel tatil günleri yönetimi sağlar.
 * 
 * @module pages/escort/CalendarManager
 * @category Pages - Escort
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Clock,
  AlertCircle,
  ArrowLeft,
  Save,
  Lock,
  Settings
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export default function CalendarManager() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Mock working hours
  const [workingHours, setWorkingHours] = useState(
    DAYS.map(day => ({
      day,
      isOpen: day !== 'Pazar',
      start: '10:00',
      end: '22:00'
    }))
  );

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Çalışma saatleriniz güncellendi');
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">TAKVİM VE MÜSAİTLİK</h1>
              <p className="text-muted-foreground">Çalışma saatlerinizi ve randevu takviminizi yönetin</p>
            </div>
          </div>
          <Button className="bg-primary" onClick={handleSave} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" /> Değişiklikleri Kaydet
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Weekly Schedule */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none glass-panel">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> HAFTALIK ÇALIŞMA PLANI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workingHours.map((item, idx) => (
                  <div key={item.day} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 gap-4">
                    <div className="flex items-center gap-4 min-w-[150px]">
                      <Switch 
                        checked={item.isOpen}
                        onCheckedChange={(val) => {
                          const newHours = [...workingHours];
                          newHours[idx].isOpen = val;
                          setWorkingHours(newHours);
                        }}
                      />
                      <span className={`font-bold ${item.isOpen ? 'text-white' : 'text-muted-foreground line-through'}`}>{item.day}</span>
                    </div>

                    {item.isOpen ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground uppercase font-black">Başlangıç</span>
                          <input 
                            type="time" 
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            value={item.start}
                            onChange={(e) => {
                              const newHours = [...workingHours];
                              newHours[idx].start = e.target.value;
                              setWorkingHours(newHours);
                            }}
                          />
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground uppercase font-black">Bitiş</span>
                          <input 
                            type="time" 
                            className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            value={item.end}
                            onChange={(e) => {
                              const newHours = [...workingHours];
                              newHours[idx].end = e.target.value;
                              setWorkingHours(newHours);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-red-400 font-bold uppercase tracking-widest italic flex items-center gap-2">
                        <Lock className="w-3 h-3" /> TATİL GÜNÜ
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Quick Settings */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none glass-panel">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> HIZLI AYARLAR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold cursor-pointer" htmlFor="instant-booking">Anında Randevu</Label>
                    <Switch id="instant-booking" defaultChecked />
                  </div>
                  <p className="text-[10px] text-primary/70">Müşterilerin onay beklemeden randevu almasına izin ver.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold cursor-pointer" htmlFor="auto-busy">Otomatik Meşgul</Label>
                    <Switch id="auto-busy" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Randevu saatlerinde profilinizi otomatik olarak "Meşgul" moduna al.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-amber-500/10 border border-amber-500/20">
              <CardContent className="p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-bold text-amber-400">Önemli Bilgi</h3>
                  <p className="text-xs text-amber-400/80 leading-relaxed">
                    Çalışma saatleriniz, arama sonuçlarındaki "Şu An Müsait" filtresini etkiler. Düzenli güncel tutmanız daha fazla randevu almanızı sağlar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
