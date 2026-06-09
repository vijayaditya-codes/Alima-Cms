'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GraduationCap, BookOpen, Laptop, Code, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // In development, if secrets aren't set, default to custom credentials provider
      // otherwise NextAuth will fail with OAuth configuration errors.
      const hasSecrets = process.env.NEXT_PUBLIC_HAS_GOOGLE_SECRETS === 'true' || false;
      
      if (hasSecrets) {
        await signIn('google', { callbackUrl: '/dashboard' });
      } else {
        // Fallback mock login for local testing
        await signIn('google-mock', {
          callbackUrl: '/dashboard',
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@alima.edu',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        });
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  // Floating animations for educational shapes
  const floatingAnimation = (delay: number) => ({
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut' as const,
      delay,
    },
  });

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* LEFT PANEL: branding & motion illustrations */}
      <div className="relative w-full md:w-1/2 bg-gradient-to-br from-dark-bg to-card-dark flex flex-col justify-between p-8 md:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-gray-900">
        {/* Glow meshes */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        {/* Brand header */}
        <Link href="/" className="flex items-center gap-3 relative z-10 w-fit group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            A
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Alima
          </span>
        </Link>

        {/* Floating Icons Arena */}
        <div className="relative flex-grow flex flex-col justify-center items-center my-12 md:my-0">
          <div className="absolute w-72 h-72 rounded-full border border-dashed border-gray-800 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border border-dashed border-gray-800/60" />
          </div>

          {/* Central Logo Symbol */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl shadow-xl shadow-primary/20 z-10"
          >
            <GraduationCap size={48} className="text-white" />
          </motion.div>

          {/* Floating Cap */}
          <motion.div
            animate={floatingAnimation(0)}
            className="absolute top-1/4 left-1/4 p-3 rounded-xl bg-card-dark border border-gray-800 text-primary shadow-lg z-10"
          >
            <BookOpen size={24} />
          </motion.div>

          {/* Floating Laptop */}
          <motion.div
            animate={floatingAnimation(1.5)}
            className="absolute bottom-1/4 right-1/4 p-3 rounded-xl bg-card-dark border border-gray-800 text-accent shadow-lg z-10"
          >
            <Laptop size={24} />
          </motion.div>

          {/* Floating Code */}
          <motion.div
            animate={floatingAnimation(3)}
            className="absolute top-1/3 right-1/4 p-3 rounded-xl bg-card-dark border border-gray-800 text-success shadow-lg z-10"
          >
            <Code size={24} />
          </motion.div>

          {/* Floating Sparkles */}
          <motion.div
            animate={floatingAnimation(4.5)}
            className="absolute bottom-1/3 left-1/4 p-3 rounded-xl bg-card-dark border border-gray-800 text-yellow-500 shadow-lg z-10"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>

        {/* Left footer details */}
        <div className="relative z-10">
          <h2 className="font-heading font-bold text-2xl text-white mb-2 leading-tight">
            The Foundation of Your Digital Campus
          </h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Access visual layout templates, customized colors, media storage, sitemaps, and publishing releases in one premium SaaS suite.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
        {/* Theme toggle position absolute top right */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md p-8 sm:p-10 rounded-2xl border border-gray-100 dark:border-gray-900 bg-gray-50/55 dark:bg-card-dark/40 backdrop-blur-md shadow-sm"
        >
          <div className="text-center mb-8">
            <h1 className="font-heading font-extrabold text-3xl tracking-tight text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in to manage your campus web structure
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Google Authentication Trigger */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark text-gray-700 dark:text-gray-200 font-semibold text-sm shadow-sm flex items-center justify-center gap-3 cursor-pointer hover:border-primary dark:hover:border-accent hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </motion.button>

            {/* Development Mock Sign In Alert Banner */}
            <div className="p-4 rounded-xl bg-primary/5 dark:bg-accent/5 border border-primary/10 dark:border-accent/10 flex items-start gap-3">
              <AlertCircle size={18} className="text-primary dark:text-accent mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="font-bold block mb-0.5 text-primary dark:text-accent">Local Dev Sandbox Active</span>
                Clicking the button will sign you in instantly with a mock administrator profile.
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-900 text-center">
            <span className="text-xs text-gray-500">
              Need assistance?{' '}
              <a href="mailto:support@alima.edu" className="text-primary dark:text-accent hover:underline font-semibold">
                Contact University IT
              </a>
            </span>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
