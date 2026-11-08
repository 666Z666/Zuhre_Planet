/**
 * Tema Konfigürasyonu
 * 
 * Açık (Light) ve Koyu (Dark) tema için renk ve stil tanımları
 */

export const themeConfig = {
  light: {
    // Arka plan renkleri
    bg: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
      tertiary: '#eeeeee',
      accent: '#f0f4ff',
    },
    // Metin renkleri
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      tertiary: '#999999',
      inverse: '#ffffff',
    },
    // Sınır renkleri
    border: {
      primary: '#e0e0e0',
      secondary: '#d0d0d0',
      accent: '#b0c4ff',
    },
    // Özel renkler
    special: {
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      info: '#2196f3',
      gold: '#ffc107',
      platinum: '#e8e8e8',
      vip: '#ff1493',
    },
  },
  dark: {
    // Arka plan renkleri
    bg: {
      primary: '#0f0f0f',
      secondary: '#1a1a1a',
      tertiary: '#2a2a2a',
      accent: '#1a1f3a',
    },
    // Metin renkleri
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      tertiary: '#999999',
      inverse: '#000000',
    },
    // Sınır renkleri
    border: {
      primary: '#333333',
      secondary: '#444444',
      accent: '#5566ff',
    },
    // Özel renkler
    special: {
      success: '#66bb6a',
      warning: '#ffb74d',
      error: '#ef5350',
      info: '#42a5f5',
      gold: '#ffd54f',
      platinum: '#b0bec5',
      vip: '#ff69b4',
    },
  },
};

/**
 * Tema türü
 */
export type Theme = 'light' | 'dark';

/**
 * Tema renk şeması
 */
export type ThemeColors = typeof themeConfig.light;

/**
 * Tema seçim fonksiyonu
 */
export const getThemeColors = (theme: Theme): ThemeColors => {
  return themeConfig[theme];
};

/**
 * CSS değişkenleri oluştur
 */
export const generateCSSVariables = (theme: Theme): Record<string, string> => {
  const colors = getThemeColors(theme);
  const variables: Record<string, string> = {};

  // Arka plan renkleri
  variables['--bg-primary'] = colors.bg.primary;
  variables['--bg-secondary'] = colors.bg.secondary;
  variables['--bg-tertiary'] = colors.bg.tertiary;
  variables['--bg-accent'] = colors.bg.accent;

  // Metin renkleri
  variables['--text-primary'] = colors.text.primary;
  variables['--text-secondary'] = colors.text.secondary;
  variables['--text-tertiary'] = colors.text.tertiary;
  variables['--text-inverse'] = colors.text.inverse;

  // Sınır renkleri
  variables['--border-primary'] = colors.border.primary;
  variables['--border-secondary'] = colors.border.secondary;
  variables['--border-accent'] = colors.border.accent;

  // Özel renkler
  variables['--success'] = colors.special.success;
  variables['--warning'] = colors.special.warning;
  variables['--error'] = colors.special.error;
  variables['--info'] = colors.special.info;
  variables['--gold'] = colors.special.gold;
  variables['--platinum'] = colors.special.platinum;
  variables['--vip'] = colors.special.vip;

  return variables;
};

/**
 * Tailwind CSS tema sınıfları
 */
export const tailwindThemeClasses = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    card: 'bg-white border border-gray-200',
    input: 'bg-white text-gray-900 border-gray-300',
    button: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
    },
  },
  dark: {
    bg: 'bg-gray-950',
    text: 'text-white',
    border: 'border-gray-800',
    card: 'bg-gray-900 border border-gray-800',
    input: 'bg-gray-800 text-white border-gray-700',
    button: {
      primary: 'bg-blue-700 text-white hover:bg-blue-600',
      secondary: 'bg-gray-700 text-white hover:bg-gray-600',
      danger: 'bg-red-700 text-white hover:bg-red-600',
      success: 'bg-green-700 text-white hover:bg-green-600',
    },
  },
};

/**
 * Tema sınıfı seç
 */
export const getThemeClasses = (theme: Theme, component: keyof typeof tailwindThemeClasses.light) => {
  return tailwindThemeClasses[theme][component];
};
