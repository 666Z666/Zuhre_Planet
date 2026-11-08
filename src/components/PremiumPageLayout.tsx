import React from 'react';

interface PremiumPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backgroundVariant?: 'default' | 'gradient' | 'minimal';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Premium Sayfa Düzeni Bileşeni
 * 
 * Derinlikli arka planlar, gradyanlar ve modern layout
 */
export const PremiumPageLayout: React.FC<PremiumPageLayoutProps> = ({
  children,
  title,
  subtitle,
  backgroundVariant = 'default',
  containerSize = 'lg',
}) => {
  const containerSizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'w-full',
  };

  const backgroundStyles = {
    default: {
      background: 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #f0f4ff 100%)',
    },
    gradient: {
      background: 'linear-gradient(135deg, #127a59 0%, #3b82f6 50%, #3fae86 100%)',
    },
    minimal: {
      background: '#ffffff',
    },
  };

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={backgroundStyles[backgroundVariant]}
    >
      {/* Dekoratif Arka Plan Öğeleri */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Blur Blobs */}
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, #127a59, #3b82f6)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, #3fae86, #127a59)',
          }}
        />
      </div>

      {/* Ana İçerik */}
      <div className="relative z-10">
        {/* Başlık Bölümü */}
        {(title || subtitle) && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 text-center">
            {title && (
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* İçerik Konteyner */}
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 pb-12 ${containerSizes[containerSize]}`}>
          {children}
        </div>
      </div>

      {/* Alt Dekorasyon */}
      <div className="relative z-5 h-32 bg-gradient-to-t from-black/5 to-transparent" />
    </div>
  );
};

export default PremiumPageLayout;
