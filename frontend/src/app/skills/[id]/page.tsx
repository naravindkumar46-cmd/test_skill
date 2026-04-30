'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkillCardInsights from '@/components/SkillCardInsights';

type SkillDetail = {
  starterkit_id: string;
  name: string;
  description: string;
  author?: string;
  version: string;
  technology?: string[];
  category?: string;
  subcategory?: string;
  uploaded_at?: string;
  documentation?: {
    readme?: string;
    howto?: string;
    changelog?: string;
  };
  origin?: { org?: string; sub_org?: string; creator?: string };
  maintainers?: Array<{ name: string; contact: string }>;
  status?: string;
  specialization?: { primary?: string; domain_specific?: string[] };
  tasks?: Array<{ name: string; description: string; async: boolean }>;
  supported_harness?: string[];
  rating?: { last_score?: number; grade?: string };
  downloads?: {
    stars?: number;
    total_download_7_days?: number;
    total_download_30_days?: number;
    total_download_overall?: number;
  };
  file_url?: string;
};

export default function SkillDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const skillId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);

  useEffect(() => {
    const fetchSkill = async () => {
      if (!skillId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/skills/${skillId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || 'Failed to fetch skill details');
        }

        setSkill(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [skillId]);

  const handleDownload = async () => {
    if (!skill) return;

    try {
      setIsDownloading(true);
      setError(null);

      const response = await fetch(`/api/skills/${skill.starterkit_id}/${skill.version}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ purpose: 'Marketplace detail download' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to record download');
      }

      const downloadUrl = data?.data?.file_url || skill.file_url;
      if (downloadUrl) {
        window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary dark:bg-bg-dark p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/marketplace')}
            className="mb-6 px-4 py-2 rounded-lg border border-border dark:border-border-dark text-text-primary dark:text-text-dark hover:bg-bg-secondary dark:hover:bg-bg-dark-secondary transition-colors"
          >
            Back to Marketplace
          </button>

          {loading && (
            <div className="rounded-xl border border-border dark:border-border-dark bg-bg-secondary dark:bg-bg-dark-secondary p-6">
              <p className="text-text-secondary dark:text-text-dark-secondary">Loading skill details...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-error/30 bg-error/10 p-4 mb-6">
              <p className="text-error font-medium">{error}</p>
            </div>
          )}

          {!loading && skill && (
            <div className="rounded-2xl border border-border dark:border-border-dark bg-bg-secondary dark:bg-bg-dark-secondary p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark">{skill.name}</h1>
                  <p className="text-sm text-text-muted mt-2">
                    ID: {skill.starterkit_id} | Version: {skill.version}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-5 py-2 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold disabled:bg-[#94a3b8] transition-colors"
                >
                  {isDownloading ? 'Downloading...' : 'Download Skill'}
                </button>
              </div>

              <p className="mt-6 text-text-secondary dark:text-text-dark-secondary">{skill.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(skill.technology || []).map((tech) => (
                  <span key={tech} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  <span className="font-semibold text-text-primary dark:text-text-dark">Author: </span>
                  {skill.author?.trim() || 'Unknown author'}
                </p>
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  <span className="font-semibold text-text-primary dark:text-text-dark">Category: </span>
                  {skill.category || '-'}
                </p>
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  <span className="font-semibold text-text-primary dark:text-text-dark">Subcategory: </span>
                  {skill.subcategory || '-'}
                </p>
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  <span className="font-semibold text-text-primary dark:text-text-dark">Uploaded: </span>
                  {skill.uploaded_at ? new Date(skill.uploaded_at).toLocaleDateString() : '-'}
                </p>
              </div>

              <SkillCardInsights skill={skill} />

              <div>
                <p className="font-semibold text-text-primary dark:text-text-dark mb-2">GitHub URL</p>
                {skill.file_url ? (
                  <a
                    href={skill.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {skill.file_url}
                  </a>
                ) : (
                  <p className="text-text-muted">No GitHub URL available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
