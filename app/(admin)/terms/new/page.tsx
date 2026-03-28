import { createTerm } from "@/app/actions/terms";
import Link from "next/link";

export default function NewTermPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Terms
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Add Term</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form action={createTerm} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Term
            </label>
            <input
              type="text"
              name="term"
              required
              placeholder="Enter term…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Definition
            </label>
            <textarea
              name="definition"
              rows={3}
              required
              placeholder="Enter definition…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Term Type ID <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="term_type_id"
              placeholder="Term type ID…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Create Term
            </button>
            <Link
              href="/terms"
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
