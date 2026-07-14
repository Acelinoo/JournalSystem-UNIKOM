"use client";

import { useState } from "react";
import {
  generatePengajuanDana,
  approvePengajuan,
  rejectPengajuan,
} from "@/app/actions";

interface EdisiJurnal {
  id: string;
  volume: number;
  nomor: number;
  bulan: string;
  tahun: number;
  naskah: {
    id: string;
    judul: string;
    author: string;
    editor: { id: string; nama: string; nidn: string | null; noRekening: string; namaBank: string; npwp: string | null };
    reviewer: { id: string; nama: string; institusi: string; noRekening: string; namaBank: string; npwp: string | null };
  }[];
}

interface Pengajuan {
  id: string;
  edisiId: string;
  totalHonorBruto: number;
  totalPotonganPajak: number;
  totalHonorNetto: number;
  status: string;
  catatanRevisi: string | null;
  tandaTanganKaprodi: string | null;
  tanggalPengajuan: Date;
  edisiJurnal: EdisiJurnal;
}

interface Tarif {
  honorEditor: number;
  honorReviewer: number;
  persentasePajak: number;
}

interface Props {
  pengajuanList: Pengajuan[];
  edisiList: EdisiJurnal[];
  tarif: Tarif | null;
}

export default function OutputLaporanClient({ pengajuanList, edisiList, tarif }: Props) {
  const [activeTab, setActiveTab] = useState<"surat" | "sertifikat" | "simulator">("surat");
  const [selectedEdisiId, setSelectedEdisiId] = useState<string>(
    edisiList.length > 0 ? edisiList[0].id : ""
  );
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedEdisi = edisiList.find((e) => e.id === selectedEdisiId);
  const selectedPengajuan = pengajuanList.find((p) => p.edisiId === selectedEdisiId);

  // Collect unique editors/reviewers from the selected edition
  const editorMap = new Map<string, typeof selectedEdisi extends undefined ? never : NonNullable<typeof selectedEdisi>["naskah"][0]["editor"]>();
  const reviewerMap = new Map<string, typeof selectedEdisi extends undefined ? never : NonNullable<typeof selectedEdisi>["naskah"][0]["reviewer"]>();

  if (selectedEdisi) {
    for (const n of selectedEdisi.naskah) {
      if (!editorMap.has(n.editor.id)) editorMap.set(n.editor.id, n.editor);
      if (!reviewerMap.has(n.reviewer.id)) reviewerMap.set(n.reviewer.id, n.reviewer);
    }
  }

  const handleGenerate = async () => {
    if (!selectedEdisiId || !tarif) return;
    setIsLoading(true);
    try {
      await generatePengajuanDana(selectedEdisiId);
      window.location.reload();
    } catch {
      alert("Gagal generate pengajuan. Pastikan tarif sudah dikonfigurasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (pengajuanId: string) => {
    setIsLoading(true);
    try {
      await approvePengajuan(pengajuanId, "Dr. Kaprodi, M.Kom.");
      window.location.reload();
    } catch {
      alert("Gagal menyetujui pengajuan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (pengajuanId: string) => {
    if (!revisionNote.trim()) {
      alert("Catatan revisi wajib diisi.");
      return;
    }
    setIsLoading(true);
    try {
      await rejectPengajuan(pengajuanId, revisionNote);
      setRejectingId(null);
      setRevisionNote("");
      window.location.reload();
    } catch {
      alert("Gagal menolak pengajuan.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (num: number) =>
    `Rp ${num.toLocaleString("id-ID", { minimumFractionDigits: 0 })}`;

  return (
    <div>
      {/* Edition Selector */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <label className="form-label" style={{ margin: 0, whiteSpace: "nowrap" }}>
          Pilih Edisi:
        </label>
        <select
          className="form-input"
          style={{ maxWidth: 320 }}
          value={selectedEdisiId}
          onChange={(e) => {
            setSelectedEdisiId(e.target.value);
            setRejectingId(null);
            setRevisionNote("");
          }}
        >
          {edisiList.length === 0 && <option value="">Tidak ada edisi</option>}
          {edisiList.map((e) => (
            <option key={e.id} value={e.id}>
              Vol. {e.volume} No. {e.nomor} — {e.bulan} {e.tahun} ({e.naskah.length} naskah)
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 8 }}>
          {selectedEdisi && tarif ? (
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={isLoading || selectedEdisi.naskah.length === 0}
            >
              {isLoading ? "Memproses..." : "⚡ Generate Pengajuan Dana"}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              style={{ opacity: 0.5, cursor: "not-allowed" }}
              disabled
              title="Membutuhkan Konfigurasi Edisi & Tarif"
            >
              ⚡ Generate Pengajuan Dana
            </button>
          )}

          {(!selectedEdisi || !tarif || pengajuanList.length === 0) && (
            <form action={async () => {
              // Redirect to a specialized seed route or run an inline server action if we had one.
              // For the demo, we will just alert the user to run the seed or we can call a server action here.
              alert("Gunakan tombol ini untuk demo. Sedang membuat data dummy...");
              await fetch('/api/mock-seed', { method: 'POST' }).catch(()=>window.location.reload());
            }}>
              <button
                type="submit"
                className="btn btn-secondary"
                style={{ backgroundColor: "#fef3c7", color: "#d97706", borderColor: "#fde68a" }}
              >
                🛠️ Buat Dummy Pengajuan (Demo)
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === "surat" ? "active" : ""}`} onClick={() => setActiveTab("surat")} type="button">
          📄 Surat Pengajuan Dana
        </button>
        <button className={`tab ${activeTab === "sertifikat" ? "active" : ""}`} onClick={() => setActiveTab("sertifikat")} type="button">
          🏅 Sertifikat
        </button>
        <button className={`tab ${activeTab === "simulator" ? "active" : ""}`} onClick={() => setActiveTab("simulator")} type="button">
          🔐 Kaprodi Simulator
        </button>
      </div>

      {/* ===== SURAT PENGAJUAN DANA TAB ===== */}
      {activeTab === "surat" && (
        <div className="animate-fade-in">
          {selectedPengajuan ? (
            <div>
              <div className="no-print" style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => window.print()}>
                  🖨️ Cetak Surat
                </button>
                {selectedPengajuan.status === "DISETUJUI" && (
                  <button
                    className="btn btn-primary"
                    style={{
                      background: "linear-gradient(135deg, #065f46, #059669)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontWeight: 700,
                      border: "none",
                      boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
                    }}
                    onClick={() => {
                      const originalTitle = document.title;
                      document.title = `Laporan_Resmi_Vol${selectedPengajuan.edisiJurnal.volume}_No${selectedPengajuan.edisiJurnal.nomor}_${selectedPengajuan.edisiJurnal.tahun}`;
                      window.print();
                      setTimeout(() => { document.title = originalTitle; }, 1000);
                    }}
                  >
                    <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    🖨️ Cetak PDF / Laporan Resmi
                  </button>
                )}
              </div>
              <div className="surat-container print-area">
                <div className="surat-kop">
                  <h2>Universitas Contoh Nusantara</h2>
                  <h3>Fakultas Ilmu Komputer</h3>
                  <p>Jl. Pendidikan No. 123, Kota Ilmu, Indonesia 12345</p>
                  <p>Telp: (021) 123-4567 | Email: jurnal@ucn.ac.id</p>
                </div>

                <div className="surat-meta">
                  <div>
                    <div>No: SPD/{selectedPengajuan.edisiJurnal.volume}/{selectedPengajuan.edisiJurnal.tahun}/FIK</div>
                    <div>Hal: Pengajuan Dana Honor</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>
                      {new Date(selectedPengajuan.tanggalPengajuan).toLocaleDateString("id-ID", {
                        dateStyle: "long",
                      })}
                    </div>
                  </div>
                </div>

                <p>Kepada Yth.<br /><strong>Kepala Bagian Keuangan</strong><br />Universitas Contoh Nusantara</p>

                <p>Dengan hormat,</p>
                <p>
                  Bersama surat ini kami mengajukan permohonan pencairan dana untuk pembayaran honor
                  Editor dan Reviewer untuk penerbitan jurnal edisi{" "}
                  <strong>
                    Vol. {selectedPengajuan.edisiJurnal.volume} No.{" "}
                    {selectedPengajuan.edisiJurnal.nomor}, {selectedPengajuan.edisiJurnal.bulan}{" "}
                    {selectedPengajuan.edisiJurnal.tahun}
                  </strong>
                  , dengan rincian sebagai berikut:
                </p>

                {/* Financial Details Table */}
                <div className="table-wrapper" style={{ margin: "20px 0" }}>
                  <table style={{ border: "1px solid #cbd5e1" }}>
                    <thead>
                      <tr>
                        <th style={{ border: "1px solid #cbd5e1", textAlign: "center" }}>No</th>
                        <th style={{ border: "1px solid #cbd5e1" }}>Uraian</th>
                        <th style={{ border: "1px solid #cbd5e1", textAlign: "right" }}>Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ border: "1px solid #cbd5e1", textAlign: "center" }}>1</td>
                        <td style={{ border: "1px solid #cbd5e1" }}>Total Honor Bruto (Editor + Reviewer)</td>
                        <td style={{ border: "1px solid #cbd5e1", textAlign: "right", fontWeight: 600 }}>
                          {formatRupiah(selectedPengajuan.totalHonorBruto)}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ border: "1px solid #cbd5e1", textAlign: "center" }}>2</td>
                        <td style={{ border: "1px solid #cbd5e1" }}>
                          Potongan Pajak ({tarif ? tarif.persentasePajak : 2.5}%)
                        </td>
                        <td style={{ border: "1px solid #cbd5e1", textAlign: "right", color: "#dc2626" }}>
                          - {formatRupiah(selectedPengajuan.totalPotonganPajak)}
                        </td>
                      </tr>
                      <tr style={{ background: "#ecfdf5" }}>
                        <td style={{ border: "1px solid #cbd5e1", textAlign: "center" }}></td>
                        <td style={{ border: "1px solid #cbd5e1", fontWeight: 700 }}>Total Honor Netto (Dibayarkan)</td>
                        <td style={{ border: "1px solid #cbd5e1", textAlign: "right", fontWeight: 700, color: "#059669" }}>
                          {formatRupiah(selectedPengajuan.totalHonorNetto)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>Demikian surat pengajuan ini kami sampaikan. Atas perhatian dan persetujuannya, kami ucapkan terima kasih.</p>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "#64748b" }}>Mengetahui,</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Kaprodi</div>
                    <div style={{ height: 60 }} />
                    <div style={{ borderTop: "1px solid #374151", paddingTop: 4, fontSize: 13, fontWeight: 600 }}>
                      Dr. Kaprodi, M.Kom.
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: "#64748b" }}>Hormat kami,</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Pengelola Jurnal</div>
                    <div style={{ height: 60 }} />
                    <div style={{ borderTop: "1px solid #374151", paddingTop: 4, fontSize: 13, fontWeight: 600 }}>
                      Pengelola Jurnal
                    </div>
                  </div>
                </div>

                {/* Digital Signature Stamp */}
                {selectedPengajuan.status === "DISETUJUI" && selectedPengajuan.tandaTanganKaprodi && (
                  <div style={{
                    marginTop: 28,
                    border: "2px solid #10b981",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #ecfdf5, #f0fdf9)",
                    padding: "16px 20px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {/* Decorative watermark circle */}
                    <div style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 120, height: 120,
                      borderRadius: "50%",
                      border: "3px solid #10b981",
                      opacity: 0.07,
                      pointerEvents: "none",
                    }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                        <svg style={{ width: 20, height: 20, color: "#059669" }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                        <span style={{ color: "#065f46", fontWeight: 800, fontSize: 13, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                          Dokumen Resmi Telah Disetujui
                        </span>
                        <svg style={{ width: 20, height: 20, color: "#059669" }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                      </div>
                      <div style={{
                        background: "rgba(255,255,255,0.8)",
                        borderRadius: 8,
                        border: "1px solid #a7f3d0",
                        padding: "8px 14px",
                        marginBottom: 8,
                      }}>
                        <p style={{ fontFamily: "monospace", fontSize: 11, color: "#047857", wordBreak: "break-all", lineHeight: 1.6, margin: 0 }}>
                          {selectedPengajuan.tandaTanganKaprodi}
                        </p>
                      </div>
                      <p style={{ fontSize: 10, color: "#10b981", fontWeight: 600, margin: 0 }}>
                        ✓ Verified Digital Signature • Secure Hash Certificate
                      </p>
                    </div>
                  </div>
                )}
                {selectedPengajuan.status === "DITOLAK" && (
                  <div className="ttd-stamp rejected" style={{ marginTop: 24 }}>
                    ❌ DITOLAK — {selectedPengajuan.catatanRevisi}
                  </div>
                )}

                {/* Status badge */}
                <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                  <span
                    className={`badge ${
                      selectedPengajuan.status === "DISETUJUI"
                        ? "badge-success"
                        : selectedPengajuan.status === "DITOLAK" || selectedPengajuan.status === "REJECTED"
                          ? "badge-danger"
                          : "badge-warning"
                    }`}
                    style={{ fontSize: 13, padding: "6px 16px" }}
                  >
                    Status: {selectedPengajuan.status}
                  </span>
                </div>

                {/* Catatan Revisi Kaprodi — shown when rejected */}
                {(selectedPengajuan.status === "DITOLAK" || selectedPengajuan.status === "REJECTED") &&
                  selectedPengajuan.catatanRevisi && (
                  <div style={{
                    marginTop: 20,
                    borderLeft: "4px solid #f59e0b",
                    background: "#fffbeb",
                    borderRadius: "0 10px 10px 0",
                    padding: "16px 20px",
                    border: "1px solid #fde68a",
                    borderLeftColor: "#f59e0b",
                    borderLeftWidth: 4,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <svg style={{ width: 18, height: 18, color: "#d97706", flexShrink: 0 }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#92400e",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}>
                        Catatan Revisi Kaprodi
                      </span>
                    </div>
                    <p style={{
                      fontSize: 13,
                      color: "#78350f",
                      lineHeight: 1.7,
                      margin: 0,
                      fontStyle: "italic",
                    }}>
                      &ldquo;{selectedPengajuan.catatanRevisi}&rdquo;
                    </p>
                    <p style={{ fontSize: 11, color: "#b45309", marginTop: 10, marginBottom: 0 }}>
                      ⚠️ Harap lakukan perbaikan sesuai catatan di atas, lalu ajukan kembali melalui tombol <strong>Generate Pengajuan Dana</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 48, height: 48 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <p style={{ marginTop: 12 }}>
                  Belum ada pengajuan dana untuk edisi ini.
                  <br />
                  Klik <strong>&quot;Generate Pengajuan Dana&quot;</strong> untuk membuat surat pengajuan.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== SERTIFIKAT TAB ===== */}
      {activeTab === "sertifikat" && (
        <div className="animate-fade-in">
          <div className="no-print" style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={() => window.print()}>
              🖨️ Cetak Semua Sertifikat
            </button>
          </div>

          {editorMap.size === 0 && reviewerMap.size === 0 ? (
            <div className="card">
              <div className="empty-state">
                <p>Tidak ada editor/reviewer untuk edisi ini. Tambahkan naskah terlebih dahulu.</p>
              </div>
            </div>
          ) : (
            <div className="print-area">
              {/* Editor Certificates */}
              {Array.from(editorMap.values()).map((editor) => (
                <div key={`cert-editor-${editor.id}`} className="certificate-block">
                  <div className="certificate-header">
                    <h3>Surat Keterangan</h3>
                    <p>No: SK-ED/{selectedEdisi?.tahun}/{selectedEdisi?.volume}/{selectedEdisi?.nomor}</p>
                  </div>
                  <div className="certificate-body">
                    <p>Yang bertanda tangan di bawah ini, Ketua Program Studi menerangkan bahwa:</p>
                    <table>
                      <tbody>
                        <tr>
                          <td>Nama</td>
                          <td>: <strong>{editor.nama}</strong></td>
                        </tr>
                        <tr>
                          <td>NIDN</td>
                          <td>: {editor.nidn || "-"}</td>
                        </tr>
                        <tr>
                          <td>Jabatan</td>
                          <td>: <strong>Editor</strong></td>
                        </tr>
                        <tr>
                          <td>No. Rekening</td>
                          <td>: {editor.noRekening} ({editor.namaBank})</td>
                        </tr>
                        <tr>
                          <td>NPWP</td>
                          <td>: {editor.npwp || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p>
                      Telah melaksanakan tugas sebagai <strong>Editor</strong> pada penerbitan jurnal edisi{" "}
                      <strong>Vol. {selectedEdisi?.volume} No. {selectedEdisi?.nomor}, {selectedEdisi?.bulan} {selectedEdisi?.tahun}</strong>.
                    </p>
                    <p>Surat keterangan ini diberikan untuk dapat dipergunakan sebagaimana mestinya.</p>
                  </div>
                  <div className="certificate-footer">
                    <div className="signature-area">
                      <div style={{ fontSize: 13, color: "#64748b" }}>Ketua Program Studi</div>
                      <div className="signature-line">Dr. Kaprodi, M.Kom.</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Reviewer Certificates */}
              {Array.from(reviewerMap.values()).map((reviewer) => (
                <div key={`cert-reviewer-${reviewer.id}`} className="certificate-block">
                  <div className="certificate-header">
                    <h3>Surat Keterangan</h3>
                    <p>No: SK-RV/{selectedEdisi?.tahun}/{selectedEdisi?.volume}/{selectedEdisi?.nomor}</p>
                  </div>
                  <div className="certificate-body">
                    <p>Yang bertanda tangan di bawah ini, Ketua Program Studi menerangkan bahwa:</p>
                    <table>
                      <tbody>
                        <tr>
                          <td>Nama</td>
                          <td>: <strong>{reviewer.nama}</strong></td>
                        </tr>
                        <tr>
                          <td>Institusi</td>
                          <td>: {reviewer.institusi}</td>
                        </tr>
                        <tr>
                          <td>Jabatan</td>
                          <td>: <strong>Reviewer</strong></td>
                        </tr>
                        <tr>
                          <td>No. Rekening</td>
                          <td>: {reviewer.noRekening} ({reviewer.namaBank})</td>
                        </tr>
                        <tr>
                          <td>NPWP</td>
                          <td>: {reviewer.npwp || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p>
                      Telah melaksanakan tugas sebagai <strong>Reviewer</strong> pada penerbitan jurnal edisi{" "}
                      <strong>Vol. {selectedEdisi?.volume} No. {selectedEdisi?.nomor}, {selectedEdisi?.bulan} {selectedEdisi?.tahun}</strong>.
                    </p>
                    <p>Surat keterangan ini diberikan untuk dapat dipergunakan sebagaimana mestinya.</p>
                  </div>
                  <div className="certificate-footer">
                    <div className="signature-area">
                      <div style={{ fontSize: 13, color: "#64748b" }}>Ketua Program Studi</div>
                      <div className="signature-line">Dr. Kaprodi, M.Kom.</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== KAPRODI SIMULATOR TAB ===== */}
      {activeTab === "simulator" && (
        <div className="animate-fade-in">
          <div className="simulator-panel" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                K
              </div>
              <div>
                <h3>Kaprodi Approval Simulator</h3>
                <p style={{ margin: 0 }}>Login sebagai Dr. Kaprodi, M.Kom. untuk menyetujui atau menolak pengajuan dana.</p>
              </div>
            </div>
          </div>

          {/* Pengajuan List for Approval */}
          {pengajuanList.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pengajuanList.map((p) => (
                <div key={p.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>
                        Vol. {p.edisiJurnal.volume} No. {p.edisiJurnal.nomor} — {p.edisiJurnal.bulan} {p.edisiJurnal.tahun}
                      </div>
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                        {p.edisiJurnal.naskah.length} naskah • Diajukan{" "}
                        {new Date(p.tanggalPengajuan).toLocaleDateString("id-ID", { dateStyle: "long" })}
                      </div>
                    </div>
                    <span
                      className={`badge ${
                        p.status === "DISETUJUI"
                          ? "badge-success"
                          : p.status === "DITOLAK"
                            ? "badge-danger"
                            : "badge-warning"
                      }`}
                    >
                      {p.status === "DISETUJUI" ? "✅" : p.status === "DITOLAK" ? "❌" : "⏳"} {p.status}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                    <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Bruto</div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{formatRupiah(p.totalHonorBruto)}</div>
                    </div>
                    <div style={{ padding: 12, background: "#fef2f2", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Pajak</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#dc2626" }}>
                        - {formatRupiah(p.totalPotonganPajak)}
                      </div>
                    </div>
                    <div style={{ padding: 12, background: "#ecfdf5", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Netto</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#059669" }}>
                        {formatRupiah(p.totalHonorNetto)}
                      </div>
                    </div>
                  </div>

                  {/* Approval Stamp Display */}
                  {p.status === "DISETUJUI" && p.tandaTanganKaprodi && (
                    <div className="ttd-stamp" style={{ marginBottom: 16 }}>
                      ✅ {p.tandaTanganKaprodi}
                    </div>
                  )}

                  {p.status === "DITOLAK" && p.catatanRevisi && (
                    <div className="ttd-stamp rejected" style={{ marginBottom: 16 }}>
                      ❌ Ditolak — {p.catatanRevisi}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {p.status === "PENDING" && (
                    <div>
                      <div className="simulator-actions">
                        <button
                          className="btn btn-success"
                          onClick={() => handleApprove(p.id)}
                          disabled={isLoading}
                        >
                          ✅ Setujui
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setRejectingId(rejectingId === p.id ? null : p.id);
                            setRevisionNote("");
                          }}
                          disabled={isLoading}
                        >
                          ❌ Tolak
                        </button>
                      </div>

                      {rejectingId === p.id && (
                        <div className="revision-box" style={{ marginTop: 12 }}>
                          <label className="form-label" style={{ color: "#a1a1aa", fontSize: 12 }}>
                            Catatan Revisi / Alasan Penolakan
                          </label>
                          <textarea
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            placeholder="Tuliskan alasan penolakan atau catatan revisi..."
                          />
                          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(p.id)}
                              disabled={isLoading}
                            >
                              Konfirmasi Penolakan
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                setRejectingId(null);
                                setRevisionNote("");
                              }}
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Re-approve/reject for already decided */}
                  {(p.status === "DISETUJUI" || p.status === "DITOLAK") && (
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
                      Pengajuan ini sudah diproses. Generate ulang dari tab Surat untuk mereset status.
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="empty-state">
                <p>Belum ada pengajuan dana yang dibuat. Generate pengajuan dana terlebih dahulu.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
