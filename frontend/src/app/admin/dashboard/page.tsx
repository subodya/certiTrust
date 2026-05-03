"use client";

import Link from "next/link";
import { QrCode } from "lucide-react";
import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import type { CertificateListItem } from "@/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
function qrPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/certificate-qr/${path.replace(/^\//, "")}`;
}

export default function AdminDashboardPage() {
  const [records, setRecords] = useState<CertificateListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.listCertificates({ q: search, limit: pageSize, offset: page * pageSize });
      setRecords(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-[var(--border-soft)] bg-white p-4">
        <div>
          <h1 className="text-2xl font-bold">Certificates</h1>
          <p className="text-sm text-slate-600">All student certificate records from Supabase.</p>
        </div>
        <Link
          href="/admin/certificates/new"
          className="rounded-lg bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + New Certificate
        </Link>
      </div>
      <section className="rounded-2xl border border-[var(--border-soft)] bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            className="h-10 flex-1 rounded-lg border border-[var(--border-soft)] px-3"
            placeholder="Search certificate id, name, course"
            value={search}
            onChange={(event) => {
              setPage(0);
              setSearch(event.target.value);
            }}
          />
          <button className="rounded-lg border border-[var(--border-soft)] px-3 py-2 text-sm" onClick={loadCertificates}>
            Refresh
          </button>
        </div>
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-2">Certificate ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Course</th>
                <th className="p-2">Institution</th>
                <th className="p-2">Partner</th>
                <th className="p-2">Issue Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">QR</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item.certificate_id} className="border-t border-[var(--border-soft)]">
                  <td className="p-2 font-mono text-xs">
                    <Link href={`/admin/certificates/${item.certificate_id}`} className="text-[var(--color-brand-primary)] hover:underline">
                      {item.certificate_id}
                    </Link>
                  </td>
                  <td className="p-2">{item.full_name}</td>
                  <td className="p-2">{item.course || "-"}</td>
                  <td className="p-2">{item.institution || "-"}</td>
                  <td className="p-2">{item.partner || "-"}</td>
                  <td className="p-2">{item.issue_date || "-"}</td>
                  <td className="p-2">{item.status}</td>
                  <td className="p-2">
                    {item.certificate_qr_path ? (
                      <a
                        href={qrPublicUrl(item.certificate_qr_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-brand-primary)] hover:underline"
                        title="View / download QR code"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && records.length === 0 && (
                <tr>
                  <td className="p-3 text-sm text-slate-500" colSpan={8}>
                    No certificates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <p className="mt-3 text-sm text-slate-500">Loading records...</p>}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500">Total: {total}</span>
          <div className="flex items-center gap-2">
            <button className="rounded border border-[var(--border-soft)] px-3 py-1 text-sm disabled:opacity-50" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
            <span className="text-xs text-slate-500">Page {page + 1}</span>
            <button className="rounded border border-[var(--border-soft)] px-3 py-1 text-sm disabled:opacity-50" disabled={(page + 1) * pageSize >= total} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </section>
    </main>
  );
}
