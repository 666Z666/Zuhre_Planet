import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Flag 
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

interface ReportsTabProps {
  reportsData: any;
  reportsLoading: boolean;
  handleQuickAction: AdminQuickActionHandler;
  page: number;
  setPage: (page: number) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  reportsData,
  reportsLoading,
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
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Şikayet Yönetimi
          </CardTitle>
          <CardDescription>
            Kullanıcılar tarafından bildirilen sorunları ve kural ihlallerini inceleyin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : !reportsData || (reportsData.items || reportsData.data || []).length === 0 ? (
            <EmptyState 
              title="Şikayet bulunamadı" 
              description="Platformda bekleyen aktif bir şikayet kaydı yok." 
              icon={Flag}
            />
          ) : (
            <div className="space-y-4">
              {(reportsData.items || reportsData.data || []).map((report: any) => (
                <div key={report.id} className="p-5 border rounded-xl hover:bg-red-50/10 transition-colors group relative border-red-100/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100/30 flex items-center justify-center font-bold text-red-600">
                        <Flag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{report.targetName}</p>
                          <Badge variant="destructive" className="text-[10px] uppercase font-bold py-0.5 px-2">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <MessageSquare className="w-3 h-3" />
                          {report.reporterName} tarafından bildirildi
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={report.status} size="sm" />
                      <span className="text-[10px] text-muted-foreground font-mono">{report.id?.slice(0, 8)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg mb-4 border border-border/30">
                    <p className="text-sm font-semibold mb-1">Sebep: {report.reason}</p>
                    {report.description && (
                      <p className="text-sm text-foreground/80 italic">"{report.description}"</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                       <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 px-3 h-9"
                        onClick={() => handleQuickAction('resolve', 'report', report.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Çözüldü
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted px-3 h-9"
                        onClick={() => handleQuickAction('dismiss', 'report', report.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Yok Say
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 hover:bg-muted text-xs transition-all"
                      onClick={() => console.log('Hizli İnceleme', report.id)}
                    >
                      Kanıtları Gör
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {reportsData.totalPages > 1 && (
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
                    {Array.from({ length: Math.min(5, reportsData.totalPages) }).map((_, i) => {
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
                    {reportsData.totalPages > 5 && <span className="text-gray-600 px-1">...</span>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(reportsData.totalPages, page + 1))}
                    disabled={page === reportsData.totalPages}
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
