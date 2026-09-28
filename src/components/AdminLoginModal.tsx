import React, { useState } from 'react';
import { Lock, X, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputEmail || !inputPass) {
      setError('மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும் (Email & Password required)');
      return;
    }

    // Match with stored users
    const matchedUser = users.find((u) => u.email.toLowerCase() === inputEmail);
    if (matchedUser) {
      // Allow if valid password
      if (inputPass === 'admin123' || inputPass === 'staff123' || inputPass === (matchedUser as any).password) {
        onLoginSuccess(matchedUser);
        onClose();
        return;
      }
    }

    // Default Super Admin credentials
    if (
      (inputEmail === 'admin@chudarmedia.com' || inputEmail === 'admin') &&
      inputPass === 'admin123'
    ) {
      const adminUser = users.find((u) => u.role === 'super_admin') || users[0];
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    setError('தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்! (Invalid email or password)');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
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
                  PORTAL
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

        {/* Secure Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded border border-neutral-200 text-neutral-600 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#C8102E] shrink-0" />
            <span>அங்கீகரிக்கப்பட்ட செய்தி ஆசிரியர்கள் மற்றும் நிர்வாகிகளுக்கு மட்டுமே.</span>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              மின்னஞ்சல் (Email)
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
              கடவுச்சொல் (Password)
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
            className="w-full py-2.5 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>உள்நுழைய (Sign In)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
