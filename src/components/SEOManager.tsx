/**
 * SEO Manager Component
 * 
 * Sayfa bazlı meta etiketlerini, başlıkları ve sosyal medya (OG/Twitter) 
 * önizlemelerini dinamik olarak yöneten merkezi bileşen.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOManagerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonical?: string;
  noindex?: boolean;
}

export function SEOManager({
  title = 'Zühre Planet - Gecenin Yıldızları',
  description = 'Zühre Planet; seçkin escorts katalogu, güvenli mesajlaşma ve gerçek zamanlı bildirimlerle gecenin en parlak yıldızlarını keşfedin.',
  keywords = ['escort', 'gece hayatı', 'istanbul escort', 'vip escort', 'zühre planet'],
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical,
  noindex = false,
}: SEOManagerProps) {
  const siteName = 'Zühre Planet';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Temel Meta Etiketleri */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={window.location.href} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Temalı Renk (Mobil Tarayıcılar İçin) */}
      <meta name="theme-color" content="#0a0a0f" />
    </Helmet>
  );
}
