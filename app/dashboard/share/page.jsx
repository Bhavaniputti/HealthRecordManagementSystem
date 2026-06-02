'use client';

import { Share2 } from 'lucide-react';

export default function SharePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <Share2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Secure Sharing</h2>
        <p className="text-slate-500 mb-6">Generate encrypted share links for doctors or family</p>
        <p className="text-sm text-slate-400">Upload reports to enable secure sharing options</p>
      </div>
    </div>
  );
}
