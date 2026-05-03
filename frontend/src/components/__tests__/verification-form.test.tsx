import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VerificationForm } from "@/components/verification-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("VerificationForm", () => {
  it("renders input and action button", () => {
    render(<VerificationForm />);
    expect(screen.getByPlaceholderText("Enter Certificate ID")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verify Now" })).toBeInTheDocument();
  });
});
