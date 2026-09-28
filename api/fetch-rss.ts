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
    .replace(/\s+/g, ' ')
    .trim();
}

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'application/rss+xml,application/xml,text/xml,text/html;q=0.9,*/*;q=0.8',
  'Cache-Control': 'no-cache',
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const feedUrl = req.query && req.query.url;
  if (!feedUrl || typeof feedUrl !== 'string') {
    res.status(400).json({ success: false, error: 'Feed URL is required' });
    return;
  }

  try {
    const response = await fetch(feedUrl.trim(), {
      headers: BROWSER_HEADERS,
      redirect: 'follow',
    });

    if (!response.ok) {
      res.status(response.status).json({
        success: false,
        error: `RSS source returned status ${response.status}`,
      });
      return;
    }

    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });

    const sourceTitle = $('channel > title, feed > title').first().text().trim() || 'Tamil Cinema RSS';
    const items: any[] = [];

    $('item, entry').slice(0, 30).each((i, el) => {
      const itemEl = $(el);
      const title = cleanText(itemEl.find('title').first().text());
      const link =
        itemEl.find('link').text().trim() ||
        itemEl.find('link').attr('href') ||
        itemEl.find('guid').text().trim();
      const rawDesc =
        itemEl.find('description').first().text() ||
        itemEl.find('summary').first().text() ||
        itemEl.find('content').first().text();
      const pubDate =
        itemEl.find('pubDate').text().trim() ||
        itemEl.find('published').text().trim() ||
        itemEl.find('updated').text().trim() ||
        new Date().toISOString();

      let img =
        itemEl.find('enclosure[type^="image"]').attr('url') ||
        itemEl.find('media\\:content[medium="image"]').attr('url') ||
        itemEl.find('media\\:thumbnail').attr('url') ||
        '';

      if (!img && rawDesc) {
        const descMatch = rawDesc.match(/src=["'](.*?)["']/);
        if (descMatch) img = descMatch[1];
      }

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

    res.status(200).json({
      success: true,
      sourceTitle,
      items,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: `Failed to fetch RSS: ${err?.message}`,
    });
  }
}
