import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Trash2, Edit2, Check, CheckCheck, Clock } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  senderId: number;
  senderName?: string;
  createdAt: Date;
  editedAt?: Date;
  isRead: boolean;
  attachmentUrl?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  currentUserId: number;
  otherUserName?: string;
  onSendMessage?: (content: string) => Promise<void>;
  onDeleteMessage?: (messageId: number) => Promise<void>;
  onEditMessage?: (messageId: number, content: string) => Promise<void>;
  isLoading?: boolean;
  isOnline?: boolean;
}

/**
 * Premium Mesajlaşma Arayüzü
 * 
 * Glassmorphism, gerçek zamanlı hissi ve modern tasarım
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  currentUserId,
  otherUserName = 'Kullanıcı',
  onSendMessage,
  onDeleteMessage,
  onEditMessage,
  isLoading = false,
  isOnline = true,
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Otomatik scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim()) return;

    try {
      await onSendMessage?.(messageInput);
      setMessageInput('');
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
    }
  };

  const handleEdit = async (messageId: number) => {
    if (!editingContent.trim()) return;

    try {
      await onEditMessage?.(messageId, editingContent);
      setEditingId(null);
      setEditingContent('');
    } catch (err) {
      console.error('Mesaj düzenleme hatası:', err);
    }
  };

  const getReadStatus = (message: Message) => {
    if (message.senderId === currentUserId) {
      return message.isRead ? <CheckCheck size={14} /> : <Check size={14} />;
    }
    return null;
  };

  return (
    <div
      className="flex flex-col h-screen rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #f0f4ff 100%)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b backdrop-blur-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
              {otherUserName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">{otherUserName}</h2>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
              </div>
            </div>
          </div>

          <button 
            title="Daha Fazla"
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Mesajlar */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-200 to-blue-200 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Henüz mesaj yok</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Sohbeti başlatmak için bir mesaj gönderin
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div className="flex gap-2 max-w-xs lg:max-w-md group">
                  {/* Mesaj */}
                  <div
                    className={`rounded-2xl px-4 py-3 backdrop-blur-xl border transition-all ${
                      isOwn
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-blue-400/50'
                        : 'bg-white/70 dark:bg-slate-800/70 text-gray-900 dark:text-white border-white/30'
                    }`}
                  >
                    {editingId === message.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingContent}
                          title="Mesajı Düzenle"
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(message.id)}
                            title="Kaydet"
                            className="text-xs px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingContent('');
                            }}
                            title="İptal"
                            className="text-xs px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="break-words">{message.content}</p>
                        {message.attachmentUrl && (
                          <a
                            href={message.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-2 text-xs underline opacity-80 hover:opacity-100"
                          >
                            📎 Ek Dosya
                          </a>
                        )}
                        <div className="flex items-center justify-between mt-1 gap-2">
                          <span className="text-xs opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString('tr-TR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isOwn && (
                            <div className="text-white/70">
                              {getReadStatus(message)}
                            </div>
                          )}
                        </div>
                        {message.editedAt && (
                          <p className="text-xs opacity-60 mt-1">(düzenlendi)</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* İşlem Butonları */}
                  {hoveredMessageId === message.id && isOwn && editingId !== message.id && (
                    <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingId(message.id);
                          setEditingContent(message.content);
                        }}
                        className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-gray-600 dark:text-gray-400"
                        title="Düzenle"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteMessage?.(message.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-600 dark:text-red-400"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        className="px-6 py-4 border-t backdrop-blur-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        <div className="flex gap-3">
          <button
            className="p-3 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-gray-600 dark:text-gray-400"
            title="Dosya Ekle"
          >
            <Paperclip size={20} />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              title="Mesajınızı Yazın"
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Mesaj yazın..."
              className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={isLoading || !messageInput.trim()}
            className="p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:from-emerald-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            title="Gönder"
          >
            {isLoading ? (
              <Clock size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
