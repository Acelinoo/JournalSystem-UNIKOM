import { getDashboardStats } from "@/app/actions";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Ringkasan data dan aktivitas terbaru sistem jurnal</p>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="metric-value">{stats.totalEdisi}</div>
          <div className="metric-label">Edisi Jurnal</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="metric-value">{stats.totalEditor}</div>
          <div className="metric-label">Editor</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: "#fdf4ff", color: "#a855f7" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6" />
              <path d="M23 11h-6" />
            </svg>
          </div>
          <div className="metric-value">{stats.totalReviewer}</div>
          <div className="metric-label">Reviewer</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: "#fffbeb", color: "#d97706" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="metric-value">{stats.totalNaskah}</div>
          <div className="metric-label">Total Naskah</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="metric-value">{stats.pendingPengajuan}</div>
          <div className="metric-label">Pengajuan Pending</div>
        </div>
      </div>

      {/* Active Edition Info */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>📌 Edisi Jurnal Aktif</h3>
          {stats.activeEdisi && (
            <span className="badge badge-success">● Aktif</span>
          )}
        </div>
        {stats.activeEdisi ? (
          <div style={{ display: "flex", gap: 32, fontSize: 14 }}>
            <div>
              <span style={{ color: "#64748b" }}>Volume: </span>
              <strong>{stats.activeEdisi.volume}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Nomor: </span>
              <strong>{stats.activeEdisi.no}</strong>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Periode: </span>
              <strong>
                {stats.activeEdisi.bulan} {stats.activeEdisi.tahun}
              </strong>
            </div>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: "20px 0" }}>
            <p>Belum ada edisi jurnal aktif. Silakan buat di halaman Konfigurasi.</p>
          </div>
        )}
      </div>

      {/* Recent Manuscripts */}
      <div className="card">
        <div className="card-header">
          <h3>📝 Naskah Terbaru</h3>
          <span className="badge badge-info">{stats.recentNaskah.length} entri</span>
        </div>
        {stats.recentNaskah.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Author</th>
                  <th>Editor</th>
                  <th>Reviewer</th>
                  <th>Edisi</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentNaskah.map((n, i) => (
                  <tr
                    key={n.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <td style={{ fontWeight: 500, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {n.title}
                    </td>
                    <td>{n.author}</td>
                    <td>{n.editor.nama}</td>
                    <td>{n.reviewer.nama}</td>
                    <td>
                      <span className="badge badge-neutral">
                        Vol.{n.systemSetting.volume} No.{n.systemSetting.no}
                      </span>
                    </td>
                    <td style={{ color: "#64748b", fontSize: 13 }}>
                      {formatDate(n.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p>Belum ada naskah. Mulai input naskah di halaman Transaksi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
