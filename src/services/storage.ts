import {
  Article,
  Category,
  BreakingNews,
  User,
  Advertisement,
  RssSource,
  ImportedStory,
  LiveStreamConfig,
  SiteSettings,
  Comment,
  MediaItem,
  VideoTrailer
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_ARTICLES,
  INITIAL_BREAKING_NEWS,
  INITIAL_USERS,
  INITIAL_ADS,
  INITIAL_RSS_SOURCES,
  INITIAL_LIVE_STREAM,
  INITIAL_SITE_SETTINGS,
  INITIAL_COMMENTS,
  INITIAL_MEDIA_ITEMS,
  INITIAL_VIDEO_TRAILERS
} from '../data/seedData';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const STORAGE_KEYS = {
  ARTICLES: 'chudar_articles',
  CATEGORIES: 'chudar_categories',
  BREAKING_NEWS: 'chudar_breaking_news',
  USERS: 'chudar_users',
  CURRENT_USER: 'chudar_current_user',
  ADS: 'chudar_ads',
  RSS_SOURCES: 'chudar_rss_sources',
  IMPORTED_STORIES: 'chudar_imported_stories',
  LIVE_STREAM: 'chudar_live_stream',
  SITE_SETTINGS: 'chudar_site_settings',
  COMMENTS: 'chudar_comments',
  MEDIA: 'chudar_media',
  VIDEO_TRAILERS: 'chudar_video_trailers',
  INITIALIZED: 'chudar_initialized_v1'
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

/**
 * Deeply strips undefined properties from an object so Firestore setDoc never throws
 * "Unsupported field value: undefined" errors.
 */
export function cleanForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      cleaned[key] = cleanForFirestore(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

let isFirestoreSyncActive = false;

export function initializeStore() {
  if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.BREAKING_NEWS, JSON.stringify(INITIAL_BREAKING_NEWS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0])); // Default as Super Admin
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(INITIAL_ADS));
    localStorage.setItem(STORAGE_KEYS.RSS_SOURCES, JSON.stringify(INITIAL_RSS_SOURCES));
    localStorage.setItem(STORAGE_KEYS.LIVE_STREAM, JSON.stringify(INITIAL_LIVE_STREAM));
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA_ITEMS));
    localStorage.setItem(STORAGE_KEYS.VIDEO_TRAILERS, JSON.stringify(INITIAL_VIDEO_TRAILERS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  } else if (!localStorage.getItem(STORAGE_KEYS.VIDEO_TRAILERS)) {
    localStorage.setItem(STORAGE_KEYS.VIDEO_TRAILERS, JSON.stringify(INITIAL_VIDEO_TRAILERS));
  }

  // Setup Real-time Firestore Cloud Synchronization
  if (!isFirestoreSyncActive && typeof window !== 'undefined') {
    isFirestoreSyncActive = true;

    // 1. Sync Articles collection
    try {
      onSnapshot(collection(db, 'articles'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudArticles: Article[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Article;
            cloudArticles.push(data);
          });

          // Smart merge: keep local articles that may not yet have synced to cloud
          const localArticles = getItem<Article[]>(STORAGE_KEYS.ARTICLES, []);
          const mergedMap = new Map<string, Article>();

          cloudArticles.forEach((art) => mergedMap.set(art.id, art));

          localArticles.forEach((localArt) => {
            const cloudArt = mergedMap.get(localArt.id);
            if (!cloudArt) {
              // Local article exists only locally - preserve and push to Firestore
              mergedMap.set(localArt.id, localArt);
              setDoc(doc(db, 'articles', localArt.id), cleanForFirestore(localArt)).catch(console.warn);
            } else {
              const localTime = new Date(localArt.updatedAt || localArt.publishedAt).getTime();
              const cloudTime = new Date(cloudArt.updatedAt || cloudArt.publishedAt).getTime();
              if (localTime > cloudTime) {
                mergedMap.set(localArt.id, localArt);
                setDoc(doc(db, 'articles', localArt.id), cleanForFirestore(localArt)).catch(console.warn);
              }
            }
          });

          const finalArticles = Array.from(mergedMap.values()).map(sanitizeArticle);
          finalArticles.sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
          localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(finalArticles));
          notify();
        } else {
          // If Firestore collection is empty, seed initial articles to Firestore
          const currentArticles = getItem<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
          currentArticles.forEach((art) => {
            setDoc(doc(db, 'articles', art.id), cleanForFirestore(art)).catch((e) =>
              console.warn('Seed article failed:', e)
            );
          });
        }
      }, (err) => {
        console.warn('Firestore articles sync notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore articles setup error:', e);
    }

    // 2. Sync Breaking News collection
    try {
      onSnapshot(collection(db, 'breaking_news'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudBreaking: BreakingNews[] = [];
          snapshot.forEach((docSnap) => {
            cloudBreaking.push(docSnap.data() as BreakingNews);
          });
          localStorage.setItem(STORAGE_KEYS.BREAKING_NEWS, JSON.stringify(cloudBreaking));
          notify();
        } else {
          const currentBreaking = getItem<BreakingNews[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
          currentBreaking.forEach((b) => {
            setDoc(doc(db, 'breaking_news', b.id), b).catch(console.error);
          });
        }
      }, (err) => {
        console.warn('Firestore breaking_news sync notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore breaking_news setup error:', e);
    }

    // 3. Sync Categories collection
    try {
      onSnapshot(collection(db, 'categories'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudCats: Category[] = [];
          snapshot.forEach((docSnap) => {
            cloudCats.push(docSnap.data() as Category);
          });
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cloudCats));
          notify();
        }
      }, (err) => {
        console.warn('Firestore categories sync notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore categories setup error:', e);
    }

    // 4. Sync Comments collection
    try {
      onSnapshot(collection(db, 'comments'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudComments: Comment[] = [];
          snapshot.forEach((docSnap) => {
            cloudComments.push(docSnap.data() as Comment);
          });
          cloudComments.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(cloudComments));
          notify();
        }
      }, (err) => {
        console.warn('Firestore comments sync notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore comments setup error:', e);
    }

    // 5. Sync Site Settings
    try {
      onSnapshot(doc(db, 'site_settings', 'global'), (snapshot) => {
        if (snapshot.exists()) {
          const remoteSettings = snapshot.data() as SiteSettings;
          localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(remoteSettings));
          notify();
        }
      }, (err) => {
        console.warn('Firestore site_settings sync notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore site_settings setup error:', e);
    }

    // 6. Sync Video Trailers collection
    try {
      onSnapshot(collection(db, 'video_trailers'), (snapshot) => {
        if (!snapshot.empty) {
          const cloudTrailers: VideoTrailer[] = [];
          snapshot.forEach((docSnap) => {
            cloudTrailers.push(docSnap.data() as VideoTrailer);
          });
          const localTrailers = getItem<VideoTrailer[]>(STORAGE_KEYS.VIDEO_TRAILERS, []);
          const merged = new Map<string, VideoTrailer>();
          cloudTrailers.forEach((t) => merged.set(t.id, t));
          localTrailers.forEach((t) => {
            if (!merged.has(t.id)) {
              merged.set(t.id, t);
              setDoc(doc(db, 'video_trailers', t.id), cleanForFirestore(t)).catch(console.warn);
            }
          });
          const list = Array.from(merged.values());
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          localStorage.setItem(STORAGE_KEYS.VIDEO_TRAILERS, JSON.stringify(list));
          notify();
        } else {
          const currentTrailers = getItem<VideoTrailer[]>(STORAGE_KEYS.VIDEO_TRAILERS, INITIAL_VIDEO_TRAILERS);
          currentTrailers.forEach((t) => {
            setDoc(doc(db, 'video_trailers', t.id), cleanForFirestore(t)).catch(console.warn);
          });
        }
      }, (err) => {
        console.warn('Firestore video_trailers sync notice:', err.message);
      });
    } catch (e) {
      console.warn('Firestore video_trailers setup error:', e);
    }
  }
}

function sanitizeArticle(article: Article): Article {
  const cleanSubtitle = (article.subtitle || '')
    .replace(/செய்தி\s*மூலம்:[^\n]*/gi, '')
    .replace(/மூல\s*செய்தி:[^\n]*/gi, '')
    .replace(/Source:\s*CineUlagam/gi, '')
    .replace(/CineUlagam(\s*\(சினிஉலகம்\))?/gi, '')
    .replace(/சினி\s*உலகம்/gi, '')
    .trim();

  const cleanContent = (article.content || '')
    .replace(/<[^>]*>.*?மூல\s*செய்தி.*?<\/[^>]*>/gi, '')
    .replace(/<[^>]*>.*?CineUlagam.*?<\/[^>]*>/gi, '')
    .replace(/மூல\s*செய்தி[^\n<]*/gi, '')
    .replace(/செய்தி\s*மூலம்[^\n<]*/gi, '')
    .replace(/மூலம்:[^\n<]*/gi, '')
    .replace(/CineUlagam(\s*\(சினிஉலகம்\))?/gi, '')
    .replace(/சினி\s*உலகம்/gi, '')
    .trim();

  const cleanPhotographer = (article.photographerCredit || 'சுடர் மீடியா')
    .replace(/cineulagam/gi, 'சுடர் மீடியா')
    .replace(/சினி\s*உலகம்/gi, 'சுடர் மீடியா')
    .replace(/\/\s*Desk/gi, '/ சினிமா பிரிவு');

  const cleanTags = (article.tags || []).filter(
    (t) => !/cineulagam|சினி\s*உலகம்/i.test(t)
  );

  return {
    ...article,
    subtitle: cleanSubtitle,
    content: cleanContent,
    photographerCredit: cleanPhotographer,
    tags: cleanTags.length > 0 ? cleanTags : ['சினிமா', 'கோலிவுட்', 'சுடர் மீடியா']
  };
}

// Articles API
export function getArticles(): Article[] {
  const raw = getItem<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  return raw.map(sanitizeArticle);
}

export function getArticleById(id: string): Article | undefined {
  return getArticles().find((a) => a.id === id);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function saveArticle(article: Article): Article {
  const sanitized = sanitizeArticle(article);
  const articles = getArticles();
  const index = articles.findIndex((a) => a.id === sanitized.id);
  const toSave: Article = {
    ...sanitized,
    updatedAt: new Date().toISOString()
  };
  if (index >= 0) {
    articles[index] = toSave;
  } else {
    articles.unshift(toSave);
  }
  setItem(STORAGE_KEYS.ARTICLES, articles);

  // Sync to Cloud Firestore (cleaning undefined properties)
  const cleanedData = cleanForFirestore(toSave);
  setDoc(doc(db, 'articles', toSave.id), cleanedData).catch((err) => {
    console.warn('Error saving article to Firestore:', err);
  });

  return toSave;
}

export function deleteArticle(id: string): void {
  const articles = getArticles().filter((a) => a.id !== id);
  setItem(STORAGE_KEYS.ARTICLES, articles);

  // Sync to Cloud Firestore
  deleteDoc(doc(db, 'articles', id)).catch((err) => {
    console.warn('Error deleting article from Firestore:', err);
  });
}

export function incrementArticleView(id: string): void {
  const articles = getArticles();
  const article = articles.find((a) => a.id === id);
  if (article) {
    article.viewCount = (article.viewCount || 0) + 1;
    setItem(STORAGE_KEYS.ARTICLES, articles);
    setDoc(doc(db, 'articles', id), { viewCount: article.viewCount }, { merge: true }).catch(() => {});
  }
}

// Categories API
export function getCategories(): Category[] {
  return getItem<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}

export function saveCategory(category: Category): void {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    categories[index] = category;
  } else {
    categories.push(category);
  }
  setItem(STORAGE_KEYS.CATEGORIES, categories);
  setDoc(doc(db, 'categories', category.id), cleanForFirestore(category)).catch(console.warn);
}

export function deleteCategory(id: string): void {
  const categories = getCategories().filter((c) => c.id !== id);
  setItem(STORAGE_KEYS.CATEGORIES, categories);
  deleteDoc(doc(db, 'categories', id)).catch(console.warn);
}

// Breaking News API
export function getBreakingNews(): BreakingNews[] {
  return getItem<BreakingNews[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
}

export function saveBreakingNews(item: BreakingNews): void {
  const list = getBreakingNews();
  const index = list.findIndex((b) => b.id === item.id);
  if (index >= 0) {
    list[index] = item;
  } else {
    list.unshift(item);
  }
  setItem(STORAGE_KEYS.BREAKING_NEWS, list);
  setDoc(doc(db, 'breaking_news', item.id), cleanForFirestore(item)).catch(console.warn);
}

export function deleteBreakingNews(id: string): void {
  const list = getBreakingNews().filter((b) => b.id !== id);
  setItem(STORAGE_KEYS.BREAKING_NEWS, list);
  deleteDoc(doc(db, 'breaking_news', id)).catch(console.warn);
}

// Comments API
export function getComments(articleId?: string): Comment[] {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  if (articleId) {
    return comments.filter((c) => c.articleId === articleId);
  }
  return comments;
}

export function addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Comment {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  const newComment: Comment = {
    ...comment,
    id: 'comm-' + Date.now(),
    createdAt: new Date().toISOString(),
    likes: 0
  };
  comments.unshift(newComment);
  setItem(STORAGE_KEYS.COMMENTS, comments);
  setDoc(doc(db, 'comments', newComment.id), cleanForFirestore(newComment)).catch(console.warn);
  return newComment;
}

export function updateCommentStatus(id: string, status: 'approved' | 'pending' | 'rejected'): void {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  const comment = comments.find((c) => c.id === id);
  if (comment) {
    comment.status = status;
    setItem(STORAGE_KEYS.COMMENTS, comments);
    setDoc(doc(db, 'comments', id), { status }, { merge: true }).catch(console.warn);
  }
}

export function deleteComment(id: string): void {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS).filter((c) => c.id !== id);
  setItem(STORAGE_KEYS.COMMENTS, comments);
  deleteDoc(doc(db, 'comments', id)).catch(console.warn);
}

export function likeComment(id: string): void {
  const comments = getItem<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  const comment = comments.find((c) => c.id === id);
  if (comment) {
    comment.likes = (comment.likes || 0) + 1;
    setItem(STORAGE_KEYS.COMMENTS, comments);
  }
}

// Advertisements API
export function getAdvertisements(): Advertisement[] {
  return getItem<Advertisement[]>(STORAGE_KEYS.ADS, INITIAL_ADS);
}

export function saveAdvertisement(ad: Advertisement): void {
  const ads = getAdvertisements();
  const index = ads.findIndex((a) => a.id === ad.id);
  if (index >= 0) {
    ads[index] = ad;
  } else {
    ads.push(ad);
  }
  setItem(STORAGE_KEYS.ADS, ads);
}

export function deleteAdvertisement(id: string): void {
  const ads = getAdvertisements().filter((a) => a.id !== id);
  setItem(STORAGE_KEYS.ADS, ads);
}

export function recordAdImpression(id: string): void {
  const ads = getAdvertisements();
  const ad = ads.find((a) => a.id === id);
  if (ad) {
    ad.impressions = (ad.impressions || 0) + 1;
    setItem(STORAGE_KEYS.ADS, ads);
  }
}

export function recordAdClick(id: string): void {
  const ads = getAdvertisements();
  const ad = ads.find((a) => a.id === id);
  if (ad) {
    ad.clicks = (ad.clicks || 0) + 1;
    setItem(STORAGE_KEYS.ADS, ads);
  }
}

// Users API
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function saveUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  setItem(STORAGE_KEYS.USERS, users);
}

export function deleteUser(id: string): void {
  const users = getUsers().filter((u) => u.id !== id);
  setItem(STORAGE_KEYS.USERS, users);
}

export function getCurrentUser(): User {
  return getItem<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
}

export function setCurrentUser(user: User): void {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
}

// RSS Feeds & Imported Stories API
export function getRssSources(): RssSource[] {
  return getItem<RssSource[]>(STORAGE_KEYS.RSS_SOURCES, INITIAL_RSS_SOURCES);
}

export function saveRssSource(source: RssSource): void {
  const sources = getRssSources();
  const index = sources.findIndex((s) => s.id === source.id);
  if (index >= 0) {
    sources[index] = source;
  } else {
    sources.push(source);
  }
  setItem(STORAGE_KEYS.RSS_SOURCES, sources);
}

export function deleteRssSource(id: string): void {
  const sources = getRssSources().filter((s) => s.id !== id);
  setItem(STORAGE_KEYS.RSS_SOURCES, sources);
}

export function getImportedStories(): ImportedStory[] {
  return getItem<ImportedStory[]>(STORAGE_KEYS.IMPORTED_STORIES, [
    {
      id: 'imp-1',
      title: 'தெற்காசியாவின் புதிய வர்த்தக மையமாக மாறும் இலங்கை துறைமுகங்கள்',
      description: 'கப்பல் போக்குவரத்து சர்வதேச கூட்டமைப்பின் வருடாந்த அறிக்கையில் கொழும்பு துறைமுகத்தின் அபரிமிதமான வளர்ச்சி குறித்து விரிவாக குறிப்பிடப்பட்டுள்ளது.',
      link: 'https://virakesari.lk/article/sample-1',
      sourceName: 'வீரகேசரி (Virakesari)',
      publishedAt: '2026-09-28T08:00:00Z',
      categoryId: 'sri-lanka',
      status: 'imported',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'imp-2',
      title: 'சென்னையில் புதிய அதிவேக மெட்ரோ ரயில் பாதைகள் விரிவாக்கம்',
      description: 'சென்னை மாநகரத்தின் போக்குவரத்து நெரிசலை குறைக்கும் நோக்கில் இரண்டாம் கட்ட மெட்ரோ ரயில் பணிகள் அடுத்த மாதம் முடிவடையும் என அறிவிக்கப்பட்டுள்ளது.',
      link: 'https://hindutamil.in/news/sample-2',
      sourceName: 'தி இந்து தமிழ் திசை',
      publishedAt: '2026-09-28T07:30:00Z',
      categoryId: 'india',
      status: 'imported',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'imp-3',
      title: 'அறிவியல் உலகில் புதிய புரட்சி: சூரிய சக்தி மூலம் இயங்கும் செயற்கைக்கோள்',
      description: 'விண்வெளியில் தொடர்ச்சியாக ஆற்றலை உற்பத்தி செய்து பூமிக்கு அனுப்பும் புதிய சோதனையில் சர்வதேச விஞ்ஞானிகள் வெற்றி கண்டுள்ளனர்.',
      link: 'https://bbc.com/tamil/sample-3',
      sourceName: 'பிபிசி தமிழ்',
      publishedAt: '2026-09-28T06:15:00Z',
      categoryId: 'technology',
      status: 'imported',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
    }
  ]);
}

export function saveImportedStories(stories: ImportedStory[]): void {
  setItem(STORAGE_KEYS.IMPORTED_STORIES, stories);
}

export function convertStoryToDraft(storyId: string, currentUser: User): Article | null {
  const stories = getImportedStories();
  const story = stories.find((s) => s.id === storyId);
  if (!story) return null;

  const newArticle: Article = {
    id: 'art-' + Date.now(),
    title: story.title,
    titleEn: '',
    subtitle: `ஆதாரம்: ${story.sourceName} | தொகுப்பு: சுடர் மீடியா செய்திப் பிரிவு`,
    subtitleEn: `Source: ${story.sourceName}`,
    slug: 'imported-' + Date.now(),
    categoryId: story.categoryId || 'world',
    summary: story.description,
    summaryEn: '',
    content: `<p>${story.description}</p><p>மூலச் செய்தி ஆதாரம்: <a href="${story.link}" target="_blank" rel="noopener noreferrer">${story.sourceName}</a></p>`,
    featuredImage: story.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    imageCaption: `${story.title} - செய்திப் படம்`,
    photographerCredit: story.sourceName,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorRole: currentUser.role === 'reporter' ? 'கள நிருபர்' : 'செய்தி ஆசிரியர்',
    authorAvatar: currentUser.avatar,
    location: 'செய்திப் பிரிவு',
    status: 'draft',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    editorPick: false,
    allowComments: true,
    viewCount: 0,
    shareCount: 0,
    tags: [story.sourceName, 'செய்தி'],
    seoTitle: story.title + ' | Chudar Media',
    seoDescription: story.description
  };

  saveArticle(newArticle);

  story.status = 'converted';
  saveImportedStories(stories);

  return newArticle;
}

// Live Stream API
export function getLiveStreamConfig(): LiveStreamConfig {
  return getItem<LiveStreamConfig>(STORAGE_KEYS.LIVE_STREAM, INITIAL_LIVE_STREAM);
}

export function updateLiveStreamConfig(config: LiveStreamConfig): void {
  setItem(STORAGE_KEYS.LIVE_STREAM, config);
}

// Media API
export function getMediaItems(): MediaItem[] {
  return getItem<MediaItem[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA_ITEMS);
}

export function addMediaItem(item: MediaItem): void {
  const media = getMediaItems();
  media.unshift(item);
  setItem(STORAGE_KEYS.MEDIA, media);
}

export function deleteMediaItem(id: string): void {
  const media = getMediaItems().filter((m) => m.id !== id);
  setItem(STORAGE_KEYS.MEDIA, media);
}

// Site Settings API
export function getSiteSettings(): SiteSettings {
  return getItem<SiteSettings>(STORAGE_KEYS.SITE_SETTINGS, INITIAL_SITE_SETTINGS);
}

export function updateSiteSettings(settings: SiteSettings): void {
  setItem(STORAGE_KEYS.SITE_SETTINGS, settings);
  setDoc(doc(db, 'site_settings', 'global'), cleanForFirestore(settings)).catch(console.warn);
}

// Video Trailers API
export function getVideoTrailers(): VideoTrailer[] {
  return getItem<VideoTrailer[]>(STORAGE_KEYS.VIDEO_TRAILERS, INITIAL_VIDEO_TRAILERS);
}

export function saveVideoTrailer(trailer: VideoTrailer): void {
  const trailers = getVideoTrailers();
  const index = trailers.findIndex((v) => v.id === trailer.id);
  if (index >= 0) {
    trailers[index] = trailer;
  } else {
    trailers.unshift(trailer);
  }
  setItem(STORAGE_KEYS.VIDEO_TRAILERS, trailers);
  setDoc(doc(db, 'video_trailers', trailer.id), cleanForFirestore(trailer)).catch(console.warn);
}

export function deleteVideoTrailer(id: string): void {
  const trailers = getVideoTrailers().filter((v) => v.id !== id);
  setItem(STORAGE_KEYS.VIDEO_TRAILERS, trailers);
  deleteDoc(doc(db, 'video_trailers', id)).catch(console.warn);
}

export function reorderVideoTrailers(trailers: VideoTrailer[]): void {
  setItem(STORAGE_KEYS.VIDEO_TRAILERS, trailers);
}

// Reset data helper
export function resetStoreToDefaults(): void {
  localStorage.clear();
  initializeStore();
  notify();
}
