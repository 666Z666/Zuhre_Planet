/**
 * Image Editor Component
 * 
 * Basit görüntü düzenleme, kırpma ve filtreler.
 */

import React, { useState } from 'react';
import { 
  RotateCcw, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical, 
  Sliders, 
  Image as ImageIcon,
  Save,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageEditorProps {
  imageSrc: string;
  onSave?: (editedImage: Blob) => void;
  onCancel?: () => void;
  className?: string;
}

export function ImageEditor({
  imageSrc,
  onSave,
  onCancel,
  className = '',
}: ImageEditorProps) {
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simülasyon: Görüntü işleme
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (onSave) {
      const blob = new Blob([], { type: 'image/jpeg' });
      onSave(blob);
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Edit Area */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-black/40 border border-white/10">
        <img
          src={imageSrc}
          alt="Edit Preview"
          className="w-full h-full object-contain transition-transform duration-300"
          style={{
            transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
            filter: `brightness(${brightness}%) contrast(${contrast}%)`
          }}
        />
      </div>

      {/* Control Panel */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-8">
        {/* Transform Controls */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: RotateCcw, onClick: () => setRotation(r => r - 90), label: '-90°' },
            { icon: RotateCw, onClick: () => setRotation(r => r + 90), label: '+90°' },
            { icon: FlipHorizontal, onClick: () => setFlipH(!flipH), label: 'Yatay' },
            { icon: FlipVertical, onClick: () => setFlipV(!flipV), label: 'Dikey' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold"
            >
              <item.icon className="w-4 h-4 text-emerald-400" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Adjustments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-500 font-black uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-3 h-3" /> Parlaklık
              </span>
              <span className="text-emerald-400">%{brightness}</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-500 font-black uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Sliders className="w-3 h-3" /> Kontrast
              </span>
              <span className="text-emerald-400">%{contrast}</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-white/5">
          <button
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-black uppercase tracking-widest hover:text-white transition-all text-sm"
          >
            İptal
          </button>
          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-white/5 text-gray-400 hover:text-red-400 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 text-sm"
          >
            {isSaving ? (
              <div className="w-5 h-5 rounded-full border-4 border-white/20 border-t-white animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Değişiklikleri Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
