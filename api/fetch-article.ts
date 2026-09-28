import * as cheerio from 'cheerio';

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

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'ta,en-US;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
};

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const targetUrl = (req.query && req.query.url) || (req.body && req.body.url);
  if (!targetUrl || typeof targetUrl !== 'string') {
    res.status(400).json({ success: false, error: 'URL is required' });
    return;
  }

  try {
    const cleanUrl = targetUrl.trim();
    const response = await fetch(cleanUrl, {
      headers: BROWSER_HEADERS,
      redirect: 'follow',
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        error: `Target website returned HTTP status ${response.status}`,
      });
      return;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

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

    title = cleanText(title)
      .replace(
        /\s*[-–|]\s*(Cineulagam|சினிஉலகம்|Dinamalar|தினமலர்|Dinamani|தினமணி|BBC News தமிழ்|Tamil News|Oneindia).*$/i,
        ''
      )
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

    // 4. Author Extraction
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

    const source = 'சுடர் மீடியா';

    // 6. Full Paragraph Content Extraction
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
    let pElements = $('article p, .article-content p, .story-content p, .news-details p, .entry-content p, main p');
    if (pElements.length === 0) {
      pElements = $('p');
    }

    pElements.each((_, el) => {
      const pText = cleanText($(el).text());
      if (pText.length > 20) {
        const lower = pText.toLowerCase();
        const isNoise = ignoredPhrases.some((phrase) => lower.includes(phrase));
        if (!isNoise && !paragraphs.includes(pText)) {
          paragraphs.push(pText);
        }
      }
    });

    if (paragraphs.length === 0 && summary) {
      paragraphs.push(summary);
    }

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

    res.status(200).json({
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
}
