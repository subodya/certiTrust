import React from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CoursesPage from "@/app/admin/courses/page";

vi.mock("@/lib/admin-api", () => ({
  adminApi: {
    listCourses: vi.fn().mockResolvedValue({ items: [] }),
    createCourse: vi.fn().mockResolvedValue({}),
    updateCourse: vi.fn().mockResolvedValue({}),
    deleteCourse: vi.fn().mockResolvedValue({ deleted: true }),
  },
}));

describe("Courses page", () => {
  it("renders add form and title", async () => {
    await act(async () => {
      render(<CoursesPage />);
      await Promise.resolve();
    });
    expect(screen.getByText("Courses")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Course name")).toBeInTheDocument();
  });
});
