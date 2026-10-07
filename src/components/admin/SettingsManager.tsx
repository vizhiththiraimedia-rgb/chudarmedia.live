import React, { useState } from 'react';
import { Settings, Save, Check, RefreshCw, Download, Image as ImageIcon } from 'lucide-react';
import { SiteSettings } from '../../types';
import { resetStoreToDefaults } from '../../services/storage';

interface SettingsManagerProps {
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    resetStoreToDefaults();
    setShowResetConfirm(false);
    window.location.reload();
  };

  const handleExportBackup = () => {
    const backup: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chudar_')) {
        try {
          backup[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          backup[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chudar_cinema_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#C8102E]" />
            <span>Portal Settings & Custom Logo Branding</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Configure portal branding, upload custom logo, and update contact information
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* 1. Custom Logo Update Feature (Specifically requested by user) */}
      <div className="bg-white border-2 border-neutral-800 rounded-sm p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C8102E]" />
            <span>Custom Logo Setup (அதிகாரப்பூர்வ லோகோ இணைப்பு)</span>
          </h3>
          <span className="text-[11px] text-neutral-500 font-mono">Header & Footer Logo</span>
        </div>

        <p className="text-xs text-neutral-600">
          Paste the URL of your official Chudar Media logo image here. If left blank, the portal automatically uses the stylized signature flame logo.
        </p>

        <div className="p-3.5 bg-neutral-900 text-white rounded text-xs space-y-2">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <span>📐 லோகோவின் சரியான அளவுகள் (Recommended Logo Dimensions):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-neutral-300 pt-0.5">
            <div className="p-2 bg-neutral-800 rounded border border-neutral-700">
              <span className="text-white font-bold block mb-0.5">✨ சிறந்த விகிதம் (Aspect Ratio):</span>
              <span className="font-mono text-emerald-300 font-bold">4:1 அல்லது 5:1 (கிடைமட்டம் / Horizontal)</span>
              <p className="text-[10px] text-neutral-400 mt-0.5">நீளவாக்கு லோகோ Header-க்கு மிகச் சிறந்தது</p>
            </div>
            <div className="p-2 bg-neutral-800 rounded border border-neutral-700">
              <span className="text-white font-bold block mb-0.5">📏 சிறந்த அளவு (Dimensions):</span>
              <span className="font-mono text-amber-300 font-bold">250 × 60 px (அல்லது 300 × 75 px)</span>
              <p className="text-[10px] text-neutral-400 mt-0.5">PC-யில் 44px உயரத்திலும், மொபைலில் 36px-லும் பொருந்தும்</p>
            </div>
            <div className="p-2 bg-neutral-800 rounded border border-neutral-700">
              <span className="text-white font-bold block mb-0.5">🎨 வடிவம் (Image Format):</span>
              <span className="font-mono text-cyan-300 font-bold">Transparent PNG அல்லது SVG</span>
              <p className="text-[10px] text-neutral-400 mt-0.5">வெள்ளை / கருப்பு பின்னணியில் அழகாகத் தெரிய</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Custom Logo Image URL
            </label>
            <input
              type="url"
              value={formData.logoUrl || ''}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://your-domain.com/chudar-media-logo.png"
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-mono focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div className="md:col-span-4 p-3 bg-neutral-100 rounded border border-neutral-200 text-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase block mb-1">Preview</span>
            {formData.logoUrl ? (
              <img
                src={formData.logoUrl}
                alt="Logo Preview"
                className="max-h-10 mx-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'30\' viewBox=\'0 0 100 30\'%3E%3Ctext x=\'10\' y=\'20\' fill=\'%23C8102E\' font-size=\'12\'%3EInvalid URL%3C/text%3E%3C/svg%3E';
                }}
              />
            ) : (
              <span className="text-xs text-neutral-500 italic">Default Flame Logo active</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Site Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded border border-neutral-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
          Brand Details & Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brand Name (English)
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brand Name (Tamil)
            </label>
            <input
              type="text"
              value={formData.brandNameTa}
              onChange={(e) => setFormData({ ...formData, brandNameTa: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Tagline (Tamil)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Editor in Chief
            </label>
            <input
              type="text"
              value={formData.editorInChief}
              onChange={(e) => setFormData({ ...formData, editorInChief: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Studio / Office Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save All Settings</span>
        </button>
      </form>

      {/* 3. Database Maintenance */}
      <div className="bg-neutral-50 p-5 rounded border border-neutral-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
          Database Maintenance & Backup
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Complete JSON Backup</span>
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold rounded cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Fresh Seed Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-red-500 rounded p-5 max-w-sm w-full space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-neutral-900">Reset Content to Fresh Defaults?</h4>
            <p className="text-xs text-neutral-600">
              Are you sure you want to reset all cinema news, reviews, and categories back to fresh initial seed data?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 border border-neutral-300 rounded text-xs text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
