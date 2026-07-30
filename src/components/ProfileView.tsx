import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  Edit3,
  Key,
  Trash2,
  LogOut,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  AtSign,
  Info
} from 'lucide-react';

interface ProfileViewProps {
  onClose?: () => void;
  onNavigateToDashboard?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose, onNavigateToDashboard }) => {
  const {
    user,
    logout,
    updateUserProfile,
    changePassword,
    deleteAccount,
    sendEmailVerificationLink
  } = useAuth();

  const [activeModal, setActiveModal] = useState<'none' | 'editProfile' | 'changePassword' | 'deleteConfirm'>('none');
  
  // Edit Profile Form State
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editPhotoUrl, setEditPhotoUrl] = useState(user?.photoURL || '');
  const [editBio, setEditBio] = useState(user?.bio || '');

  // Change Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Status Notification
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-400 text-sm">Please sign in to access your profile.</p>
      </div>
    );
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      await updateUserProfile({
        fullName: editFullName,
        username: editUsername,
        photoURL: editPhotoUrl,
        bio: editBio
      });
      setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      setActiveModal('none');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    try {
      await changePassword(newPassword);
      setStatusMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmNewPassword('');
      setActiveModal('none');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      await deleteAccount();
      if (onClose) onClose();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete account' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendVerification = async () => {
    try {
      const msg = await sendEmailVerificationLink();
      setStatusMessage({ type: 'success', text: msg });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Verification link disptached' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-slate-100 pb-12">
      {/* Top Banner / Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="relative rounded-[28px] border border-slate-800 bg-[#0A0E1A]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-cyan-500/30 border-b border-slate-800/80" />

        <div className="relative pt-12 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
            <div className="relative group">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                alt={user.fullName}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover border-4 border-[#0A0E1A] shadow-2xl bg-slate-900"
              />
              <button
                type="button"
                onClick={() => {
                  setEditFullName(user.fullName);
                  setEditUsername(user.username);
                  setEditPhotoUrl(user.photoURL || '');
                  setEditBio(user.bio || '');
                  setActiveModal('editProfile');
                }}
                className="absolute bottom-1 right-1 p-2 rounded-xl bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-all active:scale-95"
                title="Change Photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-black uppercase">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  Pro Member
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <span>@{user.username}</span>
                <span>•</span>
                <span className="text-cyan-400">{user.email}</span>
              </p>
              <p className="text-xs text-slate-400 pt-1 max-w-md">
                {user.bio || 'AI Prompt Creator & Engineer'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
            {onNavigateToDashboard && (
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="px-4 py-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-200 text-xs font-bold transition-all"
              >
                Go to Dashboard
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setEditFullName(user.fullName);
                setEditUsername(user.username);
                setEditPhotoUrl(user.photoURL || '');
                setEditBio(user.bio || '');
                setActiveModal('editProfile');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              <Edit3 className="h-3.5 w-3.5 text-purple-400" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Details */}
        <div className="rounded-[24px] border border-slate-800 bg-[#0A0E1A]/90 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
            <User className="h-4 w-4 text-purple-400" />
            <span>Account Details</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-semibold">Full Name</span>
              <span className="text-white font-bold">{user.fullName}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-semibold">Username</span>
              <span className="text-cyan-400 font-bold">@{user.username}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-semibold">Email</span>
              <span className="text-slate-200 font-bold">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-semibold">Account Created Date</span>
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>{formattedDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Security & Verification */}
        <div className="rounded-[24px] border border-slate-800 bg-[#0A0E1A]/90 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Security & Verification</span>
            </h3>

            {/* Verification Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${user.emailVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Email Verification</p>
                  <p className="text-[10px] text-slate-400">
                    {user.emailVerified ? 'Account is fully verified' : 'Pending email verification link'}
                  </p>
                </div>
              </div>
              {!user.emailVerified && (
                <button
                  type="button"
                  onClick={handleSendVerification}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition-all"
                >
                  Verify Now
                </button>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal('changePassword')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-bold text-slate-200 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Key className="h-4 w-4 text-purple-400" />
                  <span>Change Password</span>
                </div>
                <span className="text-purple-400 text-[11px]">Update →</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('deleteConfirm')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-500/5 hover:bg-rose-500/15 border border-rose-500/20 text-xs font-bold text-rose-300 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="h-4 w-4 text-rose-400" />
                  <span>Delete Account</span>
                </div>
                <span className="text-rose-400 text-[11px]">Danger Zone</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {activeModal === 'editProfile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-[28px] border border-slate-700 bg-[#0A0E1A] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Edit Profile</h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Username</label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Avatar Photo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editPhotoUrl}
                  onChange={(e) => setEditPhotoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Bio</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {activeModal === 'changePassword' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-[28px] border border-slate-700 bg-[#0A0E1A] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Change Password</h3>
              <button onClick={() => setActiveModal('none')} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {activeModal === 'deleteConfirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-[28px] border border-rose-500/30 bg-[#0A0E1A] p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-black text-white">Delete Account?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete your PROMPT MASTER PRO account? This action is permanent and cannot be undone. All your saved prompts and settings will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                {isSaving ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
