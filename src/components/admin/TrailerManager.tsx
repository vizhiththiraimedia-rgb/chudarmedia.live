import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Play,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  Film,
  Sparkles,
  Youtube
} from 'lucide-react';
import { VideoTrailer } from '../../types';

interface TrailerManagerProps {
  trailers: VideoTrailer[];
  onSave: (trailer: VideoTrailer) => void;
  onDelete: (id: string) => void;
}

export const TrailerManager: React.FC<TrailerManagerProps> = ({
  trailers,
  onSave,
  onDelete
}) => {
  // Local synchronized state for immediate UI responsiveness
  const [trailerList, setTrailerList] = useState<VideoTrailer[]>(trailers);

  useEffect(() => {
    setTrailerList(trailers);
  }, [trailers]);

  // Form states for Add / Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [embedId, setEmbedId] = useState('');
  const [duration, setDuration] = useState('02:45');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState<string>('டிரெய்லர்');

  // Interactive Live Video Preview modal
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);

  // In-app Delete Confirmation Modal (zero blocked browser dialogs)
  const [trailerToDelete, setTrailerToDelete] = useState<VideoTrailer | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Toast notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper to extract clean YouTube Video ID from full URLs or raw IDs
  const extractYoutubeId = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    // If it's already an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    // Match youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = trimmed.match(regExp);
    return match ? match[1] : trimmed;
  };

  // Auto-handle YouTube input change and auto-suggest thumbnail
  const handleYoutubeInputChange = (val: string) => {
    setYoutubeInput(val);
    const parsedId = extractYoutubeId(val);
    setEmbedId(parsedId);
    if (parsedId && !thumbnail) {
      setThumbnail(`https://img.youtube.com/vi/${parsedId}/hqdefault.jpg`);
    }
  };

  // Handle Form Submission (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification('தயவுசெய்து தமிழ் தலைப்பை உள்ளிடவும் (Tamil title is required)', 'error');
      return;
    }

    const cleanEmbedId = extractYoutubeId(youtubeInput || embedId) || 'dQw4w9WgXcQ';
    const finalThumbnail =
      thumbnail.trim() ||
      `https://img.youtube.com/vi/${cleanEmbedId}/hqdefault.jpg`;

    const existingTrailer = editingId ? trailerList.find((t) => t.id === editingId) : null;
    const newTrailer: VideoTrailer = {
      id: editingId || 'vid-' + Date.now(),
      title: title.trim(),
      titleEn: titleEn.trim() || title.trim(),
      duration: duration.trim() || '02:30',
      thumbnail: finalThumbnail,
      embedId: cleanEmbedId,
      category: category || 'டிரெய்லர்',
      order: existingTrailer?.order || trailerList.length + 1
    };

    // Update local state immediately
    const updated = editingId
      ? trailerList.map((t) => (t.id === editingId ? newTrailer : t))
      : [newTrailer, ...trailerList];
    setTrailerList(updated);

    // Persist to storage
    onSave(newTrailer);

    showNotification(
      editingId
        ? `"${newTrailer.title}" வீடியோ வெற்றிகரமாக மாற்றப்பட்டது!`
        : `"${newTrailer.title}" புதிய வீடியோ வெற்றிகரமாக சேர்க்கப்பட்டது!`
    );

    // Reset Form
    resetForm();
  };

  // Start Editing an existing trailer
  const startEdit = (trailer: VideoTrailer) => {
    setEditingId(trailer.id);
    setTitle(trailer.title);
    setTitleEn(trailer.titleEn || '');
    setYoutubeInput(trailer.embedId ? `https://www.youtube.com/watch?v=${trailer.embedId}` : '');
    setEmbedId(trailer.embedId || '');
    setDuration(trailer.duration || '02:30');
    setThumbnail(trailer.thumbnail || '');
    setCategory(trailer.category || 'டிரெய்லர்');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setTitleEn('');
    setYoutubeInput('');
    setEmbedId('');
    setDuration('02:45');
    setThumbnail('');
    setCategory('டிரெய்லர்');
  };

  // Execute in-app delete
  const executeDelete = () => {
    if (!trailerToDelete) return;
    const { id, title: delTitle } = trailerToDelete;

    // Remove from local state immediately
    setTrailerList((prev) => prev.filter((t) => t.id !== id));
    // Persist deletion
    onDelete(id);

    setTrailerToDelete(null);
    showNotification(`"${delTitle}" வீடியோ வெற்றிகரமாக நீக்கப்பட்டது!`);
  };

  // Re-order Move Up / Down
  const moveTrailer = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= trailerList.length) return;

    const listCopy = [...trailerList];
    const [moved] = listCopy.splice(index, 1);
    listCopy.splice(targetIndex, 0, moved);

    const reordered = listCopy.map((t, idx) => ({ ...t, order: idx + 1 }));
    setTrailerList(reordered);
    reordered.forEach((t) => onSave(t));
    showNotification('வீடியோக்களின் வரிசை மாற்றப்பட்டது!');
  };

  // Filtered trailers
  const filteredTrailers = trailerList.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.titleEn.toLowerCase().includes(q) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-[#C8102E]" />
            <span>புதிய டிரெய்லர்கள் & வீடியோ பேட்டிகள் மேலாண்மை</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            இங்கு புதிய சினிமா டிரெய்லர்கள், டீசர்கள் மற்றும் வீடியோ பேட்டிகளை எளிதாகச் சேர்க்கலாம், திருத்தலாம் (Edit) அல்லது நீக்கலாம் (Delete).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-neutral-100 border border-neutral-300 rounded text-neutral-700">
            மொத்தம்: {trailerList.length} வீடியோக்கள்
          </span>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded text-xs flex items-center justify-between shadow-xs transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-red-50 border border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-neutral-500 hover:text-neutral-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="bg-white border-2 border-neutral-200 rounded-sm p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit2 className="w-4 h-4 text-[#C8102E]" />
                <span className="text-neutral-900 font-extrabold">வீடியோவை திருத்துக (Edit Video Details)</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#C8102E]" />
                <span className="text-neutral-900 font-extrabold">புதிய டிரெய்லர் / வீடியோ பேட்டி சேர்க்க (Add New Video)</span>
              </>
            )}
          </h3>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              <X className="w-3.5 h-3.5" />
              <span>ரத்து செய் (Cancel Edit)</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tamil Title */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                தமிழ் தலைப்பு (Tamil Video Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="எ.கா: கமல் ஹாசன் - மணிரத்னம் ‘தக் லைஃப்’ அதிகாரப்பூர்வ அதிரடி டிரெய்லர்"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-medium focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            {/* English Title */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                ஆங்கிலத் தலைப்பு (English Video Title)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Kamal Haasan Thug Life Official Trailer"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* YouTube Link / ID */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1 flex items-center gap-1">
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>YouTube Link அல்லது Video ID *</span>
              </label>
              <input
                type="text"
                required
                value={youtubeInput}
                onChange={(e) => handleYoutubeInputChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... அல்லது ID"
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
              />
              {embedId && (
                <span className="text-[10px] text-neutral-500 font-mono mt-0.5 block">
                  YouTube ID: <strong>{embedId}</strong>
                </span>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                பிரிவு (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-medium focus:outline-none focus:border-[#C8102E]"
              >
                <option value="டிரெய்லர்">டிரெய்லர் (Official Trailer)</option>
                <option value="டீசர்">டீசர் (Official Teaser)</option>
                <option value="வீடியோ பேட்டி">வீடியோ பேட்டி (Video Interview)</option>
                <option value="பாடல் காட்சி">பாடல் காட்சி (Song Video)</option>
                <option value="பிரத்யேகக் காட்சி">பிரத்யேகக் காட்சி (Sneak Peek)</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                கால அளவு (Duration e.g. 02:45)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="02:45"
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>

          {/* Thumbnail Image URL & Quick Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                முகப்பு படம் (Thumbnail Image URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/... அல்லது YouTube Thumbnail"
                  className="flex-1 px-3 py-2 text-xs font-mono border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
                />
                {embedId && (
                  <button
                    type="button"
                    onClick={() => setThumbnail(`https://img.youtube.com/vi/${embedId}/hqdefault.jpg`)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-[11px] font-semibold text-neutral-700 cursor-pointer shrink-0"
                    title="YouTube படத்தைப் பயன்படுத்து"
                  >
                    Auto YouTube Pic
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-1">
              {thumbnail ? (
                <div className="relative aspect-16/9 w-full bg-neutral-900 rounded overflow-hidden border border-neutral-300">
                  <img
                    src={thumbnail}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="absolute bottom-1 right-1 px-1 bg-black/70 text-white font-mono text-[9px] rounded">
                    {duration}
                  </span>
                </div>
              ) : (
                <div className="aspect-16/9 w-full bg-neutral-100 rounded border border-dashed border-neutral-300 flex items-center justify-center text-[10px] text-neutral-400">
                  No Preview
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'மாற்றங்களை சேமி (Save Changes)' : 'வீடியோவைச் சேர் (Add Video)'}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-neutral-300 rounded text-xs text-neutral-700 hover:bg-neutral-100 cursor-pointer font-medium"
              >
                ரத்து (Cancel)
              </button>
            )}

            {embedId && (
              <button
                type="button"
                onClick={() => setPreviewVideoId(embedId)}
                className="ml-auto px-3.5 py-2 border border-neutral-300 hover:bg-neutral-100 rounded text-xs font-semibold text-neutral-700 cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                <span>Test Video Play</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Trailers List */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
        <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              தற்போதுள்ள டிரெய்லர்கள் & வீடியோ பேட்டிகள் (Active Videos)
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="வீடியோவை தேடுங்கள் (Search)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
            />
          </div>
        </div>

        {/* List Content */}
        <div className="divide-y divide-neutral-200">
          {filteredTrailers.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              வீடியோக்கள் எதுவும் காணப்படவில்லை. மேலே உள்ள படிவத்தின் மூலம் புதிய வீடியோக்களை சேர்க்கலாம்.
            </div>
          ) : (
            filteredTrailers.map((item, index) => (
              <div
                key={item.id}
                className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
              >
                {/* Order & Thumbnail */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Order control */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveTrailer(index, 'up')}
                      className="p-0.5 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 cursor-pointer"
                      title="மேலே நகர்த்து (Move Up)"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[11px] font-bold text-neutral-400">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={index === trailerList.length - 1}
                      onClick={() => moveTrailer(index, 'down')}
                      className="p-0.5 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 cursor-pointer"
                      title="கீழே நகர்த்து (Move Down)"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail with interactive Play trigger */}
                  <div
                    onClick={() => setPreviewVideoId(item.embedId)}
                    className="relative w-24 h-16 sm:w-28 sm:h-18 bg-neutral-900 rounded shrink-0 overflow-hidden group cursor-pointer border border-neutral-300"
                    title="வீடியோ முன்னோட்டம் பார்க்க கிளிக் செய்க"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-6 h-6 rounded-full bg-[#C8102E] text-white flex items-center justify-center">
                        <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 px-1 bg-black/80 text-white font-mono text-[9px] rounded">
                      {item.duration}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-200 text-neutral-800">
                        {item.category || 'டிரெய்லர்'}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        YouTube: {item.embedId}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-serif-tamil line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    {item.titleEn && (
                      <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                        {item.titleEn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions: Edit, Delete, Test Play */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setPreviewVideoId(item.embedId)}
                    className="p-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                    title="வீடியோவை இயக்கவும் (Play Video)"
                  >
                    <Play className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="px-2.5 py-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
                    title="வீடியோவை திருத்துக (Edit Video Details)"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTrailerToDelete(item)}
                    className="px-2.5 py-1.5 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
                    title="வீடியோவை நீக்குக (Delete Video)"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* In-App Delete Confirmation Modal */}
      {trailerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-red-500 rounded-sm shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-600 pb-2 border-b border-neutral-200">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  வீடியோவை நீக்க உறுதிப்படுத்தவும் (Confirm Delete)
                </h3>
                <span className="text-[11px] text-neutral-500 font-mono">
                  ID: {trailerToDelete.id}
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-neutral-50 p-2.5 rounded border border-neutral-200">
              <img
                src={trailerToDelete.thumbnail}
                alt={trailerToDelete.title}
                referrerPolicy="no-referrer"
                className="w-16 h-12 object-cover rounded shrink-0 bg-neutral-800"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-neutral-900 line-clamp-2">
                  {trailerToDelete.title}
                </h4>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  பிரிவு: {trailerToDelete.category} • கால அளவு: {trailerToDelete.duration}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">
              இந்த வீடியோ டிரெய்லரை நிச்சயமாக முகப்புப் பக்கத்திலிருந்து நீக்க விரும்புகிறீர்களா?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setTrailerToDelete(null)}
                className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                ரத்து (Cancel)
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ஆம், நீக்குக (Yes, Delete)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {previewVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-black rounded-sm overflow-hidden shadow-2xl border border-neutral-800">
            <div className="flex items-center justify-between p-3 bg-neutral-900 text-white border-b border-neutral-800">
              <span className="text-xs font-bold font-mono">YouTube Preview: {previewVideoId}</span>
              <button
                type="button"
                onClick={() => setPreviewVideoId(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-16/9 w-full">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=1&rel=0`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
