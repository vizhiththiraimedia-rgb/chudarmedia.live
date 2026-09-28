import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Search,
  Sparkles
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryManagerProps {
  categories: Category[];
  onSave: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onSave,
  onDelete
}) => {
  // Local synchronized state for instant UI response
  const [categoryList, setCategoryList] = useState<Category[]>(categories);

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  // Form states for Add / Edit
  const [nameTa, setNameTa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Inline editing row state
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineNameTa, setInlineNameTa] = useState('');
  const [inlineNameEn, setInlineNameEn] = useState('');
  const [inlineSlug, setInlineSlug] = useState('');

  // Delete confirmation modal state (replaces blocked window.confirm)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Success / Feedback notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Auto-generate clean slug from text
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `cat-${Date.now()}`;
  };

  // Handle Add Category from Top Form
  const handleTopFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameTa.trim()) {
      showNotification('தயவுசெய்து தமிழ் பெயரை உள்ளிடவும் (Tamil name is required)', 'error');
      return;
    }

    const cleanSlug = (slug.trim() || generateSlug(nameEn || nameTa)).toLowerCase();

    // Check slug collision
    if (!editingId && categoryList.some((c) => c.slug === cleanSlug)) {
      showNotification('இந்த URL Slug ஏற்கனவே பயன்பாட்டில் உள்ளது. வேறு பெயரை உள்ளிடவும்.', 'error');
      return;
    }

    const existingCat = editingId ? categoryList.find((c) => c.id === editingId) : null;
    const newCategory: Category = {
      id: editingId || cleanSlug || 'cat-' + Date.now(),
      nameTa: nameTa.trim(),
      nameEn: nameEn.trim() || nameTa.trim(),
      slug: cleanSlug,
      order: existingCat ? existingCat.order : categoryList.length + 1
    };

    // Update local state immediately
    const updated = editingId
      ? categoryList.map((c) => (c.id === editingId ? newCategory : c))
      : [...categoryList, newCategory];
    setCategoryList(updated);

    // Persist
    onSave(newCategory);

    showNotification(
      editingId
        ? `"${newCategory.nameTa}" பிரிவு வெற்றிகரமாக மாற்றப்பட்டது!`
        : `"${newCategory.nameTa}" புதிய பிரிவு வெற்றிகரமாக சேர்க்கப்பட்டது!`
    );

    // Reset top form
    setNameTa('');
    setNameEn('');
    setSlug('');
    setEditingId(null);
  };

  // Start inline editing of a table row
  const startInlineEdit = (cat: Category) => {
    setInlineEditId(cat.id);
    setInlineNameTa(cat.nameTa);
    setInlineNameEn(cat.nameEn);
    setInlineSlug(cat.slug);
    // Cancel top form editing if open
    setEditingId(null);
  };

  // Save inline edit
  const saveInlineEdit = (originalCat: Category) => {
    if (!inlineNameTa.trim()) {
      showNotification('தமிழ் பெயர் அவசியம் (Tamil name is required)', 'error');
      return;
    }

    const updatedCat: Category = {
      ...originalCat,
      nameTa: inlineNameTa.trim(),
      nameEn: inlineNameEn.trim() || inlineNameTa.trim(),
      slug: inlineSlug.trim() || originalCat.slug
    };

    // Update local state immediately
    const updated = categoryList.map((c) => (c.id === originalCat.id ? updatedCat : c));
    setCategoryList(updated);

    // Persist
    onSave(updatedCat);

    setInlineEditId(null);
    showNotification(`"${updatedCat.nameTa}" பிரிவு வெற்றிகரமாக மாற்றப்பட்டது!`);
  };

  // Cancel inline edit
  const cancelInlineEdit = () => {
    setInlineEditId(null);
    setInlineNameTa('');
    setInlineNameEn('');
    setInlineSlug('');
  };

  // Confirm and Execute Delete (in-app modal, works 100% in iframes)
  const executeDelete = () => {
    if (!categoryToDelete) return;

    if (categoryToDelete.id === 'all') {
      showNotification('முகப்பு (Home) முதன்மைப் பிரிவை நீக்க முடியாது.', 'error');
      setCategoryToDelete(null);
      return;
    }

    const catName = categoryToDelete.nameTa;
    const catId = categoryToDelete.id;

    // Update local state immediately
    const updated = categoryList.filter((c) => c.id !== catId);
    setCategoryList(updated);

    // Persist
    onDelete(catId);

    setCategoryToDelete(null);
    showNotification(`"${catName}" பிரிவு வெற்றிகரமாக நீக்கப்பட்டது!`);
  };

  // Move Category Up
  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categoryList.length) return;

    const listCopy = [...categoryList];
    const [moved] = listCopy.splice(index, 1);
    listCopy.splice(targetIndex, 0, moved);

    // Reassign order indices
    const reordered = listCopy.map((cat, idx) => ({ ...cat, order: idx + 1 }));
    setCategoryList(reordered);

    // Save all affected categories
    reordered.forEach((c) => onSave(c));
    showNotification('பிரிவுகளின் வரிசை வெற்றிகரமாக மாற்றப்பட்டது!');
  };

  // Filtered categories
  const filteredCategories = categoryList.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.nameTa.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C8102E]" />
            <span>சினிமா பிரிவுகள் மேலாண்மை (Cinema Categories Manager)</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            தளத்தின் தலைப்பு மெனு, திரைப்பட பிரிவுகள், மற்றும் செய்தி வகைப்பாடுகளை இங்கிருந்து எளிதாக சேர்க்கலாம், திருத்தலாம் அல்லது நீக்கலாம்.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-neutral-100 border border-neutral-300 rounded text-neutral-700">
            மொத்தம்: {categoryList.length} பிரிவுகள்
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

      {/* Add / Edit Category Form */}
      <div className="bg-white border-2 border-neutral-200 rounded-sm p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit2 className="w-4 h-4 text-[#C8102E]" />
                <span>பிரிவை திருத்துக (Edit Cinema Category)</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#C8102E]" />
                <span>புதிய சினிமா பிரிவு சேர்க்க (Add New Category)</span>
              </>
            )}
          </h3>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNameTa('');
                setNameEn('');
                setSlug('');
              }}
              className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              <X className="w-3.5 h-3.5" />
              <span>ரத்து செய் (Cancel Edit)</span>
            </button>
          )}
        </div>

        <form onSubmit={handleTopFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                தமிழ் பெயர் (Tamil Name) *
              </label>
              <input
                type="text"
                required
                value={nameTa}
                onChange={(e) => {
                  setNameTa(e.target.value);
                  if (!slug && !editingId) {
                    setSlug(generateSlug(nameEn || e.target.value));
                  }
                }}
                placeholder="எ.கா: கோலிவுட் செய்திகள், இசை & பாடல்"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-medium focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                ஆங்கிலப் பெயர் (English Name)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => {
                  setNameEn(e.target.value);
                  if (!editingId && !slug) {
                    setSlug(generateSlug(e.target.value));
                  }
                }}
                placeholder="e.g. Kollywood, Music & Songs"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                URL Slug (இணைப்பு முகவரி)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="e.g. kollywood-news"
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="px-5 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'பிரிவை சேமி (Save Changes)' : 'பிரிவைச் சேர் (Add Category)'}</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNameTa('');
                  setNameEn('');
                  setSlug('');
                }}
                className="px-3 py-2 border border-neutral-300 rounded text-xs text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                ரத்து (Cancel)
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category List & Quick Search */}
      <div className="bg-white border border-neutral-200 rounded-sm shadow-xs overflow-hidden">
        <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              தற்போதுள்ள சினிமா பிரிவுகள் (Available Categories)
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="பிரிவை தேடுங்கள் (Search)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="px-4 py-2.5 bg-neutral-100 border-b border-neutral-200 text-xs font-bold uppercase text-neutral-700 grid grid-cols-12 items-center">
          <span className="col-span-1 text-center">வரிசை</span>
          <span className="col-span-4">தமிழ் பெயர் (Tamil Name)</span>
          <span className="col-span-3">English Name</span>
          <span className="col-span-2">URL Slug</span>
          <span className="col-span-2 text-right">செயல்கள் (Actions)</span>
        </div>

        {/* Categories Rows */}
        <div className="divide-y divide-neutral-200">
          {filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              பிரிவுகள் எதுவும் காணப்படவில்லை.
            </div>
          ) : (
            filteredCategories.map((cat, index) => {
              const isInlineEditing = inlineEditId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`px-4 py-3 text-xs grid grid-cols-12 items-center gap-2 transition-colors ${
                    isInlineEditing ? 'bg-amber-50/80 border-l-4 border-amber-500' : 'hover:bg-neutral-50'
                  }`}
                >
                  {/* Order & Move Buttons */}
                  <div className="col-span-1 flex items-center justify-center gap-0.5">
                    <span className="font-mono font-bold text-neutral-400 mr-1 text-[11px]">
                      #{cat.order || index + 1}
                    </span>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveCategory(index, 'up')}
                        className="p-0.5 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 cursor-pointer"
                        title="Move Up (மேலே நகர்த்து)"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === categoryList.length - 1}
                        onClick={() => moveCategory(index, 'down')}
                        className="p-0.5 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 cursor-pointer"
                        title="Move Down (கீழே நகர்த்து)"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* If in Inline Edit Mode */}
                  {isInlineEditing ? (
                    <>
                      <div className="col-span-4">
                        <input
                          type="text"
                          required
                          value={inlineNameTa}
                          onChange={(e) => setInlineNameTa(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-amber-400 rounded bg-white font-bold text-neutral-900"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={inlineNameEn}
                          onChange={(e) => setInlineNameEn(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-amber-400 rounded bg-white text-neutral-800"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={inlineSlug}
                          onChange={(e) => setInlineSlug(e.target.value)}
                          className="w-full px-2 py-1 text-xs font-mono border border-amber-400 rounded bg-white text-neutral-800 text-[11px]"
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => saveInlineEdit(cat)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                          title="சேமி (Save)"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>சேமி</span>
                        </button>
                        <button
                          type="button"
                          onClick={cancelInlineEdit}
                          className="p-1 border border-neutral-300 hover:bg-neutral-200 rounded text-neutral-600 cursor-pointer"
                          title="ரத்து (Cancel)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Normal Display Mode */
                    <>
                      <div className="col-span-4 flex items-center gap-2">
                        <span className="font-bold text-neutral-900 font-serif-tamil text-sm">
                          {cat.nameTa}
                        </span>
                        {cat.id === 'all' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-200 text-neutral-700 font-bold">
                            முதன்மை
                          </span>
                        )}
                      </div>

                      <div className="col-span-3 text-neutral-700 font-medium">
                        {cat.nameEn}
                      </div>

                      <div className="col-span-2 font-mono text-neutral-500 text-[11px]">
                        /{cat.slug}
                      </div>

                      <div className="col-span-2 flex items-center justify-end gap-1.5">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => startInlineEdit(cat)}
                          className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 hover:text-blue-700 cursor-pointer transition-colors"
                          title="நேரடியாக திருத்து (Edit Category)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button (Modal trigger, never window.confirm) */}
                        {cat.id !== 'all' ? (
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-1.5 rounded hover:bg-red-50 text-neutral-400 hover:text-red-600 cursor-pointer transition-colors"
                            title="பிரிவை நீக்கு (Delete Category)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="w-6"></span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* In-App Delete Confirmation Modal (Zero blocked browser dialogs!) */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-red-500 rounded-sm shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-600 pb-2 border-b border-neutral-200">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  பிரிவை நீக்க உறுதிப்படுத்தவும் (Confirm Delete)
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  ID: {categoryToDelete.id}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">
              <strong>"{categoryToDelete.nameTa} ({categoryToDelete.nameEn})"</strong> என்ற சினிமா பிரிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?
            </p>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-[11px] text-neutral-600 space-y-1">
              <p>• இப்பிரிவை நீக்கினால் தளத்தின் மெனுவிலும் உடனடியாக நீக்கப்படும்.</p>
              <p>• இப்பிரிவில் ஏற்கனவே உள்ள செய்திகள் தானாகவே முகப்பு / பிற பிரிவுகளுக்கு மாற்றப்படும்.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
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
    </div>
  );
};
