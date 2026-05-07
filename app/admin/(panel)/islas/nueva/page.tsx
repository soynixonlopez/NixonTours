import { IslandForm } from "@/components/admin/island-form";

export default function NuevaIslaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold font-display text-brand-deep">Nueva isla</h1>
        <p className="text-sm text-slate-600">Slug en minúsculas con guiones.</p>
      </div>
      <IslandForm />
    </div>
  );
}
