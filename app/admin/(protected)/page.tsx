"use client";

import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

export default function AdminDashboard() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Welcome to Pandawa CMS"
      />

      <Card className="p-8 md:p-10">
        <h2 className="text-2xl font-bold">Selamat datang di Pandawa CMS</h2>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-mid">
          Kelola event, data lulusan, dan foto wisuda dari satu tempat. Gunakan
          menu di samping untuk mulai mengelola konten Anda.
        </p>
      </Card>
    </div>
  );
}
