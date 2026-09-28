export type UserRole = 'super_admin' | 'admin' | 'editor' | 'journalist' | 'reporter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio: string;
  location: string;
  active: boolean;
  articlesCount: number;
}

export type ArticleStatus = 'draft' | 'pending_review' | 'scheduled' | 'published';

export interface Article {
  id: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  slug: string;
  categoryId: string; // kollywood, sri-lankan-cinema, indian-cinema, world-cinema, sinhala-cinema, reviews, gossips, interviews, trailers, gallery, box-office
  content: string;
  summary: string;
  summaryEn: string;
  featuredImage: string;
  imageCaption: string;
  photographerCredit: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  location: string;
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  scheduledFor?: string;
  isBreaking: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  editorPick: boolean;
  allowComments: boolean;
  viewCount: number;
  shareCount: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  videoEmbedUrl?: string;
  // Cinema specific fields
  rating?: number; // e.g. 4.0 out of 5
  movieVerdict?: string; // e.g. 'Blockbuster', 'Must Watch', 'Super Hit'
  director?: string;
  cast?: string;
  musicDirector?: string;
}

export interface Category {
  id: string;
  nameTa: string;
  nameEn: string;
  slug: string;
  order: number;
  color?: string;
}

export interface BreakingNews {
  id: string;
  headlineTa: string;
  headlineEn: string;
  url?: string;
  articleId?: string;
  active: boolean;
  priority: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  likes: number;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  altText: string;
  caption: string;
  fileType: 'image' | 'video';
  size: string;
  folder: string;
  uploadedAt: string;
}

export type AdPlacement = 'home_top' | 'home_sidebar' | 'article_sidebar' | 'article_inline' | 'mobile_banner';

export interface Advertisement {
  id: string;
  title: string;
  placement: AdPlacement;
  imageUrl: string;
  targetUrl: string;
  active: boolean;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  clientName: string;
}

export interface RssSource {
  id: string;
  name: string;
  url: string;
  categoryId: string;
  language: string;
  active: boolean;
  lastFetched?: string;
}

export interface ImportedStory {
  id: string;
  title: string;
  description: string;
  link: string;
  sourceName: string;
  publishedAt: string;
  categoryId?: string;
  status: 'imported' | 'converted' | 'dismissed';
  image?: string;
  content?: string;
}

export interface ProgramScheduleItem {
  time: string;
  title: string;
  host: string;
  category: string;
}

export interface LiveStreamConfig {
  id: string;
  title: string;
  description: string;
  streamType: 'youtube' | 'hls';
  streamUrl: string;
  isLive: boolean;
  currentProgram: string;
  presenter: string;
  schedule: ProgramScheduleItem[];
}

export interface VideoTrailer {
  id: string;
  title: string;
  titleEn: string;
  duration: string;
  thumbnail: string;
  embedId: string;
  category?: string;
  order?: number;
}

export interface SiteSettings {
  brandName: string;
  brandNameTa: string;
  tagline: string;
  taglineEn: string;
  logoUrl?: string; // Customizable logo URL
  editorInChief: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    youtube: string;
    whatsapp: string;
    telegram: string;
    instagram?: string;
  };
  liveTvEnabled: boolean;
  commentsRequireApproval: boolean;
  firebaseProjectId?: string;
  firebaseConnected?: boolean;
}
