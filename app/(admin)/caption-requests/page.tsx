import { createClient } from "@/utils/supabase/server";

export default async function CaptionRequestsPage() {
  const supabase = await createClient();
  const { data: requests, error } = await supabase
    .from("caption_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Caption Requests</h1>
        <p className="text-slate-500 text-sm mt-1">
          Showing {requests?.length ?? 0} most recent requests
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading caption requests: {error.message}
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
                Image ID
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Profile ID
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Status
              </th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((req, i) => (
              <tr
                key={req.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(req.id).slice(0, 8)}...
                </td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {req.image_id
                    ? String(req.image_id).slice(0, 8) + "..."
                    : "—"}
                </td>
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {req.profile_id
                    ? String(req.profile_id).slice(0, 8) + "..."
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                      req.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : req.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : req.status === "processing"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {req.status ?? "unknown"}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {req.created_at
                    ? new Date(req.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {(!requests || requests.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-slate-400"
                >
                  No caption requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
