'use client';

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark opacity-0" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark flex items-center justify-center cursor-pointer shadow-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent hover:border-primary dark:hover:border-accent hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
