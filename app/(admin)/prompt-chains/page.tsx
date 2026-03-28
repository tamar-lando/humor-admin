import { createClient } from "@/utils/supabase/server";

export default async function PromptChainsPage() {
  const supabase = await createClient();
  const { data: chains, error } = await supabase
    .from("llm_prompt_chains")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Prompt Chains</h1>
        <p className="text-slate-500 text-sm mt-1">
          Showing {chains?.length ?? 0} most recent prompt chains
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading prompt chains: {error.message}
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
                Caption Request ID
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Humor Flavor ID
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {chains?.map((chain, i) => (
              <tr
                key={chain.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(chain.id).slice(0, 8)}...
                </td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {chain.caption_request_id
                    ? String(chain.caption_request_id).slice(0, 8) + "..."
                    : "—"}
                </td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {chain.humor_flavor_id
                    ? String(chain.humor_flavor_id).slice(0, 8) + "..."
                    : "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {chain.created_at
                    ? new Date(chain.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {(!chains || chains.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No prompt chains found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
