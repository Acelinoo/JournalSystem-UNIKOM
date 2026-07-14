import { getKaprodiDashboardData, approveAndSignAction } from "@/app/actions/dashboard";

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
  const totalDisbursed = data.pengajuanList.reduce((sum, p) => sum + (p.status === "APPROVED" ? p.totalHonorNetto : 0), 0);

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
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ color: "#0f172a" }}>
              Kaprodi Approval Center
            </h2>
            <p className="text-slate-500 mt-1">
              Welcome, <strong className="text-slate-800">{data.kaprodiName}</strong> — Digital Signature Authority
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Pending Requests */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Requests</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalPending}</h3>
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Signed & Approved</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalApproved}</h3>
            </div>
          </div>
        </div>

        {/* Total Disbursed */}
        <div className="bg-slate-900 rounded-xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/10 text-emerald-400 rounded-lg backdrop-blur-sm border border-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300 mb-1">Total Approved Disbursement</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(totalDisbursed)}</h3>
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
              const approveWithId = approveAndSignAction.bind(null, p.id);

              return (
                <div key={p.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left: Request Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-lg font-bold text-slate-900">
                          Vol. {p.edisiJurnal.volume} No. {p.edisiJurnal.nomor} — {p.edisiJurnal.bulan} {p.edisiJurnal.tahun}
                        </h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                          isApproved
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}>
                          {isApproved ? "✓ Approved & Signed" : "⏳ Pending Approval"}
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
                        {p.catatanRevisi && <> • Note: <span className="text-slate-700">{p.catatanRevisi}</span></>}
                      </p>
                    </div>

                    {/* Right: Action / Signature */}
                    <div className="flex-shrink-0 lg:ml-6 flex flex-col items-center gap-3 min-w-[220px]">
                      {isApproved ? (
                        <div className="w-full border-2 border-emerald-200 bg-emerald-50 rounded-xl p-4 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                            <span className="text-emerald-700 font-bold text-sm">Digitally Signed</span>
                          </div>
                          <p className="text-xs text-emerald-600 font-mono break-all leading-relaxed">
                            {p.tandaTanganKaprodi}
                          </p>
                          <div className="mt-2 pt-2 border-t border-emerald-200">
                            <p className="text-[10px] text-emerald-500 font-medium">Verified • Secure Hash Signature</p>
                          </div>
                        </div>
                      ) : (
                        <form action={approveWithId} className="w-full">
                          <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold rounded-xl px-6 py-3 hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-sm"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            Approve & Sign Digitally
                          </button>
                          <p className="text-[11px] text-slate-400 text-center mt-2">
                            This action will apply your digital signature
                          </p>
                        </form>
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
