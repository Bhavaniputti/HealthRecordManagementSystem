'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { motion, AnimatePresence } from 'framer-motion';

import {
  Brain,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Clock,
  Search,
  Share2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },

  {
    href: '/dashboard/reports',
    icon: FileText,
    label: 'My Reports',
  },

  {
    href: '/dashboard/chat',
    icon: MessageSquare,
    label: 'AI Chat',
  },

  {
    href: '/dashboard/timeline',
    icon: Clock,
    label: 'Timeline',
  },

  {
    href: '/dashboard/search',
    icon: Search,
    label: 'Search',
  },

  {
    href: '/dashboard/sharing',
    icon: Share2,
    label: 'Sharing',
  },
];

const BOTTOM_ITEMS = [
  {
    href: '/dashboard/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] =
    useState(false);

  const pathname = usePathname();

  const { profile, signOut } =
    useAuthStore();

  const router = useRouter();

  async function handleSignOut() {
    await signOut();

    toast.success('Signed out successfully');

    router.push('/');
  }

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{
        width: collapsed ? 72 : 240,
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      className="flex-shrink-0 bg-slate-900 flex flex-col relative z-10 shadow-xl"
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-slate-800',
          collapsed
            ? 'justify-center'
            : 'gap-3'
        )}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-900/30">
          <Brain className="w-4 h-4 text-white" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -10,
              }}
              className="font-bold text-white text-lg"
            >
              HealX AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
          >
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative',

                isActive(item.href)
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white',

                collapsed &&
                  'justify-center px-2'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 flex-shrink-0',

                  isActive(item.href)
                    ? 'text-white'
                    : 'text-slate-400 group-hover:text-white'
                )}
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="text-sm font-medium truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        {BOTTOM_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
          >
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-400 hover:bg-slate-800 hover:text-white group',

                collapsed &&
                  'justify-center px-2'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />

              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}
            </div>
          </Link>
        ))}

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-400 hover:bg-red-900/30 hover:text-red-400 group',

            collapsed &&
              'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />

          {!collapsed && (
            <span className="text-sm font-medium">
              Sign Out
            </span>
          )}
        </button>

        {/* Profile */}
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 mt-2 border-t border-slate-800 pt-3',

            collapsed && 'justify-center'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {profile?.full_name
              ? profile.full_name
                  .charAt(0)
                  .toUpperCase()
              : 'U'}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {profile?.full_name ||
                  'User'}
              </p>

              <p className="text-slate-400 text-xs truncate">
                Patient
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() =>
          setCollapsed(!collapsed)
        }
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
}