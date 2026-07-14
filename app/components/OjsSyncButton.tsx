"use client";

import { useState } from "react";
import { syncOjsUnikomPapers } from "@/app/actions";

export default function OjsSyncButton() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setToast(null);
    try {
      const res = await syncOjsUnikomPapers();
      if (res.success) {
        setToast({ message: res.message, type: "success" });
      } else {
        setToast({ message: res.message, type: "error" });
      }
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <div className="card" style={{ background: "linear-gradient(to right, #ecfdf5, #d1fae5)", border: "1px solid #10b981", marginBottom: 24 }}>
      <div className="card-header" style={{ borderBottom: "none", paddingBottom: 10 }}>
        <h3 style={{ color: "#065f46", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <span>🌐</span> Integrasi OJS UNIKOM
        </h3>
        <p style={{ color: "#047857", fontSize: 13, marginTop: 4 }}>
          Tarik metadata naskah jurnal secara otomatis dari portal OJS Universitas Komputer Indonesia (OAI-PMH).
        </p>
      </div>
      <div style={{ padding: "0 20px 20px 20px", position: "relative" }}>
        <button
          onClick={handleSync}
          disabled={loading}
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s",
            boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <span style={{ 
            display: "inline-block", 
            transform: loading ? "rotate(360deg)" : "none",
            transition: "transform 1s linear",
            animation: loading ? "spin 1s linear infinite" : "none"
          }}>
            🔄
          </span>
          {loading ? "Menyinkronkan Data..." : "Sinkronisasi Data Jurnal UNIKOM"}
        </button>

        {toast && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              borderRadius: 8,
              background: toast.type === "success" ? "#059669" : "#dc2626",
              color: "white",
              fontSize: 14,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: "fade-in 0.3s ease-out",
            }}
          >
            <span>{toast.type === "success" ? "✅" : "❌"}</span>
            {toast.message}
          </div>
        )}
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        `}} />
      </div>
    </div>
  );
}
