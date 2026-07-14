import { getKaprodiDashboardData, approveAndSignAction, rejectFundRequestAction } from "@/app/actions/dashboard";
import KaprodiActionButtons from "./KaprodiActionButtons";

export default async function KaprodiDashboardPage() {
  const data = await getKaprodiDashboardData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const totalPending = data.pengajuanList.filter(p => p.status === "PENDING").length;
  const totalApproved = data.pengajuanList.filter(p => p.status === "APPROVED").length;
  const totalRejected = data.pengajuanList.filter(p => p.status === "REJECTED").length;
  const totalDisbursed = data.pengajuanList.reduce(
    (sum, p) => sum + (p.status === "APPROVED" ? p.totalHonorNetto : 0), 0
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Header */}
      <div className="page-header border-b border-slate-200 pb-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-900 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Kaprodi Approval Center
            </h2>
            <p className="text-slate-500 mt-1">
              Welcome, <strong className="text-slate-800">{data.kaprodiName}</strong> — Digital Signature Authority
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-0.5">Pending</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalPending}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-0.5">Signed & Approved</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalApproved}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-0.5">Dikembalikan</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalRejected}</h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500 rounded-full opacity-20 blur-xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/10 text-emerald-400 rounded-lg border border-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300 mb-0.5">Total Approved Disbursement</p>
              <h3 className="text-xl font-bold text-white">{formatCurrency(totalDisbursed)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Request Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Honorarium Fund Requests
          </h3>
        </div>

        {data.pengajuanList.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.pengajuanList.map((p) => {
              const isApproved = p.status === "APPROVED";
              const isRejected = p.status === "REJECTED";
              const isPending = p.status === "PENDING";
              const approveWithId = approveAndSignAction.bind(null, p.id);

              return (
                <div key={p.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left: Request Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-900">
                          Vol. {p.edisiJurnal.volume} No. {p.edisiJurnal.nomor} — {p.edisiJurnal.bulan} {p.edisiJurnal.tahun}
                        </h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                          isApproved
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : isRejected
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}>
                          {isApproved ? "✓ Approved & Signed" : isRejected ? "❌ Dikembalikan untuk Revisi" : "⏳ Pending Approval"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                          <p className="text-slate-500 text-xs font-medium mb-1">Honor Bruto</p>
                          <p className="text-slate-900 font-bold">{formatCurrency(p.totalHonorBruto)}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                          <p className="text-slate-500 text-xs font-medium mb-1">Potongan Pajak</p>
                          <p className="text-red-600 font-bold">- {formatCurrency(p.totalPotonganPajak)}</p>
                        </div>
                        <div className="bg-slate-900 rounded-lg px-4 py-3">
                          <p className="text-slate-400 text-xs font-medium mb-1">Honor Netto (Cair)</p>
                          <p className="text-white font-bold">{formatCurrency(p.totalHonorNetto)}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500">
                        Submitted: {formatDate(p.tanggalPengajuan)}
                      </p>

                      {/* Rejection notes display */}
                      {isRejected && p.catatanRevisi && (
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-1">
                          <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                          <div>
                            <p className="text-xs font-semibold text-amber-800 mb-0.5">Catatan Revisi:</p>
                            <p className="text-xs text-amber-700">{p.catatanRevisi}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Action / Signature Panel */}
                    <div className="flex-shrink-0 lg:ml-4 flex flex-col items-stretch gap-3 min-w-[240px]">
                      {isApproved && (
                        <>
                          {/* Official Approval Stamp */}
                          <div className="w-full border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-center relative overflow-hidden">
                            {/* Decorative background seal */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                              <svg className="w-32 h-32 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                              </svg>
                            </div>
                            <div className="relative z-10">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                                </svg>
                                <span className="text-emerald-800 font-bold text-sm uppercase tracking-wide">Officially Approved</span>
                              </div>
                              <div className="border border-emerald-200 rounded-lg bg-white/70 px-3 py-2 mb-2">
                                <p className="text-[10px] text-emerald-600 font-mono break-all leading-relaxed">
                                  {p.tandaTanganKaprodi}
                                </p>
                              </div>
                              <div className="flex items-center justify-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                <p className="text-[10px] text-emerald-600 font-semibold">Verified Digital Certificate • Secure Hash Signature</p>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                              </div>
                            </div>
                          </div>
                          {/* Print PDF button for approved entries */}
                          <KaprodiActionButtons pengajuanId={p.id} isPrint />
                        </>
                      )}

                      {isPending && (
                        <div className="w-full space-y-2">
                          {/* Approve button */}
                          <form action={approveWithId} className="w-full">
                            <button
                              type="submit"
                              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold rounded-xl px-5 py-2.5 hover:bg-slate-800 transition-all shadow hover:shadow-lg active:scale-[0.98] text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                              </svg>
                              Setujui &amp; Tanda Tangan
                            </button>
                          </form>
                          {/* Reject button — client component for textarea interaction */}
                          <KaprodiActionButtons pengajuanId={p.id} isPrint={false} />
                        </div>
                      )}

                      {isRejected && (
                        <div className="w-full border-2 border-red-200 bg-red-50 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="text-red-700 font-bold text-sm">Dikembalikan</span>
                          </div>
                          <p className="text-xs text-red-500">Admin dapat generate ulang untuk reset status.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <p className="text-lg font-medium text-slate-700 mb-1">No Fund Requests</p>
            <p className="text-sm">There are currently no honorarium disbursement requests to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
