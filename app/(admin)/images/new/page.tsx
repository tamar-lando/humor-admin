import { createImage } from "@/app/actions/images";
import Link from "next/link";

export default function NewImagePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/images" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Images
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Add Image</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form action={createImage} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              name="url"
              required
              placeholder="https://example.com/image.jpg"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Caption
            </label>
            <textarea
              name="caption"
              rows={3}
              placeholder="Caption for this image…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Create Image
            </button>
            <Link
              href="/images"
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
