import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

async function getStat(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string
) {
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    profilesCount,
    captionsCount,
    imagesCount,
    votesCount,
    flavorsCount,
    captionRequestsCount,
    llmResponsesCount,
  ] = await Promise.all([
    getStat(supabase, "profiles"),
    getStat(supabase, "captions"),
    getStat(supabase, "images"),
    getStat(supabase, "caption_votes"),
    getStat(supabase, "humor_flavors"),
    getStat(supabase, "caption_requests"),
    getStat(supabase, "llm_model_responses"),
  ]);

  const { data: recentCaptions } = await supabase
    .from("captions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentRequests } = await supabase
    .from("caption_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      label: "Total Users",
      value: profilesCount,
      icon: "👥",
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      text: "text-violet-700",
    },
    {
      label: "Captions",
      value: captionsCount,
      icon: "💬",
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      label: "Images",
      value: imagesCount,
      icon: "🖼️",
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    {
      label: "Votes Cast",
      value: votesCount,
      icon: "🗳️",
      gradient: "from-orange-500 to-amber-600",
      bg: "bg-orange-50",
      text: "text-orange-700",
    },
    {
      label: "Humor Flavors",
      value: flavorsCount,
      icon: "🎭",
      gradient: "from-pink-500 to-rose-600",
      bg: "bg-pink-50",
      text: "text-pink-700",
    },
    {
      label: "Caption Requests",
      value: captionRequestsCount,
      icon: "📨",
      gradient: "from-indigo-500 to-blue-600",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
    },
    {
      label: "LLM Responses",
      value: llmResponsesCount,
      icon: "🤖",
      gradient: "from-fuchsia-500 to-purple-600",
      bg: "bg-fuchsia-50",
      text: "text-fuchsia-700",
    },
  ];

  return (
    <div className="p-8">
      {/* Gradient Header */}
      <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, boss
          </h1>
          <p className="mt-2 text-violet-100 text-base">
            Here&apos;s an overview of your Humor platform.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
          >
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient}`}
            ></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div
                className={`text-2xl ${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
        <h2 className="font-semibold text-slate-800 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/images/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-sm"
          >
            <span>+</span> Add Image
          </Link>
          <Link
            href="/users"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 transition-colors"
          >
            View Users
          </Link>
          <Link
            href="/captions"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 transition-colors"
          >
            View Captions
          </Link>
          <Link
            href="/flavors"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg border border-slate-200 transition-colors"
          >
            View Flavors
          </Link>
        </div>
      </div>

      {/* Two column layout for recent data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Captions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Recent Captions</h2>
            <Link
              href="/captions"
              className="text-xs text-violet-600 hover:text-violet-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentCaptions && recentCaptions.length > 0 ? (
              recentCaptions.map((caption) => (
                <div key={caption.id} className="px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {caption.content ?? caption.text ?? "—"}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400 font-mono">
                      {String(caption.id).slice(0, 8)}...
                    </span>
                    <span className="text-xs text-slate-400">
                      {caption.created_at
                        ? new Date(caption.created_at).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center text-sm text-slate-400">
                No captions yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity (Caption Requests) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Recent Activity</h2>
            <Link
              href="/caption-requests"
              className="text-xs text-violet-600 hover:text-violet-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentRequests && recentRequests.length > 0 ? (
              recentRequests.map((req) => (
                <div key={req.id} className="px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 font-mono">
                      {String(req.id).slice(0, 12)}...
                    </span>
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
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400">
                      Image: {req.image_id ? String(req.image_id).slice(0, 8) + "..." : "—"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {req.created_at
                        ? new Date(req.created_at).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center text-sm text-slate-400">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
