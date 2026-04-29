'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function UploadSkillModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ json_schema: '', file_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.json_schema || !formData.file_url) {
      alert("Please provide both the JSON schema and the File URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Parse the local JSON from the textarea
      const rawJson = JSON.parse(formData.json_schema);
      
      // 2. Extract the actual card data 
      // This handles cases where the user pastes { "skill_card": { ... } } 
      // OR just the raw { starterkit_id: ... }
      const skillCardData = rawJson.skill_card || rawJson;

      const response = await fetch('http://localhost:4000/api/skills/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          // MUST MATCH BACKEND 'UploadSchema' KEYS:
          skill_card: skillCardData,
          file_url: formData.file_url
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data.message);
        onClose();
        // Reset form on success
        setFormData({ json_schema: '', file_url: '' });
      } else {
        // Capture the 422 error detail to see exactly what failed
        const errorData = await response.json();
        console.error("Validation Failed:", errorData.error);
        alert(`Validation Error: ${JSON.stringify(errorData.error)}`);
      }
    } catch (e) {
      console.error("Upload failed", e);
      alert("Invalid JSON format. Please check your syntax.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop with blur per Doc 05 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Content Panel - Glass Strong variant from Doc 13 */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden 
                    glass-strong rounded-2xl shadow-2xl border border-border dark:border-border-dark 
                    animate-scale-in flex flex-col">
        
        {/* Header per Doc 05 Pattern */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-border-dark">
          <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark">
            Submit New Skill
          </h2>
          <button 
            onClick={onClose}
            className="text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark 
                       transition-colors p-1 rounded-lg hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-primary dark:text-text-dark">
              Skill Card JSON
            </label>
            <textarea 
              className="w-full h-64 px-4 py-3 rounded-lg bg-bg-secondary dark:bg-bg-dark-secondary 
                         border-2 border-border dark:border-border-dark text-text-primary dark:text-text-dark 
                         placeholder-text-muted dark:placeholder-text-dark-muted font-mono text-xs
                         focus:border-primary dark:focus:border-primary-dark focus:ring-4 focus:ring-primary/10 
                         transition-all duration-300 outline-none"
              placeholder='Paste your JSON schema here...'
              value={formData.json_schema}
              onChange={(e) => setFormData({...formData, json_schema: e.target.value})}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-primary dark:text-text-dark">
              GitHub MD URL
            </label>
            <input 
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-bg-secondary dark:bg-bg-dark-secondary 
                         border-2 border-border dark:border-border-dark text-text-primary dark:text-text-dark
                         focus:border-primary dark:focus:border-primary-dark focus:ring-4 focus:ring-primary/10 
                         transition-all duration-300 outline-none"
              placeholder="https://github.com/your-repo/agent.md"
              value={formData.file_url}
              onChange={(e) => setFormData({...formData, file_url: e.target.value})}
            />
          </div>
        </div>

        {/* Footer with Primary Gradient Button + Shimmer from Doc 05 */}
        <div className="flex justify-end gap-3 p-6 border-t border-border dark:border-border-dark bg-bg-secondary/30">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-text-primary dark:text-text-dark hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary transition-all"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="group relative px-6 py-2 rounded-lg font-medium text-white overflow-hidden
                       bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg hover:shadow-primary/30 
                       dark:from-primary-dark dark:to-primary-dark/90 transform active:scale-95 transition-all
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Shimmer Effect child span from Doc 05 */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            
            <span className="relative">
              {isSubmitting ? "Deploying..." : "Deploy to Review"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}