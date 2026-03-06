import { createClient } from "@/utils/supabase/server";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Users</h1>
        <p className="text-slate-500 text-sm mt-1">
          {profiles?.length ?? 0} registered users
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading users: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Username</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Display Name</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Superadmin</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Created At</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((profile, i) => (
              <tr
                key={profile.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {profile.id?.slice(0, 8)}…
                </td>
                <td className="px-5 py-3 text-slate-700">{profile.username ?? "—"}</td>
                <td className="px-5 py-3 text-slate-700">{profile.display_name ?? "—"}</td>
                <td className="px-5 py-3">
                  {profile.is_superadmin ? (
                    <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      ✓ Admin
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {(!profiles || profiles.length === 0) && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
