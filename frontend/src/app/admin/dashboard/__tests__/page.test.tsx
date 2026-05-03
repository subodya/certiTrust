import React from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminDashboardPage from "@/app/admin/dashboard/page";

const apiMocks = vi.hoisted(() => ({
  listCertificates: vi.fn().mockResolvedValue({
    items: [
      {
        certificate_id: "CERT-1",
        full_name: "Alice Doe",
        course: "Course A",
        institution: "Institution A",
        partner: "Partner A",
        issue_date: "2026-01-01",
        verification_url: "/info/CERT-1",
        has_qr: true,
        status: "valid",
      },
    ],
    total: 1,
    limit: 20,
    offset: 0,
  }),
  listCourses: vi.fn().mockResolvedValue({ items: [] }),
  listInstitutions: vi.fn().mockResolvedValue({ items: [] }),
  listPartners: vi.fn().mockResolvedValue({ items: [] }),
  getCertificate: vi.fn().mockResolvedValue({
    certificate_id: "",
    full_name: "",
    course: "",
    issue_date: "2026-01-01",
    status: "valid",
  }),
  createCertificate: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/admin-api", () => ({
  adminApi: {
    listCertificates: apiMocks.listCertificates,
    listCourses: apiMocks.listCourses,
    listInstitutions: apiMocks.listInstitutions,
    listPartners: apiMocks.listPartners,
    getCertificate: apiMocks.getCertificate,
    createCertificate: apiMocks.createCertificate,
    updateCertificate: vi.fn(),
    deleteCertificate: vi.fn(),
    generateCertificateQr: vi.fn(),
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    channel: () => ({
      on() { return this; },
      subscribe(cb: (s: string) => void) { cb("SUBSCRIBED"); return this; },
    }),
    removeChannel: vi.fn().mockResolvedValue(undefined),
    auth: {
      signOut: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

describe("Admin dashboard page", () => {
  it("renders view-only certificate table", async () => {
    await act(async () => {
      render(<AdminDashboardPage />);
      await Promise.resolve();
    });
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("View-only certificate records from Supabase.")).toBeInTheDocument();
    expect(screen.getByText("Certificate ID")).toBeInTheDocument();
    expect(screen.getByText("Alice Doe")).toBeInTheDocument();
  });
});
