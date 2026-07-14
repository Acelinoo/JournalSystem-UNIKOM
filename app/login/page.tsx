"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await loginUser(formData);
      
      if (result.success) {
        if (result.role === "EDITOR") {
          window.location.href = "/dashboard/editor";
        } else if (result.role === "REVIEWER") {
          window.location.href = "/dashboard/reviewer";
        } else if (result.role === "KAPRODI") {
          window.location.href = "/dashboard/kaprodi";
        } else {
          window.location.href = "/";
        }
      } else {
        setError(result.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">📚 Jurnal Manager</h1>
          <p className="text-slate-500 text-sm font-medium">Sistem Keuangan & Manajemen Jurnal</p>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Login Administrator</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm font-medium">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="username">
              Username
            </label>
            <input 
              id="username"
              name="username"
              type="text" 
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50 text-slate-900 outline-none font-medium"
              placeholder="Masukkan username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <input 
              id="password"
              name="password"
              type="password" 
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all bg-slate-50 text-slate-900 outline-none font-medium"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-xl py-3 font-medium transition-all hover:bg-slate-800 shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
