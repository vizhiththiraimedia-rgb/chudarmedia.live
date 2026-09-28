import React, { useState } from 'react';
import { Lock, X, Shield, ArrowRight, UserCheck, Key, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLoginSuccess: (user: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('admin@chudarmedia.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const inputEmail = email.trim().toLowerCase();

    // Direct match with stored users
    const foundUser = users.find((u) => u.email.toLowerCase() === inputEmail);
    if (foundUser) {
      onLoginSuccess(foundUser);
      onClose();
      return;
    }

    // Default admin alias or empty
    if (
      inputEmail === 'admin@chudarmedia.com' ||
      inputEmail === 'admin' ||
      inputEmail === '' ||
      inputEmail.includes('admin')
    ) {
      const adminUser = users.find((u) => u.role === 'super_admin') || users[0];
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    // Chief editor alias
    if (inputEmail.includes('editor')) {
      const editorUser = users.find((u) => u.role === 'editor') || users[0];
      onLoginSuccess(editorUser);
      onClose();
      return;
    }

    // Journalist / reporter alias
    if (inputEmail.includes('journalist') || inputEmail.includes('reporter')) {
      const reporterUser = users.find((u) => u.role === 'reporter' || u.role === 'journalist') || users[0];
      onLoginSuccess(reporterUser);
      onClose();
      return;
    }

    // Fallback: log in as admin user
    const defaultAdmin = users.find((u) => u.role === 'super_admin') || users[0];
    onLoginSuccess(defaultAdmin);
    onClose();
  };

  const handleOneClickAdmin = () => {
    const adminUser = users.find((u) => u.role === 'super_admin') || users[0];
    onLoginSuccess(adminUser);
    onClose();
  };

  const handleQuickSelect = (user: User, pass = 'admin123') => {
    setEmail(user.email);
    setPassword(pass);
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#C8102E] flex items-center justify-center shadow-md">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-wide font-display">CHUDAR MEDIA</h3>
                <span className="text-[10px] bg-[#C8102E] text-white px-2 py-0.5 rounded font-mono font-bold">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">நிர்வாகி & ஆசிரியர் பாதுகாப்பான உள்நுழைவு</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent Login Credentials Banner (Requested by user) */}
        <div className="p-4 bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border-b border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Key className="w-4 h-4 text-[#C8102E]" />
              <span>Admin Login Details / உள்நுழைவு விபரங்கள்:</span>
            </span>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
              Verified & Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs bg-white/90 p-2.5 rounded border border-amber-200 font-mono">
            <div>
              <span className="text-[11px] text-neutral-500 block font-sans font-semibold">User Email:</span>
              <strong className="text-neutral-900 select-all font-bold">admin@chudarmedia.com</strong>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block font-sans font-semibold">Password:</span>
              <strong className="text-neutral-900 select-all font-bold">admin123</strong>
            </div>
          </div>

          {/* 1-Click Instant Login Button */}
          <button
            type="button"
            onClick={handleOneClickAdmin}
            className="w-full mt-3 py-2.5 px-4 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>⚡ 1-Click Instant Admin Login (உடனடி நிர்வாகி உள்நுழைவு)</span>
          </button>
        </div>

        {/* Standard Login Form */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              Staff Email / நிர்வாகி மின்னஞ்சல்
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chudarmedia.com"
              className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded font-medium focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              Password / கடவுச்சொல்
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-xs border border-neutral-300 rounded font-medium focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Login to Editorial Portal / உள்நுழைய</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick Staff Switcher for convenient testing of different roles */}
          <div className="pt-3 border-t border-neutral-200">
            <span className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Or Select Staff Role to Login directly:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSelect(u, u.role === 'super_admin' ? 'admin123' : 'staff123')}
                  className="p-2 border border-neutral-200 hover:border-[#C8102E] rounded text-left text-xs bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-neutral-300"
                  />
                  <div className="truncate">
                    <div className="font-bold text-neutral-900 truncate text-[11px]">{u.name}</div>
                    <div className="text-[10px] text-neutral-500 capitalize flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{u.role.replace('_', ' ')}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
