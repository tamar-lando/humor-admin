import { createClient } from "@/utils/supabase/server";
import { updateLLMProvider } from "@/app/actions/llm-providers";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditLLMProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: provider } = await supabase
    .from("llm_providers")
    .select("*")
    .eq("id", id)
    .single();

  if (!provider) notFound();

  const updateWithId = updateLLMProvider.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/llm-providers" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to LLM Providers
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Edit LLM Provider</h1>
        <p className="text-slate-500 text-xs mt-1 font-mono">{id}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form action={updateWithId} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={provider.name ?? ""}
              required
              placeholder="e.g. OpenAI"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              API Base URL <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              name="api_base_url"
              defaultValue={provider.api_base_url ?? ""}
              placeholder="https://api.openai.com/v1"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Save Changes
            </button>
            <Link
              href="/llm-providers"
              className="bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg border border-slate-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
