/**
 * Custom Video Player Component
 * Galeri entegrasyonu için özel video oynatıcı
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { VideoProcessingService } from '../services/videoProcessingService';

interface CustomVideoPlayerProps {
  videoSrc: string;
  posterImage?: string;
  title?: string;
  escortName?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  onLike?: () => Promise<void>;
  onComment?: () => void;
  onShare?: () => void;
  className?: string;
}

export function CustomVideoPlayer({
  videoSrc,
  posterImage,
  title,
  escortName,
  viewCount = 0,
  likeCount = 0,
  commentCount = 0,
  isLiked = false,
  onLike,
  onComment,
  onShare,
  className = '',
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Video metadata yükle
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Kontrolleri otomatik gizle
  useEffect(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (isPlaying && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, showControls]);

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

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value / 100;
    setVolume(newVolume);
    video.volume = newVolume;
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const handleToggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen hatası:', error);
    }
  };

  const handleSkip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike?.();
      setLiked(!liked);
    } catch (error) {
      console.error('Beğeni hatası:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black rounded-2xl overflow-hidden group ${className}`}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterImage}
        className="w-full h-full object-contain"
      />

      {/* Overlay - Oynatma Butonu */}
      {!isPlaying && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all"
        >
          <Play className="w-20 h-20 text-white" />
        </motion.button>
      )}

      {/* Kontroller */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3"
      >
        {/* Zaman Çubuğu */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              const video = videoRef.current;
              if (video) {
                video.currentTime = Number(e.target.value);
              }
            }}
            className="w-full accent-emerald-400 h-1 rounded-full cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{VideoProcessingService.formatDuration(currentTime)}</span>
            <span>{VideoProcessingService.formatDuration(duration)}</span>
          </div>
        </div>

        {/* Kontrol Düğmeleri */}
        <div className="flex items-center gap-2">
          {/* Oynat/Duraklat */}
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>

          {/* Geri/İleri Atla */}
          <button
            onClick={() => handleSkip(-10)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
            title="10 saniye geri"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSkip(10)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
            title="10 saniye ileri"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Ses Kontrolü */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-20 accent-emerald-400 h-1 rounded-full cursor-pointer"
            />
          </div>

          {/* Ayarlar */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full right-0 mb-2 bg-black/90 border border-white/10 rounded-lg p-2 space-y-1 z-10"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`block w-full text-left px-3 py-1 rounded text-xs transition-all ${
                      playbackRate === rate
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Tam Ekran */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Başlık ve Bilgi */}
      {(title || escortName) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 space-y-2"
        >
          {title && <h3 className="font-bold text-white text-sm">{title}</h3>}
          {escortName && <p className="text-white/60 text-xs">@{escortName}</p>}
        </motion.div>
      )}

      {/* Etkileşim Düğmeleri (Sağ Taraf) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {/* Beğeni */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          disabled={isLiking}
          className={`p-3 rounded-full transition-all ${
            liked
              ? 'bg-red-500/20 border border-red-500/30 text-red-400'
              : 'bg-white/10 border border-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Yorum */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComment}
          className="p-3 rounded-full bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>

        {/* Paylaş */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShare}
          className="p-3 rounded-full bg-white/10 border border-white/10 text-white/60 hover:bg-white/20 transition-all"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      </div>

      {/* İstatistikler (Sol Taraf) */}
      <div className="absolute left-4 bottom-20 flex flex-col gap-2 text-white/80 text-xs">
        {viewCount > 0 && (
          <div className="flex items-center gap-1">
            <span>👁️</span>
            <span>{viewCount}</span>
          </div>
        )}
        {likeCount > 0 && (
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{likeCount}</span>
          </div>
        )}
        {commentCount > 0 && (
          <div className="flex items-center gap-1">
            <span>💬</span>
            <span>{commentCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomVideoPlayer;


