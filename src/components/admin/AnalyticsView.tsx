import React from 'react';
import { BarChart3, TrendingUp, Eye, MousePointer, ArrowUpRight } from 'lucide-react';
import { Article, Category, Advertisement } from '../../types';

interface AnalyticsViewProps {
  articles: Article[];
  categories: Category[];
  advertisements: Advertisement[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  articles,
  categories,
  advertisements
}) => {
  const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);
  const totalShares = articles.reduce((sum, a) => sum + (a.shareCount || 0), 0);
  const totalAdImpressions = advertisements.reduce((sum, a) => sum + a.impressions, 0);
  const totalAdClicks = advertisements.reduce((sum, a) => sum + a.clicks, 0);

  const categoryCounts = categories.map((cat) => {
    const count = articles.filter((a) => a.categoryId === cat.id).length;
    return { name: cat.nameEn, count };
  }).filter((c) => c.count > 0);

  const topArticles = [...articles].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);

  const weeklyData = [
    { day: 'Mon', views: 28400 },
    { day: 'Tue', views: 35100 },
    { day: 'Wed', views: 42800 },
    { day: 'Thu', views: 48900 },
    { day: 'Fri', views: 64200 },
    { day: 'Sat', views: 82100 },
    { day: 'Sun', views: 94600 }
  ];
  const maxWeeklyViews = Math.max(...weeklyData.map((d) => d.views));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#C8102E]" />
            <span>Audience Analytics & Real-Time Performance</span>
          </h2>
          <p className="text-xs text-neutral-500">Live audience metrics for Kollywood, reviews, and video trailers</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-neutral-200 rounded-sm">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Total Article Reads</span>
            <Eye className="w-4 h-4 text-[#C8102E]" />
          </div>
          <div className="text-2xl font-black font-mono text-neutral-900">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18.4% this week
          </div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 rounded-sm">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Social Viral Shares</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-neutral-900">
            {totalShares.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">WhatsApp & Social Media</div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 rounded-sm">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Ad Banner Impressions</span>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-neutral-900">
            {totalAdImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">{advertisements.length} Active Campaigns</div>
        </div>

        <div className="p-4 bg-white border border-neutral-200 rounded-sm">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
            <span>Movie Ticket Clicks</span>
            <MousePointer className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-neutral-900">
            {totalAdClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Average CTR: 4.82%
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-sm p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Weekly Traffic & Cinema Buzz Trends
            </h3>
            <span className="text-[11px] text-neutral-400">Past 7 Days</span>
          </div>

          <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2">
            {weeklyData.map((d, i) => {
              const heightPct = Math.round((d.views / maxWeeklyViews) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="font-mono text-[10px] text-neutral-400 group-hover:text-[#C8102E] font-bold">
                    {(d.views / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full max-w-[42px] bg-neutral-100 rounded-t overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-[#111111] group-hover:bg-[#C8102E] transition-all rounded-t"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-medium text-neutral-600">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-sm p-5">
          <div className="pb-3 mb-4 border-b border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Category Distribution
            </h3>
          </div>

          <div className="space-y-3">
            {categoryCounts.map((cat, idx) => {
              const pct = Math.round((cat.count / articles.length) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-neutral-700">{cat.name}</span>
                    <span className="font-mono text-neutral-500 font-bold">{cat.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8102E] rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 5 Articles */}
      <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
        <div className="px-4 py-3 bg-neutral-100 border-b border-neutral-200 text-xs font-bold uppercase text-neutral-700">
          Top Trending Cinema Stories
        </div>

        <div className="divide-y divide-neutral-200">
          {topArticles.map((article, idx) => (
            <div key={article.id} className="p-4 flex items-center justify-between text-xs hover:bg-neutral-50">
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                <span className="font-mono font-bold text-neutral-400 text-sm">#{idx + 1}</span>
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-10 object-cover rounded shrink-0 bg-neutral-800"
                />
                <div className="truncate">
                  <h4 className="font-bold text-neutral-900 truncate">{article.title}</h4>
                  <div className="text-[11px] text-neutral-400">
                    By {article.authorName} · {article.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-right shrink-0">
                <div>
                  <div className="font-bold text-neutral-900">{article.viewCount.toLocaleString()}</div>
                  <div className="text-[10px] text-neutral-400">Views</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
