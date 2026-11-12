/**
 * Support Page
 * 
 * Customer support and help center page.
 * Provides multiple ways to contact support and access help resources.
 * 
 * @page
 * @category General
 */

import * as React from 'react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, Mail, ShieldAlert, Clock, HelpCircle, 
  Send, CheckCircle
} from 'lucide-react';
import { SEO } from '@/pages/SEO';
import { trpc } from '@/lib/trpc';

export default function Support() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const contactMutation = trpc.support.contact.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('Destek talebiniz alındı.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
    onError: (err) => {
      toast.error(err.message || 'Gönderim sırasında bir hata oluştu.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const contactMethods = [
    {
      title: 'İletişim Merkezi',
      description: 'Moderasyon ve destek talepleri için çevrimiçi form',
      icon: MessageCircle,
      color: 'from-primary to-emerald-600',
      action: 'Forma Git',
      href: '/contact',
      available: '7/24 Kayıt Açık',
    },
    {
      title: 'E-posta',
      description: 'support@zuhreplanet.com',
      icon: Mail,
      color: 'from-amber-500 to-orange-600',
      action: 'E-posta Gönder',
      href: 'mailto:support@zuhreplanet.com',
      available: '24 saat içinde yanıt',
    },
    {
      title: 'Güvenlik & İhlal Bildirimi',
      description: 'Rıza dışı içerik veya kural ihlali bildirimi',
      icon: ShieldAlert,
      color: 'from-rose-500 to-red-600',
      action: 'Güvenlik İlkeleri',
      href: '/safety',
      available: 'Öncelikli İnceleme',
    },
    {
      title: 'SSS',
      description: 'Sıkça sorulan soruları inceleyin',
      icon: HelpCircle,
      color: 'from-emerald-500 to-teal-600',
      action: 'SSS\'ye Git',
      href: '/faq',
      available: 'Her zaman erişilebilir',
    },
  ];

  const officeHours = [
    { day: 'Moderasyon & İhlal İnceleme', hours: '7/24 Aktif' },
    { day: 'Hesap ve Üyelik Desteği', hours: '09:00 - 22:00' },
    { day: 'Hukuki / KVKK Başvuruları', hours: 'Hafta içi 09:00 - 18:00' },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white pt-36">
      <SEO 
        title="Destek ve Yardım | Zühre Planet"
        description="Zühre Planet destek ve moderasyon merkezi. Sorularınız ve bildirimleriniz için bize ulaşın."
      />
      
      <div className="container mx-auto px-6 pb-24 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-4">
            Destek ve <span className="text-primary">Yardım Merkezi</span>
          </h1>
          <p className="text-sm md:text-base text-white/50">
            Moderasyon, hesap güvenliği ve gizlilik talepleriniz için destek ekibimiz yanınızda.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="glass-panel border border-white/10 rounded-3xl p-6 text-center flex flex-col justify-between">
                <div>
                  <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-black uppercase italic text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-white/60 mb-2 text-xs">
                    {method.description}
                  </p>
                  <p className="text-[11px] text-primary font-bold uppercase tracking-wider mb-6">
                    {method.available}
                  </p>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (method.href.startsWith('mailto:')) {
                      window.location.href = method.href;
                    } else {
                      setLocation(method.href);
                    }
                  }}
                  className="w-full rounded-xl border-white/15 bg-white/5 hover:bg-primary hover:text-white text-white font-bold text-xs"
                >
                  {method.action}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass-panel border border-white/10 rounded-3xl p-8">
            <h2 className="text-2xl font-black uppercase italic text-white mb-2">Bize Ulaşın</h2>
            <p className="text-white/50 text-xs mb-6">
              Formu doldurun, talebiniz doğrudan destek kayıtlarımıza iletilsin.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  Adınız / Rumuzunuz
                </label>
                <Input
                  type="text"
                  placeholder="Adınız veya Rumuzunuz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  E-posta
                </label>
                <Input
                  type="email"
                  placeholder="ornek@eposta.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  Konu (en az 3 karakter)
                </label>
                <Input
                  type="text"
                  placeholder="Konu başlığı"
                  minLength={3}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  Mesajınız (en az 10 karakter)
                </label>
                <Textarea
                  placeholder="Detaylı açıklama..."
                  rows={5}
                  minLength={10}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  required
                />
              </div>

              {isSubmitted && (
                <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Destek talebiniz kaydedildi. En kısa sürede size dönüş yapacağız.</span>
                </div>
              )}

              <Button 
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs py-6 rounded-xl"
              >
                <Send className="w-4 h-4 mr-2" />
                {contactMutation.isPending ? 'Gönderiliyor...' : 'Talebi Gönder'}
              </Button>
            </form>
          </div>

          {/* Contact Info & Office Hours */}
          <div className="space-y-6">
            <div className="glass-panel border border-white/10 rounded-3xl p-8">
              <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                Destek Çalışma Saatleri
              </h3>
              <div className="space-y-4">
                {officeHours.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0 text-sm">
                    <span className="text-white/70 font-medium">{item.day}</span>
                    <span className="text-primary font-bold">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel border border-white/10 rounded-3xl p-8">
              <h3 className="text-lg font-black uppercase italic text-white mb-4">
                Hızlı Bağlantılar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setLocation('/faq')} className="h-auto py-3.5 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold">
                  SSS
                </Button>
                <Button variant="outline" onClick={() => setLocation('/how-it-works')} className="h-auto py-3.5 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold">
                  Nasıl Çalışır
                </Button>
                <Button variant="outline" onClick={() => setLocation('/terms')} className="h-auto py-3.5 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold">
                  Kullanım Koşulları
                </Button>
                <Button variant="outline" onClick={() => setLocation('/privacy')} className="h-auto py-3.5 border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-bold">
                  Gizlilik Politikası
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
