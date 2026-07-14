import { getReviewerDashboardData, submitReviewAction } from "@/app/actions/dashboard";

export default async function ReviewerDashboardPage() {
  const data = await getReviewerDashboardData();

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
      month: "short",
      year: "numeric"
    });
  };

  const toReviewCount = data.naskahList.length;
  // Calculate completed reviews dynamically from the database status
  const completedReviews = data.naskahList.filter(n => n.statusReview === "Approved with Revision").length;
  const calculatedHonor = completedReviews * data.honorPerNaskah;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="page-header border-b border-slate-200 pb-6 mb-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ color: "#0f172a" }}>Peer Review Portal</h2>
        <p className="text-slate-500 mt-2">
          Welcome, <strong className="text-slate-800">{data.reviewerName}</strong>. Thank you for your contribution to academic excellence.
        </p>
      </div>

      {/* Reviewer Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-700"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Manuscripts to Review</p>
              <h3 className="text-3xl font-bold text-slate-900">{toReviewCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Completed Reviews</p>
              <h3 className="text-3xl font-bold text-slate-900">{completedReviews}</h3>
            </div>
          </div>
        </div>

        {/* Prominent Honorarium Card */}
        <div className="bg-slate-900 rounded-xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/10 text-emerald-400 rounded-lg backdrop-blur-sm border border-white/10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300 mb-1">Estimasi Honorarium</p>
              <h3 className="text-2xl font-bold text-white">{formatCurrency(calculatedHonor)}</h3>
              <p className="text-xs text-slate-400 mt-1">Berdasarkan {completedReviews} review selesai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-slate-800 font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            My Review Assignments
          </h3>
        </div>
        
        {data.naskahList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Manuscript Info</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Assigned By</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Review Status</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.naskahList.map((n, idx) => {
                  const isCompleted = n.statusReview === "Approved with Revision";
                  const statusLabel = n.statusReview;
                  const statusBadgeClass = isCompleted 
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                    : "bg-amber-100 text-amber-800 border-amber-200";

                  const submitReviewWithId = submitReviewAction.bind(null, n.id);

                  return (
                    <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 mb-1">{n.judul}</p>
                        <p className="text-xs text-slate-500">Author: {n.author} • Date: {formatDate(n.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                            {n.editor.nama.charAt(0)}
                          </div>
                          <span className="text-slate-700">{n.editor.nama}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusBadgeClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col gap-2 items-end">
                          <a 
                            href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 px-3 py-1.5 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Draft
                          </a>
                          <form action={submitReviewWithId}>
                            <button type="submit" className={`inline-flex items-center gap-1.5 text-xs font-medium rounded px-3 py-1.5 transition-colors ${
                              isCompleted 
                              ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                            }`} disabled={isCompleted}>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                              </svg>
                              {isCompleted ? 'Submitted' : 'Submit Review'}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <p className="text-lg font-medium text-slate-700 mb-1">No Manuscripts to Review</p>
            <p className="text-sm">You currently have no manuscripts assigned for review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
