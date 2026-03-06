import { createClient } from "@/utils/supabase/server";

async function getStat(supabase: Awaited<ReturnType<typeof createClient>>, table: string) {
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [profilesCount, captionsCount, imagesCount, votesCount] = await Promise.all([
    getStat(supabase, "profiles"),
    getStat(supabase, "captions"),
    getStat(supabase, "images"),
    getStat(supabase, "caption_votes"),
  ]);

  const stats = [
    { label: "Total Users", value: profilesCount, icon: "👥", color: "bg-violet-50 text-violet-700 border-violet-100" },
    { label: "Captions", value: captionsCount, icon: "💬", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "Images", value: imagesCount, icon: "🖼️", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { label: "Votes Cast", value: votesCount, icon: "🗳️", color: "bg-orange-50 text-orange-700 border-orange-100" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, boss. Here&apos;s what&apos;s going on.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-5 ${stat.color}`}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
            <div className="text-sm font-medium mt-1 opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-700 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/images/new" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <span>+</span> Add Image
          </a>
          <a href="/users" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 transition-colors">
            View Users
          </a>
          <a href="/captions" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 transition-colors">
            View Captions
          </a>
        </div>
      </div>
    </div>
  );
}
