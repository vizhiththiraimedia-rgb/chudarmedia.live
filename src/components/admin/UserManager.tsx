import React, { useState } from 'react';
import { Users, UserPlus, Shield, UserCheck } from 'lucide-react';
import { User, UserRole } from '../../types';

interface UserManagerProps {
  users: User[];
  currentUser: User;
  onSaveUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onSwitchUser: (user: User) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({
  users,
  currentUser,
  onSaveUser,
  onDeleteUser,
  onSwitchUser
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('reporter');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('Chennai & Colombo');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      avatar,
      bio: bio.trim() || 'Chudar Cinema Journalist.',
      location: location.trim(),
      active: true,
      articlesCount: 0
    };

    onSaveUser(newUser);
    setName('');
    setEmail('');
    setBio('');
    setShowAddForm(false);
  };

  const [notice, setNotice] = useState<string | null>(null);

  const toggleUserActive = (user: User) => {
    if (user.id === currentUser.id) {
      setNotice('தற்போது உள்நுழைந்துள்ள உங்கள் சொந்த கணக்கை முடக்க முடியாது (You cannot deactivate your current active account).');
      setTimeout(() => setNotice(null), 4000);
      return;
    }
    onSaveUser({ ...user, active: !user.active });
  };

  const handleRoleChange = (user: User, newRole: UserRole) => {
    onSaveUser({ ...user, role: newRole });
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs font-medium">
          {notice}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C8102E]" />
            <span>Staff & Journalist Management</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Configure editorial access, review roles, and reporter permissions
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close' : 'Add New Staff Member'}</span>
        </button>
      </div>

      {/* Role explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-neutral-50 rounded border border-neutral-200 text-xs">
        <div>
          <span className="font-bold text-neutral-900 block mb-0.5">Field Reporter</span>
          <p className="text-neutral-600">Drafts articles & submits them for editorial approval (Pending Review).</p>
        </div>
        <div>
          <span className="font-bold text-neutral-900 block mb-0.5">Cinema Editor</span>
          <p className="text-neutral-600">Reviews reporter submissions, edits copy, and publishes live stories.</p>
        </div>
        <div>
          <span className="font-bold text-neutral-900 block mb-0.5">Super Admin / Administrator</span>
          <p className="text-neutral-600">Full system access: users, movie banners, site settings, custom logo.</p>
        </div>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <form onSubmit={handleCreateUser} className="p-5 bg-white border border-neutral-200 rounded shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Register New Staff / Journalist
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Karthik"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@chudarmedia.com"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-medium"
              >
                <option value="reporter">Reporter (Pending Review workflow)</option>
                <option value="journalist">Journalist (Direct write)</option>
                <option value="editor">Editor (Approve & Publish)</option>
                <option value="admin">Administrator</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer"
          >
            Create Staff Profile
          </button>
        </form>
      )}

      {/* Users Table */}
      <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
        <div className="px-4 py-3 bg-neutral-100 border-b border-neutral-200 text-xs font-bold uppercase text-neutral-700 flex justify-between">
          <span>Registered Staff ({users.length})</span>
          <span>Role & Testing</span>
        </div>

        <div className="divide-y divide-neutral-200">
          {users.map((user) => {
            const isCurrent = user.id === currentUser.id;

            return (
              <div
                key={user.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCurrent ? 'bg-red-50/40' : user.active ? 'bg-white' : 'bg-neutral-50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-neutral-300"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-neutral-900">{user.name}</h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-[#C8102E] text-white text-[10px] font-bold rounded">
                          Current Active User
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500">{user.email} · {user.location}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user, e.target.value as UserRole)}
                    className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white font-medium"
                  >
                    <option value="reporter">Reporter</option>
                    <option value="journalist">Journalist</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrator</option>
                    <option value="super_admin">Super Admin</option>
                  </select>

                  {!isCurrent && (
                    <button
                      onClick={() => onSwitchUser(user)}
                      className="px-2.5 py-1 rounded bg-neutral-900 text-white text-xs font-semibold hover:bg-black cursor-pointer flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>Switch to User</span>
                    </button>
                  )}

                  {!isCurrent && (
                    <button
                      onClick={() => toggleUserActive(user)}
                      className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                        user.active ? 'bg-neutral-200 text-neutral-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
