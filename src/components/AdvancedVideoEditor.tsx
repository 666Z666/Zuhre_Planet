/**
 * Advanced Video Editor Component
 * Video kırpma, kapak fotoğrafı seçimi ve filtreler
 */

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Play,
  Pause,
  Sliders,
  Image,
  Scissors,
  Volume2,
  Maximize,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoProcessingService } from '../services/videoProcessingService';

export interface EditedVideoData {
  file: File;
  coverImage: Blob;
  startTime: number;
  endTime: number;
  filters: VideoFilters;
}

interface AdvancedVideoEditorProps {
  videoSrc: string;
  videoFile: File;
  onSave?: (editedVideoData: EditedVideoData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export interface VideoFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
}

type EditMode = 'none' | 'trim' | 'cover' | 'filter';

export function AdvancedVideoEditor({
  videoSrc,
  videoFile,
  onSave,
  onCancel,
  className = '',
}: AdvancedVideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [coverTime, setCoverTime] = useState(0);
  const [coverImage, setCoverImage] = useState<Blob | null>(null);
  const [filters, setFilters] = useState<VideoFilters>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0,
    blur: 0,
  });
  const [volume, setVolume] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // Video metadata yükle
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setEndTime(video.duration);
      generateThumbnails();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, []);

  // Video oynatma süresi güncelle
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Filtreleri uygula
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let filterString = '';
    filterString += `brightness(${100 + filters.brightness}%) `;
    filterString += `contrast(${100 + filters.contrast}%) `;
    filterString += `saturate(${100 + filters.saturation}%) `;
    filterString += `hue-rotate(${filters.hue}deg) `;
    filterString += `blur(${filters.blur}px)`;

    video.style.filter = filterString;
  }, [filters]);

  // Ses seviyesini ayarla
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
    }
  }, [volume]);

  const generateThumbnails = async () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const thumbs: string[] = [];
    const interval = video.duration / 10;

    for (let i = 0; i < 10; i++) {
      const time = i * interval;
      video.currentTime = time;
      await new Promise((resolve) => {
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            thumbs.push(canvas.toDataURL());
          }
          resolve(null);
        };
      });
    }

    setThumbnails(thumbs);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCaptureCover = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        setCoverImage(blob);
        setEditMode('none');
      }
    }, 'image/jpeg', 0.95);
  };

  const handleSave = async () => {
    if (!coverImage) {
      toast.error('Lütfen kapak fotoğrafı seçin');
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.({
        file: videoFile,
        coverImage,
        startTime,
        endTime,
        filters,
      });
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Video Oynatıcı */}
      <div className="bg-black/30 border border-white/10 rounded-2xl overflow-hidden">
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
          />
          {!isPlaying && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all"
            >
              <Play className="w-16 h-16 text-white" />
            </button>
          )}
        </div>

        {/* Kontroller */}
        <div className="p-4 space-y-3">
          {/* Zaman Çubuğu */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                const video = videoRef.current;
                if (video) {
                  video.currentTime = Number(e.target.value);
                  setCurrentTime(Number(e.target.value));
                }
              }}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{VideoProcessingService.formatDuration(currentTime)}</span>
              <span>{VideoProcessingService.formatDuration(duration)}</span>
            </div>
          </div>

          {/* Düğmeler */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1 flex items-center gap-2 pl-4">
              <Volume2 className="w-4 h-4 text-white/60" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <button
              onClick={() => {
                const video = videoRef.current;
                if (video) {
                  video.requestFullscreen().catch(() => {});
                }
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Şeridi */}
      {thumbnails.length > 0 && (
        <div className="bg-black/20 border border-white/10 rounded-xl p-3 space-y-2">
          <p className="text-xs font-bold text-white/60">Video Önizlemesi</p>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {thumbnails.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    video.currentTime = (idx / thumbnails.length) * duration;
                  }
                }}
                className="shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 border-white/10 hover:border-emerald-500/50 transition-all"
              >
                <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Araç Seçimi */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setEditMode(editMode === 'trim' ? 'none' : 'trim')}
          className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            editMode === 'trim'
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <Scissors className="w-4 h-4 inline mr-1" />
          Kırp
        </button>

        <button
          onClick={() => setEditMode(editMode === 'cover' ? 'none' : 'cover')}
          className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            editMode === 'cover'
              ? 'bg-gold-500/20 border border-gold-500/30 text-gold-400'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <Image className="w-4 h-4 inline mr-1" />
          Kapak
        </button>

        <button
          onClick={() => setEditMode(editMode === 'filter' ? 'none' : 'filter')}
          className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            editMode === 'filter'
              ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <Sliders className="w-4 h-4 inline mr-1" />
          Filtre
        </button>
      </div>

      {/* Kırpma Ayarları */}
      {editMode === 'trim' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3"
        >
          <h3 className="font-bold text-white text-sm">Video Kırpma</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-white/60">Başlangıç Zamanı</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={startTime}
                  onChange={(e) => setStartTime(Number(e.target.value))}
                  className="flex-1 accent-emerald-400"
                />
                <span className="text-xs font-bold text-emerald-400 w-12 text-right">
                  {VideoProcessingService.formatDuration(startTime)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/60">Bitiş Zamanı</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={endTime}
                  onChange={(e) => setEndTime(Number(e.target.value))}
                  className="flex-1 accent-emerald-400"
                />
                <span className="text-xs font-bold text-emerald-400 w-12 text-right">
                  {VideoProcessingService.formatDuration(endTime)}
                </span>
              </div>
            </div>
            <p className="text-xs text-white/40">
              Kırpılmış video süresi: {VideoProcessingService.formatDuration(endTime - startTime)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Kapak Fotoğrafı Ayarları */}
      {editMode === 'cover' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3"
        >
          <h3 className="font-bold text-white text-sm">Kapak Fotoğrafı Seç</h3>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-white/60">Zaman Noktası</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={coverTime}
                  onChange={(e) => {
                    const video = videoRef.current;
                    if (video) {
                      video.currentTime = Number(e.target.value);
                      setCoverTime(Number(e.target.value));
                    }
                  }}
                  className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <span className="text-xs font-bold text-emerald-400 w-12 text-right">
                  {VideoProcessingService.formatDuration(coverTime)}
                </span>
              </div>
            </div>
            {coverImage && (
              <div className="w-full h-32 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="Kapak"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <button
              onClick={handleCaptureCover}
              className="w-full px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm uppercase hover:bg-emerald-500/30 transition-all"
            >
              <Image className="w-4 h-4 inline mr-1" />
              Kapak Fotoğrafı Çek
            </button>
          </div>
        </motion.div>
      )}

      {/* Filtre Ayarları */}
      {editMode === 'filter' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3"
        >
          <h3 className="font-bold text-white text-sm">Video Filtreleri</h3>
          {[
            { key: 'brightness', label: 'Parlaklık', min: -100, max: 100 },
            { key: 'contrast', label: 'Kontrast', min: -100, max: 100 },
            { key: 'saturation', label: 'Doygunluk', min: -100, max: 100 },
            { key: 'hue', label: 'Renk Tonu', min: -180, max: 180 },
            { key: 'blur', label: 'Bulanıklık', min: 0, max: 50 },
          ].map((filter) => (
            <div key={filter.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/60">{filter.label}</label>
                <span className="text-xs font-bold text-emerald-400">
                  {filters[filter.key as keyof VideoFilters]}
                </span>
              </div>
              <input
                type="range"
                min={filter.min}
                max={filter.max}
                value={filters[filter.key as keyof VideoFilters]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [filter.key]: Number(e.target.value),
                  }))
                }
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Aksiyonlar */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 font-bold text-sm uppercase hover:bg-white/10 transition-all shadow-lg"
        >
          İptal
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !coverImage}
          className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold text-sm uppercase disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {isSaving ? (
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  );
}

export default AdvancedVideoEditor;
