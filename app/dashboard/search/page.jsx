'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Search,
  FileText,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from '@/store/authStore';

import { formatDate } from '@/lib/utils';

export default function SearchPage() {
  const { user } =
    useAuthStore();

  const [reports, setReports] =
    useState([]);

  const [filteredReports, setFilteredReports] =
    useState([]);

  const [query, setQuery] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadReports();
  }, [user?.id]);

  useEffect(() => {
    handleSearch(query);
  }, [query, reports]);

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
            'created_at',
            {
              ascending: false,
            }
          );

      setReports(data || []);
      setFilteredReports(
        data || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(
    value
  ) {
    setQuery(value);

    if (!value.trim()) {
      setFilteredReports(
        reports
      );

      return;
    }

    const lower =
      value.toLowerCase();

    const filtered =
      reports.filter(
        (report) =>
          report?.title
            ?.toLowerCase()
            .includes(lower) ||
          report?.category
            ?.toLowerCase()
            .includes(lower)
      );

    setFilteredReports(
      filtered
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Semantic Search
        </h1>

        <p className="text-slate-500 mt-2">
          Search across all
          your reports using
          natural language
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

        <input
          type="text"
          placeholder="Search reports..."
          value={query}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">
            Loading reports...
          </p>
        </div>
      ) : filteredReports.length ===
        0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            No Reports Found
          </h2>

          <p className="text-slate-500">
            Try searching with
            another keyword
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map(
            (
              report,
              index
            ) => (
              <div
                key={
                  report?.id ||
                  index
                }
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
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

                    <p className="text-sm text-slate-500 capitalize mt-1">
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
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}