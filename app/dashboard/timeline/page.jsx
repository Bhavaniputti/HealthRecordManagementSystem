'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Clock,
  FileText,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from '@/store/authStore';

import { formatDate } from '@/lib/utils';

export default function TimelinePage() {
  const { user } =
    useAuthStore();

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadReports();
  }, [user?.id]);

  async function loadReports() {
    if (!user?.id) return;

    try {
      const { data } =
        await supabase
          .from(
            'medical_reports'
          )
          .select('*')
          .eq('user_id', user.id)
          .order(
            'report_date',
            {
              ascending: false,
            }
          );

      setReports(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Health Timeline
        </h1>

        <p className="text-slate-500 mt-2">
          Visualize your
          complete medical
          history
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <p className="text-slate-400">
              Loading timeline...
            </p>
          </div>
        ) : reports.length ===
          0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No Reports Yet
            </h2>

            <p className="text-slate-500">
              Upload reports to
              see them displayed
              chronologically
            </p>
          </div>
        ) : (
          reports.map(
            (report, index) => (
              <div
                key={
                  report?.id ||
                  index
                }
                className="relative pl-10"
              >
                {/* Timeline Line */}
                {index !==
                  reports.length -
                    1 && (
                  <div className="absolute left-4 top-10 w-0.5 h-full bg-slate-200"></div>
                )}

                {/* Timeline Dot */}
                <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {
                        report?.title
                      }
                    </h3>

                    <span className="text-xs text-slate-400">
                      {report?.report_date
                        ? formatDate(
                            report.report_date
                          )
                        : '-'}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 capitalize">
                    Category:{' '}
                    {
                      report?.category
                    }
                  </p>

                  <div className="mt-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600 capitalize">
                      {
                        report?.status
                      }
                    </span>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}