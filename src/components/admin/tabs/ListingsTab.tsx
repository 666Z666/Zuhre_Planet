import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ImageIcon, 
  ChevronDown 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { StatusBadge, LoadingSpinner, EmptyState } from '../AdminShared';
import type { AdminQuickActionHandler } from '@/types/admin';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

interface ListingsTabProps {
  listingsData: any;
  listingsLoading: boolean;
  listingFilters: any;
  setListingFilters: (filters: any) => void;
  listingSearch: string;
  setListingSearch: (search: string) => void;
  handleQuickAction: AdminQuickActionHandler;
  navigate: (path: string) => void;
}

export const ListingsTab: React.FC<ListingsTabProps> = ({
  listingsData,
  listingsLoading,
  listingFilters,
  setListingFilters,
  listingSearch,
  setListingSearch,
  handleQuickAction,
  navigate
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
            <FileText className="w-5 h-5 text-primary" />
            İlan Yönetimi
          </CardTitle>
          <CardDescription>
            {listingsData?.total || 0} toplam ilan moderasyon kuyruğunda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="İlan başlığı, ID veya Escort adı ara..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={listingFilters.status}
              onValueChange={(v) =>
                setListingFilters({ ...listingFilters, status: v })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Durum Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="pending">Bekliyor</SelectItem>
                <SelectItem value="rejected">Reddedildi</SelectItem>
                <SelectItem value="suspended">Askıda</SelectItem>
                <SelectItem value="flagged">İşaretli</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Listings List */}
          {listingsLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : !listingsData || listingsData.data.length === 0 ? (
            <EmptyState
              title="İlan bulunamadı"
              description="Moderasyon bekleyen veya kriterlerinize uygun ilan yok."
            />
          ) : (
            <div className="space-y-4">
              {listingsData.data.map((listing: any, index: number) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-all hover:border-primary/20 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                      {listing.thumbnail ? (
                        <img src={listing.thumbnail} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{listing.title}</p>
                        <StatusBadge status={listing.status} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {listing.escortName} • {listing.location}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        ₺{listing.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs text-muted-foreground mr-2">
                      <p>{listing.views || 0} Görüntülenme</p>
                      <p>{listing.reviews || 0} Değerlendirme</p>
                    </div>
                    <div className="flex gap-2">
                       <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-primary"
                        onClick={() => navigate(`/escort/${listing.escortId}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {listing.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleQuickAction('approve', 'listing', listing.id)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleQuickAction('reject', 'listing', listing.id, 'Moderasyon reddi')}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pagination */}
              {listingsData && listingsData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t mt-6">
                  <p className="text-sm text-muted-foreground">
                    Toplam {listingsData.total} ilandan {listingsData.data.length} tanesi gösteriliyor.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setListingFilters({ ...listingFilters, page: listingFilters.page - 1 })}
                      disabled={listingFilters.page === 1}
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </Button>
                    <span className="text-sm font-medium px-4">
                      Sayfa {listingFilters.page} / {listingsData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setListingFilters({ ...listingFilters, page: listingFilters.page + 1 })}
                      disabled={listingFilters.page === listingsData.totalPages}
                    >
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
