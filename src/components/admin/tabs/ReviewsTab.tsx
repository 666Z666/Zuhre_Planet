import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  EyeOff, 
  Trash2 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, LoadingSpinner, EmptyState } from '../AdminShared';
import type { AdminQuickActionHandler } from '@/types/admin';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

interface ReviewsTabProps {
  reviewsData: any;
  reviewsLoading: boolean;
  handleQuickAction: AdminQuickActionHandler;
  page: number;
  setPage: (page: number) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviewsData,
  reviewsLoading,
  handleQuickAction,
  page,
  setPage
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInVariants}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Değerlendirme Yönetimi
          </CardTitle>
          <CardDescription>
            Tüm kullanıcı yorumlarını ve puanlamaları buradan yönetin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviewsLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : !reviewsData || (reviewsData.items || reviewsData.data || []).length === 0 ? (
            <EmptyState title="Değerlendirme bulunamadı" description="Henüz platformda yazılmış bir değerlendirme yok." />
          ) : (
            <div className="space-y-6">
              {(reviewsData.items || reviewsData.data || []).map((review: any) => (
                <div key={review.id} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 p-0.5">
                        <div className="w-full h-full rounded-[0.9rem] bg-black flex items-center justify-center font-black text-primary italic text-lg">
                          {review.customerName?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-black text-sm text-white uppercase tracking-tighter italic">{review.customerName}</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-white/5'
                                }`}
                              />
                            ))}
                          </div>
                          {review.isVerified && (
                             <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[8px] font-black italic px-2 py-0.5 rounded-full">DOĞRULANMIŞ</Badge>
                          )}
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          HEDEF: <span className="text-white italic">{review.escortName}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <StatusBadge status={review.status} size="sm" />
                       <span className="text-[9px] text-gray-700 font-mono uppercase tracking-widest">{review.createdAt || 'YENİ'}</span>
                    </div>
                  </div>
                  
                  <div className="relative p-6 rounded-2xl bg-black/40 border border-white/5 mb-6">
                     <p className="text-xs text-gray-400 italic leading-relaxed">
                        "{review.comment}"
                     </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-500 text-white font-black text-[9px] uppercase tracking-widest h-9 px-6 rounded-xl italic"
                            onClick={() => handleQuickAction('approve', 'review', review.id)}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                            ONAYLA
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-500 text-white font-black text-[9px] uppercase tracking-widest h-9 px-6 rounded-xl italic"
                            onClick={() => handleQuickAction('reject', 'review', review.id, 'Uygunsuz içerik')}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-2" />
                            REDDET
                          </Button>
                        </>
                      )}
                      {review.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-gray-500 hover:text-white font-black text-[9px] uppercase tracking-widest h-9 px-6 rounded-xl italic"
                          onClick={() => handleQuickAction('hide', 'review', review.id)}
                        >
                          <EyeOff className="w-3.5 h-3.5 mr-2" />
                          YAYINDAN KALDIR
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-1.5 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                      onClick={() => handleQuickAction('delete', 'review', review.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {reviewsData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="border-white/10 text-gray-400 hover:text-white"
                  >
                    Önceki
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, reviewsData.totalPages) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 p-0 ${page === pageNum ? "bg-primary text-white" : "border-white/10 text-gray-400"}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {reviewsData.totalPages > 5 && <span className="text-gray-600 px-1">...</span>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(reviewsData.totalPages, page + 1))}
                    disabled={page === reviewsData.totalPages}
                    className="border-white/10 text-gray-400 hover:text-white"
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
