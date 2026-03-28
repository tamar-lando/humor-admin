import { createClient } from "@/utils/supabase/server";

export default async function FlavorsPage() {
  const supabase = await createClient();
  const { data: flavors, error } = await supabase
    .from("humor_flavors")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Humor Flavors</h1>
        <p className="text-slate-500 text-sm mt-1">
          {flavors?.length ?? 0} flavors
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading flavors: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                ID
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Name
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Description
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {flavors?.map((flavor, i) => (
              <tr
                key={flavor.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(flavor.id).slice(0, 8)}...
                </td>
                <td className="px-5 py-3 text-slate-700 font-medium">
                  {flavor.name ?? "—"}
                </td>
                <td className="px-5 py-3 text-slate-500 max-w-[300px] truncate">
                  {flavor.description ?? "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {flavor.created_at
                    ? new Date(flavor.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {(!flavors || flavors.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No humor flavors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
