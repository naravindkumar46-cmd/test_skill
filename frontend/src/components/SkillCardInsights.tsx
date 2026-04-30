'use client';

type SkillShape = {
  status?: string;
  origin?: { org?: string; sub_org?: string; creator?: string };
  maintainers?: Array<{ name: string; contact: string }>;
  specialization?: { primary?: string; domain_specific?: string[] };
  tasks?: Array<{ name: string; description: string; async: boolean }>;
  supported_harness?: string[];
  documentation?: { readme?: string; howto?: string; changelog?: string };
  rating?: { last_score?: number; grade?: string };
  downloads?: {
    stars?: number;
    total_download_7_days?: number;
    total_download_30_days?: number;
    total_download_overall?: number;
  };
};

export default function SkillCardInsights({ skill }: { skill: SkillShape }) {
  return (
    <section className="rounded-2xl border border-border dark:border-border-dark bg-gradient-to-b from-white/60 to-bg-secondary/60 dark:from-bg-dark-secondary/70 dark:to-bg-dark/70 p-5 space-y-4">
      <h3 className="text-lg font-bold text-text-primary dark:text-text-dark">Skill Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <p><span className="font-semibold">Lifecycle Status: </span>{skill.status || '-'}</p>
        <p><span className="font-semibold">Primary Specialization: </span>{skill.specialization?.primary || '-'}</p>
        <p><span className="font-semibold">Origin Org: </span>{skill.origin?.org || '-'}</p>
        <p><span className="font-semibold">Origin Sub-Org: </span>{skill.origin?.sub_org || '-'}</p>
        <p><span className="font-semibold">Creator: </span>{skill.origin?.creator || '-'}</p>
        <p><span className="font-semibold">Domain Tags: </span>{(skill.specialization?.domain_specific || []).join(', ') || '-'}</p>
      </div>

      {!!skill.maintainers?.length && (
        <div>
          <p className="text-sm font-semibold mb-2">Maintainers</p>
          <div className="flex flex-wrap gap-2">
            {skill.maintainers.map((m, i) => (
              <span key={`${m.name}-${i}`} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                {m.name} ({m.contact})
              </span>
            ))}
          </div>
        </div>
      )}

      {!!skill.tasks?.length && (
        <div>
          <p className="text-sm font-semibold mb-2">Tasks</p>
          <div className="space-y-2">
            {skill.tasks.map((t, i) => (
              <div key={`${t.name}-${i}`} className="p-3 rounded-xl border border-border dark:border-border-dark bg-bg-primary/70 dark:bg-bg-dark/70">
                <p className="font-medium text-sm">{t.name} {t.async ? '(async)' : '(sync)'}</p>
                <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!!skill.supported_harness?.length && (
        <div>
          <p className="text-sm font-semibold mb-2">Supported Harness</p>
          <div className="flex flex-wrap gap-2">
            {skill.supported_harness.map((h) => (
              <span key={h} className="px-2 py-1 rounded-md text-xs bg-secondary/10 text-secondary border border-secondary/20">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {skill.documentation && (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <p><span className="font-semibold">README: </span>{skill.documentation.readme || '-'}</p>
          <p><span className="font-semibold">How-To: </span>{skill.documentation.howto || '-'}</p>
          <p><span className="font-semibold">Changelog: </span>{skill.documentation.changelog || '-'}</p>
        </div>
      )}

      {(skill.rating || skill.downloads) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Rating</p>
            <p className="font-bold">{skill.rating?.last_score ?? '-'}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Grade</p>
            <p className="font-bold">{skill.rating?.grade || '-'}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Stars</p>
            <p className="font-bold">{skill.downloads?.stars ?? '-'}</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Downloads</p>
            <p className="font-bold">{skill.downloads?.total_download_overall ?? '-'}</p>
          </div>
        </div>
      )}
    </section>
  );
}
