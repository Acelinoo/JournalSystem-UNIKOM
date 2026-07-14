"use client";

import { useState, useTransition } from "react";
import { rejectFundRequestAction } from "@/app/actions/dashboard";

interface Props {
  pengajuanId: string;
  /** true = show Print PDF button (for approved entries), false = show Reject button (for pending) */
  isPrint: boolean;
}

export default function KaprodiActionButtons({ pengajuanId, isPrint }: Props) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (isPrint) {
    return (
      <button
        type="button"
        onClick={() => window.print()}
        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 text-white font-semibold rounded-xl px-5 py-2.5 hover:bg-emerald-800 transition-all shadow hover:shadow-lg active:scale-[0.98] text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        🖨️ Cetak PDF / Laporan Resmi
      </button>
    );
  }

  const handleReject = () => {
    if (!catatan.trim()) {
      setError("Catatan revisi wajib diisi.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        await rejectFundRequestAction(pengajuanId, catatan);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Gagal menolak pengajuan.");
      }
    });
  };

  return (
    <div className="w-full space-y-2">
      {!showRejectForm ? (
        <button
          type="button"
          onClick={() => setShowRejectForm(true)}
          className="w-full inline-flex items-center justify-center gap-2 bg-white text-red-700 border-2 border-red-300 font-semibold rounded-xl px-5 py-2.5 hover:bg-red-50 hover:border-red-400 transition-all text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Revisi / Tolak
        </button>
      ) : (
        <div className="border-2 border-red-200 rounded-xl p-3 bg-red-50 space-y-2">
          <p className="text-xs font-semibold text-red-700">Catatan Revisi / Alasan Penolakan</p>
          <textarea
            value={catatan}
            onChange={(e) => { setCatatan(e.target.value); setError(""); }}
            placeholder="Tuliskan alasan penolakan atau catatan revisi..."
            rows={3}
            className="w-full text-xs rounded-lg border border-red-200 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-600 text-white font-semibold rounded-lg px-3 py-2 hover:bg-red-700 transition-all text-xs disabled:opacity-60"
            >
              {isPending ? "Memproses..." : "✓ Konfirmasi Penolakan"}
            </button>
            <button
              type="button"
              onClick={() => { setShowRejectForm(false); setCatatan(""); setError(""); }}
              className="flex-1 inline-flex items-center justify-center bg-white border border-slate-300 text-slate-600 font-semibold rounded-lg px-3 py-2 hover:bg-slate-50 transition-all text-xs"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
