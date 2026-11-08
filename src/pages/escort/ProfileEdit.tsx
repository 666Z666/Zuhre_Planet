/**
 * Escort Profil Düzenleme Sayfası
 * 
 * Escort'ların kendi profillerini düzenleyebileceği kapsamlı form sayfası.
 * Tüm profil bilgilerini düzenlemek için kullanılır.
 * 
 * @module pages/escort/ProfileEdit
 * @category Pages - Escort
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Camera,
  Shield,
  Save,
  ArrowLeft,
  CheckCircle2,
  Ruler,
  Weight,
  Palette,
  Eye,
  Languages,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileEdit() {
  const { user, updateProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.name || '',
    age: user?.age?.toString() || '',
    city: user?.city || '',
    district: user?.district || '',
    bio: user?.bio || '',
    height: user?.height?.toString() || '',
    weight: user?.weight?.toString() || '',
    hairColor: user?.hairColor || '',
    eyeColor: user?.eyeColor || '',
    languages: user?.languages?.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const profileUpdate: Parameters<typeof updateProfile>[0] = {
        ...formData,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        languages: formData.languages.split(',').map(l => l.trim()),
      };

      await updateProfile(profileUpdate);
      toast.success('Profiliniz başarıyla güncellendi.');
      setLocation('/escort/dashboard');
    } catch {
      toast.error('Güncellenirken bir hata oluştu.');
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
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">PROFİLİ DÜZENLE</h1>
              <p className="text-muted-foreground">Profil bilgilerinizi güncelleyerek galakside parlayın</p>
            </div>
          </div>
          <Button className="bg-primary px-8" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : <><Save className="w-4 h-4 mr-2" /> Kaydet</>}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 w-full bg-white/5 p-1 rounded-xl">
                <TabsTrigger value="basic">Temel Bilgiler</TabsTrigger>
                <TabsTrigger value="physical">Fiziksel</TabsTrigger>
                <TabsTrigger value="content">Biyografi</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-6 space-y-6">
                <Card className="border-none glass-panel">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Görünen İsim</Label>
                        <Input 
                          value={formData.displayName} 
                          onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Yaş</Label>
                        <Input 
                          type="number" 
                          value={formData.age}
                          onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Şehir</Label>
                        <Input 
                          value={formData.city}
                          onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>İlçe</Label>
                        <Input 
                          value={formData.district}
                          onChange={e => setFormData(prev => ({ ...prev, district: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="physical" className="mt-6 space-y-6">
                <Card className="border-none glass-panel">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Ruler className="w-4 h-4" /> Boy (cm)</Label>
                        <Input type="number" value={formData.height} onChange={e => setFormData(p => ({ ...p, height: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Weight className="w-4 h-4" /> Kilo (kg)</Label>
                        <Input type="number" value={formData.weight} onChange={e => setFormData(p => ({ ...p, weight: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Languages className="w-4 h-4" /> Diller</Label>
                        <Input value={formData.languages} onChange={e => setFormData(p => ({ ...p, languages: e.target.value }))} placeholder="Türkçe, İngilizce" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Palette className="w-4 h-4" /> Saç Rengi</Label>
                        <Input value={formData.hairColor} onChange={e => setFormData(p => ({ ...p, hairColor: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Eye className="w-4 h-4" /> Göz Rengi</Label>
                        <Input value={formData.eyeColor} onChange={e => setFormData(p => ({ ...p, eyeColor: e.target.value }))} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <Card className="border-none glass-panel">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Biyografi & Hikaye</Label>
                      <Textarea 
                        className="min-h-[200px]" 
                        value={formData.bio}
                        onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Müşterilerinize kendinizden bahsedin..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none glass-panel overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img 
                  src={user?.avatarUrl || '/brand/placeholders/portrait-1.svg'} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Button className="w-full bg-white/20 backdrop-blur-md border-white/20">
                    <Camera className="w-4 h-4 mr-2" /> Fotoğrafı Değiştir
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border-none glass-panel">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> DOĞRULAMA DURUMU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs font-bold text-green-500 uppercase tracking-widest">DOĞRULANDI</p>
                    <p className="text-[10px] text-muted-foreground">Profiliniz güvenilir olarak işaretlendi.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
