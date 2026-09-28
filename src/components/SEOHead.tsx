import React, { useEffect } from 'react';
import { Article, Category, SiteSettings } from '../types';

interface SEOHeadProps {
  currentArticle?: Article;
  currentCategory?: Category;
  siteSettings: SiteSettings;
  pageType: 'home' | 'article' | 'livetv' | 'admin' | 'static';
  staticPageTitle?: string;
  language: 'ta' | 'en';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  currentArticle,
  currentCategory,
  siteSettings,
  pageType,
  staticPageTitle,
  language
}) => {
  useEffect(() => {
    let title = `${siteSettings.brandNameTa} | ${siteSettings.brandName} – ${siteSettings.tagline}`;
    let description = 'சுடர் மீடியா (CHUDAR MEDIA) – இலங்கை, தமிழ்நாடு மற்றும் உலகத் தமிழர்களுக்கான முன்னணி செய்தி இணையதளம்.';
    let schemaData: object = {};

    if (pageType === 'article' && currentArticle) {
      title = `${currentArticle.title} | ${siteSettings.brandName}`;
      description = currentArticle.summary || currentArticle.seoDescription;

      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: currentArticle.title,
        alternativeHeadline: currentArticle.subtitle,
        image: [currentArticle.featuredImage],
        datePublished: currentArticle.publishedAt,
        dateModified: currentArticle.updatedAt,
        author: [
          {
            '@type': 'Person',
            name: currentArticle.authorName,
            jobTitle: currentArticle.authorRole
          }
        ],
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: siteSettings.brandName,
          url: window.location.origin,
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/logo.png`
          }
        },
        description: currentArticle.summary
      };
    } else if (pageType === 'livetv') {
      title = `சுடர் டிவி நேரலை 24/7 | CHUDAR TV LIVE | ${siteSettings.brandName}`;
      description = 'சுடர் டிவி நேரலை ஒளிபரப்பு - முக்கிய செய்திகள், பிரைம் டைம் விவாதங்கள் மற்றும் உடனுக்குடன் நேரடி தகவல்கள்.';
    } else if (pageType === 'admin') {
      title = `செய்தியாளர் நிர்வாகப் பிரிவு | ${siteSettings.brandName} Portal`;
    } else if (currentCategory && currentCategory.id !== 'all') {
      title = `${currentCategory.nameTa} செய்திகள் | ${siteSettings.brandName}`;
      description = `${currentCategory.nameTa} தொடர்பான சமீபத்திய முக்கிய செய்திகள் மற்றும் ஆய்வுகள்.`;
    } else if (staticPageTitle) {
      title = `${staticPageTitle} | ${siteSettings.brandName}`;
    }

    // Update Document Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Inject or update JSON-LD Schema
    const scriptId = 'chudar-schema-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (pageType === 'article' && Object.keys(schemaData).length > 0) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schemaData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [currentArticle, currentCategory, siteSettings, pageType, staticPageTitle, language]);

  return null;
};
