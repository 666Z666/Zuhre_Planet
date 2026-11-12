import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Tag, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Zap, 
  Clock, 
  Plus,
  ShoppingBag,
  MoreVertical
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const mockStoreItems = [
  { id: 'item-1', name: 'VİP RANDEVU ROZETİ', category: 'Membership', price: 990, duration: '30 Gün', status: 'active', sales: 124 },
  { id: 'item-2', name: 'ANA SAYFA BOOST (1 SAAT)', category: 'Boost', price: 250, duration: '1 Saat', status: 'active', sales: 492 },
  { id: 'item-3', name: 'PLATİNUM ÜYE PAKETİ', category: 'Package', price: 2490, duration: '30 Gün', status: 'inactive', sales: 0 },
];

export const StoreTab = () => {
  const [items, setItems] = useState(mockStoreItems);

  const toggleStatus = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item
    ));
    toast.info('Ürün durumu güncellendi.');
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success('Ürün mağazadan kaldırıldı.');
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-2">
            <h2 className="text-3xl font-black font-orbitron text-white flex items-center gap-3 italic">
               <ShoppingBag className="w-8 h-8 text-emerald-400" />
               PRO MAĞAZA <span className="text-emerald-400 italic">KATALOĞU</span>
            </h2>
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">Eskortlara Sunulan Paket ve Özelliklerin Yönetimi</p>
         </div>
         <Button className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest italic shadow-xl shadow-emerald-600/20">
            YENİ ÜRÜN EKLE <Plus className="w-4 h-4 ml-2" />
         </Button>
      </div>

      {/* ITEMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                 <Card className={`relative overflow-hidden border-2 transition-all rounded-[3rem] p-10 bg-[#0a0a0f] backdrop-blur-3xl shadow-2xl ${
                   item.status === 'active' ? 'border-emerald-500/20 hover:border-emerald-500/50' : 'border-white/5 opacity-60 grayscale'
                 }`}>
                    {/* Floating Icon */}
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                       <Zap className="w-32 h-32 text-emerald-400" />
                    </div>

                    <div className="flex flex-col gap-6 relative z-10">
                       <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[9px] font-black px-4 py-1.5 rounded-full border-white/10 text-emerald-400 uppercase tracking-widest italic">{item.category}</Badge>
                          <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500"><MoreVertical className="w-5 h-5" /></Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
                                <DropdownMenuItem className="text-xs" onClick={() => toggleStatus(item.id)}>
                                   {item.status === 'active' ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                   {item.status === 'active' ? 'Yayından Kaldır' : 'Yayınla'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs"><Edit3 className="w-4 h-4 mr-2" /> Düzenle</DropdownMenuItem>
                                <DropdownMenuItem className="text-xs text-red-500" onClick={() => deleteItem(item.id)}><Trash2 className="w-4 h-4 mr-2" /> Sil</DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </div>

                       <div className="space-y-2">
                          <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{item.name}</h4>
                          <div className="flex items-center gap-3 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                             <Clock className="w-3 h-3" /> {item.duration} SÜRELİ
                          </div>
                       </div>

                       <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                          <div>
                             <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">SATIŞ FİYATI</p>
                             <h5 className="text-3xl font-black text-white italic">₺{item.price}</h5>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">TOPLAM SATIŞ</p>
                             <h5 className="text-xl font-black text-emerald-400 italic">{item.sales}</h5>
                          </div>
                       </div>
                    </div>
                 </Card>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-10">
         <SmallStat label="AKTİF ÜRÜN" value={items.filter(i => i.status === 'active').length} icon={Package} />
         <SmallStat label="TASLAK ÜRÜN" value={items.filter(i => i.status === 'inactive').length} icon={EyeOff} />
         <SmallStat label="TOPLAM GELİR" value="₺45,920" icon={Tag} />
         <SmallStat label="POPÜLER ÜRÜN" value="BOOST" icon={Zap} />
      </div>

    </div>
  );
};

interface SmallStatProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}

const SmallStat = ({ label, value, icon: Icon }: SmallStatProps) => (
  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4 transition-all hover:bg-white/10 shrink-0">
     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-emerald-400" />
     </div>
     <div>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">{label}</p>
        <p className="text-lg font-black text-white italic">{value}</p>
     </div>
  </div>
);
