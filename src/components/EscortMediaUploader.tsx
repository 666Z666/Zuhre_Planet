/**
 * Escort Media Uploader Component
 * Fotoğraf ve video yükleme, düzenleme, sürükle-bırak desteği
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  Play,
  Image,
  X,
  Edit2,
  Trash2,
  Star,
  Lock,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedMedia {
  id: string;
  file: File;
  preview: string;
  type: 'photo' | 'video';
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  isMain: boolean;
  duration?: number; // Video süresi (saniye)
}

interface EscortMediaUploaderProps {
  userTier: 'free' | 'gold' | 'platinum' | 'vip';
  currentMediaCount: { photos: number; videos: number };
  onUpload?: (files: UploadedMedia[]) => Promise<void>;
  className?: string;
}

// Tier'e göre limitler
const MEDIA_LIMITS = {
  free: { photos: 3, videos: 0, maxPhotoSize: 5, maxVideoSize: 0 },
  gold: { photos: 10, videos: 2, maxPhotoSize: 10, maxVideoSize: 50 },
  platinum: { photos: 25, videos: 5, maxPhotoSize: 20, maxVideoSize: 100 },
  vip: { photos: 50, videos: 10, maxPhotoSize: 50, maxVideoSize: 500 },
};

export function EscortMediaUploader({
  userTier,
  currentMediaCount,
  onUpload,
  className = '',
}: EscortMediaUploaderProps) {
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limits = MEDIA_LIMITS[userTier];
  const canAddPhotos = currentMediaCount.photos < limits.photos;
  const canAddVideos = limits.videos > 0 && currentMediaCount.videos < limits.videos;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const newMedia: UploadedMedia[] = [];

    files.forEach((file) => {
      // Dosya türü kontrolü
      const isPhoto = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isPhoto && !isVideo) {
        alert('Sadece fotoğraf ve video dosyaları yükleyebilirsiniz');
        return;
      }

      // Sınır kontrolü
      if (isPhoto && !canAddPhotos) {
        alert(`Maksimum ${limits.photos} fotoğraf yükleyebilirsiniz`);
        return;
      }

      if (isVideo && !canAddVideos) {
        alert(`Maksimum ${limits.videos} video yükleyebilirsiniz`);
        return;
      }

      // Dosya boyutu kontrolü
      const maxSize = isPhoto ? limits.maxPhotoSize : limits.maxVideoSize;
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Maksimum dosya boyutu: ${maxSize} MB`);
        return;
      }

      // Önizleme oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        newMedia.push({
          id: `media-${Date.now()}-${Math.random()}`,
          file,
          preview: e.target?.result as string,
          type: isPhoto ? 'photo' : 'video',
          title: file.name.replace(/\.[^/.]+$/, ''),
          status: 'pending',
          isMain: uploadedMedia.length === 0,
        });

        if (newMedia.length === files.length) {
          setUploadedMedia((prev) => [...prev, ...newMedia]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEditMedia = (media: UploadedMedia) => {
    setEditingId(media.id);
    setEditTitle(media.title);
    setEditDescription(media.description || '');
  };

  const handleSaveEdit = (mediaId: string) => {
    setUploadedMedia((prev) =>
      prev.map((m) =>
        m.id === mediaId
          ? { ...m, title: editTitle, description: editDescription }
          : m
      )
    );
    setEditingId(null);
  };

  const handleSetMain = (mediaId: string) => {
    setUploadedMedia((prev) =>
      prev.map((m) => ({
        ...m,
        isMain: m.id === mediaId,
      }))
    );
  };

  const handleRemoveMedia = (mediaId: string) => {
    setUploadedMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  const handleUpload = async () => {
    if (uploadedMedia.length === 0) {
      alert('Lütfen en az bir medya dosyası seçin');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload?.(uploadedMedia);
      setUploadedMedia([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Başlık */}
      <div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
          <Upload className="w-6 h-6 text-emerald-400" />
          Medya Yönetimi
        </h2>
        <p className="text-white/40 text-sm mt-1">Fotoğraf ve video yükle, düzenle ve yayınla</p>
      </div>

      {/* Limitler */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/60">Fotoğraflar</span>
            <Image className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {currentMediaCount.photos}/{limits.photos}
          </p>
          <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{
                width: `${(currentMediaCount.photos / limits.photos) * 100}%`,
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/60">Videolar</span>
            <Play className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {currentMediaCount.videos}/{limits.videos}
          </p>
          <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gold-500 transition-all"
              style={{
                width: `${limits.videos > 0 ? (currentMediaCount.videos / limits.videos) * 100 : 0}%`,
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Sürükle-Bırak Alanı */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-white/20 bg-black/20 hover:border-white/40'
        }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-3 text-white/30" />
        <h3 className="font-bold text-white mb-1">Medya Yükle</h3>
        <p className="text-white/40 text-sm mb-3">
          Fotoğraf veya videoyu buraya sürükle ya da tıkla
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase hover:bg-emerald-500/30 transition-all"
        >
          Dosya Seç
        </button>
      </motion.div>

      {/* Yüklenen Medya Listesi */}
      {uploadedMedia.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm">Yükleme Sırası ({uploadedMedia.length})</h3>

          <div className="space-y-2">
            <AnimatePresence>
              {uploadedMedia.map((media, idx) => (
                <motion.div
                  key={media.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-black/20 border border-white/10 rounded-xl overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    {/* Önizleme */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={media.preview}
                        alt={media.title}
                        className="w-full h-full object-cover"
                      />
                      {media.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Bilgi */}
                    <div className="flex-1 min-w-0">
                      {editingId === media.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-sm outline-none"
                            placeholder="Başlık"
                          />
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none resize-none"
                            placeholder="Açıklama"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-white text-sm truncate">{media.title}</p>
                          {media.description && (
                            <p className="text-white/40 text-xs truncate">{media.description}</p>
                          )}
                          <p className="text-[10px] text-white/30 mt-1">
                            {(media.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Aksiyonlar */}
                    <div className="flex items-center gap-1">
                      {editingId === media.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(media.id)}
                            className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all"
                            title="Kaydet"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all"
                            title="İptal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditMedia(media)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSetMain(media.id)}
                            className={`p-2 rounded-lg transition-all ${
                              media.isMain
                                ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                            }`}
                            title="Ana medya yap"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveMedia(media.id)}
                            className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Yükleme Butonu */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold text-sm uppercase disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Yükle ({uploadedMedia.length})
              </>
            )}
          </button>
        </div>
      )}

      {/* Bilgi */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-2">
        <p className="text-blue-300 text-xs font-bold">💡 Medya Yönetimi İpuçları</p>
        <ul className="text-blue-300/70 text-[10px] space-y-1">
          <li>• Yüksek kaliteli fotoğraf ve videolar yükle</li>
          <li>• Admin onayından sonra yayınlanacak</li>
          <li>• Tier'ine göre limit: {limits.photos} fotoğraf, {limits.videos} video</li>
          <li>• Maksimum dosya boyutu: Fotoğraf {limits.maxPhotoSize}MB, Video {limits.maxVideoSize}MB</li>
          <li>• Ana medyayı yıldız ikonu ile seç</li>
        </ul>
      </div>
    </div>
  );
}

export default EscortMediaUploader;

