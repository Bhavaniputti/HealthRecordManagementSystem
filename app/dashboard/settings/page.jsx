'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { Settings, Save, Loader as Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, profile } = useAuthStore();
  const [form, setForm] = useState({ full_name: '', phone: '', date_of_birth: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
      });
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({
        full_name: form.full_name,
        phone: form.phone,
        date_of_birth: form.date_of_birth,
      }).eq('id', user.id);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Settings
          </h1>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled className="bg-slate-50" />
            <p className="text-xs text-slate-400">Your email address cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={form.date_of_birth}
              onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
            />
          </div>

          <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0">
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Changes</>
            )}
          </Button>
        </form>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
          <p className="text-xs text-slate-500">Last updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}</p>
        </div>
      </div>
    </div>
  );
}
