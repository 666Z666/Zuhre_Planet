/**
 * Gallery Interaction Component
 * Medya galerisi, beğeni, yorum ve görüntülenme
 */

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Star,
  Send,
  MoreVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  username: string;
  userAvatar: string;
  userRole: 'customer' | 'escort';
  content: string;
  rating?: number;
  likeCount: number;
  createdAt: Date;
  isEdited: boolean;
}

interface GalleryMedia {
  id: string;
  title: string;
  escortName: string;
  escortAvatar: string;
  escortMemberId: string;
  type: 'photo' | 'video';
  image: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  averageRating: number;
  isLiked: boolean;
  uploadedAt: Date;
}

interface GalleryInteractionProps {
  media: GalleryMedia;
  comments: Comment[];
  currentUserRole: 'customer' | 'escort';
  currentUsername: string;
  currentUserAvatar: string;
  onLike?: (mediaId: string) => Promise<void>;
  onComment?: (mediaId: string, content: string, rating?: number) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  className?: string;
}

export function GalleryInteraction({
  media,
  comments,
  currentUserRole,
  currentUsername: _currentUsername,
  currentUserAvatar: _currentUserAvatar,
  onLike,
  onComment,
  onDeleteComment: _onDeleteComment,
  className = '',
}: GalleryInteractionProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike?.(media.id);
    } catch (error) {
      console.error('Beğeni hatası:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onComment?.(media.id, commentText, selectedRating || undefined);
      setCommentText('');
      setSelectedRating(null);
    } catch (error) {
      console.error('Yorum hatası:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Medya Başlığı */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{media.title}</h2>
          <p className="text-white/40 text-sm">@{media.escortName}</p>
        </div>
        <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Medya Görüntüsü */}
      <div className="relative w-full aspect-video bg-black/30 border border-white/10 rounded-2xl overflow-hidden">
        <img src={media.image} alt={media.title} className="w-full h-full object-cover" />
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-3 text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">{media.viewCount}</span>
          </div>
          <p className="text-[10px] text-white/40">Görüntülenme</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-black/20 border border-white/10 rounded-xl p-3 text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="font-bold text-white">{media.likeCount}</span>
          </div>
          <p className="text-[10px] text-white/40">Beğeni</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/20 border border-white/10 rounded-xl p-3 text-center"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <MessageCircle className="w-4 h-4 text-gold-400" />
            <span className="font-bold text-white">{media.commentCount}</span>
          </div>
          <p className="text-[10px] text-white/40">Yorum</p>
        </motion.div>
      </div>

      {/* Aksiyonlar */}
      <div className="flex gap-2">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm uppercase transition-all flex items-center justify-center gap-2 ${
            media.isLiked
              ? 'bg-red-500/20 border border-red-500/30 text-red-400'
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
          } disabled:opacity-50`}
        >
          {isLiking ? (
            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${media.isLiked ? 'fill-current' : ''}`} />
          )}
          {media.isLiked ? 'Beğendin' : 'Beğen'}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 font-bold text-sm uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Yorum
        </button>

        <button className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/60 font-bold text-sm uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" />
          Paylaş
        </button>
      </div>

      {/* Yorum Formu */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 border border-white/10 rounded-xl p-4 space-y-3"
        >
          <h3 className="font-bold text-white">Yorum Yap</h3>

          {/* Puan Seçimi */}
          {currentUserRole === 'customer' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60">Puan:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                    className={`transition-all ${
                      selectedRating && selectedRating >= star
                        ? 'text-yellow-400'
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Yorum Metni */}
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            className="w-full bg-black/30 border border-white/10 focus:border-emerald-500/50 rounded-lg px-3 py-2 text-white text-sm outline-none transition-all resize-none"
            rows={3}
          />

          {/* Gönder Butonu */}
          <button
            onClick={handleSubmitComment}
            disabled={isSubmittingComment || !commentText.trim()}
            className="w-full px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm uppercase hover:bg-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmittingComment ? (
              <>
                <div className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Gönder
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Yorumlar Listesi */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="font-bold text-white">Yorumlar ({comments.length})</h3>

          {comments.length === 0 ? (
            <div className="text-center py-6">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-white/10" />
              <p className="text-white/30 text-sm">Henüz yorum yok</p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment, idx) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-black/20 border border-white/10 rounded-xl p-3 space-y-2"
                >
                  {/* Yorum Başlığı */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={comment.userAvatar}
                        alt={comment.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-white text-sm">{comment.username}</p>
                        <p className="text-[10px] text-white/40">
                          {comment.createdAt.toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                    <button className="p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                      <MoreVertical className="w-4 h-4 text-white/40" />
                    </button>
                  </div>

                  {/* Puan */}
                  {(comment.rating ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (comment.rating ?? 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Yorum Metni */}
                  <p className="text-white/80 text-sm">{comment.content}</p>

                  {/* Beğeni */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <button className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/60 transition-all">
                      <Heart className="w-3 h-3" />
                      {comment.likeCount}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default GalleryInteraction;


