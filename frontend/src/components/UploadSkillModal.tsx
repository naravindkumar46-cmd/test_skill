'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function UploadSkillModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { token } = useAuth();
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [formData, setFormData] = useState({ json_schema: '', file_url: '' });
  const [uploadedJsonFile, setUploadedJsonFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const parseSkillJson = async () => {
    if (inputMode === 'upload') {
      if (!uploadedJsonFile) {
        throw new Error('Please upload a JSON file.');
      }
      const fileText = await uploadedJsonFile.text();
      return JSON.parse(fileText);
    }

    if (!formData.json_schema.trim()) {
      throw new Error('Please paste the skill card JSON.');
    }

    return JSON.parse(formData.json_schema);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!formData.file_url.trim()) {
      setErrorMessage('Please provide a GitHub URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const rawJson = await parseSkillJson();
      const skillCardData = rawJson.skill_card || rawJson;

      const response = await fetch('http://localhost:4000/api/skills/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          skill_card: skillCardData,
          file_url: formData.file_url,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data.message);
        onClose();
        setFormData({ json_schema: '', file_url: '' });
        setUploadedJsonFile(null);
        setUploadedFileName('');
        setInputMode('paste');
        setErrorMessage(null);
      } else {
        const errorData = await response.json();
        console.error('Validation Failed:', errorData.error);
        setErrorMessage(`Validation Error: ${JSON.stringify(errorData.error)}`);
      }
    } catch (e: unknown) {
      console.error('Upload failed', e);
      const msg = e instanceof Error ? e.message : 'Invalid JSON format. Please check your input.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      setErrorMessage('Only .json files are supported for skill schema upload.');
      setUploadedJsonFile(null);
      setUploadedFileName('');
      return;
    }

    setErrorMessage(null);
    setUploadedJsonFile(file);
    setUploadedFileName(file.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-border dark:border-border-dark bg-white dark:bg-bg-dark-secondary animate-scale-in flex flex-col"
      >
        <div className="px-6 py-5 border-b border-border dark:border-border-dark bg-gradient-to-r from-primary/10 to-cyan-500/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary dark:text-text-dark">Submit New Skill</h2>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
                Add JSON via paste or file upload, then attach your GitHub URL.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark transition-colors p-2 rounded-lg hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary"
              aria-label="Close modal"
            >
              x
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="inline-flex rounded-lg border border-border dark:border-border-dark p-1 bg-bg-secondary dark:bg-bg-dark">
            <button
              type="button"
              onClick={() => setInputMode('paste')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                inputMode === 'paste'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark'
              }`}
            >
              Paste JSON
            </button>
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                inputMode === 'upload'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark'
              }`}
            >
              Upload JSON File
            </button>
          </div>

          {inputMode === 'paste' ? (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary dark:text-text-dark">Skill Card JSON</label>
              <textarea
                className="w-full h-72 px-4 py-3 rounded-xl bg-bg-secondary dark:bg-bg-dark-secondary border-2 border-border dark:border-border-dark text-text-primary dark:text-text-dark placeholder-text-muted dark:placeholder-text-dark-muted font-mono text-xs focus:border-primary dark:focus:border-primary-dark focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none"
                placeholder='Paste JSON here. You can provide either {"skill_card": {...}} or raw skill object.'
                value={formData.json_schema}
                onChange={(e) => setFormData({ ...formData, json_schema: e.target.value })}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-primary dark:text-text-dark">Upload Skill Card JSON File</label>
              <label className="flex flex-col items-center justify-center w-full p-8 rounded-xl border-2 border-dashed border-border dark:border-border-dark bg-bg-secondary dark:bg-bg-dark-secondary cursor-pointer hover:border-primary transition-colors">
                <span className="text-sm font-medium text-text-primary dark:text-text-dark">Choose a .json file</span>
                <span className="text-xs mt-1 text-text-muted dark:text-text-dark-muted">Max size depends on browser limits</span>
                <input type="file" accept=".json,application/json" className="hidden" onChange={handleFileChange} />
              </label>
              {uploadedFileName && <p className="text-sm text-success font-medium">Selected: {uploadedFileName}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-primary dark:text-text-dark">GitHub MD URL</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-bg-secondary dark:bg-bg-dark-secondary border-2 border-border dark:border-border-dark text-text-primary dark:text-text-dark focus:border-primary dark:focus:border-primary-dark focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none"
              placeholder="https://github.com/your-repo/agent.md"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            />
            <p className="text-xs text-text-muted dark:text-text-dark-muted">This URL is stored as file_url and used for user download/open actions.</p>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3">
              <p className="text-sm text-error">{errorMessage}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border dark:border-border-dark bg-bg-secondary/30 dark:bg-bg-dark/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-text-primary dark:text-text-dark hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="group relative px-6 py-2 rounded-lg font-medium text-white overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg hover:shadow-primary/30 dark:from-primary-dark dark:to-primary-dark/90 transform active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <span className="relative">{isSubmitting ? 'Deploying...' : 'Deploy to Review'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
