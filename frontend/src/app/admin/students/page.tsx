import Link from "next/link";

export default function StudentsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-3xl font-bold">Students</h1>
      <p className="mb-5 text-sm text-slate-600">
        Student records are currently managed through certificate records to keep the workflow simple.
      </p>
      <div className="rounded-2xl border border-[var(--border-soft)] bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm text-slate-700">
          Open the certificates area to create/edit student records and verification data.
        </p>
        <Link href="/admin/dashboard" className="inline-flex rounded-lg bg-[var(--blue-primary)] px-4 py-2 text-white">
          Go to Certificates Dashboard
        </Link>
      </div>
    </main>
  );
}
