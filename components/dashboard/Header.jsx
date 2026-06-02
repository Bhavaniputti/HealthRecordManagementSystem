'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';
import { timeAgo } from '@/lib/utils';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/reports': 'My Reports',
  '/dashboard/chat': 'AI Chat',
  '/dashboard/timeline': 'Health Timeline',
  '/dashboard/search': 'Semantic Search',
  '/dashboard/share': 'Secure Sharing',
  '/dashboard/settings': 'Settings',
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, profile } = useAuthStore();
  const { notifications, unreadCount, fetch: fetchNotifications, markAllRead } = useNotificationStore();

  useEffect(() => {
    if (user?.id) fetchNotifications(user.id);
  }, [user?.id]);

  const title = PAGE_TITLES[pathname] || 'HealX AI';

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-400 hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-slate-500 hover:text-slate-900"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-900">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-semibold text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => user?.id && markAllRead(user.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">No notifications yet</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-slate-50 last:border-0 ${!n.is_read ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.is_read ? 'bg-blue-500' : 'bg-transparent'}`} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{n.title}</p>
                        {n.message && <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>}
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 leading-tight">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-slate-400 capitalize">{profile?.role || 'patient'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
