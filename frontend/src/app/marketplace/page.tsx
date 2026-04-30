'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import UploadSkillModal from '@/components/UploadSkillModal';
import { useSkills } from '@/lib/useSkills';

export default function MarketplacePage() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch only approved skills for the marketplace
  const { skills, loading, error } = useSkills({
    endpoint: 'marketplace',
    limit: 20,
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary dark:bg-bg-dark transition-colors duration-300 flex flex-col">
        
        {/* Header - Styled per Doc 03 & 06 */}
        <nav className="bg-bg-secondary dark:bg-bg-dark-secondary border-b border-border dark:border-border-dark px-6 py-4 sticky top-0 z-40 shadow-light dark:shadow-light-dark">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-text-primary dark:text-text-dark tracking-tight">
                Skill<span className="text-primary">Market</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Conditional Action Button based on Role */}
              {user?.role === 'USER' ? (
                <>
                  <button 
                    onClick={() => router.push('/my-skills')}
                    className="px-4 py-2 text-sm font-medium text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark transition-colors"
                  >
                    My Skills
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="group relative px-5 py-2 bg-primary text-white font-bold rounded-lg 
                               hover:shadow-medium transition-all active:scale-95 overflow-hidden"
                  >
                     {/* Shimmer Effect from Doc 05 */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    <span className="relative flex items-center gap-2">
                      <span className="text-lg leading-none">+</span> Upload Skill
                    </span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => router.push('/admin')}
                  className="px-5 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-all"
                >
                  Admin Console
                </button>
              )}

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

        {/* Main Layout Area */}
        <main className="max-w-7xl mx-auto w-full p-8 flex-1">
          <header className="mb-10">
            <h2 className="text-3xl font-bold text-text-primary dark:text-text-dark">Community Skills</h2>
            <p className="text-text-secondary dark:text-text-dark-secondary mt-1">
              {user?.role === 'ADMIN' 
                ? "You are viewing the marketplace as an Administrator." 
                : "Explore and deploy verified AI agent architecture patterns."}
            </p>
          </header>

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
            <div className="lg:col-span-3 py-20 flex flex-col items-center justify-center border-2 border-dashed border-border dark:border-border-dark rounded-3xl opacity-40">
              <div className="text-5xl mb-4">📥</div>
              <p className="text-lg font-medium text-text-secondary dark:text-text-dark-secondary">
                No verified skills available yet.
              </p>
              {user?.role === 'USER' && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-primary font-bold hover:underline"
                >
                  Upload your first skill card →
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skill) => (
                <div
                  key={skill.starterkit_id}
                  className="bg-gradient-to-b from-white to-bg-secondary dark:from-bg-dark-secondary dark:to-bg-dark border border-border dark:border-border-dark rounded-2xl p-6 hover:shadow-medium dark:hover:shadow-light-dark hover:border-primary/50 transition-all group cursor-pointer"
                  onClick={() => router.push(`/skills/${skill.starterkit_id}`)}
                >
                  {/* Header with Status Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-text-primary dark:text-text-dark group-hover:text-primary transition-colors flex-1">
                      {skill.name}
                    </h3>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-success/20 text-success border border-success/30 ml-2 whitespace-nowrap">
                      Approved
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-text-secondary dark:text-text-dark-secondary text-sm mb-4 line-clamp-2">
                    {skill.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skill.technology?.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary dark:bg-primary/20 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {skill.technology && skill.technology.length > 3 && (
                      <span className="px-2 py-1 text-xs text-text-muted">
                        +{skill.technology.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border-dark text-xs text-text-muted">
                    <span>{skill.author?.trim() || 'Unknown author'}</span>
                    <span>v{skill.version}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* The Modal */}
        <UploadSkillModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </ProtectedRoute>
  );
}
