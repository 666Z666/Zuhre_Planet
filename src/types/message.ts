/**
 * Chat and Messaging Types
 * 
 * Sistem genelindeki mesajlaşma ve dosya paylaşımı tipleri.
 */

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'location' | 'system' | 'call';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
  metadata?: Record<string, unknown>;
  payload?: unknown; // Esnek yükler için
}

export interface ConversationSummary {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: ChatMessage;
  unreadCount: number;
  isOnline: boolean;
  updatedAt: string;
}

/** Configuration for active call or session */
export interface ActiveCall {
  callId: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'connected' | 'ended' | 'missed';
  startTime?: string;
  endTime?: string;
}

/** Error payload for messaging service */
export interface MessagingError {
  code: string;
  message: string;
  details?: unknown;
}

/** Filter for messaging history */
export interface MessageFilter {
  type?: MessageType[];
  startDate?: string;
  endDate?: string;
  query?: string;
  limit?: number;
  offset?: number;
}

export const QUICK_REPLIES = [
  "Harika görünüyorsun!",
  "Randevu detaylarını konuşalım mı?",
  "Hangi bölgedesin?",
  "Fiyat bilgisi alabilir miyim?",
  "Teşekkürler, çok naziksin."
];

export type OnlineStatus = 'online' | 'offline' | 'away' | 'busy';

export interface MessageAttachment {
    id: string;
    /** Sunucuya yüklendikten sonra dolar; yükleme sırasında boş olabilir */
    url?: string;
    type: string;
    name?: string;
    size?: number;
    /** İstemci tarafı: yüklenen dosya ve önizleme */
    file?: File;
    preview?: string;
    uploadProgress?: number;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageReaction {
    emoji: string;
    userId: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName?: string;
    senderAvatar?: string;
    receiverId?: string;
    content: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'system' | 'call' | 'location';
    status: MessageStatus;
    timestamp: string | Date;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    reactions?: MessageReaction[];
    isEdited?: boolean;
    metadata?: Record<string, unknown>;
}

/** Bir sohbette yazmakta olan kullanıcı */
export interface TypingUser {
    userId: string;
    userName: string;
    timestamp: Date;
}

export interface ChatError {
    type: string;
    message: string;
    retryable?: boolean;
}

export interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantAvatar?: string;
    onlineStatus: OnlineStatus;
    typingUsers: TypingUser[];
    participantType?: 'escort' | 'customer' | 'admin';
    createdAt?: Date | string;
    isMuted?: boolean;
    isPinned?: boolean;
    isArchived?: boolean;
    unreadCount: number;
    lastMessage?: Message;
    lastMessageAt?: Date | string;
    lastActivityAt?: string | Date;
}
export interface MessageState {
    conversations: Conversation[];
    activeConversationId: string | null;
    messages: Record<string, Message[]>;
    drafts: Record<string, string>;
    presences: Record<string, OnlineStatus>;
    isLoading: boolean;
    error: string | null;
    typingUsers: Record<string, TypingUser[]>;
}

