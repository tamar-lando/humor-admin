import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";

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

  const [
    { data: recentCaptions },
    { data: recentRequests },
    { data: topVotedRaw },
    { data: recentImages },
  ] = await Promise.all([
    supabase
      .from("captions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("caption_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("caption_votes")
      .select("caption_id, captions(id, content, like_count)")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("images")
      .select("id, url, image_description, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  // Aggregate votes by caption to find top voted
  const voteMap = new Map<
    string,
    { caption_id: string; content: string; voteCount: number }
  >();
  if (topVotedRaw) {
    for (const row of topVotedRaw) {
      const cid = row.caption_id as string;
      const existing = voteMap.get(cid);
      const caption = row.captions as unknown as {
        id: string;
        content: string;
        like_count: number;
      } | null;
      if (existing) {
        existing.voteCount += 1;
      } else {
        voteMap.set(cid, {
          caption_id: cid,
          content: caption?.content ?? "Unknown caption",
          voteCount: 1,
        });
      }
    }
  }
  const topVoted = Array.from(voteMap.values())
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, 5);
  const maxVotes = topVoted.length > 0 ? topVoted[0].voteCount : 1;

  // Compute system health percentages (arbitrary targets for visual effect)
  const systemHealth = [
    {
      label: "User Growth",
      current: profilesCount,
      target: Math.max(profilesCount, 100),
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-violet-100",
    },
    {
      label: "Caption Coverage",
      current: captionsCount,
      target: Math.max(imagesCount * 3, 1),
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100",
    },
    {
      label: "Vote Activity",
      current: votesCount,
      target: Math.max(captionsCount * 2, 1),
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-100",
    },
    {
      label: "LLM Throughput",
      current: llmResponsesCount,
      target: Math.max(captionRequestsCount, 1),
      color: "from-fuchsia-500 to-pink-500",
      bgColor: "bg-fuchsia-100",
    },
  ];

  const stats = [
    {
      label: "Total Users",
      value: profilesCount,
      icon: "👥",
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-gradient-to-br from-violet-500 to-purple-600",
      text: "text-white",
      shadow: "shadow-violet-200",
    },
    {
      label: "Captions",
      value: captionsCount,
      icon: "💬",
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-gradient-to-br from-blue-500 to-cyan-600",
      text: "text-white",
      shadow: "shadow-blue-200",
    },
    {
      label: "Images",
      value: imagesCount,
      icon: "🖼️",
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      text: "text-white",
      shadow: "shadow-emerald-200",
    },
    {
      label: "Votes Cast",
      value: votesCount,
      icon: "🗳️",
      gradient: "from-orange-500 to-amber-600",
      bg: "bg-gradient-to-br from-orange-500 to-amber-600",
      text: "text-white",
      shadow: "shadow-orange-200",
    },
    {
      label: "Humor Flavors",
      value: flavorsCount,
      icon: "🎭",
      gradient: "from-pink-500 to-rose-600",
      bg: "bg-gradient-to-br from-pink-500 to-rose-600",
      text: "text-white",
      shadow: "shadow-pink-200",
    },
    {
      label: "Caption Requests",
      value: captionRequestsCount,
      icon: "📨",
      gradient: "from-indigo-500 to-blue-600",
      bg: "bg-gradient-to-br from-indigo-500 to-blue-600",
      text: "text-white",
      shadow: "shadow-indigo-200",
    },
    {
      label: "LLM Responses",
      value: llmResponsesCount,
      icon: "🤖",
      gradient: "from-fuchsia-500 to-purple-600",
      bg: "bg-gradient-to-br from-fuchsia-500 to-purple-600",
      text: "text-white",
      shadow: "shadow-fuchsia-200",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Gradient Header */}
      <div className="relative mb-8 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, boss
          </h1>
          <p className="mt-2 text-violet-100 text-base">
            Here&apos;s an overview of your Humor platform.
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-violet-200">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All systems operational
            </span>
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`relative rounded-xl p-5 ${stat.bg} ${stat.text} shadow-lg ${stat.shadow} hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-1 drop-shadow-sm">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className="text-2xl bg-white/15 backdrop-blur-sm w-10 h-10 rounded-lg flex items-center justify-center shadow-inner">
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
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
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

      {/* Top Voted Captions with Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">
              Top Voted Captions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Most popular captions by vote count
            </p>
          </div>
          <Link
            href="/captions"
            className="text-xs text-violet-600 hover:text-violet-700 font-medium"
          >
            View all
          </Link>
        </div>
        <div className="p-6">
          {topVoted.length > 0 ? (
            <div className="space-y-4">
              {topVoted.map((item, index) => {
                const percentage = Math.round(
                  (item.voteCount / maxVotes) * 100
                );
                const barColors = [
                  "from-violet-500 to-purple-500",
                  "from-indigo-500 to-blue-500",
                  "from-blue-500 to-cyan-500",
                  "from-fuchsia-500 to-pink-500",
                  "from-purple-500 to-indigo-500",
                ];
                return (
                  <div key={item.caption_id} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700 text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <p className="text-sm text-slate-700 truncate">
                          {item.content}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-sm font-semibold text-slate-600 ml-3 tabular-nums">
                        {item.voteCount}{" "}
                        {item.voteCount === 1 ? "vote" : "votes"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColors[index % barColors.length]} transition-all duration-500 group-hover:opacity-90`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">
              No votes recorded yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Images */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">Recent Images</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest uploads to the platform
            </p>
          </div>
          <Link
            href="/images"
            className="text-xs text-violet-600 hover:text-violet-700 font-medium"
          >
            View all
          </Link>
        </div>
        <div className="p-6">
          {recentImages && recentImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {recentImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {img.url ? (
                    <Image
                      src={img.url}
                      alt={img.image_description ?? "Image"}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-2xl">🖼️</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-xs text-white truncate font-medium">
                        {img.image_description ?? "No description"}
                      </p>
                      <p className="text-[10px] text-white/70">
                        {img.created_at
                          ? new Date(img.created_at).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">
              No images uploaded yet
            </div>
          )}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">System Health</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Platform metrics and coverage indicators
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {systemHealth.map((metric) => {
            const pct = Math.min(
              Math.round((metric.current / metric.target) * 100),
              100
            );
            return (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {metric.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    {metric.current.toLocaleString()} /{" "}
                    {metric.target.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${metric.color} transition-all duration-700 relative`}
                    style={{ width: `${pct}%` }}
                  >
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-sm">
                      {pct}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
                <div
                  key={caption.id}
                  className="px-6 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {caption.content ?? caption.text ?? "—"}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400 font-mono">
                      {String(caption.id).slice(0, 8)}...
                    </span>
                    {caption.like_count != null && (
                      <span className="text-xs text-violet-500 font-medium">
                        {caption.like_count} likes
                      </span>
                    )}
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
                <div
                  key={req.id}
                  className="px-6 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
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
                      Image:{" "}
                      {req.image_id
                        ? String(req.image_id).slice(0, 8) + "..."
                        : "—"}
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
