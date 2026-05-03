"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Building2, Handshake, LayoutDashboard, LogOut, PlusCircle, Settings, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/certificates/new", label: "Add Certificate", icon: PlusCircle },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/institutions", label: "Institutions", icon: Building2 },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
      } else {
        setChecked(true);
      }
    });
  }, [isLoginPage, router]);

  if (!checked) return null;

  if (isLoginPage) return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-56 flex-col border-r border-[var(--border-soft)] bg-white">
        <div className="flex items-center gap-2 border-b border-[var(--border-soft)] px-4 py-4">
          <ShieldCheck className="h-5 w-5 text-[var(--color-brand-primary)]" />
          <span className="font-bold text-slate-900">CertiTrust</span>
          <span className="ml-1 text-xs text-slate-400">Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/admin/dashboard" && href !== "/admin/certificates/new" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[var(--color-brand-primary)] text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-[var(--border-soft)] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
      <div className="ml-56 flex-1 overflow-auto bg-slate-50">
        {children}
      </div>
    </div>
  );
}
