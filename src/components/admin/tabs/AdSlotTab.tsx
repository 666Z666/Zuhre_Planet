import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  User, 
  Clock, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  AlertCircle,
  MoreVertical,
  Calendar,
  Zap,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// AdSlot type as defined in domain.ts
interface AdSlot {
  id: string;
  position: number;
  status: 'empty' | 'full' | 'reserved';
  escortId?: string;
  escortName?: string;
  escortThumbnail?: string;
  type: 'vip' | 'gold' | 'pro' | 'standard';
  expiresAt?: string;
}

const mockSlots: AdSlot[] = Array.from({ length: 20 }, (_, i) => ({
  id: `slot-${i + 1}`,
  position: i + 1,
  status: i === 0 ? 'full' : i === 3 ? 'reserved' : 'empty',
  escortName: i === 0 ? 'Esmer Melek' : undefined,
  escortId: i === 0 ? 'e1' : undefined,
  type: i < 5 ? 'vip' : i < 10 ? 'gold' : 'pro',
}));

export const AdSlotTab = () => {
  const [slots, setSlots] = useState<AdSlot[]>(mockSlots);

  const handleClearSlot = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, status: 'empty', escortId: undefined, escortName: undefined } : s));
    toast.success('Reklam alanı boşaltıldı.');
  };

  const handleReserve = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, status: 'reserved' } : s));
    toast.info('Alan rezerve edildi.');
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-2">
            <h2 className="text-3xl font-black font-orbitron text-white flex items-center gap-3 italic">
               <LayoutGrid className="w-8 h-8 text-yellow-500" />
               BÜLTEN <span className="text-yellow-500 italic">SLOT YÖNETİMİ</span>
            </h2>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Ana Sayfa İlan Dizilimi ve Reklam Alanları</p>
         </div>
         <div className="flex gap-3">
            <Button variant="outline" className="border-white/10 text-gray-400 font-black text-xs uppercase tracking-widest rounded-xl">
               TAKVİMİ GÖR <Calendar className="w-4 h-4 ml-2" />
            </Button>
            <Button className="bg-yellow-600 hover:bg-yellow-500 text-white font-black text-xs uppercase tracking-widest rounded-xl px-8 shadow-xl shadow-yellow-600/20">
               TOPLU GÜNCELLE <Zap className="w-4 h-4 ml-2" />
            </Button>
         </div>
      </div>

      {/* SLOT BOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
         {slots.map((slot) => (
           <motion.div
             key={slot.id}
             whileHover={{ y: -5 }}
             className="relative"
           >
              <Card className={`h-48 border-2 transition-all p-4 rounded-3xl bg-[#0a0a0f] flex flex-col justify-between overflow-hidden ${
                slot.status === 'full' ? 'border-yellow-500/30' :
                slot.status === 'reserved' ? 'border-blue-500/30' :
                'border-white/5 opacity-80 hover:opacity-100 hover:border-white/20'
              }`}>
                 {/* Position Badge */}
                 <div className="absolute -top-2 -right-2 w-10 h-10 bg-black/80 border border-white/10 rounded-bl-2xl flex items-center justify-center font-black text-xs text-muted-foreground italic">
                    #{slot.position}
                 </div>

                 <div className="space-y-2">
                    <Badge variant="outline" className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                       slot.type === 'vip' ? 'text-gold-400 border-gold-500/20' :
                       slot.type === 'gold' ? 'text-yellow-400 border-yellow-400/20' :
                       'text-emerald-400 border-emerald-400/20'
                    }`}>
                       {slot.type} ALANI
                    </Badge>

                    {slot.status === 'full' ? (
                       <div className="pt-2">
                          <p className="text-xs font-black text-white italic truncate">{slot.escortName}</p>
                          <p className="text-[9px] text-muted-foreground flex items-center gap-1 mt-1">
                             <Clock className="w-2.5 h-2.5" /> 14s Kaldı
                          </p>
                       </div>
                    ) : slot.status === 'reserved' ? (
                       <div className="pt-2 flex items-center gap-2 text-blue-400">
                          <AlertCircle className="w-3 h-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest italic">REZERVE</p>
                       </div>
                    ) : (
                       <div className="pt-2 flex items-center gap-2 text-gray-700">
                          <Plus className="w-3 h-3" />
                          <p className="text-[10px] font-black uppercase tracking-widest italic">BOŞ ALAN</p>
                       </div>
                    )}
                 </div>

                 <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex gap-1">
                       {slot.status === 'empty' ? (
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-500 hover:text-white" onClick={() => handleReserve(slot.id)}>
                             <Clock className="w-4 h-4" />
                          </Button>
                       ) : (
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500/50 hover:text-red-500" onClick={() => handleClearSlot(slot.id)}>
                             <Trash2 className="w-4 h-4" />
                          </Button>
                       )}
                    </div>
                    <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreVertical className="w-4 h-4" /></Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                          <DropdownMenuItem className="text-xs italic"><User className="w-4 h-4 mr-2" /> Eskort Ata</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs italic"><ShieldCheck className="w-4 h-4 mr-2" /> Sabitle</DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
              </Card>
           </motion.div>
         ))}
      </div>

      {/* QUICK INFO */}
      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col md:flex-row items-center gap-8 italic">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center border border-white/10">
               <Info className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
               <h4 className="text-sm font-black text-white">SLOT DİNAMİĞİ</h4>
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Sistem 24 saatlik döngülerle çalışır.</p>
            </div>
         </div>
         <div className="flex-1 grid grid-cols-3 gap-8">
            <div className="text-center">
               <p className="text-[9px] text-gray-600 font-black uppercase">DOLULUK</p>
               <p className="text-xl font-black text-white italic">%{(slots.filter(s=>s.status==='full').length / slots.length * 100).toFixed(0)}</p>
            </div>
            <div className="text-center border-x border-white/5">
               <p className="text-[9px] text-gray-600 font-black uppercase">BEKLEYEN İSTEK</p>
               <p className="text-xl font-black text-yellow-500 italic">12</p>
            </div>
            <div className="text-center">
               <p className="text-[9px] text-gray-600 font-black uppercase">GÜNLÜK GELİR</p>
               <p className="text-xl font-black text-green-500 italic">₺14,200</p>
            </div>
         </div>
      </div>

    </div>
  );
};
