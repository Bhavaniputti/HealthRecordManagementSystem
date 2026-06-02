'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Share2,
  FileText,
  Lock,
} from 'lucide-react';

import { supabase }
from '@/lib/supabase';

import { useAuthStore }
from '@/store/authStore';

import { Button }
from '@/components/ui/button';

import { Input }
from '@/components/ui/input';

import { toast }
from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SharingPage() {

  const { user } =
    useAuthStore();

  /*
  =========================
  STATES
  =========================
  */

  const [
    reports,
    setReports,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    selectedReport,
    setSelectedReport,
  ] = useState(null);

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    expiryHours,
    setExpiryHours,
  ] = useState(24);

  /*
  =========================
  LOAD REPORTS
  =========================
  */

  useEffect(() => {

    loadReports();

  }, [user?.id]);

  async function loadReports() {

    if (!user?.id)
      return;

    try {

      const { data } =
        await supabase
          .from(
            'medical_reports'
          )
          .select('*')
          .eq(
            'user_id',
            user.id
          )
          .order(
            'created_at',
            {
              ascending:
                false,
            }
          );

      setReports(
        data || []
      );

    } catch (error) {

      console.log(
        error
      );

      toast.error(
        'Failed to load reports'
      );

    } finally {

      setLoading(false);
    }
  }

  /*
  =========================
  CREATE SECURE SHARE
  =========================
  */

  async function createShare(
    report
  ) {

    try {

      /*
      =========================
      VALIDATION
      =========================
      */

      if (!password) {

        toast.error(
          'Enter password'
        );

        return;
      }

      /*
      =========================
      TOKEN
      =========================
      */

      const token =
        crypto.randomUUID();

      /*
      =========================
      EXPIRY
      =========================
      */

      const expiresAt =
        new Date(
          Date.now() +
          expiryHours *
          60 *
          60 *
          1000
        );

      /*
      =========================
      SAVE SHARE
      =========================
      */

      const {
        error,
      } =
        await supabase
          .from(
            'shared_reports'
          )
          .insert({

            report_id:
              report.id,

            owner_id:
              user.id,

            share_token:
              token,

            pin_hash:
              password,

            expires_at:
              expiresAt,

            failed_attempts:
              0,

            locked:
              false,

            is_active:
              true,
          });

      if (error)
        throw error;

      /*
      =========================
      CREATE URL
      =========================
      */

      const shareUrl = `${window.location.origin}/shared/${token}`;

      /*
      =========================
      COPY URL
      =========================
      */

      await navigator.clipboard.writeText(
        shareUrl
      );

      /*
      =========================
      RESET
      =========================
      */

      setOpen(false);

      setPassword('');

      setExpiryHours(
        24
      );

      setSelectedReport(
        null
      );

      toast.success(
        'Secure link copied'
      );

    } catch (error) {

      console.log(
        error
      );

      toast.error(
        'Failed to create secure link'
      );
    }
  }

  return (

    <div className="max-w-5xl mx-auto">

      {/* HEADER */}

      <div className="mb-8">

        <div className="flex items-center gap-3 mb-2">

          <Lock className="w-7 h-7 text-blue-600" />

          <h1 className="text-3xl font-bold text-slate-900">

            Secure Sharing

          </h1>
        </div>

        <p className="text-slate-500">

          Share medical reports
          securely with doctors
          or family members

        </p>
      </div>

      {/* LOADING */}

      {loading ? (

        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">

          <p className="text-slate-400">

            Loading reports...

          </p>
        </div>

      ) : reports.length ===
        0 ? (

        /* EMPTY */

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">

          <Share2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-slate-900 mb-2">

            No Reports Yet

          </h2>

          <p className="text-slate-500">

            Upload reports to
            enable secure
            sharing

          </p>
        </div>

      ) : (

        /* REPORTS */

        <div className="space-y-4">

          {reports.map(
            (
              report,
              index
            ) => (

              <div

                key={
                  report?.id ||
                  index
                }

                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between"
              >

                {/* LEFT */}

                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">

                    <FileText className="w-5 h-5 text-blue-600" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">

                      {
                        report?.title
                      }

                    </h3>

                    <p className="text-sm text-slate-500 capitalize">

                      {
                        report?.category
                      }

                    </p>
                  </div>
                </div>

                {/* BUTTON */}

                <Button

                  onClick={() => {

                    setSelectedReport(
                      report
                    );

                    setOpen(true);
                  }}

                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0"
                >

                  <Share2 className="w-4 h-4 mr-2" />

                  Create Share Link

                </Button>
              </div>
            )
          )}
        </div>
      )}

      {/* DIALOG */}

      <Dialog
        open={open}
        onOpenChange={
          setOpen
        }
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Create Secure Share Link

            </DialogTitle>

          </DialogHeader>

          <div className="space-y-5">

            {/* PASSWORD */}

            <div>

              <label className="text-sm font-medium mb-2 block">

                Password

              </label>

              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />
            </div>

            {/* EXPIRY */}

            <div>

              <label className="text-sm font-medium mb-2 block">

                Expiry Time (Hours)

              </label>

              <Input
                type="number"
                value={
                  expiryHours
                }
                onChange={(e) =>
                  setExpiryHours(
                    e.target.value
                  )
                }
              />
            </div>

            {/* BUTTON */}

            <Button

              onClick={() =>
                createShare(
                  selectedReport
                )
              }

              className="w-full bg-gradient-to-r from-blue-600 to-teal-500"
            >

              Create Secure Link

            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}