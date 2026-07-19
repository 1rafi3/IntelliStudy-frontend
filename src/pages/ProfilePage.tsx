import React from 'react';
import { useAuth } from '@features/auth/hooks';
import { PageHeader } from '@components/ui/PageHeader';
import { DashboardCard } from '@components/ui/DashboardCard';
import { CTAButton } from '@components/ui/CTAButton';
import { User, Mail, Shield, Calendar, Globe } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile Update — settings saving integration coming in next phase!');
  };

  return (
    <div className="space-y-lg">
      <PageHeader 
        title="Profile Settings" 
        description="Manage your account profile details, security preferences, and integration settings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Profile Card Form */}
        <div className="lg:col-span-8">
          <DashboardCard title="Profile Details" subtitle="Your personal account information">
            <form onSubmit={handleSave} className="space-y-md mt-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-neutral-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      disabled
                      value={user?.name || ''}
                      className="block w-full pl-lg pr-md py-sm bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-neutral-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="block w-full pl-lg pr-md py-sm bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-xs">
                {/* Role */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                    Account Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-neutral-400">
                      <Shield size={16} />
                    </div>
                    <input
                      type="text"
                      disabled
                      value={user?.role || 'user'}
                      className="block w-full pl-lg pr-md py-sm bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-600 focus:outline-none capitalize"
                    />
                  </div>
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                    Auth Provider
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-neutral-400">
                      <Globe size={16} />
                    </div>
                    <input
                      type="text"
                      disabled
                      value="Local Credentials (JWT)"
                      className="block w-full pl-lg pr-md py-sm bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-sm border-t border-neutral-100 flex justify-end">
                <CTAButton type="submit" variant="primary">
                  Save Changes
                </CTAButton>
              </div>
            </form>
          </DashboardCard>
        </div>

        {/* Sidebar Info Card */}
        <div className="lg:col-span-4 space-y-md">
          <DashboardCard title="Account Overview">
            <div className="space-y-sm text-sm mt-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="flex items-center gap-xs">
                  <Calendar size={16} /> Member Since
                </span>
                <span className="font-semibold text-neutral-700">July 2026</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500 pt-2xs border-t border-neutral-50">
                <span>Verification Status</span>
                <span className="font-semibold text-green-600 bg-green-50 px-2xs py-3xs rounded text-xs">Verified</span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
