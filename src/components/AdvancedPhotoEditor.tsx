/**
 * Advanced Photo Editor Component
 * Yüz gizleme, arka plan blur, filtreler ve marka maskesi ile fotoğraf düzenleme
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Zap,
  Trash2,
  Download,
  Circle,
  Square,
  Sparkles,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdvancedPhotoEditorProps {
  imageSrc: string;
  onSave?: (editedImageBlob: Blob) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

type EditMode = 'none' | 'blur' | 'mask' | 'filter';
type MaskType = 'circle' | 'rectangle';

interface BlurArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  intensity: number;
  type: MaskType;
}

export function AdvancedPhotoEditor({
  imageSrc,
  onSave,
  onCancel,
  className = '',
}: AdvancedPhotoEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [maskType, setMaskType] = useState<MaskType>('circle');
  const [blurAreas, setBlurAreas] = useState<BlurArea[]>([]);
  const [selectedBlurId, setSelectedBlurId] = useState<string | null>(null);
  const [blurIntensity, setBlurIntensity] = useState(50);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [filters, setFilters] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
  });
  const [showBrandMask, setShowBrandMask] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ x: 0, y: 0 });
  const [maskSize, setMaskSize] = useState({ width: 100, height: 100 });
  const [isSaving, setIsSaving] = useState(false);

  // Canvas'a fotoğrafı yükle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Filtreleri uygula
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const filterString = `
      brightness(${100 + filters.brightness}%)
      contrast(${100 + filters.contrast}%)
      saturate(${100 + filters.saturation}%)
      blur(${filters.blur}px)
    `;
    canvas.style.filter = filterString;
  }, [filters]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editMode !== 'blur' && editMode !== 'mask') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleCanvasMouseMove = (_e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    if (!rect) return;

    // Gerçek zamanlı önizleme için canvas'ı yeniden çiz
    redrawCanvas();
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = Math.abs(x - startPos.x);
    const height = Math.abs(y - startPos.y);
    const minX = Math.min(startPos.x, x);
    const minY = Math.min(startPos.y, y);

    if (editMode === 'blur' && width > 10 && height > 10) {
      const newBlurArea: BlurArea = {
        id: `blur-${Date.now()}`,
        x: minX,
        y: minY,
        width,
        height,
        intensity: blurIntensity,
        type: maskType,
      };
      setBlurAreas([...blurAreas, newBlurArea]);
    }

    setIsDrawing(false);
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Orijinal fotoğrafı yeniden çiz
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      // Blur alanlarını çiz
      blurAreas.forEach((area) => {
        if (area.type === 'circle') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.arc(area.x + area.width / 2, area.y + area.height / 2, area.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(area.x, area.y, area.width, area.height);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.strokeRect(area.x, area.y, area.width, area.height);
        }
      });
    };
    img.src = imageSrc;
  };

  const handleRemoveBlur = (id: string) => {
    setBlurAreas(blurAreas.filter((area) => area.id !== id));
    if (selectedBlurId === id) {
      setSelectedBlurId(null);
    }
  };

  const handleReset = () => {
    setFilters({ brightness: 0, contrast: 0, saturation: 0, blur: 0 });
    setBlurAreas([]);
    setShowBrandMask(false);
    setEditMode('none');
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.95);
      });

      await onSave?.(blob);
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="bg-black/30 border border-white/10 rounded-2xl overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className={`w-full max-h-[500px] object-contain ${
            editMode !== 'none' ? 'cursor-crosshair' : 'cursor-default'
          }`}
        />
      </div>

      {/* Araç Seçimi */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setEditMode(editMode === 'blur' ? 'none' : 'blur')}
          className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            editMode === 'blur'
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-1" />
          Blur
        </button>

        <button
          onClick={() => setEditMode(editMode === 'filter' ? 'none' : 'filter')}
          className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            editMode === 'filter'
              ? 'bg-gold-500/20 border border-gold-500/30 text-gold-400'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-1" />
          Filtre
        </button>

        <button
          onClick={() => setShowBrandMask(!showBrandMask)}
          className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
            showBrandMask
              ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4 inline mr-1" />
          Marka
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase hover:bg-white/10 transition-all"
        >
          <RotateCcw className="w-4 h-4 inline mr-1" />
          Sıfırla
        </button>
      </div>

      {/* Blur Ayarları */}
      {editMode === 'blur' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3"
        >
          <h3 className="font-bold text-white text-sm">Blur Ayarları</h3>

          {/* Maske Türü */}
          <div className="space-y-2">
            <label className="text-xs text-white/60">Maske Türü</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMaskType('circle')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  maskType === 'circle'
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border border-white/10 text-white/60'
                }`}
              >
                <Circle className="w-4 h-4 inline mr-1" />
                Dairesel
              </button>
              <button
                onClick={() => setMaskType('rectangle')}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  maskType === 'rectangle'
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border border-white/10 text-white/60'
                }`}
              >
                <Square className="w-4 h-4 inline mr-1" />
                Dikdörtgen
              </button>
            </div>
          </div>

          {/* Blur Yoğunluğu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/60">Yoğunluk</label>
              <span className="text-xs font-bold text-emerald-400">{blurIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={blurIntensity}
              onChange={(e) => setBlurIntensity(Number(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* Blur Alanları */}
          {blurAreas.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="text-xs text-white/60">Blur Alanları ({blurAreas.length})</p>
              <div className="space-y-1">
                {blurAreas.map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center justify-between p-2 bg-black/30 rounded-lg"
                  >
                    <span className="text-xs text-white/60">
                      {area.type === 'circle' ? '⭕' : '▭'} {area.intensity}%
                    </span>
                    <button
                      onClick={() => handleRemoveBlur(area.id)}
                      className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Filtre Ayarları */}
      {editMode === 'filter' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3"
        >
          <h3 className="font-bold text-white text-sm">Filtre Ayarları</h3>

          {[
            { key: 'brightness', label: 'Parlaklık', min: -100, max: 100 },
            { key: 'contrast', label: 'Kontrast', min: -100, max: 100 },
            { key: 'saturation', label: 'Doygunluk', min: -100, max: 100 },
            { key: 'blur', label: 'Bulanıklık', min: 0, max: 50 },
          ].map((filter) => (
            <div key={filter.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/60">{filter.label}</label>
                <span className="text-xs font-bold text-emerald-400">
                  {filters[filter.key as keyof typeof filters]}
                </span>
              </div>
              <input
                type="range"
                min={filter.min}
                max={filter.max}
                value={filters[filter.key as keyof typeof filters]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [filter.key]: Number(e.target.value),
                  }))
                }
                className="w-full accent-emerald-400"
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Marka Maskesi Ayarları */}
      {showBrandMask && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3"
        >
          <h3 className="font-bold text-white text-sm">Zühre Planet Maskesi</h3>
          <p className="text-xs text-white/40">Marka maskesini konumlandır ve boyutlandır</p>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-white/60">X Konumu</label>
              <input
                type="number"
                value={maskPosition.x}
                onChange={(e) =>
                  setMaskPosition((prev) => ({ ...prev, x: Number(e.target.value) }))
                }
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60">Y Konumu</label>
              <input
                type="number"
                value={maskPosition.y}
                onChange={(e) =>
                  setMaskPosition((prev) => ({ ...prev, y: Number(e.target.value) }))
                }
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60">Genişlik</label>
              <input
                type="number"
                value={maskSize.width}
                onChange={(e) =>
                  setMaskSize((prev) => ({ ...prev, width: Number(e.target.value) }))
                }
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-white/60">Yükseklik</label>
              <input
                type="number"
                value={maskSize.height}
                onChange={(e) =>
                  setMaskSize((prev) => ({ ...prev, height: Number(e.target.value) }))
                }
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Aksiyonlar */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 font-bold text-sm uppercase hover:bg-white/10 transition-all"
        >
          İptal
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold text-sm uppercase disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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

export default AdvancedPhotoEditor;


