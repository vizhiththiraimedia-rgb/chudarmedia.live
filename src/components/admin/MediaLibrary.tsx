import React, { useState } from 'react';
import { Image, Upload, Search, Copy, Check, Trash2 } from 'lucide-react';
import { MediaItem } from '../../types';

interface MediaLibraryProps {
  mediaItems: MediaItem[];
  onAddMedia: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  mediaItems,
  onAddMedia,
  onDeleteMedia
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newFolder, setNewFolder] = useState('Kollywood');

  const folders = ['All', 'Kollywood', 'Celebrity Photos', 'Sri Lankan Cinema', 'Posters', 'Trailers'];

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'All' || item.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const item: MediaItem = {
      id: 'med-' + Date.now(),
      url: newUrl.trim(),
      title: newTitle.trim() || 'Movie Poster Still',
      altText: newAlt.trim() || newTitle.trim(),
      caption: newCaption.trim(),
      fileType: 'image',
      size: '1.5 MB',
      folder: newFolder,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    onAddMedia(item);
    setNewUrl('');
    setNewTitle('');
    setNewAlt('');
    setNewCaption('');
    setShowUploadForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Image className="w-5 h-5 text-[#C8102E]" />
            <span>Media Library & Film Poster Archive</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Upload movie stills, actor photoshoots, and trailer graphics
          </p>
        </div>

        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-4 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{showUploadForm ? 'Close' : 'Register New Poster / Media'}</span>
        </button>
      </div>

      {showUploadForm && (
        <form onSubmit={handleAddMedia} className="bg-neutral-50 p-5 rounded border border-neutral-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Add New Media Asset
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Image URL *
              </label>
              <input
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Folder / Cinema Tag
              </label>
              <select
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              >
                {folders.filter((f) => f !== 'All').map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Thalapathy Vijay Movie Poster"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Caption</label>
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Caption displayed in articles..."
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded cursor-pointer"
          >
            Save Media to Library
          </button>
        </form>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1 rounded-xs text-xs font-medium whitespace-nowrap cursor-pointer ${
                selectedFolder === f
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movie photos..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-neutral-200 rounded-sm overflow-hidden group flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 bg-neutral-950 overflow-hidden">
              <img
                src={item.url}
                alt={item.altText}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded font-mono">
                {item.folder}
              </span>
            </div>

            <div className="p-3">
              <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{item.caption || item.altText}</p>
            </div>

            <div className="p-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopyUrl(item.url, item.id)}
                className="text-neutral-600 hover:text-[#C8102E] flex items-center gap-1 cursor-pointer text-[11px] font-medium"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === item.id ? 'Copied URL!' : 'Copy URL'}</span>
              </button>
              <button
                onClick={() => onDeleteMedia(item.id)}
                className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
