import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function HumorMixPage() {
  const supabase = await createClient();
  const { data: mixes, error } = await supabase
    .from("humor_mix")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Humor Mix</h1>
        <p className="text-slate-500 text-sm mt-1">
          {mixes?.length ?? 0} humor mix entries
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading humor mix: {error.message}
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
                Humor Flavor ID
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Weight
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Active
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Created At
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mixes?.map((mix, i) => (
              <tr
                key={mix.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(mix.id).slice(0, 8)}...
                </td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {mix.humor_flavor_id
                    ? String(mix.humor_flavor_id).slice(0, 8) + "..."
                    : "—"}
                </td>
                <td className="px-5 py-3 text-slate-700">
                  {mix.weight != null ? (
                    <span className="inline-flex items-center text-xs font-mono bg-violet-50 text-violet-700 px-2 py-0.5 rounded">
                      {mix.weight}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-3">
                  {mix.is_active ?? mix.enabled ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {mix.created_at
                    ? new Date(mix.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/humor-mix/${mix.id}/edit`}
                    className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!mixes || mixes.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No humor mix entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
