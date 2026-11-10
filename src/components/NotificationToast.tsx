/**
 * Notification Toast Component
 *
 * Individual toast alert for real-time notifications.
 * Displays title, message, icon, and optional actions.
 * Supports auto-dismiss and manual dismissal.
 *
 * @module components/NotificationToast
 * @category Components - Notification
 */

import { useEffect, useState } from 'react';
import type { ElementType } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Star,
  Gift,
  Calendar,
  Shield,
  User,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification, NotificationType } from '@/contexts/NotificationContext';

interface NotificationToastProps {
  notification: Notification;
  onDismiss: () => void;
  onActionClick?: () => void;
}

const CATEGORY_COLORS: Record<NotificationType, string> = {
  message: 'bg-blue-500',
  booking: 'bg-gold-500',
  promo: 'bg-pink-500',
  system: 'bg-gray-500',
  review: 'bg-yellow-500',
  profile: 'bg-emerald-500',
};

const CATEGORY_ICONS: Record<NotificationType, ElementType> = {
  message: MessageCircle,
  booking: Calendar,
  review: Star,
  system: Shield,
  promo: Gift,
  profile: User,
};

export function NotificationToast({ 
  notification, 
  onDismiss, 
  onActionClick 
}: NotificationToastProps) {
  const [progress, setProgress] = useState(100);
  const duration = notification.duration || 5000;

  useEffect(() => {
    if (duration > 0) {
      const interval = 10;
      const step = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - step;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [duration]);

  const categoryColor = CATEGORY_COLORS[notification.type] || 'bg-primary';
  const CategoryIcon = CATEGORY_ICONS[notification.type] || Shield;

  const handleActionClick = () => {
    onActionClick?.();
    onDismiss();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border bg-background/80 shadow-2xl backdrop-blur-xl mb-4"
    >
      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-muted/20">
          <motion.div
            className={`h-full ${categoryColor}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon/Avatar */}
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${categoryColor}`}>
            {notification.icon ? (
              <span className="text-xl">{notification.icon}</span>
            ) : (
              <CategoryIcon className="h-5 w-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-bold text-sm truncate">{notification.title}</h4>
              {notification.priority === 'urgent' && (
                <Badge variant="destructive" className="h-4 px-1 text-[10px] uppercase font-black animate-pulse">
                  Acil
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {notification.message}
            </p>

            {/* Actions */}
            {notification.actionLabel && (
              <div className="mt-3">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-8 text-xs font-bold px-3"
                  onClick={handleActionClick}
                >
                  {notification.actionLabel}
                </Button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full hover:bg-muted"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationContainer({ 
  toasts, 
  onDismiss, 
  onActionClick 
}: { 
  toasts: Notification[], 
  onDismiss: (id: string) => void,
  onActionClick?: (notification: Notification) => void 
}) {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-0 w-full max-w-sm pointer-events-none items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <NotificationToast
            key={toast.id}
            notification={toast}
            onDismiss={() => onDismiss(toast.id)}
            onActionClick={() => onActionClick?.(toast)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NotificationToast;
