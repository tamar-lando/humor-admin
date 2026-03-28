import { createLLMModel } from "@/app/actions/llm-models";
import Link from "next/link";

export default function NewLLMModelPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/llm-models" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to LLM Models
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Add LLM Model</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form action={createLLMModel} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. GPT-4o"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Model ID
            </label>
            <input
              type="text"
              name="model_id"
              required
              placeholder="e.g. gpt-4o"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Provider ID <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="provider_id"
              placeholder="Provider ID…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Create Model
            </button>
            <Link
              href="/llm-models"
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
