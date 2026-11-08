import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Sayfa düzeyinde yükleniyor / hata durumu. Sunucuya ulaşılamadığında sayfanın
 * sonsuza kadar "yükleniyor"da kalmasını engeller; yeniden deneme düğmesi verir.
 */
export function QueryState({
  isLoading,
  error,
  onRetry,
  loadingText = 'Yükleniyor…',
}: {
  isLoading: boolean;
  error?: { message?: string } | null;
  onRetry?: () => void;
  loadingText?: string;
}) {
  if (error) {
    return (
      <div role="alert" className="max-w-xl mx-auto mt-32 mx-4 glass-panel rounded-3xl p-8 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="text-white font-bold">İçerik şu an yüklenemedi.</p>
        <p className="text-white/50 text-sm">Bağlantınızı kontrol edip tekrar deneyin. Sorun sürerse kısa süre sonra yeniden deneyin.</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90"
          >
            <RefreshCw className="w-4 h-4" /> Tekrar dene
          </button>
        )}
      </div>
    );
  }
  if (isLoading) {
    return <div className="pt-32 px-6 text-white/80 animate-pulse" aria-busy="true">{loadingText}</div>;
  }
  return null;
}
