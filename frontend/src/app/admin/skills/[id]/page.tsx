'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkillCardInsights from '@/components/SkillCardInsights';

type SkillDetail = {
  starterkit_id: string;
  name: string;
  description: string;
  version: string;
  file_url?: string;
  technology?: string[];
  author?: string;
  uploaded_at?: string;
  is_approved: boolean;
  is_rejected: boolean;
  rejection_note?: string | null;
  origin?: { org?: string; sub_org?: string; creator?: string };
  maintainers?: Array<{ name: string; contact: string }>;
  status?: string;
  specialization?: { primary?: string; domain_specific?: string[] };
  tasks?: Array<{ name: string; description: string; async: boolean }>;
  documentation?: { readme?: string; howto?: string; changelog?: string };
  supported_harness?: string[];
  rating?: { last_score?: number; grade?: string };
  downloads?: {
    last_downloaded?: string;
    total_download_7_days?: number;
    total_download_30_days?: number;
    total_download_overall?: number;
    stars?: number;
  };
  moderation_history?: Array<{
    actor_role: 'ADMIN' | 'USER';
    actor_id: string;
    action: 'REJECTED' | 'APPROVED' | 'RESUBMITTED';
    comment: string;
    at: string;
  }>;
  [key: string]: unknown;
};

export default function AdminSkillReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const skillId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);

  const loadSkill = async () => {
    if (!skillId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/skills/${skillId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Failed to fetch skill');
      setSkill(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkill();
  }, [skillId]);

  const approveSkill = async () => {
    if (!skill) return;
    try {
      setActionLoading(true);
      setError(null);
      setMessage(null);
      const response = await fetch(`/api/admin/skills/${skill.starterkit_id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notes: approvalNote }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Failed to approve skill');
      setMessage('Skill approved successfully.');
      setApprovalNote('');
      await loadSkill();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const rejectSkill = async () => {
    if (!skill) return;
    if (!rejectionReason.trim()) {
      setError('Rejection reason is required.');
      return;
    }

    try {
      setActionLoading(true);
      setError(null);
      setMessage(null);
      const response = await fetch(`/api/admin/skills/${skill.starterkit_id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Failed to reject skill');
      setMessage('Skill rejected successfully.');
      await loadSkill();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const resetDecision = async () => {
    if (!skill) return;
    try {
      setActionLoading(true);
      setError(null);
      setMessage(null);
      const response = await fetch(`/api/admin/skills/${skill.starterkit_id}/reset-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Failed to reset decision');
      setMessage('Decision reset. Skill is pending review now.');
      setRejectionReason('');
      await loadSkill();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset decision');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-bg-primary dark:bg-bg-dark p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 rounded-lg border border-border dark:border-border-dark text-text-primary dark:text-text-dark hover:bg-bg-secondary dark:hover:bg-bg-dark-secondary transition-colors"
          >
            Back to Admin Console
          </button>

          {loading && <p className="text-text-secondary dark:text-text-dark-secondary">Loading skill card...</p>}
          {error && <p className="text-error font-medium">{error}</p>}
          {message && <p className="text-success font-medium">{message}</p>}

          {!loading && skill && (
            <div className="rounded-2xl border border-border dark:border-border-dark bg-bg-secondary dark:bg-bg-dark-secondary p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark">{skill.name}</h1>
                  <p className="text-sm text-text-muted mt-1">
                    {skill.starterkit_id} | v{skill.version}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    skill.is_rejected
                      ? 'bg-error/20 text-error border-error/30'
                      : skill.is_approved
                      ? 'bg-success/20 text-success border-success/30'
                      : 'bg-warning/20 text-warning border-warning/30'
                  }`}
                >
                  {skill.is_rejected ? 'Rejected' : skill.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>

              <p className="text-text-secondary dark:text-text-dark-secondary">{skill.description}</p>

              <div className="flex flex-wrap gap-2">
                {(skill.technology || []).map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  <span className="font-semibold text-text-primary dark:text-text-dark">Author: </span>
                  {skill.author || 'Unknown author'}
                </p>
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  <span className="font-semibold text-text-primary dark:text-text-dark">Uploaded: </span>
                  {skill.uploaded_at ? new Date(skill.uploaded_at).toLocaleString() : '-'}
                </p>
              </div>

              <SkillCardInsights skill={skill} />

              {skill.file_url && (
                <div>
                  <p className="font-semibold text-text-primary dark:text-text-dark mb-1">Skill URL</p>
                  <a
                    href={skill.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {skill.file_url}
                  </a>
                </div>
              )}

              {!!skill.moderation_history?.length && (
                <div className="rounded-xl border border-border dark:border-border-dark p-4 space-y-2">
                  <p className="font-semibold text-text-primary dark:text-text-dark">Review Conversation Timeline</p>
                  {[...skill.moderation_history].reverse().map((entry, idx) => (
                    <div key={`${entry.at}-${idx}`} className="text-sm">
                      <p className="font-medium text-text-primary dark:text-text-dark">
                        {entry.actor_role} - {entry.action} - {new Date(entry.at).toLocaleString()}
                      </p>
                      <p className="text-text-secondary dark:text-text-dark-secondary">{entry.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <p className="font-semibold text-text-primary dark:text-text-dark mb-2">Full Skill Card JSON</p>
                <pre className="text-xs rounded-lg p-4 overflow-auto bg-bg-primary dark:bg-bg-dark border border-border dark:border-border-dark text-text-primary dark:text-text-dark">
                  {JSON.stringify(skill, null, 2)}
                </pre>
              </div>

              <div className="rounded-xl border border-border dark:border-border-dark p-4 space-y-3">
                <p className="font-semibold text-text-primary dark:text-text-dark">Review Actions</p>

                <textarea
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Optional note when approving (what changed/why approved)."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-bg-primary dark:bg-bg-dark border border-border dark:border-border-dark text-text-primary dark:text-text-dark"
                />

                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Required when rejecting: explain why this skill should be rejected."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-bg-primary dark:bg-bg-dark border border-border dark:border-border-dark text-text-primary dark:text-text-dark"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={approveSkill}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold disabled:bg-[#94a3b8] transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={rejectSkill}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-lg bg-error hover:brightness-110 text-white font-semibold disabled:bg-[#94a3b8] transition-colors"
                  >
                    Reject (Reason Required)
                  </button>
                  <button
                    onClick={resetDecision}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-semibold disabled:bg-[#94a3b8] transition-colors"
                  >
                    Reset Decision
                  </button>
                </div>

                {skill.is_rejected && skill.rejection_note && (
                  <p className="text-sm text-error">
                    Current rejection reason: {skill.rejection_note}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
