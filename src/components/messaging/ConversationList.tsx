import React, { useState } from 'react';
import { Search, MoreVertical, Trash2, Pin, Volume2, VolumeX } from 'lucide-react';

interface Conversation {
  id: number;
  otherParticipantId: number;
  otherParticipantName?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: number;
  onSelectConversation?: (conversationId: number) => void;
  onDeleteConversation?: (conversationId: number) => Promise<void>;
  onPinConversation?: (conversationId: number) => Promise<void>;
  onMuteConversation?: (conversationId: number) => Promise<void>;
}

/**
 * Sohbet Listesi Bileşeni
 * 
 * Glassmorphism tasarım ve modern arayüz
 */
export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onDeleteConversation,
  onPinConversation,
  onMuteConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.otherParticipantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const unpinnedConversations = filteredConversations.filter((c) => !c.isPinned);

  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/30">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Mesajlar
        </h2>

        {/* Arama */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ara..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/30 bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Sohbetler */}
      <div className="flex-1 overflow-y-auto">
        {/* Sabitlenmiş Sohbetler */}
        {pinnedConversations.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sabitlenmiş
            </div>
            {pinnedConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversationId === conv.id}
                isHovered={hoveredId === conv.id}
                onSelect={() => onSelectConversation?.(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                onDelete={() => onDeleteConversation?.(conv.id)}
                onPin={() => onPinConversation?.(conv.id)}
                onMute={() => onMuteConversation?.(conv.id)}
              />
            ))}
          </div>
        )}

        {/* Normal Sohbetler */}
        {unpinnedConversations.length > 0 && (
          <div>
            {pinnedConversations.length > 0 && (
              <div className="h-px bg-white/20 my-2" />
            )}
            {unpinnedConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversationId === conv.id}
                isHovered={hoveredId === conv.id}
                onSelect={() => onSelectConversation?.(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
                onDelete={() => onDeleteConversation?.(conv.id)}
                onPin={() => onPinConversation?.(conv.id)}
                onMute={() => onMuteConversation?.(conv.id)}
              />
            ))}
          </div>
        )}

        {/* Boş Durum */}
        {filteredConversations.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Sohbet bulunamadı' : 'Henüz sohbet yok'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDelete: () => void;
  onPin: () => void;
  onMute: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  isHovered,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  onDelete,
  onPin,
  onMute,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`px-4 py-3 cursor-pointer transition-all border-b border-white/10 ${
        isSelected
          ? 'bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30'
          : 'hover:bg-white/50 dark:hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
          {conversation.otherParticipantName?.charAt(0).toUpperCase()}
        </div>

        {/* İçerik */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {conversation.otherParticipantName}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {conversation.lastMessageTime &&
                new Date(conversation.lastMessageTime).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {conversation.lastMessage || 'Henüz mesaj yok'}
            </p>

            {conversation.unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </div>
            )}
          </div>

          {/* Durum Göstergesi */}
          <div className="flex items-center gap-1 mt-1">
            {conversation.isOnline && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
            {conversation.isMuted && (
              <VolumeX size={12} className="text-gray-400" />
            )}
          </div>
        </div>

        {/* İşlem Butonları */}
        {isHovered && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-gray-600 dark:text-gray-400"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 rounded-lg shadow-xl z-50 min-w-max"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPin();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <Pin size={14} />
                  {conversation.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMute();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/50 transition-colors flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 border-t border-white/20"
                >
                  {conversation.isMuted ? (
                    <>
                      <Volume2 size={14} />
                      Sesi Aç
                    </>
                  ) : (
                    <>
                      <VolumeX size={14} />
                      Sesini Kapat
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2 text-sm text-red-600 dark:text-red-400 border-t border-white/20"
                >
                  <Trash2 size={14} />
                  Sil
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
