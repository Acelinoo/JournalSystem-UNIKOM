import {
  createEdisiJurnal,
  toggleEdisiJurnal,
  upsertPengaturanTarif,
  getEdisiJurnalList,
  getPengaturanTarif,
} from "@/app/actions";

export default async function KonfigurasiPage() {
  const [edisiList, tarif] = await Promise.all([
    getEdisiJurnalList(),
    getPengaturanTarif(),
  ]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2>Konfigurasi</h2>
        <p>Kelola edisi jurnal dan pengaturan tarif honor</p>
      </div>

      <div className="grid-2">
        {/* ===== EDISI JURNAL SECTION ===== */}
        <div className="card">
          <div className="card-header">
            <h3>📖 Edisi Jurnal</h3>
            <span className="badge badge-info">{edisiList.length} edisi</span>
          </div>

          {/* Create Form */}
          <form action={createEdisiJurnal} style={{ marginBottom: 24 }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="volume">
                  Volume
                </label>
                <input
                  id="volume"
                  name="volume"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Contoh: 5"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="nomor">
                  Nomor
                </label>
                <input
                  id="nomor"
                  name="nomor"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Contoh: 2"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="bulan">
                  Bulan
                </label>
                <select id="bulan" name="bulan" className="form-input" required>
                  <option value="">Pilih Bulan</option>
                  <option value="Januari">Januari</option>
                  <option value="Februari">Februari</option>
                  <option value="Maret">Maret</option>
                  <option value="April">April</option>
                  <option value="Mei">Mei</option>
                  <option value="Juni">Juni</option>
                  <option value="Juli">Juli</option>
                  <option value="Agustus">Agustus</option>
                  <option value="September">September</option>
                  <option value="Oktober">Oktober</option>
                  <option value="November">November</option>
                  <option value="Desember">Desember</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="tahun">
                  Tahun
                </label>
                <input
                  id="tahun"
                  name="tahun"
                  type="number"
                  min="2020"
                  max="2030"
                  className="form-input"
                  placeholder="Contoh: 2026"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah Edisi Jurnal
            </button>
          </form>

          {/* Edition Table */}
          {edisiList.length > 0 ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Volume/No</th>
                    <th>Periode</th>
                    <th>Naskah</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {edisiList.map((edisi) => (
                    <tr key={edisi.id}>
                      <td style={{ fontWeight: 600 }}>
                        Vol. {edisi.volume} No. {edisi.nomor}
                      </td>
                      <td>
                        {edisi.bulan} {edisi.tahun}
                      </td>
                      <td>
                        <span className="badge badge-neutral">
                          {edisi._count.naskah} naskah
                        </span>
                      </td>
                      <td>
                        {edisi.isAktif ? (
                          <span className="badge badge-success">● Aktif</span>
                        ) : (
                          <span className="badge badge-neutral">Nonaktif</span>
                        )}
                      </td>
                      <td>
                        <form
                          action={async () => {
                            "use server";
                            await toggleEdisiJurnal(edisi.id);
                          }}
                        >
                          <button
                            type="submit"
                            className={`btn btn-sm ${edisi.isAktif ? "btn-warning" : "btn-success"}`}
                          >
                            {edisi.isAktif ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>Belum ada edisi jurnal. Tambahkan edisi baru di atas.</p>
            </div>
          )}
        </div>

        {/* ===== PENGATURAN TARIF SECTION ===== */}
        <div className="card">
          <div className="card-header">
            <h3>💰 Pengaturan Tarif</h3>
            {tarif && (
              <span className="badge badge-success">Tersimpan</span>
            )}
          </div>

          <form action={upsertPengaturanTarif}>
            <div className="form-group">
              <label className="form-label" htmlFor="honorEditor">
                Honor Editor (per naskah)
              </label>
              <input
                id="honorEditor"
                name="honorEditor"
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="Contoh: 500000"
                defaultValue={tarif?.honorEditor ?? ""}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="honorReviewer">
                Honor Reviewer (per naskah)
              </label>
              <input
                id="honorReviewer"
                name="honorReviewer"
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="Contoh: 750000"
                defaultValue={tarif?.honorReviewer ?? ""}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="persentasePajak">
                Persentase Pajak (%)
              </label>
              <input
                id="persentasePajak"
                name="persentasePajak"
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="form-input"
                placeholder="Contoh: 2.5"
                defaultValue={tarif?.persentasePajak ?? "2.5"}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Simpan Pengaturan Tarif
            </button>
          </form>

          {tarif && (
            <div
              style={{
                marginTop: 20,
                padding: "16px",
                background: "#f8fafc",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Konfigurasi Saat Ini
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Honor Editor</span>
                  <span style={{ fontWeight: 600 }}>
                    Rp {tarif.honorEditor.toLocaleString("id-ID")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Honor Reviewer</span>
                  <span style={{ fontWeight: 600 }}>
                    Rp {tarif.honorReviewer.toLocaleString("id-ID")}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 8,
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  <span style={{ color: "#64748b" }}>Pajak</span>
                  <span style={{ fontWeight: 600 }}>{tarif.persentasePajak}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
