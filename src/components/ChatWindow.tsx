import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  Info,
  Shield,
  Mic,
  File,
  Lock,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeRain } from '@/components/ui/CodeRain';
import { PhantomMediaBox } from '@/components/ui/PhantomMediaBox';
import type { Message as SharedMessage, Conversation as SharedConversation } from '@/types/message';

type Message = Pick<SharedMessage, 'id' | 'senderId' | 'type' | 'mediaUrl' | 'fileName' | 'fileSize'> & {
  content?: string;
  timestamp: string | Date;
  status: SharedMessage['status'];
};

type Conversation = Pick<SharedConversation, 'id' | 'participantName' | 'participantAvatar' | 'onlineStatus'> & {
  isMuted?: boolean;
  typingUsers: readonly unknown[];
};

interface ChatWindowProps {
  currentUserId: string;
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, type: 'text') => void;
  onSendMedia: (file: File) => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onShowInfo?: () => void;
  isMobile?: boolean;
  onBack?: () => void;
}

const statusColors = {
  online: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
  offline: 'bg-white/20',
  away: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
  busy: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
};

const statusLabels = {
  online: 'YÖRÜNGEDE',
  offline: 'SİSTEM DIŞI',
  away: 'DERİN BOŞLUKTA',
  busy: 'MEŞGUL'
};

export function ChatWindow({
  currentUserId,
  conversation,
  messages,
  onSendMessage,
  onSendMedia: _onSendMedia,
  onCall,
  onVideoCall,
  onShowInfo,
  isMobile,
  onBack
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [isStealthMode, setIsStealthMode] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue, 'text');
      setInputValue('');
    }
  };

  const getStatusColor = (status: keyof typeof statusColors) => statusColors[status];

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'image':
      case 'video':
        return (
          <div className="space-y-2">
            {message.mediaUrl && <PhantomMediaBox url={message.mediaUrl} type={message.type} />}
            {message.content && <p className="text-sm px-1 py-1 text-shadow-premium">{message.content}</p>}
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.5)]">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="h-1 bg-white/20 rounded-full w-24">
                <div className="w-1/3 h-full bg-gold-400 rounded-full shadow-[0_0_5px_#e0bd52]" />
              </div>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <File className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-shadow-premium">{message.fileName || 'Dosya eki'}</p>
              {message.fileSize && (
                <p className="text-xs text-white/60 font-medium">
                  {(message.fileSize / 1024).toFixed(1)} KB
                </p>
              )}
              {message.content && <p className="text-xs text-white/80 mt-1 text-shadow-premium">{message.content}</p>}
            </div>
          </div>
        );

      default:
        return <p className="text-sm font-medium whitespace-pre-wrap break-words px-1 text-shadow-premium">{message.content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
      {/* Encryption Background Effect */}
      <CodeRain opacity={isStealthMode ? 0.3 : 0.08} />
      
      {/* Header */}
      <header className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-3xl relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isMobile && onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
                ←
              </Button>
            )}
            <div className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold bg-gradient-to-tr from-gold-600 to-gold-600 p-[2px]">
                <div className={`w-full h-full rounded-full bg-black overflow-hidden ${isStealthMode ? 'blur-md grayscale' : ''}`}>
                   {conversation.participantAvatar ? (
                    <img src={conversation.participantAvatar} alt="o" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white flex items-center justify-center h-full">{conversation.participantName[0].toUpperCase()}</span>
                  )}
                </div>
              </div>
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getStatusColor(conversation.onlineStatus)} border-[3px] border-black rounded-full`} />
            </div>
            <div>
              <h3 className={`font-black flex items-center gap-2 uppercase tracking-widest text-xs italic text-shadow-premium ${isStealthMode ? 'text-white/40' : 'text-primary'}`}>
                {isStealthMode ? 'SHADOW PARTICIPANT' : conversation.participantName}
                {conversation.isMuted && <Badge className="bg-white/10 text-white/50 border-none text-[8px]">🔊 KAPALI</Badge>}
              </h3>
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-black italic text-shadow-premium">
                {statusLabels[conversation.onlineStatus]}
                {conversation.typingUsers.length > 0 && <span className="ml-2 text-gold-400 animate-pulse font-black shadow-[0_0_10px_#e0bd52]">• SINYAL AKTARILIYOR</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onCall && <Button variant="ghost" size="icon" onClick={onCall} className="text-white/60 hover:text-white hover:bg-white/10"><Phone className="w-5 h-5" /></Button>}
            {onVideoCall && <Button variant="ghost" size="icon" onClick={onVideoCall} className="text-white/60 hover:text-white hover:bg-white/10"><Video className="w-5 h-5" /></Button>}
            {onShowInfo && <Button variant="ghost" size="icon" onClick={onShowInfo} className="text-white/60 hover:text-white hover:bg-white/10"><Info className="w-5 h-5" /></Button>}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-transparent custom-scrollbar">
        {/* End-To-End Encryption Notice */}
        <div className="flex justify-center mb-8 mt-4">
          <div className="bg-slate-900/80 border border-emerald-500/40 text-emerald-400 px-8 py-4 rounded-[2rem] flex items-center gap-4 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Shield className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[9px] uppercase font-black tracking-[0.2em] leading-relaxed text-shadow-premium">PHANTOM PROTOKOLÜ AKTİF. BU BAĞLANTI UÇTAN UCA ŞİFRELİ VE GALAKSİ PORTALLARI ARKASINDA GİZLİDİR.</span>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-center text-white/30">
               <span className="text-[9px] uppercase font-black tracking-widest italic tracking-[0.5em]">Kozmik İletişimi Başlat...</span>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`max-w-[85%] md:max-w-[70%] ${isOwn ? 'order-2' : 'order-1'} flex flex-col`}>
                    <div
                      className={`relative rounded-3xl px-6 py-4 shadow-2xl backdrop-blur-3xl ${isOwn
                        ? 'bg-gradient-to-br from-gold-600 to-gold-600 text-white rounded-tr-sm border border-white/20'
                        : 'bg-slate-950/70 text-white/90 rounded-tl-sm border border-white/10'
                        }`}
                    >
                      {renderMessageContent(message)}
                    </div>
                    
                    <div className={`flex items-center gap-2 mt-1.5 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                       <span className="text-[8px] font-black text-white/30 uppercase tracking-widest italic">{formatTime(message.timestamp)}</span>
                       {isOwn && (
                         <div className="flex">
                            {message.status === 'read' ? (
                               <CheckCheck className="w-3 h-3 text-emerald-400" />
                            ) : message.status === 'delivered' ? (
                               <CheckCheck className="w-3 h-3 text-white/40" />
                            ) : message.status === 'sent' ? (
                               <Check className="w-3 h-3 text-white/40" />
                            ) : (
                               <Clock className="w-3 h-3 text-white/20 animate-spin" />
                            )}
                         </div>
                       )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-4 md:p-6 bg-black/40 backdrop-blur-3xl border-t border-white/5 relative z-30">
        <div className="max-w-4xl mx-auto flex items-end gap-3 md:gap-4">
           <div className="flex gap-1 md:gap-2 mb-1">
             <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                <Paperclip className="w-5 h-5" />
             </Button>
           </div>

           <div className="flex-1 relative group">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="MESAJINI GALAKSİYE GÖNDER..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-6 py-4 md:py-5 pr-14 focus:outline-none focus:border-primary/50 text-white placeholder:text-white/20 text-sm resize-none custom-scrollbar font-bold tracking-widest italic min-h-[56px] max-h-32 transition-all"
                rows={1}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-3 bottom-3 text-white/40 hover:text-primary transition-colors"
                onClick={() => {}}
              >
                <Smile className="w-5 h-5" />
              </Button>
           </div>

           <Button 
             onClick={handleSend}
             disabled={!inputValue.trim()}
             className={`h-12 w-12 md:h-14 md:w-14 rounded-2xl md:rounded-[1.5rem] mb-1 transition-all ${inputValue.trim() ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-100' : 'bg-white/5 text-white/20 scale-95'}`}
           >
             <Send className={`w-5 h-5 md:w-6 md:h-6 ${inputValue.trim() ? 'animate-pulse' : ''}`} />
           </Button>
        </div>
        
        <div className="flex justify-center mt-4">
           <button 
             onClick={() => setIsStealthMode(!isStealthMode)}
             className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${isStealthMode ? 'bg-gold-500/20 border-gold-500/50 text-gold-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/10 text-white/30 hover:text-white/50'}`}
           >
             <Lock className="w-3 h-3" />
             <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">SHADOW MODE: {isStealthMode ? 'AKTİF' : 'KAPALI'}</span>
           </button>
        </div>
      </footer>
    </div>
  );
}
