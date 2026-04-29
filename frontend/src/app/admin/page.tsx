'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useSkills } from '@/lib/useSkills';
import { useSkillActions } from '@/lib/useSkillActions';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const { approveSkill, rejectSkill, loading: actionLoading } = useSkillActions();
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [rejectingSkillId, setRejectingSkillId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { skills, loading, error, pagination } = useSkills({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 20,
  });

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

  const handleApprove = async (skillId: string) => {
    try {
      await approveSkill(skillId);
      setSuccessMessage(`Skill approved successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
      // Refresh skills list
      window.location.reload();
    } catch (err) {
      console.error('Error approving skill:', err);
    }
  };

  const handleRejectSubmit = async (skillId: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      await rejectSkill(skillId, rejectReason);
      setSuccessMessage(`Skill rejected successfully!`);
      setRejectingSkillId(null);
      setRejectReason('');
      setTimeout(() => setSuccessMessage(null), 3000);
      // Refresh skills list
      window.location.reload();
    } catch (err) {
      console.error('Error rejecting skill:', err);
    }
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-bg-primary dark:bg-bg-dark transition-colors duration-300 flex flex-col">
        {/* Header */}
        <nav className="bg-bg-secondary dark:bg-bg-dark-secondary border-b border-border dark:border-border-dark px-6 py-4 sticky top-0 z-40 shadow-light dark:shadow-light-dark">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-primary px-3 py-1 rounded-lg text-white font-bold text-sm">ADMIN</span>
              <h1 className="text-xl font-bold text-text-primary dark:text-text-dark">
                Skill Management Console
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/marketplace')}
                className="px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark transition-colors"
              >
                View Marketplace
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
              All Skills
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary">
              Review and manage all submitted skills ({pagination.total} total)
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-success/10 border border-success/30 text-success rounded-xl p-4 mb-6 flex items-center gap-3">
              <span>✓</span>
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

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
              <p className="font-medium">Error loading skills</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Skills Grid */}
          {!loading && skills.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border dark:border-border-dark rounded-3xl opacity-40">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg font-medium text-text-secondary dark:text-text-dark-secondary">
                No {statusFilter !== 'all' ? statusFilter : ''} skills found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.starterkit_id}
                  className="bg-bg-secondary dark:bg-bg-dark-secondary border border-border dark:border-border-dark rounded-xl p-6 hover:shadow-medium dark:hover:shadow-light-dark transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-text-primary dark:text-text-dark">
                          {skill.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(skill.is_approved, skill.is_rejected)}`}>
                          {getStatusLabel(skill.is_approved, skill.is_rejected)}
                        </span>
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
                        <span>By {skill.author}</span>
                        <span>v{skill.version}</span>
                        <span>{new Date(skill.uploaded_at).toLocaleDateString()}</span>
                      </div>
                      {skill.is_rejected && skill.rejection_note && (
                        <div className="mt-3 p-3 bg-error/10 border border-error/30 rounded-lg">
                          <p className="text-xs font-medium text-error">Rejection Reason:</p>
                          <p className="text-xs text-error/80 mt-1">{skill.rejection_note}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    {!skill.is_approved && !skill.is_rejected ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleApprove(skill.starterkit_id)}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-success text-white font-medium rounded-lg hover:brightness-110 disabled:opacity-50 transition-all whitespace-nowrap"
                        >
                          {actionLoading ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => setRejectingSkillId(skill.starterkit_id)}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-error text-white font-medium rounded-lg hover:brightness-110 disabled:opacity-50 transition-all whitespace-nowrap"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
                        onClick={() => router.push(`/admin/skills/${skill.starterkit_id}`)}
                      >
                        View
                      </button>
                    )}
                  </div>

                  {/* Rejection Form */}
                  {rejectingSkillId === skill.starterkit_id && (
                    <div className="mt-4 p-4 bg-bg-primary dark:bg-bg-dark rounded-lg border border-border dark:border-border-dark">
                      <label className="block text-sm font-medium text-text-primary dark:text-text-dark mb-2">
                        Rejection Reason
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain why this skill is being rejected..."
                        className="w-full px-3 py-2 bg-bg-secondary dark:bg-bg-dark-secondary border border-border dark:border-border-dark rounded-lg text-text-primary dark:text-text-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary mb-3 text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectSubmit(skill.starterkit_id)}
                          disabled={actionLoading || !rejectReason.trim()}
                          className="px-4 py-2 bg-error text-white font-medium rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
                        >
                          {actionLoading ? '...' : 'Submit Rejection'}
                        </button>
                        <button
                          onClick={() => {
                            setRejectingSkillId(null);
                            setRejectReason('');
                          }}
                          className="px-4 py-2 bg-text-secondary/20 text-text-secondary font-medium rounded-lg hover:bg-text-secondary/30 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Info */}
          {!loading && skills.length > 0 && (
            <div className="mt-8 text-center text-text-secondary dark:text-text-dark-secondary text-sm">
              Showing {skills.length} of {pagination.total} skills
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}