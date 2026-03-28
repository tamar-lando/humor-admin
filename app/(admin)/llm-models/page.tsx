import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import DeleteLLMModelButton from "@/components/DeleteLLMModelButton";

export default async function LLMModelsPage() {
  const supabase = await createClient();
  const { data: models, error } = await supabase
    .from("llm_models")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">LLM Models</h1>
          <p className="text-slate-500 text-sm mt-1">
            {models?.length ?? 0} models
          </p>
        </div>
        <Link
          href="/llm-models/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Model
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading models: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Name</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Model ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Provider ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Created</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models?.map((model, i) => (
              <tr
                key={model.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(model.id).slice(0, 8)}…
                </td>
                <td className="px-5 py-3 text-slate-800">
                  {model.name ?? "—"}
                </td>
                <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                  {model.model_id ?? "—"}
                </td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {model.provider_id ? String(model.provider_id).slice(0, 8) + "…" : "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {model.created_at
                    ? new Date(model.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/llm-models/${model.id}/edit`}
                      className="text-slate-600 hover:text-violet-600 text-xs font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteLLMModelButton id={String(model.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {(!models || models.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  No LLM models yet.{" "}
                  <Link href="/llm-models/new" className="text-violet-600 hover:underline">
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
