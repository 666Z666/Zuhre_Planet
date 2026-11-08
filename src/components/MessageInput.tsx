/**
 * Message Input Component
 *
 * Message composer with text input, emoji picker, file attachments,
 * and quick replies. Supports real-time typing indicators.
 *
 * @module components/MessageInput
 * @category Components - Messaging
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Send,
  Smile,
  Paperclip,
  X,
  Image,
  Mic,
  MapPin,
  File,
  Video,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageAttachment, QUICK_REPLIES } from '@/types/message';

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (content: string, type?: string, attachments?: MessageAttachment[]) => Promise<void>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  isMuted?: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  showQuickReplies?: boolean;
  className?: string;
}

const TYPING_TIMEOUT = 3000; // ms

export function MessageInput({
  conversationId: _conversationId,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  isMuted = false,
  placeholder = 'Mesajınızı yazın... (Shift+Enter için alt satır)',
  maxLength = 4000,
  disabled = false,
  showQuickReplies = true,
  className = '',
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [_showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showQuickRepliesMenu, setShowQuickRepliesMenu] = useState(false);

  const typingTimeoutRef = useRef<number>();
  const recordingTimerRef = useRef<number>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachmentsRef = useRef<MessageAttachment[]>([]);

  const revokeAttachmentPreviews = (items: MessageAttachment[]) => {
    items.forEach((attachment) => {
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
    });
  };

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      revokeAttachmentPreviews(attachmentsRef.current);
    };
  }, []);

  // Handle typing indicator
  useEffect(() => {
    if (text.trim()) {
      onTypingStart?.();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = window.setTimeout(() => {
        onTypingStop?.();
      }, TYPING_TIMEOUT);
    } else {
      onTypingStop?.();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [text, onTypingStart, onTypingStop]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000) as unknown as number;
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const handleSend = async () => {
    const trimmedText = text.trim();
    const currentAttachments = attachments;
    const inferredType = currentAttachments[0]?.type ?? 'text';

    if ((!trimmedText && attachments.length === 0) || disabled) return;

    await onSendMessage(trimmedText, inferredType, currentAttachments);

    revokeAttachmentPreviews(currentAttachments);
    setText('');
    setAttachments([]);
    setShowEmojiPicker(false);
    onTypingStop?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: MessageAttachment[] = files.map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      type: file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
        ? 'audio'
        : 'file',
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploadProgress: 0,
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    setShowAttachmentMenu(false);
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const nextAttachments = prev.filter(a => a.id !== id);
      const removedAttachment = prev.find(a => a.id === id);
      if (removedAttachment?.preview) {
        URL.revokeObjectURL(removedAttachment.preview);
      }
      return nextAttachments;
    });
  };

  const handleQuickReply = (replyText: string) => {
    setText(replyText);
    setShowQuickRepliesMenu(false);
    // Focus textarea
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and send
      setIsRecording(false);
      onSendMessage('Ses mesajı', 'audio');
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Unused constants removed or prefixed if needed later

  return (
    <div className={`p-4 border-t bg-background ${className}`}>
      {/* Attachments preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex gap-2 mb-3 overflow-x-auto pb-2"
          >
            {attachments.map(attachment => (
              <motion.div
                key={attachment.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative group shrink-0"
              >
                {attachment.type === 'image' ? (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={attachment.preview}
                      alt="Attachment preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                    <File className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAttachment(attachment.id)}
                  title="Eki Sil"
                  aria-label="Eki sil"
                >
                  <X className="w-3 h-3" />
                </Button>
                {attachment.uploadProgress !== undefined && attachment.uploadProgress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${attachment.uploadProgress}%` }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick replies */}
      <AnimatePresence>
        {showQuickRepliesMenu && showQuickReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-3 flex flex-wrap gap-2"
          >
            {QUICK_REPLIES.map(reply => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className="shrink-0"
              >
                {reply}
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="flex items-end gap-2">
        {/* Quick replies toggle */}
        {showQuickReplies && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowQuickRepliesMenu(!showQuickRepliesMenu)}
            className={showQuickRepliesMenu ? 'bg-primary/10' : ''}
            title="Hızlı Cevaplar"
            aria-label="Hızlı cevaplar menüsünü aç/kapat"
          >
            <Smile className="w-5 h-5" />
          </Button>
        )}

        {/* Attachment menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            disabled={disabled || isMuted}
            title="Dosya Ekle"
            aria-label="Dosya ekleme menüsünü aç/kapat"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <AnimatePresence>
            {showAttachmentMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-12 left-0 bg-background border rounded-lg shadow-xl z-50 overflow-hidden min-w-[200px]"
              >
                <div className="p-2 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachmentMenu(false);
                    }}
                    title="Resim Ekle"
                    aria-label="Resim ekle"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Resim
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachmentMenu(false);
                    }}
                    title="Video Ekle"
                    aria-label="Video ekle"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowAttachmentMenu(false);
                    }}
                    title="Dosya Ekle"
                    aria-label="Dosya ekle"
                  >
                    <File className="w-4 h-4 mr-2" />
                    Dosya
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      // Handle location
                      setShowAttachmentMenu(false);
                    }}
                    title="Konum Paylaş"
                    aria-label="Konum paylaş"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Konum
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            title="Mesaj Girişi"
            aria-label="Mesajınızı buraya yazın"
            disabled={disabled || isMuted}
            className="w-full resize-none border-0 focus:ring-0 bg-transparent text-sm px-4 py-3 max-h-32 min-h-[44px] pr-10"
            maxLength={maxLength}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {text.length} / {maxLength}
            </span>
          </div>
        </div>

        {/* Voice recording */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRecording}
          disabled={disabled || isMuted}
          className={isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
          title={isRecording ? "Kaydı Durdur" : "Ses Kaydet"}
          aria-label={isRecording ? "Ses kaydını durdur" : "Ses kaydı başlat"}
        >
          {isRecording ? (
            <div className="text-center">
              <X className="w-5 h-5" />
              <p className="text-xs mt-0.5">{formatRecordingTime(recordingDuration)}</p>
            </div>
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </Button>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={(!text.trim() && attachments.length === 0) || disabled}
          size="icon"
          className="shrink-0"
          title="Mesajı Gönder"
          aria-label="Mesajı gönder"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Muted warning */}
      {isMuted && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          🔇 Bu konuşma sessize alınmış
        </div>
      )}
    </div>
  );
}

export { MessageInput as default };
