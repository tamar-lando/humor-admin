import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function LlmResponsesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const perPage = 25;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const supabase = await createClient();
  const { data: responses, error, count } = await supabase
    .from("llm_model_responses")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">LLM Responses</h1>
        <p className="text-slate-500 text-sm mt-1">
          {count ?? 0} total LLM model responses
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading LLM responses: {error.message}
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
                Model
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Processing Time
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Temperature
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                System Prompt
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                User Prompt
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {responses?.map((resp, i) => (
              <tr
                key={resp.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(resp.id).slice(0, 8)}...
                </td>
                <td className="px-5 py-3 text-slate-700 font-medium">
                  {resp.model
                    ? String(resp.model).length > 20
                      ? String(resp.model).slice(0, 20) + "..."
                      : resp.model
                    : "—"}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {resp.processing_time_ms != null ? (
                    <span className="inline-flex items-center text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                      {resp.processing_time_ms}ms
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-3 text-slate-600">
                  {resp.temperature != null ? resp.temperature : "—"}
                </td>
                <td className="px-5 py-3 text-slate-500 max-w-[200px]">
                  <span className="block truncate text-xs" title={resp.system_prompt ?? ""}>
                    {resp.system_prompt
                      ? String(resp.system_prompt).slice(0, 60) + (String(resp.system_prompt).length > 60 ? "..." : "")
                      : "—"}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500 max-w-[200px]">
                  <span className="block truncate text-xs" title={resp.user_prompt ?? ""}>
                    {resp.user_prompt
                      ? String(resp.user_prompt).slice(0, 60) + (String(resp.user_prompt).length > 60 ? "..." : "")
                      : "—"}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {resp.created_at
                    ? new Date(resp.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {(!responses || responses.length === 0) && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No LLM responses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Showing {from + 1}–{Math.min(to + 1, count ?? 0)} of {count ?? 0}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}`} className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                ← Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={`?page=${page + 1}`} className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700">
                Next →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
