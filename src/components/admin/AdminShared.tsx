
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Eye, Search, Loader2, FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export type UserStatus = 'active' | 'pending' | 'suspended' | 'banned';
export type ListingStatus = 'active' | 'pending' | 'rejected' | 'hidden' | 'flagged' | 'expired';
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';
export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

interface StatusBadgeProps {
  status: UserStatus | ListingStatus | ReviewStatus | ReportStatus | string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
    active: { color: 'bg-green-500/10 text-green-600 border-green-500/30', label: 'Aktif', icon: CheckCircle2 },
    pending: { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', label: 'Bekliyor', icon: Clock },
    suspended: { color: 'bg-red-500/10 text-red-600 border-red-500/30', label: 'Askıya Alındı', icon: AlertTriangle },
    banned: { color: 'bg-red-900/10 text-red-700 border-red-900/30', label: 'Yasaklandı', icon: XCircle },
    rejected: { color: 'bg-red-500/10 text-red-600 border-red-500/30', label: 'Reddedildi', icon: XCircle },
    hidden: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/30', label: 'Gizli', icon: Eye },
    flagged: { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30', label: 'İşaretlendi', icon: AlertTriangle },
    visible: { color: 'bg-green-500/10 text-green-600 border-green-500/30', label: 'Görünür', icon: CheckCircle2 },
    reviewing: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/30', label: 'İnceleniyor', icon: Search },
    resolved: { color: 'bg-green-500/10 text-green-600 border-green-500/30', label: 'Çözüldü', icon: CheckCircle2 },
    dismissed: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/30', label: 'Yok Sayıldı', icon: XCircle },
    approved: { color: 'bg-green-500/10 text-green-600 border-green-500/30', label: 'Onaylandı', icon: CheckCircle2 },
    expired: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/30', label: 'Süresi Doldu', icon: Clock },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} ${size === 'sm' ? 'text-xs' : ''}`}>
      <Icon className={`w-3 h-3 mr-1 ${size === 'sm' ? 'w-2.5 h-2.5' : ''}`} />
      {config.label}
    </Badge>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} text-primary`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );
}

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon = FileText, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
      >
        <Icon className="w-8 h-8 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4 max-w-md">{description}</p>}
      {action && (
        <Button onClick={action.onClick}>
          <Plus className="w-4 h-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

export const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
