import { createClient } from "@/utils/supabase/server";

export default async function LlmResponsesPage() {
  const supabase = await createClient();
  const { data: responses, error } = await supabase
    .from("llm_model_responses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">LLM Responses</h1>
        <p className="text-slate-500 text-sm mt-1">
          Showing {responses?.length ?? 0} most recent LLM model responses
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
      </div>
    </div>
  );
}
