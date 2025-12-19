import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
// import { NEWS } from '../shared/data/news';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { RichTextContent } from '../components/shared/RichTextContent';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useLanguage } from '../shared/contexts/LanguageContext';
import { useNewsItem } from '../shared/hooks/useNews';
import { getLocalizedField } from '../shared/utils/localization';

const NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1742970936099-b68c962278c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwZXF1aXBtZW50JTIwbW9kZXJufGVufDF8fHx8MTc2NDU0NDUxMnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1700665537650-1bf37979aae0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJ5JTIwY29uZmVyZW5jZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjQ2MDgwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1608422050828-485141c98429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWNjaW5lJTIwbWVkaWNhbCUyMHZldGVyaW5hcnl8ZW58MXx8fHwxNzY0NjA4MDM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2NDU5Mjc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
];

export function NewsDetailPage() {
  const { newsId } = useParams<{ newsId: string }>();
  const { t, language } = useLanguage();
  const { newsItem, isLoading, error } = useNewsItem(newsId);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p>{t('newsDetail.loading')}</p>
        </div>
      </div>
    );
  }


  if (!newsItem) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4">{t('newsDetail.notFound')}</h2>
          {error && (
            <p className="text-sm text-muted-foreground mb-4">
              {t('common.error')}: {'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data 
                ? String(error.data.message) 
                : t('common.unknownError')}
            </p>
          )}
          <Button asChild>
            <Link to="/news">{t('newsDetail.backToNews')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // API возвращает данные напрямую, не в обертке { data: ... }
  const newsData = newsItem as import('../shared/types/admin').AdminNews;
  
  // Локализованные данные
  const title = getLocalizedField(newsData, 'title', language);
  const excerpt = getLocalizedField(newsData, 'excerpt', language);
  const content = getLocalizedField(newsData, 'content', language);

  return (
    <>
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: t('nav.news'), href: '/news' },
              { label: title },
            ]}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 mb-8 hover:gap-3 transition-all text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('newsDetail.backToNewsShort')}
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Calendar className="w-5 h-5" />
              <span>{newsData.publishedAt || newsData.createdAt}</span>
            </div>

            <h1 className="mb-8">{title}</h1>

            <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8">
              <ImageWithFallback
                src={newsData.coverImage || NEWS_IMAGES[0]}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-xl text-muted-foreground mb-8">{excerpt || ''}</p>
              <RichTextContent content={content || ''} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
