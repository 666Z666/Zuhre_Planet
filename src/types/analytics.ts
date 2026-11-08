/**
 * Analytics and Tracking Types
 * 
 * Sistem genelindeki olay (event) ve raporlama tipleri.
 */

export type AnalyticsEventType = 
  | 'page_view'
  | 'click'
  | 'form_submit'
  | 'conversion'
  | 'session_start'
  | 'session_end'
  | 'error'
  | 'purchase';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  page?: string;
  source?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

/** Specific event structure for user interactions */
export interface InteractionEvent extends AnalyticsEvent {
  userId: string;
  targetId?: string;
  targetType?: 'escort' | 'media' | 'review' | 'comment';
  action: 'view' | 'like' | 'favorite' | 'share' | 'report';
}

/** Error payload for analytics service */
export interface AnalyticsError {
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

/** Daily report summary */
export interface DailyReport {
  date: string;
  views: number;
  uniques: number;
  clicks: number;
  conversions: number;
  revenue: number;
  content?: unknown; // Esnek içerik verisi
}

/** Configuration for active analytics session */
export interface AnalyticsSession {
  sessionId: string;
  userId?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  country?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MISSING TYPES FOUND DURING AUDIT
// ─────────────────────────────────────────────────────────────────────────────

export type TimePeriod = 'today' | 'last7days' | 'last30days' | 'last90days' | 'year' | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
}

export type MetricType = 
  | 'views' 
  | 'visitors' 
  | 'bookings' 
  | 'revenue' 
  | 'messages' 
  | 'rating' 
  | 'responseTime' 
  | 'conversionRate';

export interface MetricValue {
  value: number;
  previousValue?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: number;
  formattedValue: string;
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  title: string;
  data: Array<{
    label: string;
    value: number;
    date?: Date;
    color?: string;
  }>;
  xAxis?: string;
  yAxis?: string;
  options?: Record<string, unknown>;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  type: 'overview' | 'traffic' | 'revenue' | 'engagement' | 'performance' | 'custom';
  period: TimePeriod;
  customRange?: DateRange;
  metrics: Array<{
    id: string;
    title: string;
    metric: MetricType;
    value: MetricValue;
    icon: string;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
    format: 'number' | 'currency' | 'percentage' | 'duration';
  }>;
  charts: ChartData[];
  generatedAt: Date;
}

export interface RealtimeData {
  currentVisitors: number;
  activeUsers: number;
  pageViewsLastHour: number;
  topPages: Array<{
    page: string;
    views: number;
  }>;
}

export interface TrafficSource {
  source: string;
  visits: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface TopContent {
  id: string;
  title: string;
  type: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export interface ConversionFunnel {
  stages: Array<{
    name: string;
    count: number;
    conversionRate: number;
    dropOffRate: number;
  }>;
  overallConversionRate: number;
}

export interface Demographics {
  ageGroups: Record<string, number>;
  gender: Record<string, number>;
  locations: Record<string, number>;
  devices: Record<string, number>;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  config: Record<string, unknown>;
}

export interface DashboardConfig {
  id: string;
  name: string;
  layout: string;
  widgets: DashboardWidget[];
}

export const TIME_PERIODS: Array<{ value: TimePeriod; label: string }> = [
  { value: 'today', label: 'Bugün' },
  { value: 'last7days', label: 'Son 7 Gün' },
  { value: 'last30days', label: 'Son 30 Gün' },
  { value: 'last90days', label: 'Son 90 Gün' },
  { value: 'year', label: 'Bu Yıl' },
  { value: 'custom', label: 'Özel Aralık' },
];

export const MOCK_ANALYTICS_DATA: Record<string, unknown> = {
  views: { value: 12500, trend: 'up', trendPercent: 12.5, formattedValue: '12.5K' },
  visitors: { value: 8400, trend: 'up', trendPercent: 8.2, formattedValue: '8.4K' },
  bookings: { value: 450, trend: 'down', trendPercent: 3.1, formattedValue: '450' },
  revenue: { value: 75000, trend: 'up', trendPercent: 15.4, formattedValue: '₺75.000' },
  messages: { value: 1200, trend: 'up', trendPercent: 5.8, formattedValue: '1.2K' },
  rating: { value: 4.8, trend: 'neutral', trendPercent: 0, formattedValue: '4.8' },
  responseTime: { value: 15, trend: 'up', trendPercent: 10, formattedValue: '15 dk' },
  conversionRate: { value: 3.5, trend: 'up', trendPercent: 2.1, formattedValue: '%3.5' },
};

export const DASHBOARD_TEMPLATES: Record<string, DashboardConfig> = {
  overview: {
    id: 'overview',
    name: 'Genel Bakış',
    layout: 'grid',
    widgets: [],
  },
};

/** İki değer arasındaki trend yönü (±%1 eşiği altında nötr). */
export function calculateTrend(current: number, previous: number): 'up' | 'down' | 'neutral' {
  if (!previous) return current > 0 ? 'up' : 'neutral';
  const change = (current - previous) / Math.abs(previous);
  if (change > 0.01) return 'up';
  if (change < -0.01) return 'down';
  return 'neutral';
}

/** Metrik değerini Türkçe yerel ayara göre biçimlendirir. */
export function formatMetricValue(
  value: number,
  format: 'number' | 'currency' | 'percentage' | 'duration' = 'number',
  prefix?: string,
): string {
  switch (format) {
    case 'currency':
      return `${prefix ?? '₺'}${value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`;
    case 'percentage':
      return `%${value.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`;
    case 'duration':
      return `${Math.round(value)} dk`;
    default: {
      const body = value >= 1_000_000
        ? `${(value / 1_000_000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}M`
        : value >= 1_000
          ? `${(value / 1_000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}K`
          : value.toLocaleString('tr-TR');
      return prefix ? `${prefix}${body}` : body;
    }
  }
}
