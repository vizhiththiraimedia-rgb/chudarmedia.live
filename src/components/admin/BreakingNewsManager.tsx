import React, { useState } from 'react';
import { Flame, Plus, Trash2, Edit2 } from 'lucide-react';
import { BreakingNews, Article } from '../../types';

interface BreakingNewsManagerProps {
  breakingItems: BreakingNews[];
  articles: Article[];
  onSave: (item: BreakingNews) => void;
  onDelete: (id: string) => void;
}

export const BreakingNewsManager: React.FC<BreakingNewsManagerProps> = ({
  breakingItems,
  articles,
  onSave,
  onDelete
}) => {
  const [headlineTa, setHeadlineTa] = useState('');
  const [headlineEn, setHeadlineEn] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headlineTa.trim()) return;

    const item: BreakingNews = {
      id: editingId || 'break-' + Date.now(),
      headlineTa: headlineTa.trim(),
      headlineEn: headlineEn.trim(),
      articleId: selectedArticleId || undefined,
      active: true,
      priority: breakingItems.length + 1,
      createdAt: new Date().toISOString()
    };

    onSave(item);
    setHeadlineTa('');
    setHeadlineEn('');
    setSelectedArticleId('');
    setEditingId(null);
  };

  const handleEdit = (item: BreakingNews) => {
    setEditingId(item.id);
    setHeadlineTa(item.headlineTa);
    setHeadlineEn(item.headlineEn || '');
    setSelectedArticleId(item.articleId || '');
  };

  const toggleActive = (item: BreakingNews) => {
    onSave({ ...item, active: !item.active });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#C8102E]" />
          <h2 className="text-lg font-bold text-neutral-900">
            Breaking News Ticker Manager
          </h2>
        </div>
        <span className="text-xs text-neutral-500">
          Red scrolling ticker headlines displayed beneath the header
        </span>
      </div>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="bg-neutral-50 p-5 rounded-sm border border-neutral-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
          {editingId ? 'Edit Breaking Alert' : 'Add New Breaking Cinema Alert'}
        </h3>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Tamil Breaking Headline *
          </label>
          <input
            type="text"
            required
            value={headlineTa}
            onChange={(e) => setHeadlineTa(e.target.value)}
            placeholder="e.g. தளபதி விஜய் - வெற்றிமாறன் கூட்டணியில் புதிய பான்-இந்தியப் படம் அறிவிப்பு..."
            className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-medium focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              English Headline (Optional)
            </label>
            <input
              type="text"
              value={headlineEn}
              onChange={(e) => setHeadlineEn(e.target.value)}
              placeholder="English breaking ticker headline..."
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Link to Full Story (Optional)
            </label>
            <select
              value={selectedArticleId}
              onChange={(e) => {
                setSelectedArticleId(e.target.value);
                const art = articles.find((a) => a.id === e.target.value);
                if (art && !headlineTa) {
                  setHeadlineTa(art.title);
                  setHeadlineEn(art.titleEn);
                }
              }}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
            >
              <option value="">-- No linked article (Standalone ticker) --</option>
              {articles.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.title.slice(0, 55)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{editingId ? 'Update Alert' : 'Publish to Ticker'}</span>
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setHeadlineTa('');
                setHeadlineEn('');
                setSelectedArticleId('');
              }}
              className="px-3 py-2 border border-neutral-300 rounded text-xs text-neutral-600 hover:bg-neutral-100 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Breaking Ticker List */}
      <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
        <div className="px-4 py-3 bg-neutral-100 border-b border-neutral-200 text-xs font-bold uppercase text-neutral-700 flex justify-between">
          <span>Active Breaking Alerts ({breakingItems.length})</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-neutral-200">
          {breakingItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.active ? 'bg-white' : 'bg-neutral-50 opacity-60'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.active ? 'bg-red-100 text-[#C8102E]' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {item.active ? 'ACTIVE ON TIKER' : 'PAUSED'}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                  {item.headlineTa}
                </h4>
                {item.headlineEn && (
                  <p className="text-[11px] text-neutral-500 mt-0.5">{item.headlineEn}</p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => toggleActive(item)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                    item.active
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {item.active ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
