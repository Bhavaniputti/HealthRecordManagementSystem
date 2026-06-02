'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetch: async (userId) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    const items = data || [];
    set({ notifications: items, unreadCount: items.filter(n => !n.is_read).length });
  },

  markAllRead: async (userId) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, is_read: true })),
      unreadCount: 0,
    }));
  },

  add: (notification) => {
    set(s => ({
      notifications: [notification, ...s.notifications].slice(0, 20),
      unreadCount: s.unreadCount + 1,
    }));
  },
}));
