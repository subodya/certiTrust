"use client";

import { Check, ExternalLink, Pencil, ToggleLeft, ToggleRight, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import type { LookupItem } from "@/lib/types";

const inputCls =
  "h-9 w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function PartnersPage() {
  const [items, setItems] = useState<LookupItem[]>([]);
  const [form, setForm] = useState({ name: "", website_url: "", logo_url: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<LookupItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [addError, setAddError] = useState<string | null>(null);

  const load = async () => {
    const data = await adminApi.listPartners();
    setItems(data.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Partners</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage partner organisations. Their names and logos auto-fill on certificates.
        </p>
      </div>

      {/* Add form */}
      <section className="mb-6 rounded-2xl border border-[var(--border-soft)] bg-white p-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Add Partner</h2>
        {addError && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{addError}</div>
        )}
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setAddError(null);
            try {
              await adminApi.createPartner({ ...form, is_active: true });
              setForm({ name: "", website_url: "", logo_url: "" });
              await load();
            } catch (e) {
              setAddError(e instanceof Error ? e.message : "Failed to add partner");
            }
          }}
          className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Partner Name *</label>
            <input
              className={inputCls}
              placeholder="e.g. JLPT Foundation"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Website URL</label>
            <input
              className={inputCls}
              placeholder="https://example.org"
              value={form.website_url}
              onChange={(e) => setForm((p) => ({ ...p, website_url: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Logo URL / Path</label>
            <input
              className={inputCls}
              placeholder="https:// or storage path"
              value={form.logo_url}
              onChange={(e) => setForm((p) => ({ ...p, logo_url: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="h-9 rounded-lg bg-[var(--color-brand-primary)] px-5 text-sm font-semibold text-white hover:opacity-90"
            >
              Add
            </button>
          </div>
        </form>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border-soft)] bg-slate-50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Website</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Logo</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">Loading...</td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  No partners yet. Add one above.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="border-t border-[var(--border-soft)] hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  {editId === item.id ? (
                    <input
                      className={inputCls}
                      value={draft?.name ?? ""}
                      onChange={(e) => setDraft((p) => (p ? { ...p, name: e.target.value } : p))}
                    />
                  ) : (
                    <span className="font-medium text-slate-900">{item.name}</span>
                  )}
                </td>
                <td className="px-4 py-3 max-w-[180px]">
                  {editId === item.id ? (
                    <input
                      className={inputCls}
                      value={draft?.website_url ?? ""}
                      onChange={(e) => setDraft((p) => (p ? { ...p, website_url: e.target.value } : p))}
                    />
                  ) : item.website_url ? (
                    <a
                      href={item.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 truncate text-xs text-[var(--color-brand-primary)] hover:underline"
                    >
                      <span className="truncate">{item.website_url.replace(/^https?:\/\//, "")}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 max-w-[160px]">
                  {editId === item.id ? (
                    <input
                      className={inputCls}
                      value={draft?.logo_url ?? ""}
                      onChange={(e) => setDraft((p) => (p ? { ...p, logo_url: e.target.value } : p))}
                    />
                  ) : item.logo_url ? (
                    <span className="truncate text-xs text-slate-500">{item.logo_url}</span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {editId === item.id ? (
                      <>
                        <button
                          title="Save"
                          onClick={async () => {
                            if (!draft) return;
                            await adminApi.updatePartner(item.id, draft);
                            setEditId(null);
                            setDraft(null);
                            await load();
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Cancel"
                          onClick={() => { setEditId(null); setDraft(null); }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        title="Edit"
                        onClick={() => { setEditId(item.id); setDraft(item); }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      title={item.is_active ? "Deactivate" : "Activate"}
                      onClick={async () => {
                        await adminApi.updatePartner(item.id, { ...item, is_active: !item.is_active });
                        await load();
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                    >
                      {item.is_active ? (
                        <ToggleRight className="h-4 w-4" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      title="Delete"
                      onClick={async () => {
                        if (!confirm(`Delete "${item.name}"?`)) return;
                        await adminApi.deletePartner(item.id);
                        await load();
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
