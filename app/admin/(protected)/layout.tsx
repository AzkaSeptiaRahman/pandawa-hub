"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import BulkUploadProvider from "@/components/admin/BulkUploadProvider";
import BulkUploadProgress from "@/components/admin/BulkUploadProgress";
import Spinner from "@/components/ui/Spinner";

function readUsername(token: string): string {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload.username || "Admin";
  } catch {
    return "Admin";
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setUsername(readUsername(token));
    setChecking(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/admin/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center text-mid">
        <span className="inline-flex items-center gap-3">
          <Spinner />
          Checking session...
        </span>
      </main>
    );
  }

  return (
    <BulkUploadProvider>
      <div className="flex min-h-screen flex-col bg-app min-[900px]:flex-row">
        <AdminSidebar username={username} onLogout={logout} />

        <main className="relative flex-1 min-w-0">
          <div className="app-hero" aria-hidden="true" />

          {/* Sticky progress bar: tetap terlihat saat pindah halaman admin. */}
          <BulkUploadProgress />

          <div className="relative z-10 mx-auto max-w-[1180px] px-5 py-7 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </BulkUploadProvider>
  );
}
