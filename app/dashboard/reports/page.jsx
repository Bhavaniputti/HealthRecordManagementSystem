'use client';

import {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  supabase,
  uploadReportFile,
} from '@/lib/supabase';

import { analyzeReport } from '@/lib/groq';

import { useAuthStore } from '@/store/authStore';

import { useDropzone } from 'react-dropzone';

import Tesseract from 'tesseract.js';

import pdfParse from 'pdf-parse';

import {
  Upload,
  Loader2,
  Trash2,
  Eye,
  Share2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { toast } from 'sonner';

import {
  formatDate,
  formatFileSize,
  getCategoryColor,
  getStatusColor,
} from '@/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ReportsPage() {

  const { user } =
    useAuthStore();

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [form, setForm] =
    useState({
      title: '',
      category: 'general',
      reportDate: '',
    });

  /*
  =========================
  LOAD REPORTS
  =========================
  */

  useEffect(() => {

    if (user?.id) {
      loadReports();
    }

  }, [user?.id]);

  async function loadReports() {

    try {

      const {
        data,
        error,
      } =
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

      if (error)
        throw error;

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
  TEXT EXTRACTION
  =========================
  */

  async function extractText(
    file
  ) {

    /*
    =========================
    PDF EXTRACTION
    =========================
    */

    if (
      file.type ===
      'application/pdf'
    ) {

      const buffer =
        await file.arrayBuffer();

      const pdfData =
        await pdfParse(
          Buffer.from(buffer)
        );

      return pdfData.text;
    }

    /*
    =========================
    IMAGE OCR
    =========================
    */

    const {
      data: { text },
    } =
      await Tesseract.recognize(
        file,
        'eng'
      );

    return text;
  }

  /*
  =========================
  FILE DROP
  =========================
  */

  const onDrop =
    useCallback(
      async (
        acceptedFiles
      ) => {

        if (
          acceptedFiles.length ===
          0
        )
          return;

        if (
          !form.title
        ) {

          toast.error(
            'Please enter report title'
          );

          return;
        }

        const file =
          acceptedFiles[0];

        setUploading(true);

        try {

          /*
          =========================
          UPLOAD FILE
          =========================
          */

          const {
            url,
          } =
            await uploadReportFile(
              file,
              user.id
            );

          /*
          =========================
          SAVE REPORT
          =========================
          */

          const {
            data,
            error,
          } =
            await supabase
              .from(
                'medical_reports'
              )
              .insert({

                user_id:
                  user.id,

                title:
                  form.title,

                category:
                  form.category,

                report_date:
                  form.reportDate,

                file_url:
                  url,

                file_name:
                  file.name,

                file_size:
                  file.size,

                file_type:
                  file.type,

                status:
                  'uploaded',

              })
              .select()
              .single();

          if (error)
            throw error;

          /*
          =========================
          EXTRACT TEXT
          =========================
          */

          const text =
            await extractText(
              file
            );

          console.log(
            'EXTRACTED TEXT:',
            text
          );

          /*
          =========================
          ANALYZE REPORT
          =========================
          */

          const analysis =
            await analyzeReport(
              text
            );

          console.log(
            'AI ANALYSIS:',
            analysis
          );

          /*
          =========================
          SAVE ANALYSIS
          =========================
          */

          const {
            error:
              analysisError,

          } =
            await supabase
              .from(
                'report_analyses'
              )
              .insert({

                report_id:
                  data.id,

                user_id:
                  user.id,

                summary:
                  analysis.summary ||
                  '',

                key_findings:
                  analysis.key_findings ||
                  [],

                medications:
                  analysis.medications ||
                  [],

                abnormal_values:
                  analysis.abnormal_values ||
                  [],

                recommendations:
                  analysis.recommendations ||
                  [],

                patient_explanation:
                  analysis.patient_explanation ||
                  '',

                report_type:
                  analysis.report_type ||
                  'general',

                raw_text:
                  text,

              });

          if (
            analysisError
          ) {

            console.log(
              'ANALYSIS ERROR:',
              analysisError
            );

            toast.error(
              'Analysis save failed'
            );

          } else {

            /*
            =========================
            UPDATE STATUS
            =========================
            */

            await supabase
              .from(
                'medical_reports'
              )
              .update({
                status:
                  'analyzed',
              })
              .eq(
                'id',
                data.id
              );
          }

          toast.success(
            'Report uploaded successfully'
          );

          loadReports();

          setOpen(false);

          setForm({
            title: '',
            category:
              'general',
            reportDate: '',
          });

        } catch (error) {

          console.log(
            error
          );

          toast.error(
            error.message
          );

        } finally {

          setUploading(false);
        }
      },
      [form, user]
    );

  /*
  =========================
  DROPZONE
  =========================
  */

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } =
    useDropzone({
      onDrop,
    });

  /*
  =========================
  DELETE REPORT
  =========================
  */

  async function deleteReport(
  id
) {

  const confirmDelete =
    confirm(
      'Delete this report?'
    );

  if (!confirmDelete)
    return;

  try {

    /*
    =========================
    GET SESSIONS
    =========================
    */

    const {
      data: sessions,
    } =
      await supabase
        .from(
          'chat_sessions'
        )
        .select('id')
        .eq(
          'report_id',
          id
        );

    /*
    =========================
    DELETE CHAT MESSAGES
    =========================
    */

    if (
      sessions &&
      sessions.length > 0
    ) {

      const sessionIds =
        sessions.map(
          s => s.id
        );

      await supabase
        .from(
          'chat_messages'
        )
        .delete()
        .in(
          'session_id',
          sessionIds
        );
    }

    /*
    =========================
    DELETE CHAT SESSIONS
    =========================
    */

    await supabase
      .from(
        'chat_sessions'
      )
      .delete()
      .eq(
        'report_id',
        id
      );

    /*
    =========================
    DELETE ANALYSIS
    =========================
    */

    await supabase
      .from(
        'report_analyses'
      )
      .delete()
      .eq(
        'report_id',
        id
      );

    /*
    =========================
    DELETE REPORT
    =========================
    */

    const {
      error,
    } =
      await supabase
        .from(
          'medical_reports'
        )
        .delete()
        .eq(
          'id',
          id
        );

    if (error)
      throw error;

    /*
    =========================
    UPDATE UI
    =========================
    */

    setReports(prev =>
      prev.filter(
        report =>
          report.id !==
          id
      )
    );

    toast.success(
      'Report deleted'
    );

  } catch (error) {

    console.log(
      error
    );

    toast.error(
      'Delete failed'
    );
  }
}
  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            My Reports
          </h1>

          <p className="text-slate-500 mt-1">
            Upload and manage medical reports
          </p>

        </div>

        <Button
          onClick={() =>
            setOpen(true)
          }
          className="bg-gradient-to-r from-blue-600 to-teal-500"
        >

          <Upload className="w-4 h-4 mr-2" />

          Upload Report

        </Button>
      </div>

      {/* REPORT TABLE */}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

        {loading ? (

          <div className="p-10 flex justify-center">

            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />

          </div>

        ) : reports.length ===
          0 ? (

          <div className="p-10 text-center text-slate-500">
            No reports uploaded
          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-50 border-b">

              <tr>

                <th className="text-left px-6 py-4">
                  Title
                </th>

                <th className="text-left px-6 py-4">
                  Category
                </th>

                <th className="text-left px-6 py-4">
                  Date
                </th>

                <th className="text-left px-6 py-4">
                  Status
                </th>

                <th className="text-right px-6 py-4">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {reports.map(
                (report) => (

                  <tr
                    key={
                      report.id
                    }
                    className="border-b"
                  >

                    <td className="px-6 py-4">

                      <p className="font-medium">
                        {
                          report.title
                        }
                      </p>

                      <p className="text-xs text-slate-400">
                        {formatFileSize(
                          report.file_size
                        )}
                      </p>

                    </td>

                    <td className="px-6 py-4">

                      <Badge
                        className={getCategoryColor(
                          report.category
                        )}
                      >
                        {
                          report.category
                        }
                      </Badge>

                    </td>

                    <td className="px-6 py-4">
                      {formatDate(
                        report.report_date
                      )}
                    </td>

                    <td className="px-6 py-4">

                      <Badge
                        className={getStatusColor(
                          report.status
                        )}
                      >
                        {
                          report.status
                        }
                      </Badge>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            window.open(
                              report.file_url,
                              '_blank'
                            )
                          }
                        >

                          <Eye className="w-4 h-4" />

                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              report.file_url
                            )
                          }
                        >

                          <Share2 className="w-4 h-4" />

                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            deleteReport(
                              report.id
                            )
                          }
                        >

                          <Trash2 className="w-4 h-4 text-red-500" />

                        </Button>

                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

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
              Upload Medical Report
            </DialogTitle>

          </DialogHeader>

          <div className="space-y-4">

            <div>

              <Label>
                Report Title
              </Label>

              <Input
                value={
                  form.title
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    title:
                      e.target
                        .value,
                  })
                }
              />

            </div>

            <div>

              <Label>
                Category
              </Label>

              <Select
                value={
                  form.category
                }
                onValueChange={(
                  value
                ) =>
                  setForm({
                    ...form,
                    category:
                      value,
                  })
                }
              >

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="general">
                    General
                  </SelectItem>

                  <SelectItem value="lab">
                    Lab
                  </SelectItem>

                  <SelectItem value="radiology">
                    Radiology
                  </SelectItem>

                  <SelectItem value="prescription">
                    Prescription
                  </SelectItem>

                </SelectContent>
              </Select>

            </div>

            <div>

              <Label>
                Report Date
              </Label>

              <Input
                type="date"
                value={
                  form.reportDate
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    reportDate:
                      e.target
                        .value,
                  })
                }
              />

            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200'
              }`}
            >

              <input
                {...getInputProps()}
              />

              {uploading ? (

                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />

              ) : (

                <>

                  <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />

                  <p className="font-medium">
                    Drag PDF or image here
                  </p>

                  <p className="text-sm text-slate-400">
                    or click to browse
                  </p>

                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}