import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import DeleteImageButton from "@/components/DeleteImageButton";

export default async function ImagesPage() {
  const supabase = await createClient();
  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Images</h1>
          <p className="text-slate-500 text-sm mt-1">
            {images?.length ?? 0} images
          </p>
        </div>
        <Link
          href="/images/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Image
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading images: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">URL</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Caption</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Created</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {images?.map((image, i) => (
              <tr
                key={image.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(image.id).slice(0, 8)}…
                </td>
                <td className="px-5 py-3 max-w-[200px]">
                  {image.url ? (
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:underline truncate block"
                    >
                      {image.url}
                    </a>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-600 max-w-[250px] truncate">
                  {image.caption ?? "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {image.created_at
                    ? new Date(image.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/images/${image.id}/edit`}
                      className="text-slate-600 hover:text-violet-600 text-xs font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteImageButton id={String(image.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {(!images || images.length === 0) && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  No images yet.{" "}
                  <Link href="/images/new" className="text-violet-600 hover:underline">
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
