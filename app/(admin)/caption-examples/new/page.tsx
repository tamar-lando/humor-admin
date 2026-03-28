import { createCaptionExample } from "@/app/actions/caption-examples";
import Link from "next/link";

export default function NewCaptionExamplePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/caption-examples" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Caption Examples
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Add Caption Example</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form action={createCaptionExample} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Content
            </label>
            <textarea
              name="content"
              rows={3}
              required
              placeholder="Enter caption example content…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Image ID <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="image_id"
              placeholder="Image ID…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Humor Flavor ID <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="humor_flavor_id"
              placeholder="Humor flavor ID…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Create Caption Example
            </button>
            <Link
              href="/caption-examples"
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
