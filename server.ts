import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper: Normalize and clean text
function cleanText(text: string): string {
  if (!text) return '';
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
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper: Detect news source domain name
function detectSource(urlStr: string): string {
  try {
    const host = new URL(urlStr).hostname.toLowerCase().replace(/^www\./, '');
    if (host.includes('cineulagam')) return 'CineUlagam (சினிஉலகம்)';
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
    if (host.includes('thehindu') || host.includes('hindutamil')) return 'இந்து தமிழ் திசை';
    return host;
  } catch {
    return 'News Source';
  }
}

// Common headers for realistic browser requests
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'ta,en-US;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
};

// API: Proxy any arbitrary URL raw text/HTML or XML without CORS errors
app.get('/api/proxy', async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).send('Missing url query parameter');
    return;
  }

  try {
    const response = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    const text = await response.text();
    res.send(text);
  } catch (err: any) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Failed to proxy request', details: err?.message });
  }
});

// API: Real Full Article Extractor
app.all('/api/fetch-article', async (req: Request, res: Response) => {
  const targetUrl = (req.query.url as string) || (req.body && req.body.url);
  if (!targetUrl || typeof targetUrl !== 'string') {
    res.status(400).json({ success: false, error: 'URL is required' });
    return;
  }

  try {
    const cleanUrl = targetUrl.trim();
    const isFacebook = cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch');

    const fetchHeaders = isFacebook
      ? {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ta,en-US;q=0.9,en;q=0.8',
        }
      : BROWSER_HEADERS;

    const response = await fetch(cleanUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
    });

    if (!response.ok && !isFacebook) {
      res.status(response.status).json({
        success: false,
        error: `Target website returned HTTP status ${response.status}`,
      });
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // SPECIAL HANDLING FOR FACEBOOK POSTS & VIDEOS
    if (isFacebook) {
      const rawDesc = cleanText(
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') ||
        ''
      );

      const rawImage =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[property="og:image:secure_url"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        '';

      const docTitle = cleanText($('title').text() || '');

      let pageName = 'Chilli Chips Official';
      if (cleanUrl.toLowerCase().includes('chillichipsofficial')) {
        pageName = 'Chilli Chips Official';
      } else {
        const match = cleanUrl.match(/facebook\.com\/([a-zA-Z0-9._-]+)/);
        if (match && match[1] && !['share', 'watch', 'reel', 'videos', 'posts', 'p'].includes(match[1])) {
          pageName = match[1];
        }
      }

      let fbHeadline = '';
      let fbSummary = '';

      if (rawDesc) {
        // Split on punctuation to get clean first sentence
        const splitMatch = rawDesc.match(/^([^!.\n]+[!.\n])(.*)$/s);
        if (splitMatch && splitMatch[1]) {
          fbHeadline = splitMatch[1].replace(/^[\s📸🎬🔥⚡️✨🎥📷\uD800-\uDBFF\uDC00-\uDFFF\-–—]+/, '').trim();
          fbSummary = splitMatch[2].trim();
        } else {
          fbHeadline = rawDesc.slice(0, 90).replace(/^[\s📸🎬🔥⚡️✨🎥📷\uD800-\uDBFF\uDC00-\uDFFF\-–—]+/, '').trim();
          fbSummary = rawDesc;
        }
      }

      if (!fbHeadline || fbHeadline.length < 5) {
        fbHeadline = docTitle
          .replace(/\s*[-–|]\s*Facebook.*$/i, '')
          .replace(/^Chilli Chips\s*[-–]\s*/i, '')
          .replace(/^[\s📸🎬🔥⚡️✨🎥📷\-–—]+/, '')
          .trim();
      }

      if (!fbHeadline) {
        fbHeadline = `${pageName} முகநூல் சிறப்பு சினிமா பதிவு`;
      }

      if (!fbSummary) {
        fbSummary = rawDesc || `சமூக வலைத்தளமான முகநூலில் ${pageName} பக்கத்தில் வெளியாகி ரசிகர்கள் மத்தியில் பெரும் வைரலாகி வரும் சினிமா தகவல் மற்றும் புகைப்படத் தொகுப்பு.`;
      }

      const isVideoOrReel =
        cleanUrl.includes('/videos/') ||
        cleanUrl.includes('/reel/') ||
        cleanUrl.includes('fb.watch') ||
        cleanUrl.includes('/watch');

      const embedType = isVideoOrReel ? 'video' : 'post';
      const iframeSrc = `https://www.facebook.com/plugins/${embedType}.php?href=${encodeURIComponent(cleanUrl)}&show_text=true&width=500`;

      const paragraphs = [
        `தமிழ் சினிமா மற்றும் திரைத்துறை வட்டாரங்களில் பெரும் வரவேற்பைப் பெற்றுள்ள முக்கிய புகைப்படத் தொகுப்பு மற்றும் செய்தித் தகவல் <strong>${pageName}</strong> முகநூல் பக்கத்தில் வெளியிடப்பட்டுள்ளது.`,
        rawDesc || fbSummary,
        `திரைப்படக் குழுவினர் மற்றும் கோலிவுட் வட்டாரங்களில் பேசப்பட்டு வரும் இந்நிகழ்வு குறித்த முழுமையான விபரங்கள் மற்றும் புகைப்படங்கள் இணையதளங்களில் பெரும் வைரலாகி வருகின்றன. சுடர் மீடியா சினிமா தளத்தில் தமிழ்த் திரைப்படங்களின் பிரத்யேக தகவல்கள் தொடர்ந்து உடனுக்குடன் பதிவேற்றப்பட்டு வருகின்றன.`
      ];

      const htmlContent = `<p>${paragraphs[0]}</p>

<div class="fb-post-highlight bg-neutral-100 p-4 border-l-4 border-[#C8102E] my-4 rounded-r-sm">
  <p class="text-sm font-semibold text-neutral-800 leading-relaxed">${paragraphs[1]}</p>
</div>

<div class="fb-embed-container my-6 flex flex-col items-center justify-center p-3 bg-neutral-900 rounded-lg shadow-md border border-neutral-800">
  <div class="w-full max-w-[500px] overflow-hidden rounded bg-black">
    <iframe src="${iframeSrc}" width="100%" height="${isVideoOrReel ? '450' : '520'}" style="border:none;overflow:hidden;min-height:380px;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
  </div>
  <span class="text-[11px] text-neutral-400 mt-2 block font-mono">மூலம்: ${pageName} முகநூல் பக்கம்</span>
</div>

<p>${paragraphs[2]}</p>`;

      const extractedArticle = {
        title: fbHeadline,
        subtitle: fbSummary.slice(0, 160),
        summary: fbSummary,
        content: htmlContent,
        plainContent: paragraphs.join('\n\n'),
        paragraphs,
        image: rawImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
        imageCaption: fbHeadline,
        source: `${pageName} (Facebook)`,
        sourceUrl: cleanUrl,
        author: `${pageName} / சுடர் மீடியா`,
        publishedAt: new Date().toISOString(),
        paragraphsCount: paragraphs.length,
        wordCount: paragraphs.join(' ').split(/\s+/).filter(Boolean).length,
        isRealFullArticle: true
      };

      res.json({
        success: true,
        article: extractedArticle,
      });
      return;
    }

    // Strip noise, ads, scripts, nav, widgets, footers
    $(
      'script, style, nav, header, footer, noscript, iframe, aside, svg, .ad, .ads, .advertisement, [id*="google_ads"], .social-share, .comments, .related-posts, .sidebar'
    ).remove();

    // 1. Title Extraction
    let title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      '';

    // Clean brand suffixes like " - சினிஉலகம்", " | Dinamalar", " - BBC News தமிழ்"
    title = cleanText(title)
      .replace(/\s*[-–|]\s*(Cineulagam|சினிஉலகம்|Dinamalar|தினமலர்|Dinamani|தினமணி|BBC News தமிழ்|Tamil News|Oneindia).*$/i, '')
      .trim();

    // 2. Featured Image Extraction
    let image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('article img').first().attr('src') ||
      $('img[src*="article"]').first().attr('src') ||
      '';

    if (image && !image.startsWith('http')) {
      try {
        image = new URL(image, cleanUrl).href;
      } catch {
        // Keep as-is
      }
    }

    // 3. Subtitle / Summary Extraction
    const summary = cleanText(
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      ''
    );

    // 4. Author Extraction (Default to Chudar Media)
    let author = cleanText(
      $('meta[name="author"]').attr('content') ||
      $('[rel="author"]').text() ||
      $('.author-name, .byline, .writer').first().text() ||
      'சுடர் மீடியா சினிமா நிருபர்'
    );
    if (/cineulagam|சினி\s*உலகம்/i.test(author)) {
      author = 'சுடர் மீடியா சினிமா நிருபர்';
    }

    // 5. Date Extraction
    const publishedAt =
      $('meta[property="article:published_time"]').attr('content') ||
      $('time').attr('datetime') ||
      new Date().toISOString();

    // 6. Source Name
    const source = 'சுடர் மீடியா';

    // 7. Full Paragraph Content Extraction
    // Filter noise lines like copyrights, feedbacks, subscribe notices, external source mentions
    const ignoredPhrases = [
      'copyright',
      'all rights reserved',
      'feedback and working',
      'click here to follow',
      'subscribe to our channel',
      'join our whatsapp',
      'join our telegram',
      'பதிவிறக்கம் செய்ய',
      'விளம்பரம்',
      'cineulagam',
      'சினிஉலகம்',
      'சினி உலகம்',
      'மூல செய்தி',
      'மூலச் செய்தி',
      'செய்தி மூலம்',
    ];

    const paragraphs: string[] = [];

    // Prioritize paragraphs inside article or main content containers if present
    let pElements = $('article p, .article-content p, .story-content p, .news-details p, .entry-content p, main p');
    if (pElements.length === 0) {
      pElements = $('p');
    }

    pElements.each((_, el) => {
      const pText = cleanText($(el).text());
      // Minimum meaningful paragraph length
      if (pText.length > 20) {
        const lower = pText.toLowerCase();
        const isNoise = ignoredPhrases.some((phrase) => lower.includes(phrase));
        if (!isNoise && !paragraphs.includes(pText)) {
          paragraphs.push(pText);
        }
      }
    });

    // Fallback if structured <p> not found
    if (paragraphs.length === 0 && summary) {
      paragraphs.push(summary);
    }

    // Build clean semantic HTML and clean plain text content
    const htmlContent = paragraphs.map((p) => `<p>${p}</p>`).join('\n\n');
    const plainContent = paragraphs.join('\n\n');

    const totalWords = paragraphs.join(' ').split(/\s+/).filter(Boolean).length;

    const extractedArticle = {
      title: title || 'செய்தி தலைப்பு',
      subtitle: summary.slice(0, 160),
      summary: summary || (paragraphs[0] ? paragraphs[0].slice(0, 200) + '...' : ''),
      content: htmlContent,
      plainContent,
      paragraphs,
      image: image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
      imageCaption: title,
      source,
      sourceUrl: cleanUrl,
      author,
      publishedAt,
      paragraphsCount: paragraphs.length,
      wordCount: totalWords,
      isRealFullArticle: paragraphs.length >= 2,
    };

    res.json({
      success: true,
      article: extractedArticle,
    });
  } catch (err: any) {
    console.error('Error fetching article:', err);
    res.status(500).json({
      success: false,
      error: `Failed to fetch article from "${targetUrl}". Details: ${err?.message || 'Server error'}`,
    });
  }
});

// API: Fetch and Parse Live RSS Feed
app.get('/api/fetch-rss', async (req: Request, res: Response) => {
  const feedUrl = req.query.url as string;
  if (!feedUrl) {
    res.status(400).json({ success: false, error: 'URL is required' });
    return;
  }

  try {
    const cleanUrl = feedUrl.trim();
    const response = await fetch(cleanUrl, {
      headers: BROWSER_HEADERS,
      redirect: 'follow',
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        error: `Feed returned status ${response.status}`,
      });
      return;
    }

    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });

    const sourceTitle = $('channel > title').first().text().trim() || detectSource(cleanUrl);
    const items: any[] = [];

    $('item').each((i, el) => {
      if (i >= 20) return; // limit to 20 items per feed
      const itemEl = $(el);
      const title = cleanText(itemEl.find('title').text());
      const link = itemEl.find('link').text().trim() || itemEl.find('guid').text().trim();
      const pubDate = itemEl.find('pubDate').text().trim() || new Date().toISOString();
      const rawDesc = itemEl.find('description').text() || '';

      // Image extraction from enclosure or media:content or description img tag
      let img =
        itemEl.find('enclosure[type^="image"]').attr('url') ||
        itemEl.find('media\\:content[medium="image"]').attr('url') ||
        itemEl.find('media\\:thumbnail').attr('url') ||
        '';

      if (!img && rawDesc) {
        const descMatch = rawDesc.match(/src=["'](.*?)["']/);
        if (descMatch) img = descMatch[1];
      }

      // Clean HTML out of description
      const descCheerio = cheerio.load(rawDesc);
      const cleanDesc = cleanText(descCheerio.text());

      if (title && link) {
        items.push({
          id: `rss-${Date.now()}-${i}`,
          title,
          link,
          description: cleanDesc,
          pubDate,
          sourceName: sourceTitle,
          image: img,
        });
      }
    });

    res.json({
      success: true,
      sourceTitle,
      items,
    });
  } catch (err: any) {
    console.error('RSS fetch error:', err);
    res.status(500).json({
      success: false,
      error: `Failed to fetch RSS: ${err?.message}`,
    });
  }
});

// Setup Vite in Dev or Static files in Prod
async function start() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

start();
