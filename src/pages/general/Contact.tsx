import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Sparkles, 
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SEOManager } from '@/components/SEOManager';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface ContactMethodProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  delay: number;
}

const ContactMethod = ({ icon: Icon, title, desc, delay }: ContactMethodProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8 }}
    className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-all"
  >
    <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h4 className="text-sm font-black text-white italic uppercase tracking-widest mb-1">{title}</h4>
    <p className="text-[10px] font-black italic text-white/30 uppercase tracking-[0.2em]">{desc}</p>
  </motion.div>
);

export default function Contact() {
  const empty = { name: '', email: '', subject: '', message: '', website: '' };
  const [formState, setFormState] = useState(empty);
  const send = trpc.support.contact.useMutation({
    onSuccess: (r) => {
      toast.success(r.message);
      setFormState(empty);
    },
    onError: (e) => {
      const zodMsg = (e.data as { zodError?: { fieldErrors?: Record<string, string[]> } } | undefined)?.zodError?.fieldErrors;
      const first = zodMsg && Object.values(zodMsg).flat()[0];
      toast.error(first ?? e.message);
    },
  });
  const isSubmitting = send.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send.mutate({ ...formState, website: formState.website || undefined });
  };

  return (
    <div className="min-h-screen relative w-full pt-28 md:pt-48 pb-20 md:pb-32 px-4 sm:px-6 overflow-hidden">
      <SEOManager title="Zühre Planet - İletişime Geç & Destek Merkezi" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-32">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 mb-6 md:mb-8 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl"
           >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/50 italic">7/24 Elit Destek Ağı</span>
           </motion.div>

           <h1 className="text-4xl sm:text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-none h-premium mb-6 md:mb-8">
              BİZE <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">ULAŞIN</span>
           </h1>

           <p className="max-w-2xl mx-auto text-xs sm:text-sm font-black italic uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/40 leading-relaxed">
              Sorularınız, iş ortaklıkları veya elit üyelik başvuruları için <br className="hidden sm:inline" /> 
              danışmanlarımız her an yanınızda.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
           {/* Form Section */}
           <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="p-6 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] bg-white/5 border border-white/5 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
           >
              <form onSubmit={handleSubmit} className="space-y-8">
                 {/* Bot tuzağı — ekranda görünmez */}
                 <input
                   type="text"
                   name="website"
                   tabIndex={-1}
                   autoComplete="off"
                   aria-hidden="true"
                   className="hidden"
                   value={formState.website}
                   onChange={(e) => setFormState({ ...formState, website: e.target.value })}
                 />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">AD SOYAD</label>
                       <Input 
                         required
                         className="h-16 px-6 rounded-2xl bg-white/5 border-white/5 text-white font-black italic tracking-widest focus:ring-primary/20 placeholder:text-white/10"
                         placeholder="YILDIZINIZ..."
                         value={formState.name}
                         onChange={(e) => setFormState({...formState, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">E-POSTA</label>
                       <Input 
                         required
                         type="email"
                         className="h-16 px-6 rounded-2xl bg-white/5 border-white/5 text-white font-black italic tracking-widest focus:ring-primary/20 placeholder:text-white/10"
                         placeholder="GALAXY@SUPPORT..."
                         value={formState.email}
                         onChange={(e) => setFormState({...formState, email: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">KONU</label>
                    <Input 
                      className="h-16 px-6 rounded-2xl bg-white/5 border-white/5 text-white font-black italic tracking-widest focus:ring-primary/20 placeholder:text-white/10"
                      placeholder="NASIL YARDIMCI OLABİLİRİZ?"
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-4">MESAJINIZ</label>
                    <Textarea 
                      required
                      className="min-h-[180px] p-6 rounded-3xl bg-white/5 border-white/5 text-white font-black italic tracking-widest focus:ring-primary/20 placeholder:text-white/10 resize-none"
                      placeholder="ELİT DETAYLARI PAYLAŞIN..."
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                    />
                 </div>

                 <Button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="w-full h-20 rounded-[2rem] bg-primary text-white font-black italic uppercase tracking-[0.3em] text-xs hover:scale-[1.02] shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] transition-all"
                 >
                   {isSubmitting ? 'İLETİLİYOR...' : (
                     <>
                       MESAJI GÖNDER <Send className="w-4 h-4 ml-3" />
                     </>
                   )}
                 </Button>
              </form>
           </motion.div>

           {/* Info Section */}
           <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <ContactMethod icon={Mail} title="E-POSTA" desc="halo@zuhreplanet.com" delay={0.1} />
                 <ContactMethod icon={MessageSquare} title="TELEGRAM" desc="@zuhre_elite" delay={0.2} />
                 <ContactMethod icon={Phone} title="DANIŞMAN" desc="+90 (XXX) XXX XX XX" delay={0.3} />
                 <ContactMethod icon={MapPin} title="MERKEZ" desc="GALAXY TOWER / IST" delay={0.4} />
              </div>

              <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 backdrop-blur-3xl space-y-6">
                 <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">İSTATİSTİKLER</h4>
                 {[
                   { label: 'YANIT SÜRESİ', value: '< 15 DK', icon: Zap },
                   { label: 'MEMNUNİYET', value: '%99.9', icon: ShieldCheck },
                   { label: 'KÜRESEL DESTEK', value: '24/7', icon: Globe }
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <stat.icon className="w-4 h-4 text-primary" />
                         </div>
                         <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <span className="text-sm font-black text-white italic tracking-tighter">{stat.value}</span>
                   </div>
                 ))}
              </div>

              <div className="p-8 rounded-[2.5rem] bg-primary/20 border border-primary/30 flex items-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0">
                    <Zap className="w-8 h-8 text-primary animate-pulse" />
                 </div>
                 <div>
                    <h5 className="font-black text-white italic uppercase tracking-tighter">ELİT BAŞVURU</h5>
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Öncelikli onay ve VIP statüsü için Telegram üzerinden ulaşın.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
