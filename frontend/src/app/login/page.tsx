'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface FormErrors {
  userId?: string;
  password?: string;
  submit?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate user ID
    if (!userId) {
      newErrors.userId = 'User ID is required';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});
  
  // 1. Use a LOCAL loading state for the button, NOT the global one
  setIsSubmitting(true); 

  try {
    await login(userId, password);
    
    // 2. SUCCESS: Don't wait for React state to catch up.
    // We know the login worked if we reached this line.
    console.log("Login verified. Forcing page jump...");
    
    // Use the absolute path to your marketplace
    window.location.href = '/marketplace'; 
    
  } catch (error: any) {
    setIsSubmitting(false);
    setErrors({ submit: error.message || "Invalid credentials" });
  }
};

  return (
    <div className="min-h-screen bg-bg-primary dark:bg-bg-dark transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-bg-secondary dark:bg-bg-dark-secondary 
            border border-border dark:border-border-dark
            text-text-primary dark:text-text-dark
            hover:bg-bg-tertiary dark:hover:bg-bg-dark-tertiary
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Login Container */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Card */}
          <div
            className="p-8 rounded-2xl border border-border dark:border-border-dark 
            shadow-card bg-bg-secondary dark:bg-bg-dark-secondary
            transition-all duration-300"
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h1
                className="text-3xl font-bold text-text-primary dark:text-text-dark 
                mb-2 bg-gradient-to-r from-primary to-secondary 
                dark:from-primary-dark dark:to-secondary-dark 
                bg-clip-text text-transparent"
              >
                SEL Marketplace
              </h1>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Alert */}
            {errors.submit && (
              <div
                className="mb-6 p-4 rounded-lg bg-error/10 dark:bg-error-dark/10 
                border border-error dark:border-error-dark
                text-error dark:text-error-dark text-sm
                animate-fade-in-down"
              >
                {errors.submit}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User ID Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="userId"
                  className="block text-sm font-semibold 
                  text-text-primary dark:text-text-dark"
                >
                  User ID
                </label>

                <input
                  id="userId"
                  type="text"
                  placeholder="Enter your user ID"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (errors.userId) setErrors({ ...errors, userId: undefined });
                  }}
                  disabled={isSubmitting || isLoading}
                  className={`w-full px-4 py-3 rounded-lg
                    bg-bg-primary dark:bg-bg-dark
                    text-text-primary dark:text-text-dark
                    placeholder-text-muted dark:placeholder-text-dark-muted
                    border-2 transition-all duration-300 ease-out
                    focus:outline-none focus:ring-4
                    disabled:opacity-60 disabled:cursor-not-allowed
                    hover:border-primary/50 dark:hover:border-primary-dark/50
                    ${
                      errors.userId
                        ? 'border-error dark:border-error-dark focus:border-error dark:focus:border-error-dark focus:ring-error/10 dark:focus:ring-error-dark/10'
                        : 'border-border dark:border-border-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary/10 dark:focus:ring-primary-dark/10'
                    }`}
                />

                {errors.userId && (
                  <p className="text-sm text-error dark:text-error-dark animate-fade-in-down">
                    {errors.userId}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold 
                  text-text-primary dark:text-text-dark"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  disabled={isSubmitting || isLoading}
                  className={`w-full px-4 py-3 rounded-lg
                    bg-bg-primary dark:bg-bg-dark
                    text-text-primary dark:text-text-dark
                    placeholder-text-muted dark:placeholder-text-dark-muted
                    border-2 transition-all duration-300 ease-out
                    focus:outline-none focus:ring-4
                    disabled:opacity-60 disabled:cursor-not-allowed
                    hover:border-primary/50 dark:hover:border-primary-dark/50
                    ${
                      errors.password
                        ? 'border-error dark:border-error-dark focus:border-error dark:focus:border-error-dark focus:ring-error/10 dark:focus:ring-error-dark/10'
                        : 'border-border dark:border-border-dark focus:border-primary dark:focus:border-primary-dark focus:ring-primary/10 dark:focus:ring-primary-dark/10'
                    }`}
                />

                {errors.password && (
                  <p className="text-sm text-error dark:text-error-dark animate-fade-in-down">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full mt-6 px-4 py-3 rounded-lg font-semibold
                  bg-gradient-to-r from-primary to-primary/90
                  dark:from-primary-dark dark:to-primary-dark/90
                  text-white
                  hover:shadow-lg hover:shadow-primary/30 hover:from-primary/90
                  dark:hover:shadow-primary-dark/30 dark:hover:from-primary-dark/90
                  focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark
                  transition-all duration-300 ease-out
                  disabled:opacity-60 disabled:cursor-not-allowed
                  active:scale-95
                  flex items-center justify-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-border dark:border-border-dark text-center">
              <p className="text-xs text-text-muted dark:text-text-dark-muted">
                Demo credentials available upon request
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
