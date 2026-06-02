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

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

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

  const [reports, setReports] =
    useState<any[]>([]);

  const [analyses, setAnalyses] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [categoryData, setCategoryData] =
    useState<any[]>([]);

  const [weeklyData, setWeeklyData] =
    useState<any[]>([]);

  const [
    aiRecommendations,
    setAiRecommendations,
  ] =
    useState<string[]>([]);

  useEffect(() => {

    if (user?.id) {
      loadDashboard();
    }

  }, [user?.id]);

  async function loadDashboard() {

    if (!user?.id) return;

    try {

      const {
        data: reportsData,
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

      const {
        data: analysesData,
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

      setReports(
        reportsData || []
      );

      setAnalyses(
        analysesData || []
      );

      const categoryMap:
      Record<string, number> =
      {};

      (
        reportsData || []
      ).forEach(
        (
          report: any
        ) => {

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

      setCategoryData(

        Object.keys(
          categoryMap
        ).map(
          key => ({
            name:
              key,

            value:
              categoryMap[
                key
              ],
          })
        )
      );

      const weeklyMap:
      Record<
        string,
        number
      > = {

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
        (
          report: any
        ) => {

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

      setWeeklyData(

        Object.keys(
          weeklyMap
        ).map(
          day => ({
            day,
            reports:
              weeklyMap[
                day
              ],
          })
        )
      );

      const recommendations:
      string[] =
      [];

      (
        analysesData || []
      ).forEach(
        (
          analysis: any
        ) => {

          if (
            analysis
              .abnormal_values
              ?.length
          ) {

            recommendations.push(

              `Your report contains ${analysis.abnormal_values.length} abnormal values.`

            );
          }

          analysis
            .recommendations
            ?.forEach(
              (
                item:
                string
              ) =>
                recommendations.push(
                  item
                )
            );
        }
      );

      if (
        recommendations
          .length === 0
      ) {

        recommendations.push(

          'Upload reports to receive AI recommendations.'

        );
      }

      setAiRecommendations(

        recommendations
          .slice(
            0,
            5
          )
      );

    } finally {

      setLoading(
        false
      );
    }
  }

  const totalReports =
    reports.length;

  const totalAnalyses =
    analyses.length;

  const abnormalReports =
    analyses.filter(
      (
        a: any
      ) =>
        a
          .abnormal_values
          ?.length
    ).length;

  if (loading) {

    return (

      <div className="p-10 text-center">

        Loading dashboard...

      </div>
    );
  }

  return (

    <div className="p-8">

      <h1 className="text-4xl font-bold">

        Dashboard

      </h1>

      <p className="mt-4">

        Reports:
        {' '}
        {totalReports}

      </p>

      <p>

        Analyses:
        {' '}
        {totalAnalyses}

      </p>

      <p>

        Abnormal:
        {' '}
        {abnormalReports}

      </p>

    </div>
  );
}
