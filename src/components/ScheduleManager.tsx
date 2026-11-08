/**
 * Schedule Manager Component
 * 
 * Müsaitlik takvimi ve randevu saatleri yönetimi.
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface ScheduleManagerProps {
  initialSlots?: TimeSlot[];
  onSave?: (slots: TimeSlot[]) => Promise<void>;
  className?: string;
}

const DAYS = [
  'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'
];

export function ScheduleManager({
  initialSlots = [],
  onSave,
  className = '',
}: ScheduleManagerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>(initialSlots);
  const [selectedDay, setSelectedDay] = useState('Pazartesi');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day: selectedDay,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    };
    setSlots([...slots, newSlot]);
  };

  const handleRemoveSlot = (id: string) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  const handleUpdateSlot = (id: string, updates: Partial<TimeSlot>) => {
    setSlots(slots.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(slots);
      }
      toast.success('Takvim başarıyla güncellendi.');
    } catch (error) {
      console.error('Takvim kaydetme hatası:', error);
      toast.error('Takvim güncellenirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentSlots = slots.filter(s => s.day === selectedDay);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Gün Seçimi */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${
              selectedDay === day
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Slot Listesi */}
      <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 text-white">
            <Calendar className="w-5 h-5 text-pink-500" />
            <h3 className="font-bold font-orbitron">{selectedDay} Planı</h3>
          </div>
          <button
            onClick={handleAddSlot}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Saat Ekle
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {currentSlots.length > 0 ? (
              currentSlots.map((slot) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 group"
                >
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleUpdateSlot(slot.id, { startTime: e.target.value })}
                        className="bg-transparent text-white font-bold text-sm focus:outline-none"
                      />
                    </div>
                    <span className="text-gray-600">-</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleUpdateSlot(slot.id, { endTime: e.target.value })}
                      className="bg-transparent text-white font-bold text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateSlot(slot.id, { isAvailable: !slot.isAvailable })}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                        slot.isAvailable
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {slot.isAvailable ? 'Müsait' : 'Meşgul'}
                    </button>
                    <button
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-12 text-center space-y-3 opacity-40">
                <Clock className="w-12 h-12 mx-auto" />
                <p className="text-sm font-bold">Bu gün için planlanmış saat bulunmuyor.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Kaydet */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-gold-600 text-white font-bold uppercase tracking-widest hover:from-pink-500 hover:to-gold-500 disabled:opacity-50 transition-all shadow-xl shadow-pink-600/20"
      >
        {isSaving ? (
          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5" />
            Ayarları Kaydet
          </>
        )}
      </button>
    </div>
  );
}
