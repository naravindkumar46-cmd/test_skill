'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkillCardInsights from '@/components/SkillCardInsights';

type MySkillDetail = {
  starterkit_id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  technology?: string[];
  uploaded_at?: string;
  file_url?: string;
  is_approved: boolean;
  is_rejected: boolean;
  rejection_note?: string | null;
  uploaded_by?: string;
  approved_by?: string | null;
  approved_at?: string | null;
  rejected_by?: string | null;
  rejected_at?: string | null;
  category?: string;
  subcategory?: string;
  moderation_history?: Array<{
    actor_role: 'ADMIN' | 'USER';
    actor_id: string;
    action: 'REJECTED' | 'APPROVED' | 'RESUBMITTED';
    comment: string;
    at: string;
  }>;
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
};

export default function MySkillDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [skill, setSkill] = useState<MySkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [jsonDraft, setJsonDraft] = useState('');
  const [fileUrlDraft, setFileUrlDraft] = useState('');
  const [userCommentDraft, setUserCommentDraft] = useState('');

  const skillId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);

  useEffect(() => {
    const fetchSkill = async () => {
      if (!skillId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/skills/my-skills/${skillId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Failed to fetch skill details');
        setSkill(data);
        const {
          uploaded_by,
          uploaded_at,
          file_url,
          is_approved,
          is_rejected,
          approved_by,
          approved_at,
          rejected_by,
          rejected_at,
          rejection_note,
          category,
          subcategory,
          ...skillCardOnly
        } = data;

        setJsonDraft(JSON.stringify(skillCardOnly, null, 2));
        setFileUrlDraft(file_url || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [skillId]);

  const statusLabel = skill?.is_rejected ? 'Rejected' : skill?.is_approved ? 'Approved' : 'Pending';
  const statusClass = skill?.is_rejected
    ? 'bg-error/20 text-error border-error/30'
    : skill?.is_approved
    ? 'bg-success/20 text-success border-success/30'
    : 'bg-warning/20 text-warning border-warning/30';

  const handleSave = async () => {
    if (!skill) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const parsed = JSON.parse(jsonDraft);
      if (skill.is_rejected && !userCommentDraft.trim()) {
        throw new Error('Please explain what you changed before resubmitting a rejected skill.');
      }
      const response = await fetch(`/api/skills/my-skills/${skill.starterkit_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          skill_card: parsed,
          file_url: fileUrlDraft,
          user_comment: userCommentDraft,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const msg = typeof data?.error === 'string' ? data.error : 'Failed to update skill';
        throw new Error(msg);
      }

      setSuccess('Skill updated. It is now pending admin approval again.');
      setIsEditing(false);
      setUserCommentDraft('');
      await (async () => {
        const refetch = await fetch(`/api/skills/my-skills/${skill.starterkit_id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const refreshed = await refetch.json();
        if (refetch.ok) {
          setSkill(refreshed);
          const {
            uploaded_by,
            uploaded_at,
            file_url,
            is_approved,
            is_rejected,
            approved_by,
            approved_at,
            rejected_by,
            rejected_at,
            rejection_note,
            category,
            subcategory,
            ...skillCardOnly
          } = refreshed;
          setJsonDraft(JSON.stringify(skillCardOnly, null, 2));
          setFileUrlDraft(file_url || '');
        }
      })();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update skill');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="USER">
      <div className="min-h-screen bg-bg-primary dark:bg-bg-dark p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/my-skills')}
            className="mb-6 px-4 py-2 rounded-lg border border-border dark:border-border-dark text-text-primary dark:text-text-dark hover:bg-bg-secondary dark:hover:bg-bg-dark-secondary transition-colors"
          >
            Back to My Skills
          </button>

          {loading && <p className="text-text-secondary dark:text-text-dark-secondary">Loading skill details...</p>}
          {error && <p className="text-error font-medium">{error}</p>}
          {success && <p className="text-success font-medium">{success}</p>}

          {!loading && skill && (
            <div className="rounded-2xl border border-border dark:border-border-dark bg-bg-secondary dark:bg-bg-dark-secondary p-6 md:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark">{skill.name}</h1>
                  <p className="text-sm text-text-muted mt-1">{skill.starterkit_id} | v{skill.version}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}>{statusLabel}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsEditing((v) => !v)}
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Skill'}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold disabled:bg-[#94a3b8] transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
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
                  {skill.author?.trim() || 'Unknown author'}
                </p>
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  <span className="font-semibold text-text-primary dark:text-text-dark">Uploaded: </span>
                  {skill.uploaded_at ? new Date(skill.uploaded_at).toLocaleString() : '-'}
                </p>
              </div>

              <SkillCardInsights skill={skill} />

              {skill.is_rejected && skill.rejection_note && (
                <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
                  <p className="text-sm font-semibold text-error">Rejection Reason</p>
                  <p className="text-sm text-error/80 mt-1">{skill.rejection_note}</p>
                </div>
              )}

              {!!skill.moderation_history?.length && (
                <div className="p-3 rounded-lg border border-border dark:border-border-dark bg-bg-primary dark:bg-bg-dark">
                  <p className="text-sm font-semibold text-text-primary dark:text-text-dark mb-2">Review Timeline</p>
                  <div className="space-y-2">
                    {[...skill.moderation_history].reverse().map((entry, index) => (
                      <div key={`${entry.at}-${index}`} className="text-xs">
                        <p className="font-semibold text-text-primary dark:text-text-dark">
                          {entry.actor_role} - {entry.action} - {new Date(entry.at).toLocaleString()}
                        </p>
                        <p className="text-text-secondary dark:text-text-dark-secondary">{entry.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="font-semibold text-text-primary dark:text-text-dark mb-1">Skill URL</p>
                {skill.file_url ? (
                  <a href={skill.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                    {skill.file_url}
                  </a>
                ) : (
                  <p className="text-text-muted">No URL available.</p>
                )}
              </div>

              {isEditing && (
                <div className="space-y-3 rounded-xl border border-border dark:border-border-dark p-4">
                  <p className="font-semibold text-text-primary dark:text-text-dark">
                    Edit Skill Card
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-dark-muted">
                    You can edit in any status. Saving will reset this skill to pending for admin re-approval.
                  </p>
                  {skill.is_rejected && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary dark:text-text-dark mb-1">
                        What did you change to address admin rejection? (Required)
                      </label>
                      <textarea
                        value={userCommentDraft}
                        onChange={(e) => setUserCommentDraft(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-bg-primary dark:bg-bg-dark border border-border dark:border-border-dark text-text-primary dark:text-text-dark"
                        placeholder="Describe the fixes/changes you made based on the rejection feedback."
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-dark mb-1">
                      Skill URL
                    </label>
                    <input
                      value={fileUrlDraft}
                      onChange={(e) => setFileUrlDraft(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-bg-primary dark:bg-bg-dark border border-border dark:border-border-dark text-text-primary dark:text-text-dark"
                      placeholder="https://github.com/org/repo/blob/main/AGENT.md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-dark mb-1">
                      Skill Card JSON
                    </label>
                    <textarea
                      value={jsonDraft}
                      onChange={(e) => setJsonDraft(e.target.value)}
                      rows={16}
                      className="w-full px-3 py-2 rounded-lg bg-bg-primary dark:bg-bg-dark border border-border dark:border-border-dark text-text-primary dark:text-text-dark font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
