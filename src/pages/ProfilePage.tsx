import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks';
import { PageHeader } from '@components/ui/PageHeader';
import { DashboardCard } from '@components/ui/DashboardCard';
import { CTAButton } from '@components/ui/CTAButton';
import {
  useProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
} from '@features/profile/hooks';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Globe,
  Target,
  BarChart3,
  Brain,
  Languages,
  Clock,
  Save,
  Lock,
  Camera,
  Loader2,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

const LEVELS = [
  { value: '', label: 'Select level' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const STYLES = [
  { value: '', label: 'Select style' },
  { value: 'visual', label: 'Visual' },
  { value: 'auditory', label: 'Auditory' },
  { value: 'reading', label: 'Reading' },
  { value: 'kinesthetic', label: 'Kinesthetic' },
];

const LANGUAGES = [
  { value: '', label: 'Select language' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: isProfileLoading } = useProfileQuery(isAuthenticated);
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();

  const [name, setName] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [learningStyle, setLearningStyle] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('');
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(0);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setLearningGoal(profile.learningGoal || '');
      setCurrentLevel(profile.currentLevel || '');
      setLearningStyle(profile.learningStyle || '');
      setPreferredLanguage(profile.preferredLanguage || '');
      setWeeklyStudyHours(profile.weeklyStudyHours || 0);
    }
  }, [profile]);

  const hasChanges =
    profile &&
    (name !== profile.name ||
      learningGoal !== (profile.learningGoal || '') ||
      currentLevel !== (profile.currentLevel || '') ||
      learningStyle !== (profile.learningStyle || '') ||
      preferredLanguage !== (profile.preferredLanguage || '') ||
      weeklyStudyHours !== (profile.weeklyStudyHours || 0));

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      name,
      learningGoal,
      currentLevel: currentLevel || undefined,
      learningStyle: learningStyle || undefined,
      preferredLanguage: preferredLanguage || undefined,
      weeklyStudyHours,
    });
  };

  const handleChangePassword = () => {
    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
        },
      },
    );
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      uploadAvatarMutation.mutate(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const avatarUrl = profile?.avatar || user?.avatar || '';
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString([], {
        year: 'numeric',
        month: 'long',
      })
    : 'N/A';

  const isProfilePending = updateProfileMutation.isPending;
  const isPasswordPending = changePasswordMutation.isPending;
  const isAvatarPending = uploadAvatarMutation.isPending;

  if (isProfileLoading) {
    return (
      <div className="space-y-6 pb-16">
        <PageHeader title="Profile Settings" description="Manage your account profile and preferences." />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <div className="bg-white border border-neutral-200/60 rounded-2xl shadow-sm p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-1/3" />
              <div className="h-4 bg-neutral-100 rounded w-2/3" />
              <div className="h-10 bg-neutral-100 rounded w-full" />
              <div className="h-10 bg-neutral-100 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Profile Settings"
        description="Manage your account profile, learning preferences, and security settings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Details */}
          <DashboardCard title="Profile Details" subtitle="Your personal account information">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-600 font-bold text-xl overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={28} />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={isAvatarPending}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition shadow-sm disabled:opacity-50"
                >
                  {isAvatarPending ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div>
                <p className="font-bold text-neutral-800">{profile?.name || user?.name}</p>
                <p className="text-xs text-neutral-500">{profile?.email || user?.email}</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      disabled
                      value={profile?.email || user?.email || ''}
                      className="block w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Learning Goal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Target size={16} />
                  </div>
                  <input
                    type="text"
                    value={learningGoal}
                    onChange={(e) => setLearningGoal(e.target.value)}
                    placeholder="e.g., Become proficient in machine learning"
                    className="block w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Current Level
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <BarChart3 size={16} />
                    </div>
                    <select
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value)}
                      className="block w-full pl-9 pr-8 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all appearance-none"
                    >
                      {LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Learning Style
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Brain size={16} />
                    </div>
                    <select
                      value={learningStyle}
                      onChange={(e) => setLearningStyle(e.target.value)}
                      className="block w-full pl-9 pr-8 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all appearance-none"
                    >
                      {STYLES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Languages size={16} />
                    </div>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="block w-full pl-9 pr-8 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all appearance-none"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Weekly Study Hours
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Clock size={16} />
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={168}
                      value={weeklyStudyHours}
                      onChange={(e) => setWeeklyStudyHours(parseInt(e.target.value) || 0)}
                      className="block w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                {hasChanges && (
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <Save size={12} />
                    Unsaved changes
                  </span>
                )}
                <div className="ml-auto" />
                <CTAButton
                  type="submit"
                  variant="primary"
                  disabled={!hasChanges || isProfilePending}
                >
                  {isProfilePending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </CTAButton>
              </div>
            </form>
          </DashboardCard>

          {/* Change Password */}
          <DashboardCard title="Change Password" subtitle="Update your account password">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="block w-full pl-9 pr-10 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-9 pr-10 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end">
                <CTAButton
                  type="submit"
                  variant="secondary"
                  disabled={!currentPassword || !newPassword || isPasswordPending}
                >
                  {isPasswordPending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Changing...
                    </span>
                  ) : (
                    'Change Password'
                  )}
                </CTAButton>
              </div>
            </form>
          </DashboardCard>

          {/* Danger Zone */}
          <DashboardCard title="Account Actions">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Sign Out</p>
                  <p className="text-xs text-neutral-500">Log out of your account on this device</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 bg-white border border-neutral-200 px-4 py-2 rounded-xl hover:bg-neutral-50 hover:text-red-600 transition-all"
                >
                  <LogOut size={14} />
                  Log Out
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardCard title="Account Overview">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Member Since
                </span>
                <span className="font-semibold text-neutral-700">{memberSince}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span className="flex items-center gap-2">
                  <Shield size={16} />
                  Role
                </span>
                <span className="font-semibold text-neutral-700 capitalize">
                  {profile?.role || user?.role || 'user'}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-500">
                <span className="flex items-center gap-2">
                  <Globe size={16} />
                  Provider
                </span>
                <span className="font-semibold text-neutral-700 capitalize">
                  {profile?.provider || 'local'}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-500 pt-2 border-t border-neutral-50">
                <span>Verification Status</span>
                <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Learning Summary">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Goal</p>
                <p className="font-semibold text-neutral-700 mt-0.5">
                  {profile?.learningGoal || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Level</p>
                <p className="font-semibold text-neutral-700 mt-0.5 capitalize">
                  {profile?.currentLevel || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Style</p>
                <p className="font-semibold text-neutral-700 mt-0.5 capitalize">
                  {profile?.learningStyle || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Weekly Hours</p>
                <p className="font-semibold text-neutral-700 mt-0.5">
                  {profile?.weeklyStudyHours || 0} hrs/week
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
