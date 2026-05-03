"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi, adminGet, adminSend } from "@/lib/admin-api";
import type { LookupItem } from "@/lib/types";

const inputCls =
  "h-11 w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100";
const selectCls =
  "h-11 w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 text-sm text-slate-900 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function NewCertificatePage() {
  const [courses, setCourses] = useState<LookupItem[]>([]);
  const [institutions, setInstitutions] = useState<LookupItem[]>([]);
  const [partners, setPartners] = useState<LookupItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    certificate_id: "",
    full_name: "",
    course: "",
    course_id: "",
    issue_date: "",
    completion_date: "",
    enrollment_date: "",
    duration: "",
    institute: "",
    institution_id: "",
    registration_number: "",
    issuing_authority: "",
    partner_id: "",
    date_of_birth: "",
    nic_number: "",
    email: "",
    image_url: "",
    student_photo_path: "",
    institution_logo_url: "",
    partner_logo_url: "",
    status: "valid",
  });

  const router = useRouter();

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const uploadImage = async (file: File) => {
    const fileBase64 = await fileToBase64(file);
    const res = await adminSend(
      "/api/admin/media/upload?bucket=student-photos&file_name=" + encodeURIComponent(file.name),
      "POST",
      { file_base64: fileBase64, content_type: file.type || "application/octet-stream" }
    );
    const data = await res.json();
    setForm((p) => ({ ...p, image_url: data.path, student_photo_path: data.path }));
  };

  useEffect(() => {
    Promise.all([
      adminGet("/api/admin/courses").then((r) => r.json()),
      adminGet("/api/admin/institutions").then((r) => r.json()),
      adminGet("/api/admin/partners").then((r) => r.json()),
    ]).then(([courseData, institutionData, partnerData]) => {
      const courseItems = (courseData.items ?? []).filter((i: LookupItem) => i.is_active !== false);
      setCourses(courseItems);
      setInstitutions((institutionData.items ?? []).filter((i: LookupItem) => i.is_active !== false));
      setPartners((partnerData.items ?? []).filter((i: LookupItem) => i.is_active !== false));
      if (courseItems.length === 1) {
        setForm((p) => ({ ...p, course_id: courseItems[0].id, course: courseItems[0].name }));
      }
    });
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Certificate</h1>
          <p className="mt-0.5 text-sm text-slate-500">Add a new student certificate record to Supabase.</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setError(null);
          try {
            const res = await adminSend("/api/admin/certificates", "POST", form);
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error((data?.detail as string) ?? `Save failed (${res.status})`);
            }
            // Auto-generate QR — non-fatal if it fails
            await adminApi.generateCertificateQr(form.certificate_id).catch(() => null);
            router.push("/admin/dashboard");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save certificate");
            setSaving(false);
          }
        }}
      >
        {/* Certificate Info */}
        <section className="rounded-2xl border border-[var(--border-soft)] bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Certificate Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Certificate ID <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="e.g. CERT-2024-001"
                value={form.certificate_id}
                onChange={(e) => setForm((p) => ({ ...p, certificate_id: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Registration Number</label>
              <input
                className={inputCls}
                placeholder="e.g. REG-001"
                value={form.registration_number}
                onChange={(e) => setForm((p) => ({ ...p, registration_number: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className={selectCls}
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              >
                <option value="valid">Valid</option>
                <option value="invalid">Invalid</option>
              </select>
            </div>
          </div>
        </section>

        {/* Student Details */}
        <section className="rounded-2xl border border-[var(--border-soft)] bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Student Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                placeholder="Student's full name"
                value={form.full_name}
                onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Date of Birth</label>
              <input
                type="date"
                className={inputCls}
                value={form.date_of_birth}
                onChange={(e) => setForm((p) => ({ ...p, date_of_birth: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">NIC Number</label>
              <input
                className={inputCls}
                placeholder="National Identity Card number"
                value={form.nic_number}
                onChange={(e) => setForm((p) => ({ ...p, nic_number: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                className={inputCls}
                placeholder="student@example.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Course & Institution */}
        <section className="rounded-2xl border border-[var(--border-soft)] bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Course & Institution</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                className={selectCls}
                value={form.course_id}
                onChange={(e) => {
                  const item = courses.find((x) => x.id === e.target.value);
                  setForm((p) => ({ ...p, course_id: e.target.value, course: item?.name ?? "" }));
                }}
                required
              >
                <option value="">Select a course</option>
                {courses.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Institution</label>
              <select
                className={selectCls}
                value={form.institution_id}
                onChange={(e) => {
                  const item = institutions.find((x) => x.id === e.target.value);
                  setForm((p) => ({
                    ...p,
                    institution_id: e.target.value,
                    institute: item?.name ?? "",
                    issuing_authority: item?.name ?? "",
                    institution_logo_url: item?.logo_url ?? "",
                  }));
                }}
              >
                <option value="">Select an institution</option>
                {institutions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Partner</label>
              <select
                className={selectCls}
                value={form.partner_id}
                onChange={(e) => {
                  const item = partners.find((x) => x.id === e.target.value);
                  setForm((p) => ({ ...p, partner_id: e.target.value, partner_logo_url: item?.logo_url ?? "" }));
                }}
              >
                <option value="">Select a partner</option>
                {partners.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Dates & Duration */}
        <section className="rounded-2xl border border-[var(--border-soft)] bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Dates & Duration</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={inputCls}
                value={form.issue_date}
                onChange={(e) => setForm((p) => ({ ...p, issue_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Enrollment Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.enrollment_date}
                onChange={(e) => setForm((p) => ({ ...p, enrollment_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Completion Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.completion_date}
                onChange={(e) => setForm((p) => ({ ...p, completion_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Duration</label>
              <input
                className={inputCls}
                placeholder="e.g. 6 months"
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Student Photo */}
        <section className="rounded-2xl border border-[var(--border-soft)] bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Student Photo</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Photo URL</label>
              <input
                className={inputCls}
                placeholder="https:// or Supabase storage path"
                value={form.image_url}
                onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value, student_photo_path: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border-soft)]" />
              <span className="text-xs text-slate-400">or upload file</span>
              <div className="h-px flex-1 bg-[var(--border-soft)]" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="block w-full rounded-lg border border-dashed border-[var(--border-soft)] px-3 py-3 text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await uploadImage(file);
              }}
            />
            {form.image_url && (
              <p className="text-xs text-emerald-600">✓ Photo path: {form.image_url}</p>
            )}
          </div>
        </section>

        <div className="flex gap-3 pb-2">
          <button
            disabled={saving}
            type="submit"
            className="h-11 rounded-lg bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Certificate"}
          </button>
          <Link
            href="/admin/dashboard"
            className="flex h-11 items-center rounded-lg border border-[var(--border-soft)] px-5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
