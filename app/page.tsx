'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain, Shield, Upload, MessageSquare, Search, Share2, Activity,
  ChevronRight, Star, Check, Zap, Lock, FileText, ArrowRight,
  Stethoscope, FlaskConical, Pill, Scan, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const FEATURES = [
  { icon: Brain, title: 'AI Report Analysis', desc: 'Automatic extraction of key findings, medications, and abnormal values from any medical report.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: MessageSquare, title: 'Chat With Your Reports', desc: 'Ask questions about your medical history in plain English. Our AI answers with context from all your reports.', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Shield, title: 'Secure Sharing', desc: 'Generate encrypted share links with optional PIN protection and expiry dates for doctors or family.', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Search, title: 'Semantic Search', desc: 'Search across all your reports using natural language. Find what matters in seconds.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Activity, title: 'Health Timeline', desc: 'Visualize your complete medical history on an interactive timeline. Spot patterns and trends.', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: Pill, title: 'Prescription Scanner', desc: 'Extract and organize medications from prescriptions with dosage, frequency, and instructions.', color: 'text-sky-600', bg: 'bg-sky-50' },
];

const TESTIMONIALS = [
  { name: 'Dr. Sarah Chen', role: 'Cardiologist', text: 'HealX AI has transformed how I review patient histories. I can now understand a patient\'s complete health picture in minutes instead of hours.', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'Patient', text: 'Finally I can understand my own lab results! The plain English explanations are lifesaving. I feel empowered in my healthcare decisions.', avatar: 'MJ' },
  { name: 'Dr. Aisha Patel', role: 'Internal Medicine', text: 'The RAG-powered chat is incredible. Asking the AI to compare trends across 2 years of reports gives me insights I could not easily get before.', avatar: 'AP' },
];

const PRICING = [
  { name: 'Free', price: 0, features: ['5 reports/month', 'Basic AI analysis', 'Chat with reports', '1 GB storage', 'Secure sharing'], cta: 'Get Started Free', highlight: false },
  { name: 'Pro', price: 19, features: ['Unlimited reports', 'Advanced AI analysis', 'Priority processing', '20 GB storage', 'Prescription scanner', 'Health timeline', 'API access'], cta: 'Start Pro Trial', highlight: true },
  { name: 'Clinic', price: 79, features: ['Everything in Pro', 'Doctor dashboard', 'Multi-patient management', '100 GB storage', 'Custom integrations', 'Priority support', 'HIPAA compliance'], cta: 'Contact Sales', highlight: false },
];

const FAQS = [
  { q: 'How does HealX AI analyze my medical reports?', a: 'We use state-of-the-art large language models (Groq-powered Llama 3) combined with a RAG pipeline. Your reports are parsed, embedded, and stored in a vector database, allowing the AI to provide contextually accurate analysis.' },
  { q: 'Is my medical data secure?', a: 'Absolutely. All reports are encrypted at rest and in transit. We use Supabase for secure storage, JWT authentication, and role-based access control. We never train AI models on your personal data.' },
  { q: 'What file formats are supported?', a: 'HealX AI supports PDF reports, JPEG/PNG images of reports and prescriptions, and scanned documents. Our OCR technology extracts text from images automatically.' },
  { q: 'Can I share reports with my doctor?', a: 'Yes! You can generate secure share links with optional PIN protection and expiry dates. Doctors get a read-only view with full AI analysis included.' },
  { q: 'How accurate is the AI analysis?', a: 'Our AI provides high-quality summaries and extractions, but it is designed to assist — not replace — medical professionals. Always consult your doctor for medical decisions.' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">HealX AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0">
                Get Started Free
              </Button>
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-slate-700">Features</a>
            <a href="#pricing" className="text-slate-700">Pricing</a>
            <a href="#faq" className="text-slate-700">FAQ</a>
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link href="/auth/login"><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link href="/auth/signup"><Button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0">Get Started Free</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 mesh-bg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-100 rounded-full opacity-30 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp}>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-6 px-4 py-1.5 text-sm font-medium">
                <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
                Powered by Groq + Llama 3
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
              Your AI Medical
              <span className="block bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                Copilot
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload any medical report. Get instant AI analysis, plain-English explanations, and secure sharing — all powered by cutting-edge RAG technology.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0 px-8 h-12 text-base font-semibold shadow-lg shadow-blue-200">
                  Start for Free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="px-8 h-12 text-base border-slate-200 hover:bg-slate-50">
                  View Demo
                </Button>
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-slate-400">
              No credit card required &middot; HIPAA-friendly &middot; 5 free reports/month
            </motion.p>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200 overflow-hidden bg-white">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-md px-3 py-1 text-xs text-slate-400 border border-slate-200 w-64 mx-auto text-center">
                    app.healxai.com/dashboard
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 min-h-80">
                <div className="col-span-1 bg-slate-900 p-4 space-y-2">
                  {['Dashboard', 'Reports', 'AI Chat', 'Timeline', 'Search', 'Share'].map((item, idx) => (
                    <div key={item} className={`px-3 py-2 rounded-lg text-xs font-medium ${idx === 0 ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="col-span-3 p-6 bg-slate-50">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Total Reports', val: '24', color: 'text-blue-600' },
                      { label: 'Analyzed', val: '21', color: 'text-green-600' },
                      { label: 'Shared', val: '5', color: 'text-amber-600' },
                    ].map(s => (
                      <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                        <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="text-xs font-semibold text-slate-700 mb-3">Recent Reports</div>
                    {[
                      { name: 'Blood Panel - CBC', icon: FlaskConical, bg: 'bg-blue-100', ic: 'text-blue-600', ago: '2 days ago' },
                      { name: 'Chest X-Ray Report', icon: Scan, bg: 'bg-amber-100', ic: 'text-amber-600', ago: '1 week ago' },
                      { name: 'Lipid Profile Test', icon: Activity, bg: 'bg-green-100', ic: 'text-green-600', ago: '2 weeks ago' },
                    ].map(r => (
                      <div key={r.name} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${r.bg}`}>
                          <r.icon className={`w-3.5 h-3.5 ${r.ic}`} />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-slate-700">{r.name}</div>
                          <div className="text-xs text-slate-400">{r.ago}</div>
                        </div>
                        <Badge className="text-xs bg-emerald-50 text-emerald-700 border-0">Analyzed</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 mb-8 uppercase tracking-widest font-medium">Trusted AI Infrastructure</p>
          <div className="flex flex-wrap justify-center gap-10 items-center">
            {['Groq API', 'Supabase', 'LangChain', 'ChromaDB', 'Llama 3'].map(tech => (
              <span key={tech} className="font-semibold text-slate-500">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp}>
              <Badge className="bg-teal-50 text-teal-700 border-teal-200 mb-4">Platform Features</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold text-slate-900 mb-4">
              Everything your health records need
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mx-auto">
              From AI-powered analysis to secure sharing — HealX AI handles your entire medical data workflow.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <motion.div key={f.title} variants={fadeUp} className="group p-6 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 bg-white">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">From upload to insight in seconds</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: 'Upload Report', desc: 'Drag and drop any PDF, image, or document. We accept lab results, X-rays, prescriptions, and more.' },
              { icon: Brain, title: 'AI Analyzes', desc: 'Our RAG pipeline parses, embeds, and analyzes your report using Groq Llama 3 in seconds.' },
              { icon: MessageSquare, title: 'Get Insights', desc: 'Receive a plain-English summary, key findings, and chat with an AI that knows your full history.' },
            ].map(s => (
              <div key={s.title} className="text-center">
                <div className="w-24 h-24 bg-white rounded-full border-2 border-blue-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-50">
                  <s.icon className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-green-50 text-green-700 border-green-200 mb-4">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Loved by doctors and patients</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white text-sm font-bold">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 mb-4">Pricing</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500 text-lg">Start free, upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map(p => (
              <div key={p.name} className={`rounded-2xl p-8 ${p.highlight ? 'bg-gradient-to-b from-blue-600 to-teal-500 text-white shadow-2xl shadow-blue-200 scale-105' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <div className={`text-sm font-semibold mb-4 ${p.highlight ? 'text-blue-100' : 'text-slate-500'}`}>{p.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">${p.price}</span>
                  <span className={`text-sm ${p.highlight ? 'text-blue-100' : 'text-slate-400'}`}>/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${p.highlight ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={p.highlight ? 'text-blue-50' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup">
                  <Button className={`w-full ${p.highlight ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                    {p.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 mb-4">FAQ</Badge>
            <h2 className="text-4xl font-bold text-slate-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {faq.q}
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Start understanding your health today
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands who use HealX AI to manage, understand, and share their medical records securely.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 h-12 text-base font-semibold shadow-xl">
              Get Started Free — No Card Needed
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-white">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              HealX AI
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              <Link href="/auth/login" className="hover:text-white transition-colors">Login</Link>
            </div>
            <p className="text-sm text-slate-500">&copy; 2026 HealX AI. Built for better health.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
