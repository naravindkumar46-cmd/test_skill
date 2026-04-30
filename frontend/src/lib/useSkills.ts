import { useState, useEffect } from 'react';

export interface SkillCard {
  starterkit_id: string;
  id?: string;
  name: string;
  description: string;
  author: string;
  version: string;
  technology: string[];
  is_approved: boolean;
  is_rejected?: boolean;
  rejection_note?: string | null;
  uploaded_at: string;
  [key: string]: any;
}

export interface SkillsResponse {
  skills: SkillCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseSkillsOptions {
  status?: 'approved' | 'pending' | 'rejected';
  page?: number;
  limit?: number;
  endpoint?: 'marketplace' | 'all';
}

export function useSkills(options?: UseSkillsOptions) {
  const [skills, setSkills] = useState<SkillCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options?.status) params.append('status', options.status);
        if (options?.page) params.append('page', options.page.toString());
        if (options?.limit) params.append('limit', options.limit.toString());

        const endpoint = options?.endpoint === 'marketplace' ? '/api/skills' : '/api/skills/all';
        const response = await fetch(`${endpoint}?${params}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data: SkillsResponse = await response.json();

        if (!response.ok) {
          const errorMsg = typeof data === 'object' && data !== null && 'error' in data 
            ? (data as any).error 
            : 'Failed to fetch skills';
          throw new Error(errorMsg);
        }

        setSkills(data.skills);
        setPagination({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        });
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [options?.status, options?.page, options?.limit, options?.endpoint]);

  return { skills, loading, error, pagination };
}
