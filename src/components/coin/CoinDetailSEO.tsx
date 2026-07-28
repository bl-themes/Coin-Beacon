import React, { useEffect } from 'react';
import { CoinDetail } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CoinDetailSEOProps {
  coin: CoinDetail;
}

export const CoinDetailSEO: React.FC<CoinDetailSEOProps> = ({ coin }) => {
  const price = coin.market_data?.current_price?.usd || 0;
  const symbolUpper = coin.symbol.toUpperCase();
  const pageTitle = `${coin.name} (${symbolUpper}) Price Today, Charts & Market Cap | CoinBeacon`;
  const pageDescription = `Live ${coin.name} price, market cap, trading volume, historical chart, official links, and cryptocurrency statistics on CoinBeacon.`;
  const canonicalUrl = `https://coinbeacon.app/coin/${coin.id}`;
  const coinImageUrl = coin.image?.large || coin.image?.small || 'https://coinbeacon.app/og-image.png';

  useEffect(() => {
    // Document Title
    document.title = pageTitle;

    // Helper to set or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Helper to set canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', pageDescription);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', coinImageUrl);

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', coinImageUrl);

    // Breadcrumb Schema JSON-LD
    const breadcrumbSchemaId = 'breadcrumb-schema';
    let breadcrumbScript = document.getElementById(breadcrumbSchemaId) as HTMLScriptElement;
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = breadcrumbSchemaId;
      breadcrumbScript.type = 'application/ld+json';
      document.head.appendChild(breadcrumbScript);
    }

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://coinbeacon.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Cryptocurrencies',
          item: 'https://coinbeacon.app/coins',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: coin.name,
          item: canonicalUrl,
        },
      ],
    };

    breadcrumbScript.text = JSON.stringify(breadcrumbLd);
  }, [coin, pageTitle, pageDescription, canonicalUrl, coinImageUrl]);

  return null;
};
