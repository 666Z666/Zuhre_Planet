/**
 * useChat Hook
 *
 * Domain-specific real-time messaging hook.
 * Uses the global WebSocketContext for transport while managing chat state
 * (conversations, mock data, and chat UI actions).
 *
 * @module hooks/useChat
 * @category Hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import {
  Message,
  Conversation,
  MessageState,
  OnlineStatus,
  TypingUser,
  MessageAttachment,
  ChatError,
} from '@/types/message';

interface UseChatOptions {
  wsUrl?: string; // Kept for backwards compatibility, but actual connection is managed by Context
  autoReconnect?: boolean;
  reconnectInterval?: number;
  enablePresence?: boolean;
  onMessageReceived?: (message: Message) => void;
  onConversationUpdated?: (conversation: Conversation) => void;
  onError?: (error: ChatError) => void;
}

interface UseChatReturn {
  // State
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  presences: Record<string, OnlineStatus>;
  typingUsers: Record<string, TypingUser[]>;

  // Actions
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (conversationId: string, content: string, type?: string, attachments?: MessageAttachment[]) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => Promise<void>;
  markAsRead: (conversationId: string, messageId: string) => Promise<void>;
  loadMoreMessages: (conversationId: string) => Promise<void>;
  pinConversation: (conversationId: string) => Promise<void>;
  unpinConversation: (conversationId: string) => Promise<void>;
  archiveConversation: (conversationId: string) => Promise<void>;
  muteConversation: (conversationId: string, duration?: number) => Promise<void>;
  unmuteConversation: (conversationId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;

  // Typing
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;

  // Connection
  connect: () => void;
  disconnect: () => void;
}

// Simulated data store (replace with actual API)
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'escort-1',
    participantName: 'Ayşe Yılmaz',
    participantAvatar: undefined,
    participantType: 'escort',
    unreadCount: 3,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    onlineStatus: 'online',
    typingUsers: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    participantId: 'escort-2',
    participantName: 'Zeynep Demir',
    participantAvatar: undefined,
    participantType: 'escort',
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    onlineStatus: 'offline',
    typingUsers: [],
    createdAt: new Date(),
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'escort-1',
      senderName: 'Ayşe Yılmaz',
      content: 'Merhaba! Hoş geldiniz 💖',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 3600000),
      reactions: [],
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'me',
      senderName: 'Ben',
      content: 'Merhaba, nasılsınız?',
      type: 'text',
      status: 'read',
      timestamp: new Date(Date.now() - 3000000),
      reactions: [],
    },
  ],
};

const LOCAL_USER_IDS = new Set(['me', 'current-user']);

function isLocalUser(userId: string): boolean {
  return LOCAL_USER_IDS.has(userId);
}

function normalizeWsMessage(message: {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  timestamp: Date | string;
  readAt?: Date | string;
  deliveredAt?: Date | string;
  attachments?: Array<{ url?: string; fileName?: string; fileSize?: number; mimeType?: string }>;
  metadata?: Record<string, unknown>;
}): Message {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    senderName: typeof message.metadata?.senderName === 'string'
      ? message.metadata.senderName
      : message.senderId,
    content: message.content,
    type: (message.type === 'system' || message.type === 'image' || message.type === 'video' || message.type === 'audio' || message.type === 'location' || message.type === 'file')
      ? message.type
      : 'text',
    status: message.readAt ? 'read' : message.deliveredAt ? 'delivered' : 'sent',
    timestamp: new Date(message.timestamp),
    reactions: [],
    mediaUrl: message.attachments?.[0]?.url,
    fileName: message.attachments?.[0]?.fileName,
    fileSize: message.attachments?.[0]?.fileSize,
    mimeType: message.attachments?.[0]?.mimeType,
  };
}

function upsertConversation(conversations: Conversation[], message: Message, activeConversationId: string | null): Conversation[] {
  const existingConversation = conversations.find((conversation) => conversation.id === message.conversationId);
  const unreadIncrement = !isLocalUser(message.senderId) && activeConversationId !== message.conversationId ? 1 : 0;

  if (!existingConversation) {
    return [
      {
        id: message.conversationId,
        participantId: isLocalUser(message.senderId) ? 'unknown' : message.senderId,
        participantName: isLocalUser(message.senderId) ? 'Yeni Sohbet' : (message.senderName ?? 'Kullanıcı'),
        participantAvatar: undefined,
        participantType: 'customer',
        lastMessage: message,
        lastMessageAt: message.timestamp,
        unreadCount: unreadIncrement,
        isPinned: false,
        isArchived: false,
        isMuted: false,
        onlineStatus: 'offline',
        typingUsers: [],
        createdAt: message.timestamp,
      },
      ...conversations,
    ];
  }

  return conversations
    .map((conversation) => conversation.id === message.conversationId
      ? {
          ...conversation,
          lastMessage: message,
          lastMessageAt: message.timestamp,
          unreadCount: conversation.unreadCount + unreadIncrement,
        }
      : conversation)
    .sort((left, right) => {
      const leftTime = new Date(left.lastMessageAt ?? left.createdAt ?? 0).getTime();
      const rightTime = new Date(right.lastMessageAt ?? right.createdAt ?? 0).getTime();
      return rightTime - leftTime;
    });
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    enablePresence = true,
    onMessageReceived,
    onConversationUpdated,
    onError,
  } = options;

  // Get WebSocket primitives from context
  const ws = useWebSocket();

  // State
  const [state, setState] = useState<MessageState>({
    conversations: mockConversations,
    activeConversationId: null,
    messages: mockMessages,
    drafts: {},
    presences: {},
    isLoading: false,
    error: null,
    typingUsers: {},
  });

  const typingTimeoutRef = useRef<Record<string, number>>({});
  const processedWsMessageIdsRef = useRef<Set<string>>(new Set());

  // Sync WebSocket errors
  useEffect(() => {
    if (ws.error && onError) {
      onError({
        type: 'CONNECTION_FAILED',
        message: ws.error.message || 'Bağlantı hatası',
        retryable: true,
      });
    }
  }, [ws.error, onError]);

  useEffect(() => {
    ws.messages.forEach((wsMessage) => {
      if (processedWsMessageIdsRef.current.has(wsMessage.id) || isLocalUser(wsMessage.senderId)) {
        return;
      }

      processedWsMessageIdsRef.current.add(wsMessage.id);
      const normalizedMessage = normalizeWsMessage(wsMessage);

      setState((prev) => {
        const conversationMessages = prev.messages[normalizedMessage.conversationId] || [];
        if (conversationMessages.some((message) => message.id === normalizedMessage.id)) {
          return prev;
        }

        const nextConversations = upsertConversation(prev.conversations, normalizedMessage, prev.activeConversationId);
        const updatedConversation = nextConversations.find((conversation) => conversation.id === normalizedMessage.conversationId);

        if (updatedConversation) {
          setTimeout(() => onConversationUpdated?.(updatedConversation), 0);
        }
        setTimeout(() => onMessageReceived?.(normalizedMessage), 0);

        return {
          ...prev,
          messages: {
            ...prev.messages,
            [normalizedMessage.conversationId]: [
              normalizedMessage,
              ...conversationMessages,
            ],
          },
          conversations: nextConversations,
        };
      });
    });
  }, [ws.messages, onConversationUpdated, onMessageReceived]);

  useEffect(() => {
    const unsubscribeTyping = ws.onTyping((typing) => {
      if (isLocalUser(typing.userId)) {
        return;
      }

      setState((prev) => {
        const existingTypingUsers = prev.typingUsers[typing.conversationId] || [];
        const nextTypingUsers = typing.isTyping
          ? [
              ...existingTypingUsers.filter((user) => user.userId !== typing.userId),
              {
                userId: typing.userId,
                userName: typing.userId,
                timestamp: new Date(),
              },
            ]
          : existingTypingUsers.filter((user) => user.userId !== typing.userId);

        return {
          ...prev,
          typingUsers: {
            ...prev.typingUsers,
            [typing.conversationId]: nextTypingUsers,
          },
          conversations: prev.conversations.map((conversation) => conversation.id === typing.conversationId
            ? { ...conversation, typingUsers: nextTypingUsers }
            : conversation),
        };
      });
    });

    return unsubscribeTyping;
  }, [ws]);

  useEffect(() => {
    if (!enablePresence) {
      return;
    }

    const unsubscribeStatus = ws.onUserStatus((presence) => {
      const normalizedStatus = (presence.status === 'online' || presence.status === 'offline' || presence.status === 'away' || presence.status === 'busy')
        ? presence.status
        : 'offline';

      setState((prev) => ({
        ...prev,
        presences: {
          ...prev.presences,
          [presence.userId]: normalizedStatus as OnlineStatus,
        },
        conversations: prev.conversations.map((conversation) => conversation.participantId === presence.userId
          ? { ...conversation, onlineStatus: normalizedStatus as OnlineStatus }
          : conversation),
      }));
    });

    return unsubscribeStatus;
  }, [enablePresence, ws]);

  // --- Helper Actions (Defined first to avoid hoisting issues) ---

  // Mark as read
  const markAsRead = useCallback(async (conversationId: string, messageId: string) => {
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: prev.messages[conversationId]?.map(m =>
          m.id === messageId || (m.status !== 'read' && new Date(m.timestamp) < new Date())
            ? { ...m, status: 'read' }
            : m
        ) || [],
      },
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));

    ws.markAsRead(conversationId, messageId);
  }, [ws]);

  // Stop typing
  const stopTyping = useCallback((conversationId: string) => {
    if (typingTimeoutRef.current[conversationId]) {
      clearTimeout(typingTimeoutRef.current[conversationId]);
    }

    ws.sendTypingIndicator(conversationId, false);
  }, [ws]);

  // --- Main Actions ---

  // Set active conversation
  const setActiveConversation = useCallback((conversationId: string | null) => {
    setState(prev => {
      // Mark messages as read when switching conversation
      if (conversationId) {
        const lastMessage = prev.messages[conversationId]?.[0];
        if (lastMessage && markAsRead) {
          // Yan etkiyi setTimeout ile state updater dışına taşı
          setTimeout(() => markAsRead(conversationId, lastMessage.id), 0);
        }
      }
      return { ...prev, activeConversationId: conversationId };
    });
  }, [markAsRead]);

  // Send message
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    type = 'text',
    attachments?: MessageAttachment[]
  ) => {
    const tempId = `temp-${Date.now()}`;
    const primaryAttachment = attachments?.[0];
    const resolvedType: Message['type'] =
      (primaryAttachment?.type === 'image' || primaryAttachment?.type === 'video' || primaryAttachment?.type === 'audio' || primaryAttachment?.type === 'file'
        ? primaryAttachment.type
        : undefined) ??
      (type === 'image' || type === 'video' || type === 'audio' || type === 'location' || type === 'file' || type === 'system'
        ? type
        : 'text');
    const tempMessage: Message = {
      id: tempId,
      conversationId,
      senderId: 'me',
      senderName: 'Ben',
      content,
      type: resolvedType,
      status: 'sending',
      timestamp: new Date(),
      reactions: [],
      mediaUrl: primaryAttachment?.preview,
      fileName: primaryAttachment?.file?.name ?? primaryAttachment?.name,
      fileSize: primaryAttachment?.file?.size ?? primaryAttachment?.size,
      mimeType: primaryAttachment?.file?.type,
    };

    // Add temp message
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: [
          tempMessage,
          ...(prev.messages[conversationId] || []),
        ],
      },
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const realMessage: Message = {
        ...tempMessage,
        id: `msg-${Date.now()}`,
        status: 'sent',
      };

      // Replace temp message and update conversation in one state update
      setState(prev => {
        let newConversations = prev.conversations;
        const updatedConversation = prev.conversations.find(c => c.id === conversationId);
        if (updatedConversation) {
          const newConv = {
            ...updatedConversation,
            lastMessage: realMessage,
            lastMessageAt: new Date(),
          };
          newConversations = prev.conversations.map(c =>
            c.id === conversationId ? newConv : c
          );
          setTimeout(() => onConversationUpdated?.(newConv), 0);
        }

        return {
          ...prev,
          messages: {
            ...prev.messages,
            [conversationId]: prev.messages[conversationId]?.map(m =>
              m.id === tempId ? realMessage : m
            ) || [realMessage],
          },
          conversations: newConversations,
        };
      });

      // Send via WebSocket context
      ws.sendMessage({
        conversationId: realMessage.conversationId,
        senderId: realMessage.senderId,
        receiverId: 'unknown', // Need correct mapping in production
        type: resolvedType,
        content: realMessage.content,
      });

    } catch {
      // Handle error
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: prev.messages[conversationId]?.map(m =>
            m.id === tempId ? { ...m, status: 'failed' } : m
          ) || [],
        },
      }));
      onError?.({
        type: 'SEND_FAILED',
        message: 'Mesaj gönderilemedi',
        retryable: true,
      });
    }
  }, [ws, onConversationUpdated, onError]);

  // Edit message
  const editMessage = useCallback(async (messageId: string, content: string) => {
    // Find message
    let foundConversationId: string | null = null;
    let foundMessage: Message | null = null;

    for (const [convId, messages] of Object.entries(state.messages)) {
      const msg = messages.find(m => m.id === messageId);
      if (msg) {
        foundConversationId = convId;
        foundMessage = msg;
        break;
      }
    }

    if (!foundMessage || !foundConversationId) return;

    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [foundConversationId!]: prev.messages[foundConversationId!]?.map(m =>
          m.id === messageId
            ? { ...m, content, isEdited: true, editedAt: new Date() }
            : m
        ) || [],
      },
    }));
  }, [state.messages]);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    setState(prev => {
      const newMessages = { ...prev.messages };
      for (const convId in newMessages) {
        newMessages[convId] = newMessages[convId]?.filter(m => m.id !== messageId) || [];
      }
      return { ...prev, messages: newMessages };
    });
  }, []);

  // React to message
  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    // Find and update message
    setState(prev => {
      const newMessages = { ...prev.messages };
      for (const convId in newMessages) {
        newMessages[convId] = newMessages[convId]?.map(m => {
          if (m.id === messageId) {
            const existingReaction = m.reactions?.find(r => r.userId === 'me');
            if (existingReaction) {
              // Remove reaction
              return {
                ...m,
                reactions: m.reactions?.filter(r => r.userId !== 'me') || [],
              };
            } else {
              // Add reaction
              return {
                ...m,
                reactions: [
                  ...(m.reactions || []),
                  {
                    emoji,
                    userId: 'me',
                    userName: 'Ben',
                    timestamp: new Date(),
                  },
                ],
              };
            }
          }
          return m;
        }) || [];
      }
      return { ...prev, messages: newMessages };
    });
  }, []);

  // Load more messages
  const loadMoreMessages = useCallback(async (conversationId: string) => {
    // Simulate loading more messages
    console.warn('Loading more messages for:', conversationId);
  }, []);

  // Pin conversation
  const pinConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, isPinned: true } : c
      ),
    }));
  }, []);

  // Unpin conversation
  const unpinConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, isPinned: false } : c
      ),
    }));
  }, []);

  // Archive conversation
  const archiveConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId ? { ...c, isArchived: true } : c
      ),
    }));
  }, []);

  // Mute conversation
  const muteConversation = useCallback(async (conversationId: string, duration?: number) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId
          ? {
              ...c,
              isMuted: true,
              mutedUntil: duration ? new Date(Date.now() + duration * 60 * 60 * 1000) : undefined,
            }
          : c
      ),
    }));
  }, []);

  // Unmute conversation
  const unmuteConversation = useCallback(async (conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c =>
        c.id === conversationId
          ? { ...c, isMuted: false, mutedUntil: undefined }
          : c
      ),
    }));
  }, []);

  // Block user
  const blockUser = useCallback(async (userId: string) => {
    console.warn('Blocking user:', userId);
  }, []);

  // Unblock user
  const unblockUser = useCallback(async (userId: string) => {
    console.warn('Unblocking user:', userId);
  }, []);

  // Start typing
  const startTyping = useCallback((conversationId: string) => {
    // Clear existing timeout
    if (typingTimeoutRef.current[conversationId]) {
      clearTimeout(typingTimeoutRef.current[conversationId]);
    }

    ws.sendTypingIndicator(conversationId, true);

    // Auto-stop typing after timeout
    typingTimeoutRef.current[conversationId] = window.setTimeout(() => {
      stopTyping(conversationId);
    }, 3000) as unknown as number;
  }, [ws, stopTyping]);

  return {
    // State
    conversations: state.conversations,
    activeConversationId: state.activeConversationId,
    messages: state.messages,
    isConnected: ws.isConnected,
    isConnecting: ws.connectionStatus === 'connecting',
    error: ws.error ? ws.error.message : null,
    presences: state.presences,
    typingUsers: state.typingUsers || {},

    // Actions
    setActiveConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    markAsRead,
    loadMoreMessages,
    pinConversation,
    unpinConversation,
    archiveConversation,
    muteConversation,
    unmuteConversation,
    blockUser,
    unblockUser,

    // Typing
    startTyping,
    stopTyping,

    // Connection overrides (routed through context)
    connect: ws.connect,
    disconnect: ws.disconnect,
  };
}
