import { getEditorDashboardData } from "@/app/actions/dashboard";

export default async function EditorDashboardPage() {
  const data = await getEditorDashboardData();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Mocked metrics for Editor demo
  const assignedCount = data.naskahList.length;
  const pendingReviews = assignedCount > 0 ? Math.max(1, Math.floor(assignedCount / 2)) : 0;
  const completedIssues = 12; // Example static data

  return (
    <div className="animate-fade-in space-y-6">
      <div className="page-header border-b border-slate-200 pb-6 mb-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight" style={{ color: "#0f172a" }}>Editorial Progress Dashboard</h2>
        <p className="text-slate-500 mt-2">
          Welcome back, <strong className="text-slate-800">{data.editorName}</strong>. Here is the overview of your editorial tasks.
        </p>
      </div>

      {/* Editor Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-900"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-900 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Assigned Manuscripts</p>
              <h3 className="text-3xl font-bold text-slate-900">{assignedCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Reviews</p>
              <h3 className="text-3xl font-bold text-slate-900">{pendingReviews}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Completed Issues</p>
              <h3 className="text-3xl font-bold text-slate-900">{completedIssues}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Manuscript Management
          </h3>
        </div>
        
        {data.naskahList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Manuscript Title</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Author</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Reviewer</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-xs">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.naskahList.map((n, idx) => {
                  // Mock some varied statuses for the demo
                  const statuses = ["In Editing", "Assigned to Reviewer", "Ready for Publish"];
                  const badgeColors = {
                    "In Editing": "bg-blue-100 text-blue-800 border-blue-200",
                    "Assigned to Reviewer": "bg-amber-100 text-amber-800 border-amber-200",
                    "Ready for Publish": "bg-emerald-100 text-emerald-800 border-emerald-200"
                  };
                  const currentStatus = statuses[idx % statuses.length];
                  const badgeClass = badgeColors[currentStatus as keyof typeof badgeColors];

                  return (
                    <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 mb-1">{n.title}</p>
                        <p className="text-xs text-slate-500">Submitted: {formatDate(n.createdAt)} • Vol.{n.systemSetting.volume} No.{n.systemSetting.no}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{n.author}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {n.reviewer.nama.charAt(0)}
                          </div>
                          <span className="text-slate-700">{n.reviewer.nama}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${badgeClass}`}>
                            {currentStatus}
                          </span>
                          <select className="text-xs border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:border-slate-500 cursor-pointer" defaultValue="">
                            <option value="" disabled>Update Status...</option>
                            <option value="In Editing">In Editing</option>
                            <option value="Assigned to Reviewer">Assigned to Reviewer</option>
                            <option value="Ready for Publish">Ready for Publish</option>
                          </select>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p className="text-lg font-medium text-slate-700 mb-1">No Manuscripts Assigned</p>
            <p className="text-sm">You currently have no editorial tasks pending.</p>
          </div>
        )}
      </div>
    </div>
  );
}
