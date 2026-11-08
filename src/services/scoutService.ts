/**
 * Zühre Planet V4.0 - Galaxy Scout AI Logic
 * 
 * Intent-based semantic analysis for handling user commands via CommandCenter.
 */

export type ScoutAction = {
  type: 'NAVIGATE' | 'SEARCH' | 'ACTION' | 'MESSAGE';
  payload: any;
  response: string;
};

class ScoutService {
  private intents = [
    { pattern: /(keşfet|katalog|bülten|escortlar)/i, action: 'NAVIGATE', path: '/catalog', response: 'Galaksinin en parlak yıldızlarına giden kapı açılıyor. Kimin ışığını takip etmek istersiniz?' },
    { pattern: /(giriş|login|üye)/i, action: 'NAVIGATE', path: '/login', response: 'Kimliğinizi Nebula ağında doğrulama noktasına aktarıyorum...' },
    { pattern: /(puanım|kaç puan|np)/i, action: 'MESSAGE', response: 'Şu an galaktik hanenizde 4,850 Nebula Point (NP) bulunuyor. PULSAR rütbesine yükselmek için hala yolunuz var.' },
    { pattern: /(vault|özel arşiv|kilitli|şifreli)/i, action: 'NAVIGATE', path: '/catalog', response: 'The Vault kapıları aralanıyor... En özel anlar sadece NP sahipleri içindir. Hangi yıldızın sırrını merak ediyorsunuz?' },
    { pattern: /(canlı|aktif|kim var|live)/i, action: 'MESSAGE', response: 'Yörüngede yoğun bir hareketlilik var! Elara ve 3 diğer yıldız şu an COSMIC LIVE modunda parlıyor. Onlara bir kalp göndermek ister misiniz?' },
    { pattern: /(maia kim|sen kimsin|nasıl çalışır)/i, action: 'MESSAGE', response: 'Ben Z-Maia, bu galaksinin ruhu ve rehberiyim. Size en seçkin partnerleri bulabilir, kilitli arşivlere (The Vault) yol gösterebilir ve rütbenizi analiz edebilirim.' },
    { pattern: /(rütbem|seviyem|rank|başarım|madalyon)/i, action: 'MESSAGE', response: 'Analiz tamamlandı: Mevcut rütbeniz PULSAR. Yakın zamanda "Vault Hunter" madalyonunu kazanmak üzeresiniz!' },
    { pattern: /(sessizliğe geç|ghost mode|stealth mode|gizle)/i, action: 'ACTION', payload: 'TOGGLE_STEALTH', response: 'Shadow Shield protokolleri devreye alınıyor. Galaksideki izinizi siliyorum...' },
    { pattern: /(izleri sil|clear trail|logları temizle)/i, action: 'ACTION', payload: 'CLEAR_TRAIL', response: 'Oturum logları temizlendi. Geçmiş artık sadece karanlığa ait.' },
    { pattern: /(ara|bul|sorgula) (.+)/i, action: 'SEARCH', response: 'Yıldız haritasında "$2" taranıyor. Kalp atışınızı hissettiğim yerde duracağım...' },
    { pattern: /(selam|merhaba|hi|maia)/i, action: 'MESSAGE', response: 'Z-Maia sizi bekliyordu. Galakside bugün sizin için ne arzu edebilirim, Kaptan?' }
  ];

  analyze(input: string): ScoutAction {
    const query = input.toLowerCase().trim();

    for (const intent of this.intents) {
      const match = query.match(intent.pattern);
      if (match) {
        if (intent.action === 'NAVIGATE') {
          return { type: 'NAVIGATE', payload: intent.path, response: intent.response };
        }
        if (intent.action === 'SEARCH') {
          return { type: 'SEARCH', payload: match[2], response: intent.response.replace('$2', match[2]) };
        }
        return { type: 'MESSAGE', payload: null, response: intent.response };
      }
    }

    return { 
      type: 'SEARCH', 
      payload: query, 
      response: `"$ {query}" için galaksiyi tarıyorum. Bir saniye lütfen...` 
    };
  }
}

export const scoutService = new ScoutService();
