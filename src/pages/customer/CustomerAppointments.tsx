/**
 * Customer Appointments Page
 *
 * Yaklaşan, tamamlanan ve iptal edilen randevuları görüntüler.
 * Mock verilerle tam işlevsel UI, kozmik tema.
 *
 * @module pages/customer/CustomerAppointments
 */

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';
import { mockEscorts } from '@/data/mockData/escorts';
import { useAuth } from '@/contexts/AuthContext';
import { CustomerDashboardLayout } from '@/components/layout/CustomerDashboardLayout';
import {
  Calendar, MessageCircle, Clock, CheckCircle2, XCircle,
  MapPin, Star, Filter, ChevronDown, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/pages/SEO';

type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending';

const mockAppointments = [
  {
    id: '1',
    escortId: 'esc-001',
    escortName: 'Ayşe',
    escortPhoto: mockEscorts[0]?.profilePhoto,
    date: '2026-04-25',
    time: '19:00',
    status: 'upcoming' as AppointmentStatus,
    service: 'Akşam Yemeği Eşliği',
    location: 'İstanbul, Beşiktaş',
    price: 1500,
    duration: '2 Saat',
  },
  {
    id: '2',
    escortId: 'esc-002',
    escortName: 'Zeynep',
    escortPhoto: mockEscorts[1]?.profilePhoto,
    date: '2026-04-28',
    time: '20:00',
    status: 'upcoming' as AppointmentStatus,
    service: 'Etkinlik Eşliği',
    location: 'İstanbul, Kadıköy',
    price: 2000,
    duration: '3 Saat',
  },
  {
    id: '3',
    escortId: 'esc-003',
    escortName: 'Elif',
    escortPhoto: mockEscorts[2]?.profilePhoto,
    date: '2026-03-22',
    time: '18:00',
    status: 'completed' as AppointmentStatus,
    service: 'Özel Davet',
    location: 'İstanbul, Şişli',
    price: 3000,
    duration: '4 Saat',
  },
  {
    id: '4',
    escortId: 'esc-004',
    escortName: 'Selin',
    escortPhoto: mockEscorts[3]?.profilePhoto,
    date: '2026-03-15',
    time: '14:00',
    status: 'completed' as AppointmentStatus,
    service: 'Gündüz Eşliği',
    location: 'Ankara, Çankaya',
    price: 1200,
    duration: '2 Saat',
  },
  {
    id: '5',
    escortId: 'esc-005',
    escortName: 'Nisan',
    escortPhoto: mockEscorts[4]?.profilePhoto,
    date: '2026-03-10',
    time: '21:00',
    status: 'cancelled' as AppointmentStatus,
    service: 'Gece Eşliği',
    location: 'İzmir, Konak',
    price: 2500,
    duration: '3 Saat',
  },
  {
    id: '6',
    escortId: 'esc-006',
    escortName: 'Melis',
    escortPhoto: mockEscorts[5]?.profilePhoto,
    date: '2026-05-02',
    time: '16:00',
    status: 'pending' as AppointmentStatus,
    service: 'Özel Etkinlik',
    location: 'İstanbul, Nişantaşı',
    price: 4000,
    duration: '5 Saat',
  },
];

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; icon: React.ReactNode }> = {
  upcoming: {
    label: 'Yaklaşan',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: <Clock className="w-3 h-3" />,
  },
  completed: {
    label: 'Tamamlandı',
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  cancelled: {
    label: 'İptal Edildi',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: <XCircle className="w-3 h-3" />,
  },
  pending: {
    label: 'Onay Bekliyor',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { label, color, icon } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      {icon}
      {label}
    </span>
  );
}

export default function CustomerAppointments() {
  const { isAdmin } = useAuth();
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all');

  const stats = useMemo(() => ({
    upcoming: mockAppointments.filter((a) => a.status === 'upcoming').length,
    completed: mockAppointments.filter((a) => a.status === 'completed').length,
    cancelled: mockAppointments.filter((a) => a.status === 'cancelled').length,
    totalSpent: mockAppointments
      .filter((a) => a.status === 'completed')
      .reduce((sum, a) => sum + a.price, 0),
  }), []);

  const filtered = useMemo(
    () => filter === 'all' ? mockAppointments : mockAppointments.filter((a) => a.status === filter),
    [filter]
  );

  return (
    <ProtectedRoute accessLevel={isAdmin ? 'admin' : 'customer'}>
      <CustomerDashboardLayout>
        <SEO
          title="Randevularım | Müşteri Paneli"
          description="Yaklaşan, tamamlanan ve iptal edilen randevularınızı görüntüleyin."
        />

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Başlık */}
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              Randevularım
            </h1>
            <p className="text-white/40 text-sm mt-1">Tüm randevu geçmişiniz</p>
          </div>

          {/* İstatistik Kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Yaklaşan', value: stats.upcoming, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { label: 'Tamamlanan', value: stats.completed, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
              { label: 'İptal Edilen', value: stats.cancelled, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
              { label: 'Toplam Harcama', value: `₺${stats.totalSpent.toLocaleString()}`, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${stat.bg} border ${stat.border} rounded-2xl p-4 text-center`}
              >
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-white/40 text-xs mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Filtre Butonları */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'upcoming', 'pending', 'completed', 'cancelled'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === f
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                {f === 'all' ? 'Tümü' : STATUS_CONFIG[f].label}
              </button>
            ))}
          </div>

          {/* Randevu Listesi */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-black/20 border border-white/10 rounded-2xl p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-white/10" />
                <p className="text-white/30 font-bold uppercase italic">Bu kategoride randevu yok</p>
              </div>
            ) : (
              filtered.map((appointment, idx) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-black/20 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Fotoğraf */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-gold-500/20 shrink-0">
                      <img
                        src={appointment.escortPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.escortName}`}
                        alt={appointment.escortName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.escortName}`;
                        }}
                      />
                    </div>

                    {/* Bilgi */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-bold text-white">{appointment.escortName}</h4>
                          <p className="text-white/50 text-sm">{appointment.service}</p>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-white/40 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-blue-400" />
                          <span>{new Date(appointment.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span>{appointment.time} • {appointment.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-amber-400 font-black text-sm">₺{appointment.price.toLocaleString()}</span>

                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-medium transition-all flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            Mesaj
                          </button>
                          {appointment.status === 'upcoming' && (
                            <button className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium transition-all flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              İptal
                            </button>
                          )}
                          {appointment.status === 'completed' && (
                            <button className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-medium transition-all flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Değerlendir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}
