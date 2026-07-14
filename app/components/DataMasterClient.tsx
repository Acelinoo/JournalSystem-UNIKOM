"use client";

import { useState } from "react";
import { createEditor, deleteEditor, createReviewer, deleteReviewer } from "@/app/actions";

interface Editor {
  id: string;
  nama: string;
  nidn: string | null;
  noRekening: string;
  namaBank: string;
  npwp: string | null;
  createdAt: Date;
}

interface Reviewer {
  id: string;
  nama: string;
  institusi: string;
  noRekening: string;
  namaBank: string;
  npwp: string | null;
  createdAt: Date;
}

interface Props {
  editors: Editor[];
  reviewers: Reviewer[];
}

export default function DataMasterClient({ editors, reviewers }: Props) {
  const [activeTab, setActiveTab] = useState<"editor" | "reviewer">("editor");

  return (
    <div>
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "editor" ? "active" : ""}`}
          onClick={() => setActiveTab("editor")}
          type="button"
        >
          👨‍🏫 Editor ({editors.length})
        </button>
        <button
          className={`tab ${activeTab === "reviewer" ? "active" : ""}`}
          onClick={() => setActiveTab("reviewer")}
          type="button"
        >
          🔍 Reviewer ({reviewers.length})
        </button>
      </div>

      {/* EDITOR TAB */}
      {activeTab === "editor" && (
        <div className="animate-fade-in">
          <div className="grid-2">
            {/* Form */}
            <div className="card">
              <div className="card-header">
                <h3>Tambah Editor Baru</h3>
              </div>
              <form action={createEditor}>
                <div className="form-group">
                  <label className="form-label" htmlFor="editor-nama">
                    Nama Lengkap *
                  </label>
                  <input
                    id="editor-nama"
                    name="nama"
                    type="text"
                    className="form-input"
                    placeholder="Nama editor"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="editor-nidn">
                      NIDN
                    </label>
                    <input
                      id="editor-nidn"
                      name="nidn"
                      type="text"
                      className="form-input"
                      placeholder="Opsional"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="editor-npwp">
                      NPWP
                    </label>
                    <input
                      id="editor-npwp"
                      name="npwp"
                      type="text"
                      className="form-input"
                      placeholder="Opsional"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="editor-rekening">
                      No. Rekening *
                    </label>
                    <input
                      id="editor-rekening"
                      name="noRekening"
                      type="text"
                      className="form-input"
                      placeholder="Nomor rekening"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="editor-bank">
                      Nama Bank *
                    </label>
                    <input
                      id="editor-bank"
                      name="namaBank"
                      type="text"
                      className="form-input"
                      placeholder="Contoh: BCA, Mandiri"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Simpan Editor
                </button>
              </form>
            </div>

            {/* Table */}
            <div className="card">
              <div className="card-header">
                <h3>Daftar Editor</h3>
                <span className="badge badge-info">{editors.length} data</span>
              </div>
              {editors.length > 0 ? (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>NIDN</th>
                        <th>Bank</th>
                        <th>Rekening</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editors.map((e) => (
                        <tr key={e.id}>
                          <td style={{ fontWeight: 500 }}>{e.nama}</td>
                          <td>{e.nidn || "-"}</td>
                          <td>{e.namaBank}</td>
                          <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                            {e.noRekening}
                          </td>
                          <td>
                            <form action={deleteEditor.bind(null, e.id)}>
                              <button type="submit" className="btn btn-danger btn-sm">
                                Hapus
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
                  <p>Belum ada data editor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REVIEWER TAB */}
      {activeTab === "reviewer" && (
        <div className="animate-fade-in">
          <div className="grid-2">
            {/* Form */}
            <div className="card">
              <div className="card-header">
                <h3>Tambah Reviewer Baru</h3>
              </div>
              <form action={createReviewer}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reviewer-nama">
                    Nama Lengkap *
                  </label>
                  <input
                    id="reviewer-nama"
                    name="nama"
                    type="text"
                    className="form-input"
                    placeholder="Nama reviewer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reviewer-institusi">
                    Institusi *
                  </label>
                  <input
                    id="reviewer-institusi"
                    name="institusi"
                    type="text"
                    className="form-input"
                    placeholder="Nama universitas atau institusi"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reviewer-rekening">
                      No. Rekening *
                    </label>
                    <input
                      id="reviewer-rekening"
                      name="noRekening"
                      type="text"
                      className="form-input"
                      placeholder="Nomor rekening"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reviewer-bank">
                      Nama Bank *
                    </label>
                    <input
                      id="reviewer-bank"
                      name="namaBank"
                      type="text"
                      className="form-input"
                      placeholder="Contoh: BCA, Mandiri"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reviewer-npwp">
                    NPWP
                  </label>
                  <input
                    id="reviewer-npwp"
                    name="npwp"
                    type="text"
                    className="form-input"
                    placeholder="Opsional"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Simpan Reviewer
                </button>
              </form>
            </div>

            {/* Table */}
            <div className="card">
              <div className="card-header">
                <h3>Daftar Reviewer</h3>
                <span className="badge badge-info">{reviewers.length} data</span>
              </div>
              {reviewers.length > 0 ? (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Nama</th>
                        <th>Institusi</th>
                        <th>Bank</th>
                        <th>Rekening</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewers.map((r) => (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 500 }}>{r.nama}</td>
                          <td>{r.institusi}</td>
                          <td>{r.namaBank}</td>
                          <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                            {r.noRekening}
                          </td>
                          <td>
                            <form action={deleteReviewer.bind(null, r.id)}>
                              <button type="submit" className="btn btn-danger btn-sm">
                                Hapus
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
                  <p>Belum ada data reviewer.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
