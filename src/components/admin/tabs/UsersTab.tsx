import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Ban, 
  Eye, 
  ChevronDown 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { StatusBadge, LoadingSpinner, EmptyState } from '../AdminShared';
import type { AdminQuickActionHandler } from '@/types/admin';

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

interface UsersTabProps {
  usersData: any;
  usersLoading: boolean;
  userFilters: any;
  setUserFilters: (filters: any) => void;
  userSearch: string;
  setUserSearch: (search: string) => void;
  handleQuickAction: AdminQuickActionHandler;
  navigate: (path: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  usersData,
  usersLoading,
  userFilters,
  setUserFilters,
  userSearch,
  setUserSearch,
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Kullanıcı Yönetimi
              </CardTitle>
              <CardDescription>
                {usersData?.total || 0} toplam kullanıcı sistemde kayıtlı
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="İsim, e-mail veya ID ile ara..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={userFilters.role}
              onValueChange={(v) =>
                setUserFilters({ ...userFilters, role: v })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rol Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Roller</SelectItem>
                <SelectItem value="escort">Escort</SelectItem>
                <SelectItem value="customer">Müşteri</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={userFilters.status}
              onValueChange={(v) =>
                setUserFilters({ ...userFilters, status: v })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Durum Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="pending">Bekliyor</SelectItem>
                <SelectItem value="suspended">Askıda</SelectItem>
                <SelectItem value="banned">Yasaklı</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          {usersLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : !usersData || usersData.data.length === 0 ? (
            <EmptyState
              title="Kullanıcı bulunamadı"
              description="Filtre kriterlerinize uygun veya sistemde kayıtlı kullanıcı yok."
            />
          ) : (
            <div className="space-y-4">
              {usersData.data.map((user: any, index: number) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-all hover:border-primary/20 group"
                >
                      <div className="flex items-center gap-4">
	                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform">
	                      {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
	                    </div>
	                    <div>
	                      <div className="flex items-center gap-2 mb-1">
	                        <p className="font-semibold">{user.fullName || user.name || 'İsimsiz Kullanıcı'}</p>
	                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
	                          {user.role}
	                        </Badge>
	                      </div>
	                      <p className="text-sm text-muted-foreground">{user.email}</p>
	                    </div>
	                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={user.status} />
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-primary"
                        onClick={() => navigate(user.role === 'escort' ? `/escort/${user.id}` : `/customer/${user.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {user.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleQuickAction('verify', 'user', user.id)}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}

                      {user.status === 'active' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Ban className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Kullanıcıyı Engelle</AlertDialogTitle>
	                              <AlertDialogDescription>
	                                <strong>{user.fullName || user.name}</strong> isimli kullanıcıyı engellemek istediğinizden emin misiniz? Bu işlem kullanıcının platforma erişimini kesecektir.
	                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleQuickAction('ban', 'user', user.id, 'Admin tarafından yasaklandı')}
                              >
                                Engelle
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pagination */}
              {usersData && usersData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t mt-6">
                  <p className="text-sm text-muted-foreground">
                    Toplam {usersData.total} kayıttan {usersData.data.length} tanesi gösteriliyor.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserFilters({ ...userFilters, page: userFilters.page - 1 })}
                      disabled={userFilters.page === 1}
                    >
                      <ChevronDown className="w-4 h-4 rotate-90 mr-1" />
                      Önceki
                    </Button>
                    <span className="text-sm font-medium px-4">
                      Sayfa {userFilters.page} / {usersData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserFilters({ ...userFilters, page: userFilters.page + 1 })}
                      disabled={userFilters.page === usersData.totalPages}
                    >
                      Sonraki
                      <ChevronDown className="w-4 h-4 -rotate-90 ml-1" />
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
