import { cn } from '@/lib/utils';
import { BRAND } from '@/config/brand';

interface LogoProps {
  /** Amblemin piksel boyutu */
  size?: number;
  /** Yazı (wordmark) gösterilsin mi */
  showWordmark?: boolean;
  /** Alt satır (tagline) gösterilsin mi */
  showTagline?: boolean;
  className?: string;
}

/**
 * Zühre Planet logosu: SVG amblem + serif wordmark.
 * Renkler CSS token'larından gelir; açık/koyu temada otomatik uyum sağlar.
 */
export function Logo({ size = 44, showWordmark = true, showTagline = false, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-3 select-none', className)}>
      <img
        src={BRAND.assets.emblem}
        width={size}
        height={size}
        alt={showWordmark ? '' : BRAND.name}
        aria-hidden={showWordmark ? true : undefined}
        className="shrink-0 drop-shadow-[0_0_12px_hsl(var(--brand-gold)/0.35)]"
        draggable={false}
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-brand whitespace-nowrap text-[1.45rem] md:text-[1.6rem] font-semibold tracking-wide text-brand-wordmark">
            Zühre <span className="text-brand-gold">Planet</span>
          </span>
          {showTagline && (
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-muted-foreground max-sm:hidden">
              {BRAND.tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

export default Logo;
