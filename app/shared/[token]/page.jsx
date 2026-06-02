'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useParams }
from 'next/navigation';

import { supabase }
from '@/lib/supabase';

import { Button }
from '@/components/ui/button';

import { Input }
from '@/components/ui/input';

export default function SharedPage() {

  const params =
    useParams();

  const token =
    params.token;

  /*
  =========================
  STATES
  =========================
  */

  const [
    share,
    setShare,
  ] = useState(null);

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const [
    unlocked,
    setUnlocked,
  ] = useState(false);

  const [
    locked,
    setLocked,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  =========================
  LOAD SHARE
  =========================
  */

  useEffect(() => {

    async function init() {

      try {

        const {
          data,
        } =
          await supabase
            .from(
              'shared_reports'
            )
            .select(`
              *,
              medical_reports(*)
            `)
            .eq(
              'share_token',
              token
            )
            .single();

        /*
        =========================
        INVALID
        =========================
        */

        if (!data) {

          setLocked(true);

          return;
        }

        /*
        =========================
        EXPIRED
        =========================
        */

        if (
          data.expires_at &&
          new Date(
            data.expires_at
          ) < new Date()
        ) {

          setLocked(true);

          return;
        }

        /*
        =========================
        ALREADY LOCKED
        =========================
        */

        if (
          data.locked
        ) {

          setLocked(
            true
          );
        }

        setShare(
          data
        );

      } catch (error) {

        console.log(
          error
        );

        setLocked(true);

      } finally {

        setLoading(
          false
        );
      }
    }

    init();

  }, [token]);

  /*
  =========================
  VERIFY PASSWORD
  =========================
  */

  async function verifyPassword() {

    if (!share)
      return;

    /*
    =========================
    PASSWORD CORRECT
    =========================
    */

    if (
      password ===
      share.pin_hash
    ) {

      /*
      =========================
      RESET ATTEMPTS
      =========================
      */

      await supabase
        .from(
          'shared_reports'
        )
        .update({

          failed_attempts:
            0,
        })
        .eq(
          'id',
          share.id
        );

      setUnlocked(
        true
      );

      return;
    }

    /*
    =========================
    WRONG PASSWORD
    =========================
    */

    const attempts =
      (
        share.failed_attempts ||
        0
      ) + 1;

    /*
    =========================
    LOCK AFTER 3
    =========================
    */

    if (
      attempts >= 3
    ) {

      await supabase
        .from(
          'shared_reports'
        )
        .update({

          failed_attempts:
            attempts,

          locked:
            true,
        })
        .eq(
          'id',
          share.id
        );

      /*
      =========================
      LOCK UI
      =========================
      */

      setLocked(
        true
      );

      /*
      =========================
      SHOW MESSAGE
      =========================
      */

      setError(
        'Link locked. Ask owner to send another secure link.'
      );

      return;
    }

    /*
    =========================
    SAVE ATTEMPTS
    =========================
    */

    await supabase
      .from(
        'shared_reports'
      )
      .update({

        failed_attempts:
          attempts,
      })
      .eq(
        'id',
        share.id
      );

    /*
    =========================
    UPDATE LOCAL
    =========================
    */

    setShare({

      ...share,

      failed_attempts:
        attempts,
    });

    setError(
      `Wrong password (${attempts}/3)`
    );
  }

  /*
  =========================
  LOADING
  =========================
  */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <div className="bg-white rounded-2xl border p-10">

          Loading secure report...

        </div>
      </div>
    );
  }

  /*
  =========================
  MAIN UI
  =========================
  */

  return (

    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">

        {/* HEADER */}

        <div className="p-6 border-b">

          <h1 className="text-3xl font-bold text-slate-900">

            {
              share
                ?.medical_reports
                ?.title ||
              'Shared Medical Report'
            }

          </h1>

          <p className="text-slate-500 mt-2">

            Securely shared medical report

          </p>
        </div>

        {/* PASSWORD SECTION */}

        {!unlocked && (

          <div className="p-6 border-b bg-slate-50">

            <div className="max-w-md">

              <h2 className="text-lg font-semibold mb-3">

                Enter Password

              </h2>

              <div className="flex gap-3">

                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  disabled={locked}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <Button
                  onClick={
                    verifyPassword
                  }
                  disabled={locked}
                  className="bg-gradient-to-r from-blue-600 to-teal-500"
                >

                  Unlock

                </Button>
              </div>

              {/* ERROR */}

              {error && (

                <p className="text-red-500 text-sm mt-3">

                  {error}

                </p>
              )}

              {/* ATTEMPTS */}

              {share && !locked && (

                <p className="text-xs text-slate-400 mt-2">

                  Remaining attempts:
                  {' '}
                  {
                    3 -
                    (
                      share.failed_attempts ||
                      0
                    )
                  }

                </p>
              )}
            </div>
          </div>
        )}

        {/* REPORT */}

        {unlocked && share && (

          <div className="p-6">

            <iframe
              src={
                share
                  .medical_reports
                  .file_url
              }
              className="w-full h-[900px] rounded-xl border"
            />
          </div>
        )}
      </div>
    </div>
  );
}