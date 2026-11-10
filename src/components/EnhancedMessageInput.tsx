/**
 * Enhanced Message Input Component
 * 
 * Zengin mesajlaşma özellikleri (Emoji, Dosya, Ses) sunan gelişmiş giriş alanı.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface EnhancedMessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'file') => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function EnhancedMessageInput({
  onSendMessage,
  isLoading = false,
  placeholder = 'Mesajınızı yazın...',
}: EnhancedMessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;

    if (attachments.length > 0) {
      attachments.forEach(file => {
        const type = file.type.startsWith('image/') ? 'image' : 'file';
        onSendMessage(URL.createObjectURL(file), type);
      });
      setAttachments([]);
    }

    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
      {/* Attachments Preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="flex flex-wrap gap-2 mb-3 px-2"
          >
            {attachments.map((file, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="relative group p-1 bg-white/5 border border-white/10 rounded-xl"
              >
                {file.type.startsWith('image/') ? (
                   <img src={URL.createObjectURL(file)} className="w-12 h-12 rounded-lg object-cover" alt="prev" />
                ) : (
                   <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                     <Paperclip className="w-4 h-4 text-emerald-400" />
                   </div>
                )}
                <button
                  onClick={() => removeAttachment(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 group-hover:scale-110 transition-transform"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-[28px] p-2 focus-within:border-emerald-500/50 transition-colors">
        <div className="flex items-center gap-1 mb-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-gray-400 hover:text-emerald-400 hover:bg-white/5"
            onClick={() => {/* Emoji picker integration ready */}}
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-gray-400 hover:text-emerald-400 hover:bg-white/5"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
        </div>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-0 focus-visible:ring-0 text-white text-sm resize-none py-2.5 px-3"
        />

        <div className="flex items-center gap-1 mb-1">
          {message.trim() || attachments.length > 0 ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </motion.div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-gray-400 hover:text-pink-400 hover:bg-white/5"
              onClick={() => {/* Voice recording integration ready */}}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
