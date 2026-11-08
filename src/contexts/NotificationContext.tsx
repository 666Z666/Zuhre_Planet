/**
 * Notification Context
 *
 * Real-time notification system for displaying alerts and updates.
 * Provides toast notifications, notification center, and unread counter.
 * Supports multiple notification types and priority levels.
 *
 * @module contexts/NotificationContext
 * @category Contexts - State Management
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Notification types
 */
export type NotificationType = 'message' | 'booking' | 'system' | 'promo' | 'review' | 'profile';

/**
 * Notification interface for UI alerts (Toasts)
 */
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
  avatar?: string;
  onClick?: () => void;
  actionLabel?: string;
  action?: () => void;
  duration?: number; // Auto-dismiss duration (ms), 0 = no auto-dismiss
  data?: Record<string, unknown>;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  enableSound: boolean;
  enableBrowser: boolean;
  enableToast: boolean;
  mutedTypes: NotificationType[];
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

/**
 * Notification Context Interface
 */
interface NotificationContextValue {
  // State
  notifications: Notification[];
  unreadCount: number;
  showNotificationCenter: boolean;
  preferences: NotificationPreferences;

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  toggleNotificationCenter: () => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;

  // Toast specific
  toasts: Notification[];
  removeToast: (id: string) => void;
}

/**
 * Default notification preferences
 */
const defaultPreferences: NotificationPreferences = {
  enableSound: false,
  enableBrowser: false,
  enableToast: true,
  mutedTypes: [],
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

// Create context
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

/**
 * Generate unique notification ID
 */
function generateId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get notification icon by type
 */
function getNotificationIcon(type: NotificationType): string {
  const icons = {
    message: '💬',
    booking: '📅',
    system: '⚙️',
    promo: '🎉',
    review: '⭐',
    profile: '👤',
  };
  return icons[type] || '🔔';
}

/**
 * Get notification duration by priority
 */
function getNotificationDuration(priority: NotificationPriority): number {
  const durations = {
    low: 5000,
    normal: 4000,
    high: 6000,
    urgent: 8000,
  };
  return durations[priority];
}

/**
 * Check if current time is in quiet hours
 */
function isQuietHours(preferences: NotificationPreferences): boolean {
  if (!preferences.quietHours.enabled) return false;

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHours * 60 + currentMinutes;

  const [startHour, startMin] = preferences.quietHours.start.split(':').map(Number);
  const [endHour, endMin] = preferences.quietHours.end.split(':').map(Number);
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  if (startTime < endTime) {
    return currentTime >= startTime && currentTime < endTime;
  } else {
    // Over midnight (e.g., 22:00 to 08:00)
    return currentTime >= startTime || currentTime < endTime;
  }
}

/**
 * Request browser notification permission
 */
async function requestBrowserPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await window.Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Show browser notification
 */
function showBrowserNotification(notification: Notification) {
  if ('Notification' in window && window.Notification.permission === 'granted') {
    new window.Notification(notification.title, {
      body: notification.message,
      icon: notification.avatar || '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'urgent',
    });
  }
}

/**
 * Notification Provider Component
 */
export function NotificationProvider({ children, initialPreferences }: { children: ReactNode; initialPreferences?: Partial<NotificationPreferences> }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    ...defaultPreferences,
    ...initialPreferences,
  });

  // Active toasts (for auto-dismissing notifications)
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Remove toast (for auto-dismiss)
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Request browser notification permission on mount
  useEffect(() => {
    if (preferences.enableBrowser) {
      requestBrowserPermission();
    }
  }, [preferences.enableBrowser]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // Check if type is muted
    if (preferences.mutedTypes.includes(notification.type)) {
      return;
    }

    // Check quiet hours
    if (isQuietHours(preferences) && notification.priority !== 'urgent') {
      return;
    }

    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      read: false,
      icon: notification.icon || getNotificationIcon(notification.type),
      duration: notification.duration ?? getNotificationDuration(notification.priority),
    };

    // Add to notifications list
    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if enabled
    if (preferences.enableBrowser) {
      showBrowserNotification(newNotification);
    }

    // Add to toasts if enabled and has duration
    const duration = newNotification.duration ?? 0;
    if (preferences.enableToast && duration > 0) {
      setToasts(prev => [...prev, newNotification]);

      // Auto-remove after duration
      setTimeout(() => {
        removeToast(newNotification.id);
      }, duration);
    }
  }, [preferences, removeToast]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setToasts([]);
  }, []);

  // Toggle notification center
  const toggleNotificationCenter = useCallback(() => {
    setShowNotificationCenter(prev => !prev);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));

    // Request browser permission if enabling
    if (updates.enableBrowser && !preferences.enableBrowser) {
      requestBrowserPermission();
    }
  }, [preferences]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    showNotificationCenter,
    preferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    toggleNotificationCenter,
    updatePreferences,
    toasts,
    removeToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

export function useNotify() {
  const { addNotification } = useNotifications();

  return {
    notify: addNotification,
    message: (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'timestamp' | 'read' | 'type'>>) => {
      addNotification({ type: 'message', title, message, priority: 'normal', ...options });
    },
    booking: (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'timestamp' | 'read' | 'type'>>) => {
      addNotification({ type: 'booking', title, message, priority: 'high', ...options });
    },
    system: (title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'timestamp' | 'read' | 'type'>>) => {
      addNotification({ type: 'system', title, message, priority: 'normal', ...options });
    },
    success: (title: string, message: string) => {
      addNotification({ type: 'system', title, message, priority: 'low', icon: '✅', duration: 3000 });
    },
    error: (title: string, message: string) => {
      addNotification({ type: 'system', title, message, priority: 'high', icon: '❌', duration: 5000 });
    },
    warning: (title: string, message: string) => {
      addNotification({ type: 'system', title, message, priority: 'normal', icon: '⚠️', duration: 4000 });
    },
  };
}
