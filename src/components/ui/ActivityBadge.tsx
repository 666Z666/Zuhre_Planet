import type { ActivityBucket } from '@/types/domain';
import { useT } from '@/contexts/LanguageContext';

/** "Şu an müsait" yerine son aktiflik. Tam saat gösterilmez, yalnız kaba dilim. */
export const ACTIVITY_LABEL: Record<ActivityBucket, string> = {
  online: 'Çevrimiçi',
  today: 'Bugün aktif',
  week: 'Bu hafta aktif',
  month: 'Bu ay aktif',
  inactive: 'Uzun süredir pasif',
};

const DOT: Record<ActivityBucket, string> = {
  online: 'bg-emerald-400',
  today: 'bg-emerald-600',
  week: 'bg-amber-400',
  month: 'bg-white/40',
  inactive: 'bg-white/20',
};

export function ActivityBadge({ activity, className = '' }: { activity?: ActivityBucket; className?: string }) {
  const t = useT();
  if (!activity || activity === 'inactive') return null;
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-2xl px-3 py-1.5 rounded-[1.2rem] border border-white/10 ${className}`}
      title={t('activity.label')}
    >
      <span className="relative flex h-2 w-2">
        {activity === 'online' && <span className={`absolute inline-flex h-full w-full rounded-full ${DOT[activity]} opacity-75 animate-ping`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${DOT[activity]}`} />
      </span>
      <span className="text-[8px] font-black uppercase text-white tracking-[0.2em]">{t(`activity.${activity}`)}</span>
    </div>
  );
}
