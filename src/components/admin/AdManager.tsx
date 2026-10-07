import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, Edit2, ExternalLink, Eye, MousePointer } from 'lucide-react';
import { Advertisement, AdPlacement } from '../../types';

interface AdManagerProps {
  advertisements: Advertisement[];
  onSaveAd: (ad: Advertisement) => void;
  onDeleteAd: (id: string) => void;
}

export const AdManager: React.FC<AdManagerProps> = ({
  advertisements,
  onSaveAd,
  onDeleteAd
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [placement, setPlacement] = useState<AdPlacement>('home_top');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !targetUrl.trim()) return;

    const ad: Advertisement = {
      id: editingId || 'ad-' + Date.now(),
      title: title.trim(),
      clientName: clientName.trim() || 'Movie Production House',
      placement,
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl.trim(),
      active: true,
      impressions: editingId ? advertisements.find((a) => a.id === editingId)?.impressions || 0 : 0,
      clicks: editingId ? advertisements.find((a) => a.id === editingId)?.clicks || 0 : 0,
      startDate,
      endDate
    };

    onSaveAd(ad);
    setTitle('');
    setClientName('');
    setImageUrl('');
    setTargetUrl('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingId(ad.id);
    setTitle(ad.title);
    setClientName(ad.clientName);
    setPlacement(ad.placement);
    setImageUrl(ad.imageUrl);
    setTargetUrl(ad.targetUrl);
    setStartDate(ad.startDate);
    setEndDate(ad.endDate);
    setShowAddForm(true);
  };

  const toggleAdActive = (ad: Advertisement) => {
    onSaveAd({ ...ad, active: !ad.active });
  };

  const placementNames: Record<AdPlacement, string> = {
    home_top: 'Homepage Top Leaderboard Banner',
    home_sidebar: 'Homepage Sidebar Movie Promo Box',
    article_sidebar: 'Article Page Sidebar Promo',
    article_inline: 'In-Article Inline Billboard',
    mobile_banner: 'Mobile Sticky Banner'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#C8102E]" />
            <span>Movie Promotions & Advertisement Campaigns</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Manage movie poster banners, theatrical release promos, impressions, and click-through rates (CTR)
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close' : 'Add New Movie Banner'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-5 bg-neutral-50 rounded border border-neutral-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            {editingId ? 'Edit Campaign Banner' : 'Create New Movie Promotion Campaign'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Campaign / Movie Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Thalapathy Vijay Movie Advance Booking"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Client / Production House *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Sun Pictures / Lyca / EAP Theatres"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                விளம்பரம் தெரியும் இடம் (Banner Placement) *
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-medium"
              >
                <option value="home_top">1. முகப்பு மேல் பேனர் (Homepage Top Leaderboard - முதன்மை பேனர்)</option>
                <option value="mobile_banner">2. மொபைல் பேனர் (Mobile Banner)</option>
                <option value="home_sidebar">3. முகப்பு பக்கவாட்டுப் பகுதி (Homepage Sidebar)</option>
                <option value="article_inline">4. செய்திக் கட்டுரைக்குள் (In-Article Inline Billboard)</option>
                <option value="article_sidebar">5. கட்டுரை பக்கவாட்டுப் பகுதி (Article Sidebar)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Banner Poster Image URL *
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-mono"
              />
              {imageUrl.trim() && (
                <div className="mt-2 p-2 bg-neutral-100 rounded border border-neutral-200">
                  <span className="text-[10px] text-neutral-500 font-bold block mb-1">Image Preview:</span>
                  <img
                    src={imageUrl.trim()}
                    alt="Ad Preview"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="max-h-24 w-full object-cover rounded bg-neutral-900"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Target Booking / Video URL *
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://ticket-booking.com/movie"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer"
            >
              {editingId ? 'Save Campaign Changes' : 'Activate Campaign'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 border border-neutral-300 rounded text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Campaigns Table */}
      <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
        <div className="px-4 py-3 bg-neutral-100 border-b border-neutral-200 text-xs font-bold uppercase text-neutral-700 flex justify-between">
          <span>Active Movie Campaigns ({advertisements.length})</span>
          <span>Analytics & Actions</span>
        </div>

        <div className="divide-y divide-neutral-200">
          {advertisements.map((ad) => {
            const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';

            return (
              <div
                key={ad.id}
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  ad.active ? 'bg-white' : 'bg-neutral-50 opacity-60'
                }`}
              >
                <div className="flex gap-3 items-start flex-1 min-w-0">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    referrerPolicy="no-referrer"
                    className="w-24 h-16 object-cover rounded shrink-0 border border-neutral-200"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ad.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {ad.active ? 'RUNNING' : 'PAUSED'}
                      </span>
                      <span className="text-[11px] font-bold text-[#C8102E]">
                        {placementNames[ad.placement] || ad.placement}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 truncate">{ad.title}</h4>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Client: <strong>{ad.clientName}</strong> · Dates: {ad.startDate} to {ad.endDate}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-6 text-xs shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Views
                    </span>
                    <span className="font-mono font-bold text-neutral-800">
                      {ad.impressions.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-neutral-400 uppercase flex items-center gap-1">
                      <MousePointer className="w-3 h-3" /> Clicks
                    </span>
                    <span className="font-mono font-bold text-[#C8102E]">
                      {ad.clicks.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-neutral-400 uppercase">CTR</span>
                    <span className="font-mono font-bold text-emerald-600">{ctr}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAdActive(ad)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                        ad.active
                          ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {ad.active ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(ad)}
                      className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteAd(ad.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
