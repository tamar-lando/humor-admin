import { createClient } from "@/utils/supabase/server";

export default async function CaptionsPage() {
  const supabase = await createClient();
  const { data: captions, error } = await supabase
    .from("captions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Captions</h1>
        <p className="text-slate-500 text-sm mt-1">
          {captions?.length ?? 0} captions
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
      </div>
    </div>
  );
}
