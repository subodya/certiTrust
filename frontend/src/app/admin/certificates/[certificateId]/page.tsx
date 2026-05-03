"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, adminGet, adminSend } from "@/lib/admin-api";
import type { LookupItem } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
function qrPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/certificate-qr/${path.replace(/^\//, "")}`;
}

const inputCls =
  "h-11 w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100";
const selectCls =
  "h-11 w-full rounded-lg border border-[var(--border-soft)] bg-white px-3 text-sm text-slate-900 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-2 focus:ring-blue-100";
const disabledCls =
  "h-11 w-full rounded-lg border border-[var(--border-soft)] bg-slate-50 px-3 text-sm text-slate-500";

type Payload = {
  certificate_id: string;
  full_name: string;
  course: string;
  course_id?: string;
  issue_date: string;
  completion_date?: string;
  enrollment_date?: string;
  duration?: string;
  institute?: string;
  institution_id?: string;
  registration_number?: string;
  issuing_authority?: string;
  partner_id?: string;
  date_of_birth?: string;
  nic_number?: string;
  email?: string;
  image_url?: string;
  student_photo_path?: string;
  institution_logo_url?: string;
  partner_logo_url?: string;
  certificate_qr_path?: string;
  status: "valid" | "invalid";
};

export default function EditCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const [record, setRecord] = useState<Payload | null>(null);
  const [courses, setCourses] = useState<LookupItem[]>([]);
  const [institutions, setInstitutions] = useState<LookupItem[]>([]);
  const [partners, setPartners] = useState<LookupItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrPath, setQrPath] = useState<string | null>(null);
  const router = useRouter();

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    Promise.all([
      adminGet("/api/admin/courses").then((r) => r.json()),
      adminGet("/api/admin/institutions").then((r) => r.json()),
      adminGet("/api/admin/partners").then((r) => r.json()),
    ]).then(([courseData, institutionData, partnerData]) => {
      setCourses(courseData.items ?? []);
      setInstitutions(institutionData.items ?? []);
      setPartners(partnerData.items ?? []);
    });

    params.then(({ certificateId }) => {
      fetch(`${API_BASE}/api/info/${certificateId}`)
        .then((r) => r.json())
        .then((data) => {
          setRecord(data);
          if (data.certificate_qr_path) setQrPath(data.certificate_qr_path);
        });
    });
  }, [params]);

  if (!record) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-400">Loading certificate...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Certificate</h1>
          <p className="mt-0.5 font-mono text-xs text-slate-400">{record.certificate_id}</p>
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

      {qrPath && (
        <div className="mb-5 flex items-center gap-4 rounded-2xl border border-[var(--border-soft)] bg-white p-4">
          <img
            src={qrPublicUrl(qrPath)}
            alt={`QR code for ${record.certificate_id}`}
            className="h-24 w-24 rounded-lg border border-[var(--border-soft)] object-contain"
          />
          <div>
            <p className="text-sm font-medium text-slate-700">QR Code Ready</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Points to: /info/{record.certificate_id}
            </p>
            <a
              href={qrPublicUrl(qrPath)}
              download={`qr-${record.certificate_id}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              ⬇ Download QR
            </a>
          </div>
        </div>
      )}

      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          setError(null);
          try {
            const res = await adminSend(`/api/admin/certificates/${record.certificate_id}`, "PUT", record);
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error((data?.detail as string) ?? `Update failed (${res.status})`);
            }
            router.push("/admin/dashboard");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to update certificate");
            setSaving(false);
          }
        }}
      >
        {/* Certificate Info */}
        <section className="rounded-2xl border border-[var(--border-soft)] bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Certificate Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Certificate ID</label>
              <input className={disabledCls} value={record.certificate_id} disabled />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Registration Number</label>
              <input
                className={inputCls}
                placeholder="e.g. REG-001"
                value={record.registration_number ?? ""}
                onChange={(e) => setRecord({ ...record, registration_number: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <select
                className={selectCls}
                value={record.status}
                onChange={(e) => setRecord({ ...record, status: e.target.value as "valid" | "invalid" })}
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
                value={record.full_name}
                onChange={(e) => setRecord({ ...record, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Date of Birth</label>
              <input
                type="date"
                className={inputCls}
                value={record.date_of_birth ?? ""}
                onChange={(e) => setRecord({ ...record, date_of_birth: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">NIC Number</label>
              <input
                className={inputCls}
                placeholder="National Identity Card number"
                value={record.nic_number ?? ""}
                onChange={(e) => setRecord({ ...record, nic_number: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                className={inputCls}
                placeholder="student@example.com"
                value={record.email ?? ""}
                onChange={(e) => setRecord({ ...record, email: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Course & Institution */}
        <section className="rounded-2xl border border-[var(--border-soft)] bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Course & Institution</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Course</label>
              <select
                className={selectCls}
                value={record.course_id ?? ""}
                onChange={(e) => {
                  const item = courses.find((x) => x.id === e.target.value);
                  setRecord({ ...record, course_id: e.target.value, course: item?.name ?? record.course });
                }}
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
                value={record.institution_id ?? ""}
                onChange={(e) => {
                  const item = institutions.find((x) => x.id === e.target.value);
                  setRecord({
                    ...record,
                    institution_id: e.target.value,
                    institute: item?.name ?? record.institute,
                    issuing_authority: item?.name ?? record.issuing_authority,
                    institution_logo_url: item?.logo_url ?? record.institution_logo_url,
                  });
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
                value={record.partner_id ?? ""}
                onChange={(e) => {
                  const item = partners.find((x) => x.id === e.target.value);
                  setRecord({ ...record, partner_id: e.target.value, partner_logo_url: item?.logo_url ?? record.partner_logo_url });
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
                value={record.issue_date ?? ""}
                onChange={(e) => setRecord({ ...record, issue_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Enrollment Date</label>
              <input
                type="date"
                className={inputCls}
                value={record.enrollment_date ?? ""}
                onChange={(e) => setRecord({ ...record, enrollment_date: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Completion Date</label>
              <input
                type="date"
                className={inputCls}
                value={record.completion_date ?? ""}
                onChange={(e) => setRecord({ ...record, completion_date: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Duration</label>
              <input
                className={inputCls}
                placeholder="e.g. 6 months"
                value={record.duration ?? ""}
                onChange={(e) => setRecord({ ...record, duration: e.target.value })}
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
                value={record.image_url ?? ""}
                onChange={(e) => setRecord({ ...record, image_url: e.target.value, student_photo_path: e.target.value })}
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
                if (!file) return;
                const fileBase64 = await fileToBase64(file);
                const res = await adminSend(
                  "/api/admin/media/upload?bucket=student-photos&file_name=" + encodeURIComponent(file.name),
                  "POST",
                  { file_base64: fileBase64, content_type: file.type || "application/octet-stream" }
                );
                const data = await res.json();
                setRecord({ ...record, image_url: data.path, student_photo_path: data.path });
              }}
            />
            {record.image_url && (
              <p className="text-xs text-emerald-600">✓ Photo path: {record.image_url}</p>
            )}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 pb-2">
          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-lg bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className="h-11 rounded-lg border border-emerald-200 bg-emerald-50 px-5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
            onClick={async () => {
              try {
                const result = await adminApi.generateCertificateQr(record.certificate_id);
                setQrPath(result.certificate_qr_path);
              } catch {
                setError("QR generation failed — check that the qrcode package is installed in the backend.");
              }
            }}
          >
            {qrPath ? "Regenerate QR" : "Generate QR"}
          </button>
          <button
            type="button"
            className="h-11 rounded-lg border border-red-200 bg-red-50 px-5 text-sm font-medium text-red-600 hover:bg-red-100"
            onClick={async () => {
              if (!confirm("Permanently delete this certificate? This cannot be undone.")) return;
              await adminSend(`/api/admin/certificates/${record.certificate_id}`, "DELETE");
              router.push("/admin/dashboard");
            }}
          >
            Delete
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
