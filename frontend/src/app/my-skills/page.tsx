'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useMySkills } from '@/lib/useMySkills';

export default function MySkillsPage() {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  // Fetch user's own skills
  const { skills: allSkills, loading, error } = useMySkills({
    limit: 50,
  });

  // Filter to only user's skills (this is already done on backend, but just in case)
  const skills = allSkills;

  const getStatusColor = (isApproved: boolean, isRejected: boolean) => {
    if (isRejected) return 'bg-error/20 text-error border-error/30';
    if (isApproved) return 'bg-success/20 text-success border-success/30';
    return 'bg-warning/20 text-warning border-warning/30';
  };

  const getStatusLabel = (isApproved: boolean, isRejected: boolean) => {
    if (isRejected) return 'Rejected';
    if (isApproved) return 'Approved';
    return 'Pending';
  };

  const getStatusIcon = (isApproved: boolean, isRejected: boolean) => {
    if (isRejected) return '✗';
    if (isApproved) return '✓';
    return '⏳';
  };

  const filteredSkills = skills.filter(skill => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'approved') return skill.is_approved;
    if (statusFilter === 'pending') return !skill.is_approved && !skill.is_rejected;
    if (statusFilter === 'rejected') return skill.is_rejected;
    return true;
  });

  return (
    <ProtectedRoute requiredRole="USER">
      <div className="min-h-screen bg-bg-primary dark:bg-bg-dark transition-colors duration-300 flex flex-col">
        {/* Header */}
        <nav className="bg-bg-secondary dark:bg-bg-dark-secondary border-b border-border dark:border-border-dark px-6 py-4 sticky top-0 z-40 shadow-light dark:shadow-light-dark">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-text-primary dark:text-text-dark">
                My<span className="text-primary">Skills</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/marketplace')}
                className="px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark transition-colors"
              >
                Marketplace
              </button>
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-lg border border-border dark:border-border-dark text-text-primary dark:text-text-dark hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary transition-colors"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={logout} 
                className="bg-error text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-110 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto w-full p-8 flex-1">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary dark:text-text-dark mb-2">
              Your Uploaded Skills
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary">
              Track the status of all skills you've uploaded ({skills.length} total)
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border dark:border-border-dark">
            {(['all', 'approved', 'pending', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors capitalize ${
                  statusFilter === tab
                    ? 'text-primary border-primary'
                    : 'text-text-secondary dark:text-text-dark-secondary border-transparent hover:text-text-primary dark:hover:text-text-dark'
                }`}
              >
                {tab === 'all' ? 'All Skills' : `${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
                {skills.length > 0 && (
                  <span className="ml-2 text-xs opacity-75">
                    ({tab === 'all' ? skills.length : skills.filter(s => {
                      if (tab === 'approved') return s.is_approved;
                      if (tab === 'pending') return !s.is_approved && !s.is_rejected;
                      if (tab === 'rejected') return s.is_rejected;
                      return false;
                    }).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-error/10 border border-error/30 text-error rounded-xl p-4 mb-6">
              <p className="font-medium">Error loading your skills</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && skills.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border dark:border-border-dark rounded-3xl opacity-40">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg font-medium text-text-secondary dark:text-text-dark-secondary">
                You haven't uploaded any skills yet.
              </p>
              <button 
                onClick={() => router.push('/marketplace')}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Go to marketplace to upload →
              </button>
            </div>
          )}

          {/* Skills List */}
          {!loading && filteredSkills.length === 0 && skills.length > 0 ? (
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border dark:border-border-dark rounded-3xl opacity-40">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium text-text-secondary dark:text-text-dark-secondary">
                No {statusFilter !== 'all' ? statusFilter : ''} skills found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.starterkit_id}
                  className="bg-gradient-to-b from-white to-bg-secondary dark:from-bg-dark-secondary dark:to-bg-dark border border-border dark:border-border-dark rounded-2xl p-6 hover:shadow-medium dark:hover:shadow-light-dark transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">
                          {getStatusIcon(skill.is_approved, skill.is_rejected)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-text-primary dark:text-text-dark">
                            {skill.name}
                          </h3>
                          <span className={`text-xs font-bold border rounded-full px-2 py-1 ${getStatusColor(skill.is_approved, skill.is_rejected)}`}>
                            {getStatusLabel(skill.is_approved, skill.is_rejected)}
                          </span>
                        </div>
                      </div>

                      <p className="text-text-secondary dark:text-text-dark-secondary mb-3">
                        {skill.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {skill.technology?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs bg-primary/10 text-primary dark:bg-primary/20 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span>v{skill.version}</span>
                        <span>Uploaded {new Date(skill.uploaded_at).toLocaleDateString()}</span>
                      </div>

                      {/* Approval Info */}
                      <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                        {skill.is_approved && skill.approved_at && (
                          <div className="p-2 bg-success/10 border border-success/30 rounded">
                            <p className="text-success font-medium">Approved</p>
                            <p className="text-success/80">{new Date(skill.approved_at).toLocaleDateString()}</p>
                          </div>
                        )}
                        {skill.is_rejected && skill.rejection_note && (
                          <div className="p-2 bg-error/10 border border-error/30 rounded">
                            <p className="text-error font-medium">Rejection Reason</p>
                            <p className="text-error/80 mt-1">{skill.rejection_note}</p>
                          </div>
                        )}
                        {!skill.is_approved && !skill.is_rejected && (
                          <div className="p-2 bg-warning/10 border border-warning/30 rounded col-span-2">
                            <p className="text-warning font-medium">Under Review</p>
                            <p className="text-warning/80 text-xs">Your skill is being reviewed by our admin team. You'll be notified once a decision is made.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/my-skills/${skill.starterkit_id}`)}
                      className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap h-fit"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
