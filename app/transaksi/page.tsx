import {
  createNaskah,
  getActiveEdisi,
  getEditorList,
  getReviewerList,
  getNaskahByEdisi,
} from "@/app/actions";
import OjsSyncButton from "@/app/components/OjsSyncButton";

export default async function TransaksiPage() {
  const [activeEdisi, editors, reviewers] = await Promise.all([
    getActiveEdisi(),
    getEditorList(),
    getReviewerList(),
  ]);

  const naskahList = activeEdisi
    ? await getNaskahByEdisi(activeEdisi.id)
    : [];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Input Naskah</h2>
        <p>Tambahkan naskah baru ke edisi jurnal yang sedang aktif</p>
      </div>

      {/* Active Edition Banner */}
      {activeEdisi ? (
        <div
          style={{
            padding: "14px 20px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 10,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
          }}
        >
          <span style={{ fontSize: 18 }}>📗</span>
          <span>
            Edisi aktif:{" "}
            <strong>
              Vol. {activeEdisi.volume} No. {activeEdisi.nomor} — {activeEdisi.bulan}{" "}
              {activeEdisi.tahun}
            </strong>
          </span>
          <span className="badge badge-success" style={{ marginLeft: "auto" }}>
            ● Aktif
          </span>
        </div>
      ) : (
        <div
          style={{
            padding: "14px 20px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 10,
            marginBottom: 24,
            fontSize: 14,
            color: "#92400e",
          }}
        >
          ⚠️ Tidak ada edisi jurnal aktif. Silakan aktifkan edisi di halaman{" "}
          <a href="/konfigurasi" style={{ fontWeight: 600, textDecoration: "underline" }}>
            Konfigurasi
          </a>
          .
        </div>
      )}

      {/* OJS UNIKOM Sync Section */}
      <OjsSyncButton />

      <div className="grid-2">
        {/* Input Form */}
        <div className="card">
          <div className="card-header">
            <h3>📝 Form Input Naskah</h3>
          </div>

          {activeEdisi && editors.length > 0 && reviewers.length > 0 ? (
            <form action={createNaskah}>
              <div className="form-group">
                <label className="form-label" htmlFor="judul">
                  Judul Naskah *
                </label>
                <input
                  id="judul"
                  name="judul"
                  type="text"
                  className="form-input"
                  placeholder="Masukkan judul naskah"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="author">
                  Nama Author *
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  className="form-input"
                  placeholder="Nama penulis naskah"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="editorId">
                    Editor *
                  </label>
                  <select
                    id="editorId"
                    name="editorId"
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Editor</option>
                    {editors.map((ed) => (
                      <option key={ed.id} value={ed.id}>
                        {ed.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reviewerId">
                    Reviewer *
                  </label>
                  <select
                    id="reviewerId"
                    name="reviewerId"
                    className="form-input"
                    required
                  >
                    <option value="">Pilih Reviewer</option>
                    {reviewers.map((rv) => (
                      <option key={rv.id} value={rv.id}>
                        {rv.nama} — {rv.institusi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Simpan Naskah
              </button>
            </form>
          ) : (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <p>
                {!activeEdisi
                  ? "Aktifkan edisi jurnal terlebih dahulu."
                  : editors.length === 0
                    ? "Tambahkan editor terlebih dahulu di Data Master."
                    : "Tambahkan reviewer terlebih dahulu di Data Master."}
              </p>
            </div>
          )}
        </div>

        {/* Naskah List */}
        <div className="card">
          <div className="card-header">
            <h3>📋 Daftar Naskah Edisi Aktif</h3>
            <span className="badge badge-info">{naskahList.length} naskah</span>
          </div>

          {naskahList.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Judul</th>
                    <th>Author</th>
                    <th>Editor</th>
                    <th>Reviewer</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {naskahList.map((n, i) => (
                    <tr key={n.id}>
                      <td style={{ color: "#94a3b8" }}>{i + 1}</td>
                      <td style={{ fontWeight: 500, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {n.judul}
                      </td>
                      <td>{n.author}</td>
                      <td>{n.editor.nama}</td>
                      <td>{n.reviewer.nama}</td>
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
              <p>Belum ada naskah untuk edisi ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
