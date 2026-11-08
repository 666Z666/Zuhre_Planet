import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { ROUTES } from '@/constants/routes';

export default function ForumNewTopic() {
  const [, setLocation] = useLocation();
  const { data: categories = [], isLoading } = trpc.forum.getCategories.useQuery();
  const createTopic = trpc.forum.createTopic.useMutation({
    onSuccess: (result) => {
      toast.success('Konu başarıyla oluşturuldu.');
      setLocation(`${ROUTES.FORUM}/topic/${result.slug}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Konu oluşturulamadı.');
    },
  });

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const defaultCategoryId = useMemo(() => {
    if (categoryId) {
      return categoryId;
    }

    return categories.length > 0 ? Number(categories[0].id) : null;
  }, [categories, categoryId]);

  const handleSubmit = () => {
    if (!defaultCategoryId) {
      toast.error('Önce bir kategori seçin.');
      return;
    }

    createTopic.mutate({
      categoryId: defaultCategoryId,
      title,
      content,
    });
  };

  if (isLoading) {
    return <div className="p-10 text-white animate-pulse">Konu oluşturma ekranı hazırlanıyor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={() => setLocation(ROUTES.FORUM)}
        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors text-xs font-bold tracking-widest uppercase"
      >
        <ArrowLeft className="w-4 h-4" />
        FORUMA DÖN
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10"
      >
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[0.25em] uppercase border border-primary/20 mb-4">
            <PlusCircle className="w-4 h-4" />
            Yeni Konu
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Topluluğa Yeni Bir Başlık Aç</h1>
          <p className="text-white/50 leading-relaxed">
            Bu alan topluluk odaklı içerikler içindir. Güvenlik, ürün geri bildirimi ve genel topluluk sohbetleri için yeni bir konu başlatabilirsiniz.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black tracking-[0.2em] uppercase text-white/60">Kategori</label>
            <select
              value={defaultCategoryId || ''}
              onChange={(event) => setCategoryId(Number(event.target.value))}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white focus:outline-none focus:border-primary/40"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-black text-white">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black tracking-[0.2em] uppercase text-white/60">Başlık</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Kısa ama açıklayıcı bir başlık yazın"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white focus:outline-none focus:border-primary/40"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black tracking-[0.2em] uppercase text-white/60">İlk Mesaj</label>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Konunun detaylarını paylaşın"
              className="w-full min-h-[220px] rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-white focus:outline-none focus:border-primary/40 resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={createTopic.isPending}
              className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {createTopic.isPending ? 'Oluşturuluyor' : 'Konuyu Yayınla'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
