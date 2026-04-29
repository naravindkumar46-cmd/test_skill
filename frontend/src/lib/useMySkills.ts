import { useState, useEffect } from 'react';
import { SkillCard } from './useSkills';

export interface SkillsResponse {
  skills: SkillCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UseMySkillsOptions {
  page?: number;
  limit?: number;
}

export function useMySkills(options?: UseMySkillsOptions) {
  const [skills, setSkills] = useState<SkillCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    const fetchMySkills = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options?.page) params.append('page', options.page.toString());
        if (options?.limit) params.append('limit', options.limit.toString());

        const response = await fetch(`/api/skills/my-skills?${params}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data: SkillsResponse = await response.json();

        if (!response.ok) {
          const errorMsg = typeof data === 'object' && data !== null && 'error' in data 
            ? (data as any).error 
            : 'Failed to fetch your skills';
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
        console.error('Error fetching your skills:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMySkills();
  }, [options?.page, options?.limit]);

  return { skills, loading, error, pagination };
}
