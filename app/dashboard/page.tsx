'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  FileText,
  Activity,
  AlertTriangle,
  Brain,
} from 'lucide-react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import { supabase }
from '@/lib/supabase';

import { useAuthStore }
from '@/store/authStore';

const COLORS = [
  '#3B82F6',
  '#14B8A6',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
];

export default function DashboardPage() {

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
    analyses,
    setAnalyses,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    categoryData,
    setCategoryData,
  ] = useState([]);

  const [
    weeklyData,
    setWeeklyData,
  ] = useState([]);

  const [
    aiRecommendations,
    setAiRecommendations,
  ] = useState([]);

  /*
  =========================
  LOAD DASHBOARD
  =========================
  */

  useEffect(() => {

    if (
      user?.id
    ) {

      loadDashboard();
    }

  }, [user?.id]);

  async function loadDashboard() {

    try {

      /*
      =========================
      FETCH REPORTS
      =========================
      */

      const {
        data: reportsData,
        error: reportsError,
      } =
        await supabase
          .from(
            'medical_reports'
          )
          .select('*')
          .eq(
            'user_id',
            user.id
          );

      if (
        reportsError
      ) {

        console.log(
          reportsError
        );
      }

      /*
      =========================
      FETCH ANALYSES
      =========================
      */

      const {
        data: analysesData,
        error: analysesError,
      } =
        await supabase
          .from(
            'report_analyses'
          )
          .select('*')
          .eq(
            'user_id',
            user.id
          );

      if (
        analysesError
      ) {

        console.log(
          analysesError
        );
      }

      /*
      =========================
      SAVE STATES
      =========================
      */

      setReports(
        reportsData || []
      );

      setAnalyses(
        analysesData || []
      );

      /*
      =========================
      CATEGORY DATA
      =========================
      */

      const categoryMap =
        {};

      (
        reportsData || []
      ).forEach(
        (report) => {

          const category =
            report.category ||
            'other';

          categoryMap[
            category
          ] =
            (
              categoryMap[
                category
              ] || 0
            ) + 1;
        }
      );

      const categories =
        Object.keys(
          categoryMap
        ).map(
          (key) => ({

            name:
              key,

            value:
              categoryMap[
                key
              ],
          })
        );

      setCategoryData(
        categories
      );

      /*
      =========================
      WEEKLY DATA
      =========================
      */

      const weeklyMap = {

        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };

      (
        reportsData || []
      ).forEach(
        (report) => {

          const day =
            new Date(
              report.created_at
            )
              .toLocaleDateString(
                'en-US',
                {
                  weekday:
                    'short',
                }
              );

          if (
            weeklyMap[
              day
            ] !==
            undefined
          ) {

            weeklyMap[
              day
            ] += 1;
          }
        }
      );

      const weekly =
        Object.keys(
          weeklyMap
        ).map(
          (day) => ({

            day,

            reports:
              weeklyMap[
                day
              ],
          })
        );

      setWeeklyData(
        weekly
      );

      /*
      =========================
      AI RECOMMENDATIONS
      =========================
      */

      const recommendations =
        [];

      (
        analysesData || []
      ).forEach(
        (analysis) => {

          /*
          =========================
          ABNORMAL VALUES
          =========================
          */

          if (
            analysis
              .abnormal_values
              ?.length > 0
          ) {

            recommendations.push(

              `Your report contains ${analysis.abnormal_values.length} abnormal values. Please consult a doctor.`

            );
          }

          /*
          =========================
          AI RECOMMENDATIONS
          =========================
          */

          if (
            analysis
              .recommendations
              ?.length > 0
          ) {

            analysis
              .recommendations
              .forEach(
                (item) => {

                  recommendations.push(
                    item
                  );
                }
              );
          }
        }
      );

      /*
      =========================
      DEFAULT MESSAGE
      =========================
      */

      if (
        recommendations
          .length === 0
      ) {

        recommendations.push(
          'Upload reports to receive AI-powered recommendations.'
        );
      }

      setAiRecommendations(

        recommendations
          .slice(0, 5)

      );

    } catch (error) {

      console.log(
        error
      );

    } finally {

      setLoading(
        false
      );
    }
  }

  /*
  =========================
  TOTALS
  =========================
  */

  const totalReports =
    reports.length;

  const totalAnalyses =
    analyses.length;

  const abnormalReports =
    analyses.filter(
      (a) =>
        a
          .abnormal_values
          ?.length > 0
    ).length;

  /*
  =========================
  LOADING
  =========================
  */

  if (loading) {

    return (

      <div className="p-10 text-center text-slate-400">

        Loading dashboard...

      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* TOTAL REPORTS */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">

                Total Reports

              </p>

              <h2 className="text-4xl font-black text-slate-900 mt-2">

                {totalReports}

              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

              <FileText className="w-7 h-7 text-blue-600" />

            </div>
          </div>
        </div>

        {/* AI ANALYSES */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">

                AI Analyses

              </p>

              <h2 className="text-4xl font-black text-slate-900 mt-2">

                {totalAnalyses}

              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center">

              <Brain className="w-7 h-7 text-teal-600" />

            </div>
          </div>
        </div>

        {/* ABNORMAL */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">

                Abnormal Reports

              </p>

              <h2 className="text-4xl font-black text-slate-900 mt-2">

                {abnormalReports}

              </h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">

              <AlertTriangle className="w-7 h-7 text-red-600" />

            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* PIE CHART */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-2xl font-bold text-slate-900 mb-6">

            Report Categories

          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={
                    categoryData
                  }
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >

                  {categoryData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={
                          index
                        }
                        fill={
                          COLORS[
                            index %
                            COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE CHART */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-2xl font-bold text-slate-900 mb-6">

            This Week

          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  weeklyData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="day"
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#3B82F6"
                  strokeWidth={3}
                />

              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATIONS */}

      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border border-blue-100 p-8">

        <div className="flex items-center gap-3 mb-5">

          <Activity className="w-7 h-7 text-blue-600" />

          <h2 className="text-2xl font-bold text-slate-900">

            AI Recommendations

          </h2>
        </div>

        <ul className="space-y-4">

          {aiRecommendations.map(
            (
              item,
              index
            ) => (

              <li
                key={index}
                className="flex gap-3 text-slate-600"
              >

                <span>

                  •

                </span>

                <span>

                  {item}

                </span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}