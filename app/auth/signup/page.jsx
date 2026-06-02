'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Brain,
  Eye,
  EyeOff,
  Loader as Loader2,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));
  }

  async function handleSignup(e) {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error(
        'Password must be at least 6 characters'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.fullName,
            },
          },
        });

      if (error) throw error;

      if (data.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: form.email,
            full_name: form.fullName,
          });
      }

      toast.success(
        'Account created! Welcome to HealX AI.'
      );

      router.push('/dashboard');
    } catch (err) {
      toast.error(
        err.message || 'Failed to create account'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full opacity-40 blur-3xl" />

        <div className="absolute bottom-20 left-20 w-72 h-72 bg-teal-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-2xl"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Brain className="w-5 h-5 text-white" />
            </div>

            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              HealX AI
            </span>
          </Link>

          <p className="text-slate-500 mt-2 text-sm">
            Start your free account today
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Create account
          </h1>

          <p className="text-slate-500 text-sm mb-6">
            Join HealX AI — free forever,
            no card needed
          </p>

          <form
            onSubmit={handleSignup}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name
              </Label>

              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={form.fullName}
                onChange={(e) =>
                  update(
                    'fullName',
                    e.target.value
                  )
                }
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  update(
                    'email',
                    e.target.value
                  )
                }
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    update(
                      'password',
                      e.target.value
                    )
                  }
                  required
                  className="h-11 pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0 font-semibold shadow-md shadow-blue-100 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}