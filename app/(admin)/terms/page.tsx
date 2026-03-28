import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import DeleteTermButton from "@/components/DeleteTermButton";

export default async function TermsPage() {
  const supabase = await createClient();
  const { data: terms, error } = await supabase
    .from("terms")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Terms</h1>
          <p className="text-slate-500 text-sm mt-1">
            {terms?.length ?? 0} terms
          </p>
        </div>
        <Link
          href="/terms/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Term
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading terms: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Term</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Definition</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Created</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {terms?.map((term, i) => (
              <tr
                key={term.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(term.id).slice(0, 8)}…
                </td>
                <td className="px-5 py-3 text-slate-800">
                  {term.term ?? "—"}
                </td>
                <td className="px-5 py-3 text-slate-600 max-w-[250px] truncate">
                  {term.definition ?? "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {term.created_at
                    ? new Date(term.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/terms/${term.id}/edit`}
                      className="text-slate-600 hover:text-violet-600 text-xs font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteTermButton id={String(term.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {(!terms || terms.length === 0) && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  No terms yet.{" "}
                  <Link href="/terms/new" className="text-violet-600 hover:underline">
                    Add one.
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
