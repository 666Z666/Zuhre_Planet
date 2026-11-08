/**
 * Customer Dashboard Page
 *
 * Main dashboard for customer users after login.
 * Shows favorites, appointments, messages, and activity history.
 */

import { useMemo } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockEscorts } from '@/data/mockData/escorts';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import {
  Heart, Calendar, MessageCircle, Search, User,
  MapPin, Phone, Crown, Wallet, CheckCircle2, ChevronRight, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/pages/SEO';

/**
 * Appointment status
 */
type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending';

/**
 * Status badge component
 */
function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = {
    upcoming: { label: 'Gelecek', color: 'bg-blue-500/15 text-blue-300 border border-blue-500/25' },
    completed: { label: 'Tamamlandı', color: 'bg-green-500/15 text-green-300 border border-green-500/25' },
    cancelled: { label: 'İptal', color: 'bg-red-500/15 text-red-300 border border-red-500/25' },
    pending: { label: 'Bekliyor', color: 'bg-amber-500/15 text-amber-300 border border-amber-500/25' },
  };

  const { label, color } = config[status];

  return (
    <Badge className={`${color} font-semibold`}>
      {label}
    </Badge>
  );
}

const mockAppointments = [
  {
    id: '1',
    escortId: '1',
    escortName: 'Ayşe Y.',
    escortPhoto: mockEscorts[0]?.profilePhoto,
    date: '2026-01-25',
    time: '19:00',
    status: 'upcoming' as AppointmentStatus,
    service: 'Akşam Yemeği',
    location: 'İstanbul, Beşiktaş',
    price: 1500,
  },
  {
    id: '2',
    escortId: '3',
    escortName: 'Zeynep K.',
    escortPhoto: mockEscorts[2]?.profilePhoto,
    date: '2026-01-20',
    time: '20:00',
    status: 'completed' as AppointmentStatus,
    service: 'Etkinlik Eşliği',
    location: 'İstanbul, Kadıköy',
    price: 2000,
  },
  {
    id: '3',
    escortId: '5',
    escortName: 'Elif S.',
    escortPhoto: mockEscorts[4]?.profilePhoto,
    date: '2026-01-22',
    time: '18:00',
    status: 'upcoming' as AppointmentStatus,
    service: 'Özel Davet',
    location: 'İstanbul, Şişli',
    price: 3000,
  },
];

const mockMessages = [
  {
    id: '1',
    escortId: '1',
    escortName: 'Ayşe Y.',
    escortPhoto: mockEscorts[0]?.profilePhoto,
    lastMessage: 'Randevu detaylarını konuşalım mı?',
    time: '14:30',
    unread: 2,
  },
  {
    id: '2',
    escortId: '5',
    escortName: 'Elif S.',
    escortPhoto: mockEscorts[4]?.profilePhoto,
    lastMessage: 'Teşekkür ederim!',
    time: 'Dün',
    unread: 0,
  },
];

export default function CustomerDashboard() {
  const { isAdmin } = useAuth();
  
  const favorites = useMemo(() => mockEscorts.slice(0, 6), []);
  const favoritesCount = 12;

  const stats = useMemo(() => ({
    favorites: favoritesCount,
    upcomingAppointments: mockAppointments.filter(a => a.status === 'upcoming').length,
    unreadMessages: mockMessages.reduce((sum, m) => sum + m.unread, 0),
    totalBookings: 24,
  }), []);

  return (
    <ProtectedRoute accessLevel={isAdmin ? "admin" : "customer"}>
      <CustomerDashboardLayout>
        <SEO
          title="Müşteri Paneli | Zühre Planet"
          description="Favorileriniz, randevularınız ve mesajlarınızı yönetin."
        />

        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Genel Bakış</h1>
              <Link href="/membership">
                <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 gap-2">
                  <Crown className="w-4 h-4" /> Elite Üyelik
                </Button>
              </Link>
            </div>

            {/* V5.0 FINANCIAL HUB - TWO COLUMN CTA SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Elite Membership CTA */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-900/40 via-yellow-900/10 to-amber-900/40 border border-amber-500/20 p-8 shadow-2xl group"
               >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] -mr-32 -mt-32 animate-pulse" />
                 <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                   <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-900/40 flex-shrink-0">
                       <Crown className="w-8 h-8 text-white" />
                     </div>
                     <div>
                       <h2 className="text-xl font-black text-white italic tracking-tight">GALAXY ELITE</h2>
                       <p className="text-amber-200/40 text-[10px] font-bold uppercase tracking-widest mt-1">GİZLİ PROFİLLER & ÖNCELİK</p>
                     </div>
                   </div>
                   <Link href="/membership">
                     <Button className="px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[9px] group">
                       KEŞFET
                     </Button>
                   </Link>
                 </div>
               </motion.div>

               {/* NEBULA WALLET CTA (Phase 11) */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-primary/5 to-emerald-400/10 border border-primary/20 p-8 shadow-2xl group"
               >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 animate-pulse" />
                 <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                   <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/40 flex-shrink-0">
                       <Wallet className="w-8 h-8 text-white" />
                     </div>
                     <div>
                       <h2 className="text-xl font-black text-white italic tracking-tight">4,850 <span className="text-primary italic">NP</span></h2>
                       <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest mt-1">MEVCUT BAKİYENİZ</p>
                     </div>
                   </div>
                   <Link href="/dashboard/wallet">
                     <Button className="px-6 py-4 rounded-xl bg-primary hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[9px] group transition-all">
                       CÜZDANI YÖNET
                     </Button>
                   </Link>
                 </div>
               </motion.div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10">
                        <Heart className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.favorites}</div>
                        <div className="text-sm text-muted-foreground">Favoriler</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <Calendar className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.upcomingAppointments}</div>
                        <div className="text-sm text-muted-foreground">Gelecek Randevu</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-blue-500/10">
                        <MessageCircle className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.unreadMessages}</div>
                        <div className="text-sm text-muted-foreground">Okunmamış</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-green-500/10">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <div className="text-2xl font-black">{stats.totalBookings}</div>
                        <div className="text-sm text-muted-foreground">Toplam Randevu</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>


            {/* Quick Actions */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/escorts">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      İlan Ara
                    </Button>
                  </Link>
                  <Link href="/favorites">
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorilerim
                    </Button>
                  </Link>
                  <Link href="/messages">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Mesajlar
                    </Button>
                  </Link>
                  <Link href="/appointments">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Randevularım
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Yaklaşan Randevular</CardTitle>
                    <Link href="/appointments">
                      <Button variant="link" className="text-blue-400 p-0">
                        Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAppointments
                      .filter(a => a.status === 'upcoming')
                      .map((appointment) => (
                        <div key={appointment.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex-shrink-0">
                            <img
                              src={appointment.escortPhoto}
                              alt={appointment.escortName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-white">{appointment.escortName}</h4>
                                <p className="text-sm text-white/60">{appointment.service}</p>
                              </div>
                              <StatusBadge status={appointment.status} />
                            </div>
                            <div className="flex items-center gap-4 text-sm text-white/50">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(appointment.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{appointment.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Mesaj
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Ara
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Mesajlar</CardTitle>
                    <Link href="/messages">
                      <Button variant="link" className="text-blue-400 p-0">
                        Tümünü Gör <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockMessages.map((message) => (
                      <Link key={message.id} href={`/messages/${message.escortId}`}>
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-emerald-500/20">
                              <img
                                src={message.escortPhoto}
                                alt={message.escortName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {message.unread > 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {message.unread}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-white truncate">{message.escortName}</h3>
                              <span className="text-xs text-white/40">{message.time}</span>
                            </div>
                            <p className="text-sm text-white/55 truncate">{message.lastMessage}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Favorites Preview */}
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Favoriler</CardTitle>
                  <Link href="/favorites">
                    <Button variant="link" className="text-blue-400 p-0">
                      Tümünü Gör ({stats.favorites}) <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {favorites.map((escort) => (
                    <Link key={escort.id} href={`/escort/${escort.id}`}>
                      <Card className="glass overflow-hidden group hover:border-blue-500/50 transition-colors cursor-pointer">
                        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-emerald-500/10">
                          <img
                            src={escort.profilePhoto || 'https://via.placeholder.com/300'}
                            alt={escort.displayName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute top-2 right-2">
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-semibold text-sm truncate">{escort.displayName}</h3>
                          <p className="text-xs text-muted-foreground">{escort.city}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}