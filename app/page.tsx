'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArrowRight, Globe, School, Shield } from 'lucide-react';

export default function LandingPage() {
  const { data: session } = useSession();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 120,
        damping: 12,
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-between z-10">
      {/* 60 FPS Particle Canvas Background */}
      <ParticleBackground />

      {/* Modern SaaS Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex justify-between items-center relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            A
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Alima
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <ThemeToggle />
          {session ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm shadow-md hover:scale-105 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 font-semibold text-sm hover:border-primary dark:hover:border-accent hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
            >
              Sign In
            </Link>
          )}
        </motion.div>
      </header>

      {/* Hero Content Section */}
      <main className="flex-grow flex items-center justify-center px-6 relative z-10 my-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-center flex flex-col items-center"
        >
          {/* Animated Promo Tag */}
          <motion.div
            variants={itemVariants}
            className="mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-accent font-semibold text-xs tracking-wider uppercase flex items-center gap-2"
          >
            <span>✨</span> Next Generation CMS Platform
          </motion.div>

          {/* Hero Headers */}
          <motion.h1
            variants={itemVariants}
            className="font-heading font-extrabold text-5xl md:text-7xl tracking-tight leading-none mb-6 text-gray-900 dark:text-white"
          >
            Alima
            <span className="block text-2xl md:text-3xl font-bold mt-3 text-primary dark:text-accent font-sans">
              The Foundation of Your Digital Campus
            </span>
          </motion.h1>

          {/* Hero Description */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 font-normal leading-relaxed mb-10"
          >
            Build beautiful websites for your institution, organization, or personal brand without complexity. Fully custom themes, form builders, and direct publishing channels.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={buttonVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/auth/login"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold text-base shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 font-semibold text-base hover:border-primary dark:hover:border-accent hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-sm"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </main>

      {/* Core Highlights section */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-900 bg-white/70 dark:bg-card-dark/60 backdrop-blur-md shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <School size={24} />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">Digital Campus</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Tailored templates and components built to highlight educational departments, courses, and researcher profiles.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-900 bg-white/70 dark:bg-card-dark/60 backdrop-blur-md shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Globe size={24} />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">Seamless Publishing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Draft page structures with visual drag-and-drop elements and schedule release dates dynamically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-900 bg-white/70 dark:bg-card-dark/60 backdrop-blur-md shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">Secure Workspace</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Integrate Google single sign-on security to safeguard forms, media folders, and sitemaps.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Styled Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-gray-100 dark:border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 relative z-20">
        <span>© {new Date().getFullYear()} Alima CMS. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
