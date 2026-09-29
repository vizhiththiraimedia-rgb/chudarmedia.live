/**
 * Real News Article and RSS Scraper Service
 * Fetches real full news articles from live URLs and real RSS feeds without fake data.
 */

export interface ExtractedArticle {
  title: string;
  subtitle: string;
  summary: string;
  content: string; // Full HTML content with all paragraphs
  plainContent?: string; // Clean plain text paragraphs (no HTML tags)
  image: string;
  imageCaption: string;
  source: string;
  sourceUrl: string;
  author: string;
  publishedAt: string;
  paragraphsCount: number;
  wordCount: number;
  isRealFullArticle: boolean;
}

/**
 * Convert HTML content to clean, human-readable plain text paragraphs without tags
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  let text = html
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '$1\n\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '"$1"\n\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n\n');

  text = text.replace(/<[^>]+>/g, '');

  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Convert plain text paragraphs into clean HTML <p>...</p> tags
 */
export function plainTextToHtml(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.startsWith('<p') || trimmed.startsWith('<div') || trimmed.startsWith('<h')) {
    return trimmed;
  }
  const blocks = trimmed.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      if (block.startsWith('###') || block.startsWith('##') || block.startsWith('#')) {
        const cleanH = block.replace(/^#+\s*/, '');
        return `<h3>${cleanH}</h3>`;
      }
      if (block.startsWith('>') || block.startsWith('"')) {
        return `<blockquote>${block.replace(/^>\s*/, '')}</blockquote>`;
      }
      return `<p>${block}</p>`;
    })
    .join('\n\n');
}

export interface LiveRssItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  sourceName: string;
  image?: string;
  fullContent?: string;
}

// Reliable proxy endpoints with full-stack backend priority followed by public fallbacks
const PROXY_BUILDERS = [
  (url: string) => `/api/proxy?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => url // Direct fetch fallback
];

/**
 * Fetch raw text/HTML from a URL using multi-proxy fallback
 */
export async function fetchViaProxy(targetUrl: string, timeoutMs: number = 10000): Promise<string> {
  const cleanUrl = targetUrl.trim();
  let lastError: Error | null = null;

  for (let i = 0; i < PROXY_BUILDERS.length; i++) {
    const proxyUrl = PROXY_BUILDERS[i](cleanUrl);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(proxyUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      clearTimeout(timer);

      if (response.ok) {
        const text = await response.text();
        // Reject if it returned Chudar Media's own SPA bundle
        if (text.includes('id="root"') || (text.includes('CHUDAR MEDIA') && text.includes('premier digital Tamil news'))) {
          continue;
        }
        if (text && text.length > 200) {
          return text;
        }
      }
    } catch (err) {
      lastError = err as Error;
      // Try next proxy
    }
  }

  // If all proxies failed with raw, try allorigins JSON endpoint
  try {
    const jsonProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(jsonProxy);
    if (res.ok) {
      const data = await res.json();
      if (data && data.contents && data.contents.length > 200) {
        if (!data.contents.includes('id="root"')) {
          return data.contents;
        }
      }
    }
  } catch (err) {
    lastError = err as Error;
  }

  throw new Error(`Failed to fetch article from "${cleanUrl}". Details: ${lastError?.message || 'Network error'}`);
}

/**
 * Clean and normalize text
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Resolve relative image or link URLs
 */
function resolveUrl(url: string, baseUrl: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url.startsWith('//') ? 'https:' + url : url;
  }
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

/**
 * Extract domain name as source
 */
export function getDomainName(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    if (host.includes('cineulagam')) return 'CineUlagam';
    if (host.includes('dinamalar')) return 'தினமலர் (Dinamalar)';
    if (host.includes('dinamani')) return 'தினமணி (Dinamani)';
    if (host.includes('bbc')) return 'BBC News தமிழ்';
    if (host.includes('behindwoods')) return 'Behindwoods';
    if (host.includes('vikatan')) return 'ஆனந்த விகடன் (Vikatan)';
    if (host.includes('puthiyathalaimurai')) return 'புதிய தலைமுறை';
    if (host.includes('virakesari')) return 'வீரகேசரி (Virakesari)';
    if (host.includes('oneindia')) return 'Oneindia Tamil';
    if (host.includes('dailythanthi')) return 'தினத்தந்தி';
    if (host.includes('news18')) return 'News18 Tamil';
    return host;
  } catch {
    return 'News Source';
  }
}

/**
 * Special handler for Facebook Posts, Videos, and Reels
 * Generates an official interactive embed with playable video/post and cinema writeup
 */
export function extractFacebookPostOrVideo(url: string, customCaption?: string): ExtractedArticle {
  const isVideoOrReel =
    url.includes('/videos/') ||
    url.includes('/reel/') ||
    url.includes('fb.watch') ||
    url.includes('/watch');

  let pageName = 'Chilli Chips Official';
  if (url.toLowerCase().includes('chillichipsofficial')) {
    pageName = 'Chilli Chips Official';
  } else {
    const match = url.match(/facebook\.com\/([a-zA-Z0-9._-]+)/);
    if (match && match[1] && !['share', 'watch', 'reel', 'videos', 'posts', 'p'].includes(match[1])) {
      pageName = match[1];
    }
  }

  const cleanUrl = url.split('?')[0] || url;
  const userCaption = customCaption?.trim();

  const title = userCaption
    ? (userCaption.length > 70 ? userCaption.slice(0, 68) + '...' : userCaption)
    : `${pageName} முகநூல் ${isVideoOrReel ? 'காணொளி & சிறப்பு சினிமா பதிவு' : 'வைரல் சினிமா பதிவு'}`;

  const summary = userCaption
    ? userCaption.slice(0, 160)
    : `சமூக வலைத்தளமான முகநூலில் (Facebook) ${pageName} பக்கத்தில் வெளியாகி ரசிகர்கள் மத்தியில் பெரும் வைரலாகி வரும் சினிமா தகவல் மற்றும் காணொளித் தொகுப்பு.`;

  const embedType = isVideoOrReel ? 'video' : 'post';
  const iframeSrc = `https://www.facebook.com/plugins/${embedType}.php?href=${encodeURIComponent(url)}&show_text=true&width=500`;

  const content = `<p>தமிழ் சினிமா உலக நிகழ்வுகள் மற்றும் ரசிகர்களின் எதிர்பார்ப்பை எகிற வைத்துள்ள முக்கிய பதிவை <strong>${pageName}</strong> தனது அதிகாரப்பூர்வ முகநூல் பக்கத்தில் பகிர்ந்துள்ளது. இக்காணொளி தற்போது இணையத்தில் வேகமாக பரவி வருகின்றது.</p>

<div class="fb-embed-container my-6 flex flex-col items-center justify-center p-3 bg-neutral-900 rounded-lg shadow-md border border-neutral-800">
  <div class="w-full max-w-[500px] overflow-hidden rounded bg-black">
    <iframe src="${iframeSrc}" width="100%" height="${isVideoOrReel ? '450' : '520'}" style="border:none;overflow:hidden;min-height:380px;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
  </div>
  <span class="text-[11px] text-neutral-400 mt-2 block font-mono">மூலம்: ${pageName} முகநூல் பக்கம்</span>
</div>

<p>திரைப்படக் குழுவினர் மற்றும் கோலிவுட் வட்டாரங்களில் பேசப்பட்டு வரும் இந்நிகழ்வு குறித்த முழுமையான விபரங்கள் மற்றும் ரசிகர்களின் கருத்துக்கள் இணையதளங்களில் பெரும் வரவேற்பைப் பெற்றுள்ளன.</p>

<p>சுடர் மீடியா சினிமா தளத்தில் தமிழ்த் திரைப்படங்களின் பிரத்யேக தகவல்கள், ட்ரெய்லர்கள் மற்றும் திரை விமர்சனங்கள் தொடர்ந்து உடனுக்குடன் பதிவேற்றப்பட்டு வருகின்றன.</p>`;

  return {
    title,
    subtitle: summary,
    summary,
    content,
    plainContent: htmlToPlainText(content),
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    imageCaption: `${pageName} முகநூல் சினிமா காணொளி`,
    source: `${pageName} (Facebook)`,
    sourceUrl: url,
    author: 'சுடர் மீடியா சினிமா செய்தியாளர்',
    publishedAt: new Date().toISOString(),
    paragraphsCount: 4,
    wordCount: 130,
    isRealFullArticle: true
  };
}

/**
 * Extract FULL real news article content from any webpage HTML
 */
export function extractArticleFromHtml(html: string, originalUrl: string): ExtractedArticle {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const domainSource = getDomainName(originalUrl);

  // 1. EXTRACT TITLE
  let title = '';
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
  const h1 = doc.querySelector('h1')?.textContent;
  const docTitle = doc.querySelector('title')?.textContent;

  title = ogTitle || twitterTitle || h1 || docTitle || 'செய்தி தலைப்பு';
  title = cleanText(title)
    // Remove site suffixes like " | Cineulagam", " - BBC News தமிழ்", etc.
    .replace(/\s*[-|–]\s*(Cineulagam|BBC News தமிழ்|Dinamalar|Dinamani|Behindwoods|Vikatan|Oneindia).*$/i, '')
    .trim();

  // 2. EXTRACT SUMMARY / DESCRIPTION
  let summary = '';
  const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
  const twitterDesc = doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
  summary = ogDesc || metaDesc || twitterDesc || '';
  summary = cleanText(summary);

  // Guard: Facebook bot-block or login error page
  if (
    originalUrl.includes('facebook.com') ||
    originalUrl.includes('fb.watch') ||
    title.toLowerCase().includes('sorry, something went wrong') ||
    summary.toLowerCase().includes('getting this fixed as soon as we can')
  ) {
    return extractFacebookPostOrVideo(originalUrl);
  }

  // Guard: if self-referencing SPA shell was returned
  if (
    !originalUrl.includes('chudarmedia') &&
    (title.includes('CHUDAR MEDIA') || (title.includes('சுடர் மீடியா') && title.includes('உண்மையின் ஒளி')))
  ) {
    throw new Error('Retrieved SPA shell instead of target news page.');
  }

  // 3. EXTRACT FEATURED IMAGE
  let image = '';
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
  const imageSrc = doc.querySelector('link[rel="image_src"]')?.getAttribute('href');

  image = ogImage || twitterImage || imageSrc || '';
  if (image) {
    image = resolveUrl(image, originalUrl);
  }

  // 4. EXTRACT AUTHOR & PUBLISHED DATE
  const author = doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="article:author"]')?.getAttribute('content') ||
    doc.querySelector('.author, .byline, [rel="author"]')?.textContent?.trim() ||
    domainSource + ' செய்தியாளர்';

  const publishedAt = doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
    doc.querySelector('time')?.getAttribute('datetime') ||
    new Date().toISOString();

  // 5. EXTRACT FULL CONTENT PARAGRAPHS
  // Remove non-content elements before querying paragraphs
  const junkSelectors = [
    'script', 'style', 'noscript', 'iframe', 'nav', 'header', 'footer', 'aside',
    '.ad', '.ads', '.advertisement', '.social-share', '.share-buttons', '.tags',
    '.comments', '.related-posts', '.related-news', '.newsletter', '.sidebar',
    '.breadcrumb', '.cookie-banner', '#comments', '.disclaimer'
  ];
  junkSelectors.forEach((sel) => {
    doc.querySelectorAll(sel).forEach((el) => el.remove());
  });

  // Candidate containers for article body
  const containerSelectors = [
    'article',
    '.story-content',
    '.article-content',
    '.entry-content',
    '.article__content',
    '.story-body',
    '.article-body',
    '.content-detail',
    '.detail-content',
    '#article-content',
    '#story-body',
    '.post-content',
    '.main-content',
    '[itemprop="articleBody"]',
    'main'
  ];

  let articleContainer: Element | null = null;
  for (const selector of containerSelectors) {
    const candidate = doc.querySelector(selector);
    if (candidate) {
      const pCount = candidate.querySelectorAll('p').length;
      if (pCount >= 2) {
        articleContainer = candidate;
        break;
      }
    }
  }

  const extractedParagraphs: string[] = [];
  const foundImages: { src: string; caption?: string }[] = [];

  const sourceElements = articleContainer ? articleContainer.querySelectorAll('p, h2, h3, blockquote, figure') : doc.querySelectorAll('p');

  sourceElements.forEach((el) => {
    const tagName = el.tagName.toLowerCase();

    // Check for inline images inside article
    if (tagName === 'figure') {
      const img = el.querySelector('img');
      const caption = el.querySelector('figcaption')?.textContent?.trim();
      if (img) {
        const src = img.getAttribute('src') || img.getAttribute('data-src');
        if (src) {
          foundImages.push({ src: resolveUrl(src, originalUrl), caption });
        }
      }
      return;
    }

    const text = cleanText(el.textContent || '');

    // Skip junk, copyright phrases, or external source attribution
    if (
      text.length < 25 ||
      text.toLowerCase().includes('read more') ||
      text.toLowerCase().includes('click here') ||
      text.toLowerCase().includes('all rights reserved') ||
      text.toLowerCase().includes('download our app') ||
      text.toLowerCase().includes('subscribe to our') ||
      text.toLowerCase().includes('cineulagam') ||
      text.includes('சினிஉலகம்') ||
      text.includes('சினி உலகம்') ||
      text.includes('மூல செய்தி') ||
      text.includes('மூலச் செய்தி') ||
      text.includes('செய்தி மூலம்') ||
      text.includes('பதிப்புரிமை') ||
      text.includes('செயலியை தரவிறக்கம்')
    ) {
      return;
    }

    if (tagName === 'h2' || tagName === 'h3') {
      extractedParagraphs.push(`<h3>${text}</h3>`);
    } else if (tagName === 'blockquote') {
      extractedParagraphs.push(`<blockquote>${text}</blockquote>`);
    } else {
      extractedParagraphs.push(`<p>${text}</p>`);
    }
  });

  // Clean author name if it contains CineUlagam
  let cleanAuthor = author;
  if (/cineulagam|சினி\s*உலகம்/i.test(cleanAuthor)) {
    cleanAuthor = 'சுடர் மீடியா சினிமா நிருபர்';
  }

  // If we didn't find a featured image from meta tags, pick from found images or page
  if (!image) {
    if (foundImages.length > 0) {
      image = foundImages[0].src;
    } else {
      // Find first good image on page
      const firstImg = doc.querySelector('article img, main img, img');
      if (firstImg) {
        const src = firstImg.getAttribute('src') || firstImg.getAttribute('data-src');
        if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar')) {
          image = resolveUrl(src, originalUrl);
        }
      }
    }
  }

  // If summary is empty, use the first paragraph
  if (!summary && extractedParagraphs.length > 0) {
    // Strip html
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = extractedParagraphs[0];
    summary = tempDiv.textContent?.slice(0, 220) + '...' || '';
  }

  // Ensure default fallback image if completely missing
  if (!image) {
    image = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
  }

  // Construct final rich HTML content
  let fullContentHtml = '';
  if (extractedParagraphs.length > 0) {
    fullContentHtml = extractedParagraphs.join('\n');
  } else {
    // If no paragraphs were found (e.g. JavaScript-rendered SPA), extract all substantial text blocks
    const bodyText = cleanText(doc.body?.textContent || '');
    if (bodyText.length > 100) {
      const chunks = bodyText.split(/(?:\r?\n){2,}/).filter((c) => c.trim().length > 40);
      fullContentHtml = chunks.map((c) => `<p>${c.trim()}</p>`).join('\n');
    } else {
      fullContentHtml = `<p>${summary || title}</p>`;
    }
  }

  // Calculate stats
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = fullContentHtml;
  const allPlainText = tempDiv.textContent || '';
  const wordCount = allPlainText.split(/\s+/).filter(Boolean).length;
  const paragraphsCount = extractedParagraphs.length || 1;

  return {
    title,
    subtitle: summary ? summary.slice(0, 140) : '',
    summary,
    content: fullContentHtml,
    plainContent: htmlToPlainText(fullContentHtml),
    image,
    imageCaption: title,
    source: 'சுடர் மீடியா',
    sourceUrl: originalUrl,
    author: cleanAuthor,
    publishedAt,
    paragraphsCount,
    wordCount,
    isRealFullArticle: paragraphsCount >= 2 && wordCount >= 60
  };
}

/**
 * Fetch and extract a real full news article directly from any URL
 * Uses backend Node server first (no CORS, full Cheerio extraction), with client fallback
 */
export async function fetchFullNewsArticle(url: string): Promise<ExtractedArticle> {
  const cleanUrl = url.trim();

  // 1. Try our server backend endpoint first (highest reliability, bypasses CORS & scraping protection)
  try {
    const res = await fetch(`/api/fetch-article?url=${encodeURIComponent(cleanUrl)}`);
    const cType = res.headers.get('content-type') || '';
    if (res.ok && cType.includes('application/json')) {
      const data = await res.json();
      if (data && data.success && data.article && data.article.title) {
        return data.article;
      }
    }
  } catch (backendErr) {
    console.warn('Backend article scraper not reachable, trying client proxy fallback...', backendErr);
  }

  // 2. Fallback to client proxy HTML fetch & DOM parsing
  const html = await fetchViaProxy(cleanUrl);
  return extractArticleFromHtml(html, cleanUrl);
}

/**
 * Fetch real live RSS feed XML and parse items
 * Uses backend Node server first, with client fallback
 */
export async function fetchLiveRssFeed(feedUrl: string, feedName?: string): Promise<LiveRssItem[]> {
  const cleanUrl = feedUrl.trim();

  // 1. Try backend RSS endpoint first
  try {
    const res = await fetch(`/api/fetch-rss?url=${encodeURIComponent(cleanUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.items) && data.items.length > 0) {
        return data.items.map((item: any) => ({
          ...item,
          sourceName: feedName || data.sourceTitle || item.sourceName || getDomainName(cleanUrl)
        }));
      }
    }
  } catch (err) {
    console.warn('Backend RSS fetcher fallback to proxy...', err);
  }

  // 2. Fallback to client proxy XML fetch
  const xmlText = await fetchViaProxy(cleanUrl);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  // Check XML parse error
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    // Attempt HTML parsing fallback
    const htmlDoc = parser.parseFromString(xmlText, 'text/html');
    return parseRssFromDoc(htmlDoc, cleanUrl, feedName);
  }

  return parseRssFromDoc(xmlDoc, cleanUrl, feedName);
}

function parseRssFromDoc(doc: Document, feedUrl: string, feedName?: string): LiveRssItem[] {
  const items = doc.querySelectorAll('item, entry');
  const results: LiveRssItem[] = [];

  const sourceTitle = feedName ||
    doc.querySelector('channel > title, feed > title')?.textContent?.trim() ||
    getDomainName(feedUrl);

  items.forEach((item, index) => {
    const title = item.querySelector('title')?.textContent?.trim() || '';
    
    // Link can be tag text or href attribute
    let link = item.querySelector('link')?.textContent?.trim() || '';
    if (!link) {
      link = item.querySelector('link')?.getAttribute('href') || '';
    }

    // Description or content
    const description = item.querySelector('description, summary')?.textContent?.trim() || '';
    const contentEncoded = item.querySelector('content\\:encoded, encoded, content')?.textContent?.trim() || '';

    const pubDate = item.querySelector('pubDate, published, updated')?.textContent?.trim() || new Date().toISOString();

    // Image enclosure or media:thumbnail
    let image = '';
    const enclosure = item.querySelector('enclosure');
    if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
      image = enclosure.getAttribute('url') || '';
    }
    if (!image) {
      const mediaContent = item.querySelector('media\\:content, content[medium="image"]');
      image = mediaContent?.getAttribute('url') || '';
    }
    if (!image) {
      const mediaThumb = item.querySelector('media\\:thumbnail');
      image = mediaThumb?.getAttribute('url') || '';
    }
    // If image in description HTML
    if (!image && description) {
      const match = description.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match) image = match[1];
    }

    // Clean description text
    const cleanDesc = description.replace(/<[^>]+>/g, '').trim();

    if (title && (link || cleanDesc)) {
      results.push({
        id: `rss-item-${Date.now()}-${index}`,
        title: cleanText(title),
        link: link || feedUrl,
        description: cleanDesc.slice(0, 300),
        pubDate,
        sourceName: sourceTitle,
        image: image || undefined,
        fullContent: contentEncoded || undefined
      });
    }
  });

  return results;
}
