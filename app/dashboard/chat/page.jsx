'use client';

import {
  useEffect,
  useState,
  useRef,
} from 'react';

import { supabase }
from '@/lib/supabase';

import { useAuthStore }
from '@/store/authStore';

import {
  MessageCircle,
  Send,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';

import { Button }
from '@/components/ui/button';

import { Input }
from '@/components/ui/input';

import { toast }
from 'sonner';

import { timeAgo }
from '@/lib/utils';

export default function ChatPage() {

  const { user } =
    useAuthStore();

  /*
  =========================
  STATES
  =========================
  */

  const [
    sessions,
    setSessions,
  ] = useState([]);

  const [
    currentSession,
    setCurrentSession,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    reports,
    setReports,
  ] = useState([]);

  const [
    selectedReport,
    setSelectedReport,
  ] = useState(null);

  const [
    input,
    setInput,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    loadingSessions,
    setLoadingSessions,
  ] = useState(true);

  const messagesEndRef =
    useRef(null);

  /*
  =========================
  SCROLL
  =========================
  */

  const scrollToBottom =
    () =>
      messagesEndRef.current?.scrollIntoView({
        behavior:
          'smooth',
      });

  useEffect(
    scrollToBottom,
    [messages]
  );

  /*
  =========================
  LOAD DATA
  =========================
  */

  useEffect(() => {

    if (user?.id) {

      loadReports();

      loadSessions();
    }

  }, [user?.id]);

  useEffect(() => {

    if (
      currentSession?.id
    ) {

      loadMessages();
    }

  }, [currentSession?.id]);

  /*
  =========================
  LOAD REPORTS
  =========================
  */

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
          );

      if (error)
        throw error;

      setReports(
        data || []
      );

      if (
        data &&
        data.length > 0
      ) {

        setSelectedReport(
          data[0]
        );
      }

    } catch {

      toast.error(
        'Failed to load reports'
      );
    }
  }

  /*
  =========================
  LOAD SESSIONS
  =========================
  */

  async function loadSessions() {

    if (!user?.id)
      return;

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from(
            'chat_sessions'
          )
          .select('*')
          .eq(
            'user_id',
            user.id
          )
          .order(
            'updated_at',
            {
              ascending:
                false,
            }
          );

      if (error)
        throw error;

      setSessions(
        data || []
      );

      if (
        data?.length > 0
      ) {

        setCurrentSession(
          data[0]
        );
      }

    } catch {

      toast.error(
        'Failed to load chat sessions'
      );

    } finally {

      setLoadingSessions(
        false
      );
    }
  }

  /*
  =========================
  LOAD MESSAGES
  =========================
  */

  async function loadMessages() {

    if (
      !currentSession?.id
    )
      return;

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from(
            'chat_messages'
          )
          .select('*')
          .eq(
            'session_id',
            currentSession.id
          )
          .order(
            'created_at',
            {
              ascending:
                true,
            }
          );

      if (error)
        throw error;

      setMessages(
        data || []
      );

    } catch {

      toast.error(
        'Failed to load messages'
      );
    }
  }

  /*
  =========================
  CREATE SESSION
  =========================
  */

  async function createNewSession() {

    if (
      !selectedReport
    ) {

      toast.error(
        'Select report first'
      );

      return;
    }

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from(
            'chat_sessions'
          )
          .insert({

            user_id:
              user.id,

            title:
              selectedReport.title,

            report_id:
              selectedReport.id,
          })
          .select()
          .single();

      if (error)
        throw error;

      setSessions(
        (prev) => [
          data,
          ...prev,
        ]
      );

      setCurrentSession(
        data
      );

      setMessages([]);

      toast.success(
        'New chat started'
      );

    } catch {

      toast.error(
        'Failed to create chat'
      );
    }
  }

  /*
  =========================
  DELETE SESSION
  =========================
  */

  async function deleteSession(
    sessionId
  ) {

    const confirmDelete =
      confirm(
        'Delete this chat?'
      );

    if (!confirmDelete)
      return;

    try {

      /*
      =========================
      DELETE MESSAGES
      =========================
      */

      await supabase
        .from(
          'chat_messages'
        )
        .delete()
        .eq(
          'session_id',
          sessionId
        );

      /*
      =========================
      DELETE SESSION
      =========================
      */

      await supabase
        .from(
          'chat_sessions'
        )
        .delete()
        .eq(
          'id',
          sessionId
        );

      /*
      =========================
      UPDATE UI
      =========================
      */

      const updated =
        sessions.filter(
          s =>
            s.id !==
            sessionId
        );

      setSessions(
        updated
      );

      /*
      =========================
      RESET CURRENT SESSION
      =========================
      */

      if (
        currentSession?.id ===
        sessionId
      ) {

        setCurrentSession(
          updated[0] ||
            null
        );

        setMessages([]);
      }

      toast.success(
        'Chat deleted'
      );

    } catch {

      toast.error(
        'Delete failed'
      );
    }
  }

  /*
  =========================
  SEND MESSAGE
  =========================
  */

  async function sendMessage(
    e
  ) {

    e.preventDefault();

    if (
      !input.trim() ||
      !currentSession?.id
    )
      return;

    const userMessage =
      input;

    setInput('');

    setLoading(true);

    try {

      /*
      =========================
      SAVE USER MESSAGE
      =========================
      */

      await supabase
        .from(
          'chat_messages'
        )
        .insert({

          session_id:
            currentSession.id,

          user_id:
            user.id,

          role:
            'user',

          content:
            userMessage,
        });

      setMessages(
        (prev) => [
          ...prev,
          {
            id:
              Date.now(),

            role:
              'user',

            content:
              userMessage,
          },
        ]
      );

      /*
      =========================
      AI REQUEST
      =========================
      */

      const response =
        await fetch(
          '/api/chat',
          {

            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({

              message:
                userMessage,

              reportId:
                currentSession.report_id,
            }),
          }
        );

      const data =
        await response.json();

      /*
      =========================
      SAVE AI MESSAGE
      =========================
      */

      await supabase
        .from(
          'chat_messages'
        )
        .insert({

          session_id:
            currentSession.id,

          user_id:
            user.id,

          role:
            'assistant',

          content:
            data.response,
        });

      setMessages(
        (prev) => [
          ...prev,
          {
            id:
              Date.now() +
              1,

            role:
              'assistant',

            content:
              data.response,
          },
        ]
      );

    } catch {

      toast.error(
        'Chat failed'
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="flex h-[calc(100vh-200px)] gap-4">

      {/* SIDEBAR */}

      <div className="w-72 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">

        {/* TOP */}

        <div className="p-4 border-b">

          {/* REPORT SELECT */}

          <select

            value={
              selectedReport?.id ||
              ''
            }

            onChange={(e) => {

              const report =
                reports.find(
                  r =>
                    r.id ===
                    e.target.value
                );

              setSelectedReport(
                report
              );
            }}

            className="w-full border rounded-lg px-3 py-2 mb-3"
          >

            {reports.map(
              report => (

                <option
                  key={report.id}
                  value={report.id}
                >

                  {report.title}

                </option>
              )
            )}
          </select>

          {/* NEW CHAT */}

          <Button
            onClick={
              createNewSession
            }
            className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white"
          >

            <Plus className="w-4 h-4 mr-2" />

            New Chat

          </Button>
        </div>

        {/* SESSIONS */}

        <div className="flex-1 overflow-y-auto">

          {loadingSessions ? (

            <div className="p-4 text-center text-slate-400 text-sm">
              Loading...
            </div>

          ) : sessions.length ===
            0 ? (

            <div className="p-4 text-center text-slate-400 text-sm">
              No chats yet
            </div>

          ) : (

            sessions.map(
              session => (

                <div
                  key={session.id}

                  className={`flex items-center justify-between px-4 py-3 border-b hover:bg-slate-50 ${
                    currentSession?.id ===
                    session.id
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : ''
                  }`}
                >

                  <button

                    onClick={() =>
                      setCurrentSession(
                        session
                      )
                    }

                    className="flex-1 text-left"
                  >

                    <p className="font-medium text-sm truncate">
                      {
                        session.title
                      }
                    </p>

                    <p className="text-xs text-slate-400">
                      {timeAgo(
                        session.updated_at
                      )}
                    </p>

                  </button>

                  {/* DELETE */}

                  <button

                    onClick={() =>
                      deleteSession(
                        session.id
                      )
                    }

                    className="ml-2 text-red-500 hover:text-red-700"
                  >

                    <Trash2 className="w-4 h-4" />

                  </button>
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* CHAT AREA */}

      <div className="flex-1 bg-white rounded-xl border shadow-sm flex flex-col">

        {/* HEADER */}

        <div className="p-4 border-b">

          <h2 className="font-semibold text-lg">
            {currentSession?.title ||
              'AI Chat'}
          </h2>

          <p className="text-sm text-slate-400">
            Ask questions about selected medical report
          </p>
        </div>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.length ===
          0 ? (

            <div className="flex flex-col items-center justify-center h-full text-center">

              <MessageCircle className="w-12 h-12 text-slate-300 mb-4" />

              <p className="text-slate-500">
                Ask anything about your selected medical report
              </p>
            </div>

          ) : (

            messages.map(
              (
                msg,
                i
              ) => (

                <div
                  key={i}
                  className={`flex ${
                    msg.role ===
                    'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl ${
                      msg.role ===
                      'user'
                        ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >

                    <p className="text-sm whitespace-pre-wrap">
                      {
                        msg.content
                      }
                    </p>
                  </div>
                </div>
              )
            )
          )}

          {loading && (

            <div className="flex justify-start">

              <div className="bg-slate-100 px-4 py-3 rounded-2xl">

                <Loader2 className="w-4 h-4 animate-spin" />

              </div>
            </div>
          )}

          <div
            ref={
              messagesEndRef
            }
          />
        </div>

        {/* INPUT */}

        <div className="p-4 border-t">

          <form
            onSubmit={
              sendMessage
            }
            className="flex gap-2"
          >

            <Input
              placeholder="Ask about this report..."

              value={input}

              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
            />

            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white"
            >

              <Send className="w-4 h-4" />

            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}