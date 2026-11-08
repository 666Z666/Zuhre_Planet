/**
 * Video Processing Service
 * Video metadata çıkarma, thumbnail oluşturma ve video işlemleri
 */

export interface VideoMetadata {
  duration: number; // Saniye cinsinden
  width: number;
  height: number;
  fps: number;
  bitrate: number; // kbps
  codec: string;
  fileSize: number; // Byte
}

export interface VideoThumbnail {
  timestamp: number; // Saniye
  canvas: HTMLCanvasElement;
  blob: Blob;
}

export interface VideoSegment {
  startTime: number; // Saniye
  endTime: number; // Saniye
  title?: string;
}

export interface VideoFilter {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  hue: number; // -180 to 180
  blur: number; // 0 to 50
}

/**
 * Video İşleme Servisi
 */
export class VideoProcessingService {
  /**
   * Video dosyasından metadata çıkar
   */
  public static extractMetadata(file: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        const metadata: VideoMetadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          fps: 30, // Varsayılan, gerçek değer FFmpeg ile alınabilir
          bitrate: 0, // Varsayılan, gerçek değer FFmpeg ile alınabilir
          codec: 'h264', // Varsayılan
          fileSize: file.size,
        };
        resolve(metadata);
      };

      video.onerror = () => reject(new Error('Video metadata alınamadı'));
      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * Video dosyasından belirli zaman noktasında thumbnail oluştur
   */
  public static generateThumbnail(
    videoSrc: string,
    timestamp: number = 0
  ): Promise<VideoThumbnail> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context alınamadı'));
        return;
      }

      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = Math.min(timestamp, video.duration - 0.1);
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Thumbnail blob oluşturulamadı'));
            return;
          }
          resolve({
            timestamp,
            canvas,
            blob,
          });
        }, 'image/jpeg', 0.9);
      };

      video.onerror = () => reject(new Error('Video yüklenemedi'));
      video.src = videoSrc;
    });
  }

  /**
   * Video dosyasından birden fazla thumbnail oluştur (sprite sheet)
   */
  public static async generateThumbnailSprite(
    videoSrc: string,
    duration: number,
    count: number = 10
  ): Promise<HTMLCanvasElement> {
    const thumbnails: HTMLCanvasElement[] = [];
    const interval = duration / count;

    for (let i = 0; i < count; i++) {
      const timestamp = i * interval;
      const thumbnail = await this.generateThumbnail(videoSrc, timestamp);
      thumbnails.push(thumbnail.canvas);
    }

    // Sprite sheet oluştur
    const spriteCanvas = document.createElement('canvas');
    const spriteCtx = spriteCanvas.getContext('2d');

    if (!spriteCtx) {
      throw new Error('Sprite canvas context alınamadı');
    }

    const thumbWidth = thumbnails[0].width;
    const thumbHeight = thumbnails[0].height;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);

    spriteCanvas.width = thumbWidth * cols;
    spriteCanvas.height = thumbHeight * rows;

    thumbnails.forEach((thumb, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      spriteCtx.drawImage(thumb, col * thumbWidth, row * thumbHeight);
    });

    return spriteCanvas;
  }

  /**
   * Video dosyasını belirli zaman aralığında kırp
   * Not: Client-side video kırpma sınırlıdır. Sunucu tarafında FFmpeg kullanılmalıdır.
   */
  public static async cropVideo(
    videoFile: File,
    _startTime: number,
    _endTime: number
  ): Promise<Blob> {
    // Bu işlem client-side'da tam olarak yapılamaz.
    // Backend'de FFmpeg kullanılmalıdır.
    // Placeholder olarak orijinal dosyayı döndürüyoruz.
    console.warn('Video kırpma işlemi backend tarafında yapılmalıdır (FFmpeg)');
    return videoFile;
  }

  /**
   * Video filtreleri CSS olarak uygula
   */
  public static applyFiltersToVideo(
    videoElement: HTMLVideoElement,
    filters: Partial<VideoFilter>
  ): void {
    let filterString = '';

    if (filters.brightness !== undefined) {
      filterString += `brightness(${100 + filters.brightness}%) `;
    }
    if (filters.contrast !== undefined) {
      filterString += `contrast(${100 + filters.contrast}%) `;
    }
    if (filters.saturation !== undefined) {
      filterString += `saturate(${100 + filters.saturation}%) `;
    }
    if (filters.hue !== undefined) {
      filterString += `hue-rotate(${filters.hue}deg) `;
    }
    if (filters.blur !== undefined) {
      filterString += `blur(${filters.blur}px) `;
    }

    videoElement.style.filter = filterString.trim();
  }

  /**
   * Video dosyasının boyutunu kontrol et
   */
  public static validateVideoFile(
    file: File,
    maxSizeMB: number = 100
  ): { isValid: boolean; reason?: string } {
    // Dosya türü kontrolü
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        reason: `İzin verilen formatlar: MP4, WebM, MOV, AVI`,
      };
    }

    // Dosya boyutu kontrolü
    if (file.size > maxSizeMB * 1024 * 1024) {
      return {
        isValid: false,
        reason: `Maksimum dosya boyutu: ${maxSizeMB} MB`,
      };
    }

    return { isValid: true };
  }

  /**
   * Video süresi kontrol et
   */
  public static validateVideoDuration(
    duration: number,
    minSeconds: number = 1,
    maxSeconds: number = 300
  ): { isValid: boolean; reason?: string } {
    if (duration < minSeconds) {
      return {
        isValid: false,
        reason: `Video en az ${minSeconds} saniye olmalıdır`,
      };
    }

    if (duration > maxSeconds) {
      return {
        isValid: false,
        reason: `Video en fazla ${Math.floor(maxSeconds / 60)} dakika olmalıdır`,
      };
    }

    return { isValid: true };
  }

  /**
   * Video dosyasını Blob olarak dışa aktar
   * Not: Client-side'da video re-encoding yapılamaz. Backend'de yapılmalıdır.
   */
  public static async exportVideo(videoFile: File): Promise<Blob> {
    // Client-side'da video re-encoding yapılamaz.
    // Backend'de FFmpeg veya benzer araç kullanılmalıdır.
    console.warn('Video export işlemi backend tarafında yapılmalıdır (FFmpeg)');
    return videoFile;
  }

  /**
   * Video oynatıcı için format dönüşümü
   */
  public static getVideoFormat(file: File): 'mp4' | 'webm' | 'mov' | 'unknown' {
    const type = file.type;
    if (type.includes('mp4')) return 'mp4';
    if (type.includes('webm')) return 'webm';
    if (type.includes('quicktime')) return 'mov';
    return 'unknown';
  }

  /**
   * Video süresi formatını düzenle (HH:MM:SS)
   */
  public static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Video boyutunu insan tarafından okunabilir formata dönüştür
   */
  public static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Video çözünürlüğü kategorisini belirle
   */
  public static getResolutionCategory(
    width: number,
    height: number
  ): 'SD' | 'HD' | 'FullHD' | '4K' {
    const pixels = width * height;

    if (pixels >= 3840 * 2160) return '4K';
    if (pixels >= 1920 * 1080) return 'FullHD';
    if (pixels >= 1280 * 720) return 'HD';
    return 'SD';
  }

  /**
   * Video çerçevesini canvas'a çiz
   */
  public static drawVideoFrame(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
  }

  /**
   * Video oynatma hızını ayarla
   */
  public static setPlaybackSpeed(video: HTMLVideoElement, speed: number): void {
    video.playbackRate = Math.max(0.25, Math.min(2, speed));
  }

  /**
   * Video ses seviyesini ayarla
   */
  public static setVolume(video: HTMLVideoElement, volume: number): void {
    video.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Video tam ekran moduna geç
   */
  public static requestFullscreen(video: HTMLVideoElement): Promise<void> {
    if (video.requestFullscreen) {
      return video.requestFullscreen();
    }
    return Promise.reject(new Error('Fullscreen desteklenmiyor'));
  }

  /**
   * Video çerçevesini kırp
   */
  public static cropVideoFrame(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): HTMLCanvasElement {
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) return croppedCanvas;

    const sourceCtx = canvas.getContext('2d');
    if (!sourceCtx) return croppedCanvas;

    const imageData = sourceCtx.getImageData(x, y, width, height);
    ctx.putImageData(imageData, 0, 0);

    return croppedCanvas;
  }
}

/**
 * Örnek Kullanım
 */
export async function exampleUsage() {
  const videoFile = new File([], 'video.mp4', { type: 'video/mp4' });

  // 1. Video dosyasını valide et
  const validation = VideoProcessingService.validateVideoFile(videoFile, 100);
  console.warn('Geçerli mi?', validation.isValid);

  // 2. Metadata çıkar
  const metadata = await VideoProcessingService.extractMetadata(videoFile);
  console.warn('Süre:', VideoProcessingService.formatDuration(metadata.duration));
  console.warn('Boyut:', VideoProcessingService.formatFileSize(metadata.fileSize));
  console.warn('Çözünürlük:', VideoProcessingService.getResolutionCategory(metadata.width, metadata.height));

  // 3. Thumbnail oluştur
  const thumbnail = await VideoProcessingService.generateThumbnail(
    URL.createObjectURL(videoFile),
    5
  );
  console.warn('Thumbnail:', thumbnail.blob);

  // 4. Sprite sheet oluştur
  const sprite = await VideoProcessingService.generateThumbnailSprite(
    URL.createObjectURL(videoFile),
    metadata.duration,
    10
  );
  console.warn('Sprite sheet:', sprite);
}


