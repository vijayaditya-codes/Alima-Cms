'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Globe, FileText, ClipboardList, Database, LogOut, Plus, 
  ExternalLink, Trash2, CheckCircle2, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Local state for sample websites list in mock sandbox
  const [websites, setWebsites] = useState([
    { id: '1', name: 'Biotech Dept Research Blog', subdomain: 'biotech', template: 'Blog', status: 'live' },
    { id: '2', name: 'Scholar CV & Portfolio', subdomain: 'jenkins', template: 'Portfolio', status: 'live' },
    { id: '3', name: 'Admissions Admissions Inquiry', subdomain: 'admit', template: 'Business', status: 'draft' },
  ]);

  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteSubdomain, setNewSiteSubdomain] = useState('');
  const [newSiteTemplate, setNewSiteTemplate] = useState('portfolio');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auth Guard redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  // Confetti on mount
  useEffect(() => {
    setMounted(true);
    if (status === 'authenticated') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#7c3aed', '#06b6d4', '#10b981'],
      });
    }
  }, [status]);

  if (status === 'loading' || !mounted || status === 'unauthenticated') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading session context...</span>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'A';

  // Toggle Live/Draft
  const toggleSiteStatus = (id: string) => {
    setWebsites(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = w.status === 'live' ? 'draft' : 'live';
        return { ...w, status: nextStatus };
      }
      return w;
    }));
  };

  // Add website
  const handleCreateWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !newSiteSubdomain) return;
    
    const newWeb = {
      id: Date.now().toString(),
      name: newSiteName,
      subdomain: newSiteSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      template: newSiteTemplate.charAt(0).toUpperCase() + newSiteTemplate.slice(1),
      status: 'draft',
    };

    setWebsites(prev => [newWeb, ...prev]);
    setIsModalOpen(false);
    setNewSiteName('');
    setNewSiteSubdomain('');
  };

  // Delete website
  const handleDeleteWebsite = (id: string) => {
    if (confirm('Delete this site configuration? This action is permanent.')) {
      setWebsites(prev => prev.filter(w => w.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-200 flex flex-col">
      
      {/* Top Navbar */}
      <header className="sticky top-0 bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-900 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-extrabold text-base shadow-md">
              A
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Alima
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* User Profile Avatar with Initials fallback */}
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center text-xs font-bold font-heading">
                  {userInitials}
                </div>
              )}
              <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {user?.name || 'Academic Admin'}
              </span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-grow w-full flex flex-col gap-8">
        
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="font-heading font-extrabold text-3xl tracking-tight text-gray-900 dark:text-white">
              Welcome, {user?.name || 'Administrator'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage website deployment, content templates, and forms under <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-card-dark text-primary dark:text-accent font-semibold">{user?.email}</code>
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-white font-bold text-sm shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus size={16} />
            New Website
          </button>
        </motion.div>

        {/* Dynamic Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-gray-200/60 dark:border-gray-900 bg-white dark:bg-card-dark shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Active Websites</span>
              <h3 className="font-heading font-extrabold text-3xl text-gray-900 dark:text-white mt-1">
                {websites.filter(w => w.status === 'live').length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Globe size={20} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-gray-200/60 dark:border-gray-900 bg-white dark:bg-card-dark shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Pages Drafted</span>
              <h3 className="font-heading font-extrabold text-3xl text-gray-900 dark:text-white mt-1">12</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-gray-200/60 dark:border-gray-900 bg-white dark:bg-card-dark shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Active Forms</span>
              <h3 className="font-heading font-extrabold text-3xl text-gray-900 dark:text-white mt-1">5</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <ClipboardList size={20} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl border border-gray-200/60 dark:border-gray-900 bg-white dark:bg-card-dark shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Form Responses</span>
              <h3 className="font-heading font-extrabold text-3xl text-gray-900 dark:text-white mt-1">42</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Database size={20} />
            </div>
          </div>

        </div>

        {/* Websites Grid */}
        <section className="flex flex-col gap-4">
          <h2 className="font-heading font-extrabold text-xl text-gray-900 dark:text-white">Your Digital Campus Sites</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {websites.map(site => (
              <motion.div
                key={site.id}
                layoutId={`site-card-${site.id}`}
                className="p-6 rounded-2xl border border-gray-200/60 dark:border-gray-900 bg-white dark:bg-card-dark shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-48"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">{site.template} Site</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      site.status === 'live' ? 'bg-success/10 text-success' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${site.status === 'live' ? 'bg-success' : 'bg-yellow-500'}`} />
                      {site.status}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mt-2 leading-tight">
                    {site.name}
                  </h3>
                  <a
                    href={`https://${site.subdomain}.alima.site`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary dark:text-accent font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    {site.subdomain}.alima.site
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-900 pt-4 mt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 cursor-pointer select-none">
                      Live Toggle
                    </label>
                    <input
                      type="checkbox"
                      checked={site.status === 'live'}
                      onChange={() => toggleSiteStatus(site.id)}
                      className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary accent-primary cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteWebsite(site.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                    title="Delete site"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-bg/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white dark:bg-card-dark p-8 rounded-2xl border border-gray-200 dark:border-gray-900 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-extrabold text-xl">Create New Website</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateWebsite} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Website Name</label>
                <input
                  type="text"
                  required
                  value={newSiteName}
                  onChange={e => setNewSiteName(e.target.value)}
                  placeholder="e.g. Science Department Portal"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark outline-none focus:border-primary dark:focus:border-accent text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Subdomain Prefix</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    value={newSiteSubdomain}
                    onChange={e => setNewSiteSubdomain(e.target.value)}
                    placeholder="e.g. science-portal"
                    className="flex-grow px-4 py-3 rounded-l-xl border-y border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark outline-none focus:border-primary dark:focus:border-accent text-sm"
                  />
                  <span className="px-4 py-3 rounded-r-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-surface-dark text-gray-400 dark:text-gray-500 text-sm font-semibold select-none">
                    .alima.site
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-500">Select Template</label>
                <select
                  value={newSiteTemplate}
                  onChange={e => setNewSiteTemplate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark outline-none focus:border-primary dark:focus:border-accent text-sm cursor-pointer"
                >
                  <option value="portfolio">Portfolio</option>
                  <option value="blog">Blog</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                </select>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/20 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold text-sm rounded-xl hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all"
                >
                  Create Site
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
