/**
 * FAQ (Sıkça Sorulan Sorular) Page
 * 
 * Frequently Asked Questions page with categorized Q&A.
 * Helps users find answers to common questions about the platform.
 * 
 * @page
 * @category General
 */

import * as React from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Footer } from '@/components/Footer';
import { ChevronDown, HelpCircle, Search, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SEO } from '@/pages/SEO';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'customer' | 'escort' | 'payment' | 'safety';
}

const faqData: FAQItem[] = [
  {
    category: 'general',
    question: 'Platform nasıl çalışır?',
    answer: 'Zühre Planet bağımsız bir ilan ve iletişim dizinidir. Ziyaretçiler şehir ve kategori filtreleriyle ilanları inceler, favori listesini yönetir ve ilan sahibinin paylaştığı doğrudan iletişim kanallarına (Telefon veya WhatsApp) ulaşır. Platform randevu ayarlamaz ve taraflar arasındaki görüşmelere aracılık etmez.'
  },
  {
    category: 'general',
    question: 'Kayıt olmak ücretsiz mi?',
    answer: 'Evet, hem ziyaretçi hem de ilan sahibi olarak platforma kayıt olmak ücretsizdir. İlan görünürlüğünü artıran vitrin ve üyelik paketleri isteğe bağlıdır.'
  },
  {
    category: 'general',
    question: 'Gizliliğim korunuyor mu?',
    answer: 'Kullanıcı gizliliği temel önceliğimizdir. Oturum ve hesap verileriniz güvenlik standartlarına uygun şekilde korunur, üçüncü taraflarla pazarlama amacıyla paylaşılmaz. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.'
  },
  {
    category: 'customer',
    question: 'İlan sahipleriyle nasıl iletişime geçebilirim?',
    answer: 'İlan detay sayfasındaki veya hızlı önizleme penceresindeki "Şimdi Ara" ve "WhatsApp ile Yaz" butonlarını kullanarak ilan sahibinin tercih ettiği iletişim kanalına doğrudan bağlanabilirsiniz.'
  },
  {
    category: 'customer',
    question: 'Platform üzerinden randevu veya rezervasyon yapılıyor mu?',
    answer: 'Hayır. Zühre Planet yalnızca ilan ve iletişim alanı sunar; randevu, rezervasyon, ulaşım veya konaklama organizasyonu yapmaz.'
  },
  {
    category: 'customer',
    question: 'Favorilerime nasıl eklerim?',
    answer: 'Beğendiğiniz bir ilanda kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz. Favorilerinize "Favorilerim" sayfasından ulaşabilirsiniz.'
  },
  {
    category: 'customer',
    question: 'VIP üyelik ne sağlar?',
    answer: 'VIP üyelik; özel vitrin filtreleri, Red Room koleksiyonu erişimi ve öncelikli destek gibi platform içi dijital ayrıcalıklar sunar.'
  },
  {
    category: 'escort',
    question: 'Nasıl ilan profili oluştururum?',
    answer: 'İlan sahibi olarak kayıt olduktan sonra panelinizdeki "Profil Düzenle" bölümünden biyografi, şehir/ilçe, hizmet etiketleri ve fotoğraf galerisi bilgilerinizi ekleyebilirsiniz.'
  },
  {
    category: 'escort',
    question: 'Fotoğraflarım moderasyondan geçiyor mu?',
    answer: 'Evet. Yüklenen tüm görseller yayınlanmadan önce yaş, rıza ve içerik kuralları çerçevesinde moderatör onayından geçer. Doğrulama rozeti yalnızca incelemesi tamamlanan profillere verilir ve satın alınamaz.'
  },
  {
    category: 'escort',
    question: 'Platform görüşmelerden komisyon alıyor mu?',
    answer: 'Hayır. Zühre Planet taraflar arasındaki hiçbir görüşmeye veya ödemeye aracılık etmez ve komisyon almaz. Platformda yalnızca dijital ilan vitrin paketleri sunulur.'
  },
  {
    category: 'payment',
    question: 'Vitrin ve üyelik ödemeleri nasıl çalışır?',
    answer: 'Platform üzerindeki vitrin ve üyelik paketleri yalnızca dijital ilan görünürlüğü içindir. Canlı ödeme altyapısı devreye alındığında işlemler yalnızca lisanslı ödeme kuruluşları üzerinden gerçekleştirilir; kart verisi sunucularımızda tutulmaz.'
  },
  {
    category: 'safety',
    question: 'Güvenlik için nelere dikkat etmeliyim?',
    answer: 'Ön ödeme veya kapora talep eden kişilere itibar etmeyiniz. Zühre Planet hiçbir zaman görüşme ücreti veya kapora tahsil etmez.'
  },
  {
    category: 'safety',
    question: 'Şüpheli bir profili nasıl bildirebilirim?',
    answer: 'İletişim veya Destek sayfası üzerinden şüpheli gördüğünüz ilanları bildirebilirsiniz. Raporlanan içerikler moderasyon ekibimiz tarafından incelenir ve kurallara aykırı profiller yayından kaldırılır.'
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string>('all');
  const [, setLocation] = useLocation();

  const filteredFAQs = React.useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = [
    { id: 'all', label: 'Tümü', icon: HelpCircle },
    { id: 'general', label: 'Genel', icon: HelpCircle },
    { id: 'customer', label: 'Ziyaretçi', icon: MessageCircle },
    { id: 'escort', label: 'İlan Sahibi', icon: MessageCircle },
    { id: 'payment', label: 'Paketler', icon: MessageCircle },
    { id: 'safety', label: 'Güvenlik', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white pt-36">
      <SEO 
        title="Sıkça Sorulan Sorular | Zühre Planet"
        description="Zühre Planet ilan dizini, doğrulama, gizlilik ve güvenlik kuralları hakkında sıkça sorulan sorular."
      />
      
      <div className="container mx-auto px-6 pb-24 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-4">
            Sıkça Sorulan <span className="text-primary">Sorular</span>
          </h1>
          <p className="text-sm md:text-base text-white/50 mb-8 max-w-xl mx-auto">
            Platformun işleyişi, doğrulama süreçleri ve güvenlik sınırları hakkında merak edilenler.
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
              <Input
                type="text"
                placeholder="Sorularda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 py-6 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-10">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-white/5 p-2 rounded-2xl h-auto border border-white/10">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="rounded-xl py-2.5 text-xs font-black uppercase tracking-wider text-white/60 data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="glass-panel border border-white/10 rounded-3xl p-12 text-center">
              <HelpCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-base text-white/50">
                Aradığınız kriterlere uygun soru bulunamadı.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div key={index} className="glass-panel border border-white/10 rounded-3xl overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left p-6 hover:bg-white/[0.03] transition-colors flex items-center justify-between gap-4"
                  onClick={() => setExpandedId(expandedId === index ? null : index)}
                >
                  <span className="text-base md:text-lg font-black text-white">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedId === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-primary shrink-0" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedId === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-0 text-sm text-white/70 leading-relaxed border-t border-white/5">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-14 text-center">
          <div className="glass-panel border border-white/10 rounded-3xl max-w-2xl mx-auto p-8 md:p-10">
            <h3 className="text-2xl font-black uppercase italic text-white mb-3">
              Hâlâ sorunuz mu var?
            </h3>
            <p className="text-white/50 text-sm mb-6">
              Destek ve moderasyon ekibimiz size yardımcı olmak için burada.
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation('/contact')}
              className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs rounded-2xl px-8 py-6"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Destek Ekibiyle İletişime Geç
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
