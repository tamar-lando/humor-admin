import { createClient } from "@/utils/supabase/server";
import { duplicateFlavor } from "@/app/actions/flavors";

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
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {flavors?.map((flavor, i) => {
              const duplicateWithId = duplicateFlavor.bind(null, flavor.id);
              return (
                <tr
                  key={flavor.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                    {String(flavor.id).slice(0, 8)}...
                  </td>
                  <td className="px-5 py-3 text-slate-700 font-medium">
                    {flavor.name ?? "---"}
                  </td>
                  <td className="px-5 py-3 text-slate-500 max-w-[300px] truncate">
                    {flavor.description ?? "---"}
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {flavor.created_at
                      ? new Date(flavor.created_at).toLocaleDateString()
                      : "---"}
                  </td>
                  <td className="px-5 py-3">
                    <form action={duplicateWithId}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 transition-colors cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Duplicate
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {(!flavors || flavors.length === 0) && (
              <tr>
                <td
                  colSpan={5}
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
