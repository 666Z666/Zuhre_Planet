import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Search, 
  Filter,
  AlertTriangle,
  MoreVertical,
  Lock,
  User
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Mock data for Intel Moderation
const mockIntel = [
  { 
    id: 'intel-1', 
    customerName: 'Kaptan Yusuf', 
    customerPhone: '053x xxx xx 10',
    postedBy: 'Esmer Melek', 
    escortId: 'e1',
    safetyRating: 5, 
    isBlacklisted: false,
    note: 'Çok güvenilir bir profil.',
    createdAt: '2026-04-03'
  },
  { 
    id: 'intel-2', 
    customerName: 'Ahmet Yanıltır', 
    customerPhone: '054x xxx xx 22',
    postedBy: 'Sarı Fırtına', 
    escortId: 'e2',
    safetyRating: 1, 
    isBlacklisted: true,
    note: 'Sahte numara ile arıyor, randevuya gelmiyor.',
    createdAt: '2026-03-28'
  }
];

export const IntelTab = () => {
  const [intelList, setIntelList] = useState(mockIntel);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    setIntelList(intelList.filter(item => item.id !== id));
    toast.success('İstihbarat kaydı silindi.');
  };

  const toggleBlacklist = (id: string) => {
    setIntelList(intelList.map(item => 
      item.id === id ? { ...item, isBlacklisted: !item.isBlacklisted } : item
    ));
    toast.info('Karaliste durumu güncellendi.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
               <Lock className="w-6 h-6 text-red-500" />
               MÜŞTERİ İSTİHBARAT YÖNETİMİ
            </h2>
            <p className="text-muted-foreground text-sm">Eskortlar tarafından girilen gizli müşteri raporlarını denetleyin.</p>
         </div>
         <div className="flex items-center gap-2">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input 
                 placeholder="Müşteri veya Eskort ara..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 w-64 bg-muted/50 border-white/5"
               />
            </div>
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
         </div>
      </div>

      <Card className="border-white/5 bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-white/5">
                  <tr>
                     <th className="px-6 py-4">Müşteri / Hedef</th>
                     <th className="px-6 py-4">Raporlayan Eskort</th>
                     <th className="px-6 py-4 text-center">Güvenlik / Puan</th>
                     <th className="px-6 py-4">Durum</th>
                     <th className="px-6 py-4">Not</th>
                     <th className="px-6 py-4 text-right">Eylemler</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {intelList.map((item) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-white/5 transition-colors"
                      >
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                  <User className="w-4 h-4 text-red-500" />
                               </div>
                               <div>
                                  <p className="font-bold text-sm text-white">{item.customerName}</p>
                                  <p className="text-[10px] text-muted-foreground">{item.customerPhone}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <p className="text-xs text-blue-400 underline cursor-pointer">{item.postedBy}</p>
                               <ExternalLink className="w-3 h-3 text-muted-foreground" />
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex justify-center gap-1">
                               {[...Array(5)].map((_, i) => (
                                 <div 
                                   key={i} 
                                   className={`w-3 h-1 rounded-full ${i < item.safetyRating ? 'bg-red-500' : 'bg-white/5'}`} 
                                 />
                               ))}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            {item.isBlacklisted ? (
                              <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black italic">KARALİSTE</Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-500 border-green-500/20 text-[9px] font-black italic">TEMİZ</Badge>
                            )}
                         </td>
                         <td className="px-6 py-4">
                            <p className="text-xs text-muted-foreground max-w-[200px] truncate italic">"{item.note}"</p>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <MoreVertical className="w-4 h-4" />
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="bg-[#0a0a0f] border-white/10">
                                  <DropdownMenuItem className="text-xs focus:bg-white/5" onClick={() => toggleBlacklist(item.id)}>
                                     <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                                     Karaliste Değiştir
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-xs focus:bg-white/5">
                                     <Edit3 className="w-4 h-4 mr-2" /> Kaydı Düzenle
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-xs focus:bg-red-500/10 text-red-500" onClick={() => handleDelete(item.id)}>
                                     <Trash2 className="w-4 h-4 mr-2" /> Raporu Sil
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                         </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="Puanlanan Müşteri" value="1,284" icon={User} color="text-blue-500" />
         <StatCard label="Aktif Karaliste" value="156" icon={AlertTriangle} color="text-red-500" />
         <StatCard label="Güven Raporu" value="4,920" icon={ShieldAlert} color="text-amber-500" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <Card className="bg-white/5 border-white/5 p-6 rounded-[2rem]">
     <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center ${color}`}>
           <Icon className="w-6 h-6" />
        </div>
        <div>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
           <h4 className="text-2xl font-black text-white">{value}</h4>
        </div>
     </div>
  </Card>
);
