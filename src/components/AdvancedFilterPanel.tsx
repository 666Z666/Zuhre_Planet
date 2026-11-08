import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Ruler, Weight, User, Scissors, Eye, Zap, MapPin, BadgeCheck, Wallet } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { TURKEY_LOCATIONS, getDistrictsByCity } from '@/data/locations';
import { LipsIcon, MaskIcon, CorsetIcon, SilkBowIcon } from './ui/SensualIcons';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  icon?: React.ElementType;
}

interface FilterSection {
  id: string;
  title: string;
  icon: React.ElementType;
  type: 'checkbox' | 'range' | 'minmax' | 'select' | 'grid' | 'toggle';
  /** minmax: URL anahtarları (ör. minAge / maxAge) */
  keys?: [string, string];
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

interface AdvancedFilterPanelProps {
  onFilterChange?: (filters: Record<string, any>) => void;
  onReset?: () => void;
  className?: string;
}

const filterSections: FilterSection[] = [
  {
    id: 'location',
    title: 'Konum',
    icon: MapPin,
    type: 'select',
    options: TURKEY_LOCATIONS.map(c => ({ id: c.slug, label: c.name, value: c.slug }))
  },
  {
    id: 'verified',
    title: 'Yalnız Doğrulanmış',
    icon: BadgeCheck,
    type: 'toggle',
  },
  {
    id: 'age',
    title: 'Yaş Aralığı',
    icon: User,
    type: 'minmax',
    keys: ['minAge', 'maxAge'],
    min: 18,
    max: 60,
    step: 1,
    unit: 'Yaş'
  },
  {
    id: 'price',
    title: 'Saatlik Ücret',
    icon: Wallet,
    type: 'minmax',
    keys: ['minPrice', 'maxPrice'],
    min: 0,
    max: 20000,
    step: 250,
    unit: '₺'
  },
  {
    id: 'height',
    title: 'Boy',
    icon: Ruler,
    type: 'range',
    min: 150,
    max: 190,
    step: 1,
    unit: 'cm'
  },
  {
    id: 'weight',
    title: 'Kilo',
    icon: Weight,
    type: 'range',
    min: 45,
    max: 90,
    step: 1,
    unit: 'kg'
  },
  {
    id: 'hairColor',
    title: 'Saç Rengi',
    icon: Scissors,
    type: 'grid',
    options: [
      { id: 'blonde', label: 'Sarı', value: 'blonde' },
      { id: 'brunette', label: 'Kumral', value: 'brunette' },
      { id: 'black', label: 'Siyah', value: 'black' },
      { id: 'red', label: 'Kızıl', value: 'red' },
    ],
  },
  {
    id: 'services',
    title: 'Hizmetler',
    icon: Zap,
    type: 'grid',
    options: [
      { id: 'classic', label: 'Klasik', value: 'classic', icon: LipsIcon },
      { id: 'tantric', label: 'Tantrik', value: 'tantric', icon: MaskIcon },
      { id: 'massage', label: 'Masaj', value: 'massage', icon: CorsetIcon },
      { id: 'dinner', label: 'Akşam Yemeği', value: 'dinner_date', icon: SilkBowIcon },
    ],
  },
  {
    id: 'vip_attributes',
    title: 'VIP & Özel Deneyimler',
    icon: Eye,
    type: 'grid',
    options: [
      { id: 'gfe', label: 'GFE (Kız Arkadaş)', value: 'gfe', icon: SilkBowIcon },
      { id: 'bdsm', label: 'Dominant/BDSM', value: 'bdsm', icon: CorsetIcon },
      { id: 'travel', label: 'Seyahat Uyumlu', value: 'travel_friendly', icon: MapPin },
      { id: 'redroom', label: 'The Red Room Üyesi', value: 'red_room', icon: Eye },
    ]
  },
];

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({
  onFilterChange,
  onReset,
  className = ''
}) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(['location', 'verified', 'age', 'price']);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleValueChange = (sectionId: string, value: any) => {
    const newFilters = { ...activeFilters, [sectionId]: value };
    // Şehir değişince eski ilçe geçersiz olur
    if (sectionId === 'location') delete newFilters.district;
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleToggleValue = (sectionId: string, value: string) => {
    const currentValues = activeFilters[sectionId] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];

    handleValueChange(sectionId, newValues);
  };

  const handleReset = () => {
    setActiveFilters({});
    onReset?.();
  };

  const selectedCityDistricts = useMemo(() => {
    if (activeFilters.location) {
      return getDistrictsByCity(activeFilters.location);
    }
    return [];
  }, [activeFilters.location]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center px-2">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white italic">
          ARZU <span className="text-primary">FİLTRESİ</span>
        </h3>
        <button
          onClick={handleReset}
          className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
        >
          SIFIRLA
        </button>
      </div>

      <div className="space-y-4">
        {filterSections.map((section) => (
          <div key={section.id} className="glass-panel border-white/5 rounded-3xl overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex justify-between items-center p-6 group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <section.icon className={`w-5 h-5 ${expandedSections.includes(section.id) ? 'text-primary' : 'text-white/20'}`} />
                <span className={`text-[11px] font-black uppercase tracking-widest ${expandedSections.includes(section.id) ? 'text-white' : 'text-white/40'}`}>
                  {section.title}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-500 ${expandedSections.includes(section.id) ? 'rotate-180 text-primary' : 'text-white/20'}`}
              />
            </button>

            <AnimatePresence>
              {expandedSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  {section.type === 'select' && (
                    <div className="space-y-4">
                      <select
                        value={activeFilters[section.id] || ''}
                        onChange={(e) => handleValueChange(section.id, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                      >
                        <option value="">Şehir Seçin</option>
                        {section.options?.map(opt => (
                          <option key={opt.id} value={opt.value} className="bg-slate-900">{opt.label}</option>
                        ))}
                      </select>

                      {section.id === 'location' && activeFilters.location && selectedCityDistricts.length > 0 && (
                        <select
                          value={activeFilters.district || ''}
                          onChange={(e) => handleValueChange('district', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                        >
                          <option value="">İlçe Seçin</option>
                          {selectedCityDistricts.map(dist => (
                            <option key={dist.slug} value={dist.slug} className="bg-slate-900">{dist.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {section.type === 'toggle' && (
                    <label className="flex items-center justify-between gap-4 pt-2 cursor-pointer">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                        Kimliği ve fotoğrafı doğrulanmış profiller
                      </span>
                      <input
                        type="checkbox"
                        checked={activeFilters[section.id] === true}
                        onChange={(e) => handleValueChange(section.id, e.target.checked ? true : undefined)}
                        className="h-5 w-5 accent-primary"
                        aria-label={section.title}
                      />
                    </label>
                  )}

                  {section.type === 'minmax' && section.keys && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {section.keys.map((key, i) => (
                        <label key={key} className="space-y-2">
                          <span className="block text-[9px] font-black uppercase tracking-widest text-white/40">
                            {i === 0 ? 'En az' : 'En çok'} ({section.unit})
                          </span>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={section.min}
                            max={section.max}
                            step={section.step}
                            value={activeFilters[key] ?? ''}
                            placeholder={String(i === 0 ? section.min : section.max)}
                            onChange={(e) => {
                              const raw = e.target.value;
                              if (raw === '') return handleValueChange(key, undefined);
                              const n = Math.min(section.max ?? Infinity, Math.max(section.min ?? 0, Number(raw)));
                              handleValueChange(key, Number.isFinite(n) ? n : undefined);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs font-black text-white focus:outline-none focus:border-primary/50"
                          />
                        </label>
                      ))}
                    </div>
                  )}

                  {section.type === 'range' && (
                    <div className="pt-4 space-y-4">
                      <input
                        type="range"
                        min={section.min}
                        max={section.max}
                        step={section.step}
                        value={activeFilters[section.id] || section.min}
                        onChange={(e) => handleValueChange(section.id, parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between items-center text-[9px] font-black tracking-widest text-white/40">
                        <span>{section.min} {section.unit}</span>
                        <span className="text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                          {activeFilters[section.id] || section.min} {section.unit}
                        </span>
                        <span>{section.max} {section.unit}</span>
                      </div>
                    </div>
                  )}

                  {section.type === 'grid' && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {section.options?.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleToggleValue(section.id, option.value)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                            (activeFilters[section.id] || []).includes(option.value)
                              ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                          }`}
                        >
                          {option.icon ? (
                            <option.icon size={14} className={(activeFilters[section.id] || []).includes(option.value) ? 'text-primary' : 'text-white/20'} />
                          ) : (
                            <div className={`w-2 h-2 rounded-full ${(activeFilters[section.id] || []).includes(option.value) ? 'bg-primary animate-pulse' : 'bg-white/10'}`} />
                          )}
                          <span className="text-[9px] font-black uppercase tracking-widest">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <button className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] italic shadow-2xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 group">
        KADERİ FİLTRELE <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
      </button>
    </div>
  );
};
