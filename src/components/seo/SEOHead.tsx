import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  jsonLd?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'CoinBeacon - Navigate the Crypto Market with Confidence',
  description = 'CoinBeacon is a premium cryptocurrency market intelligence platform powered by real-time market data, AI market summaries, and institutional-grade analytics.',
  canonicalUrl = 'https://coinbeacon.app',
  jsonLd,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OpenGraph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // Inject JSON-LD Schema
    const schemaId = 'coinbeacon-jsonld-schema';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const defaultJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      name: 'CoinBeacon Cryptocurrency Intelligence Platform',
      url: canonicalUrl,
      description: description,
      provider: {
        '@type': 'Organization',
        name: 'CoinBeacon',
      },
    };

    scriptTag.text = JSON.stringify(jsonLd || defaultJsonLd);
  }, [title, description, canonicalUrl, jsonLd]);

  return null;
};
