import {
  createEdisiJurnal,
  toggleEdisiJurnal,
  getSystemSettingList,
} from "@/app/actions";

export default async function KonfigurasiPage() {
  const edisiList = await getSystemSettingList();

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
                        Vol. {edisi.volume} No. {edisi.no}
                      </td>
                      <td>
                        {edisi.bulan} {edisi.tahun}
                      </td>
                      <td>
                        <span className="badge badge-neutral">
                          {edisi._count.naskahJurnals} naskah
                        </span>
                      </td>
                      <td>
                        {edisi.isActive ? (
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
                            className={`btn btn-sm ${edisi.isActive ? "btn-warning" : "btn-success"}`}
                          >
                            {edisi.isActive ? "Nonaktifkan" : "Aktifkan"}
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

        {/* PENGATURAN TARIF SECTION MOVED TO EDISI JURNAL CREATION */}
      </div>
    </div>
  );
}
