import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function CaptionsPage({
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
  const { data: captions, error, count } = await supabase
    .from("captions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / perPage);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Captions</h1>
        <p className="text-slate-500 text-sm mt-1">
          {count ?? 0} captions
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading captions: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Content</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Image ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Created</th>
            </tr>
          </thead>
          <tbody>
            {captions?.map((caption, i) => (
              <tr
                key={caption.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(caption.id).slice(0, 8)}…
                </td>
                <td className="px-5 py-3 text-slate-700 max-w-[400px]">
                  {caption.content ?? caption.text ?? JSON.stringify(caption)}
                </td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {caption.image_id ? String(caption.image_id).slice(0, 8) + "…" : "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {caption.created_at
                    ? new Date(caption.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {(!captions || captions.length === 0) && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  No captions found
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
