import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function CaptionStatsPage() {
  const supabase = await createClient();

  // Fetch all votes with caption info
  const { data: allVotes, error: votesError } = await supabase
    .from("caption_votes")
    .select("id, caption_id, vote_value, created_at, captions(id, content)")
    .order("created_at", { ascending: false });

  // Fetch total captions count
  const { count: totalCaptions } = await supabase
    .from("captions")
    .select("*", { count: "exact", head: true });

  const votes = allVotes ?? [];
  const captionCount = totalCaptions ?? 0;

  // --- Vote Distribution ---
  let thumbsUp = 0;
  let thumbsDown = 0;
  for (const v of votes) {
    if (v.vote_value === 1) thumbsUp++;
    else if (v.vote_value === -1) thumbsDown++;
  }
  const totalVotes = thumbsUp + thumbsDown;

  // --- Most Voted Captions (top 10 by total votes) ---
  const voteMap = new Map<
    string,
    {
      caption_id: string;
      content: string;
      up: number;
      down: number;
      total: number;
    }
  >();
  for (const v of votes) {
    const cid = v.caption_id as string;
    const caption = v.captions as unknown as {
      id: string;
      content: string;
    } | null;
    const existing = voteMap.get(cid);
    if (existing) {
      if (v.vote_value === 1) existing.up++;
      else if (v.vote_value === -1) existing.down++;
      existing.total++;
    } else {
      voteMap.set(cid, {
        caption_id: cid,
        content: caption?.content ?? "Unknown caption",
        up: v.vote_value === 1 ? 1 : 0,
        down: v.vote_value === -1 ? 1 : 0,
        total: 1,
      });
    }
  }

  const topVoted = Array.from(voteMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
  const maxVotes = topVoted.length > 0 ? topVoted[0].total : 1;

  // --- Average Votes Per Caption ---
  const captionsWithVotes = voteMap.size;
  const avgVotesPerCaption =
    captionsWithVotes > 0 ? (totalVotes / captionsWithVotes).toFixed(1) : "0";

  // --- Captions with no votes ---
  // Fetch captions that have no matching vote entries
  const votedCaptionIds = Array.from(voteMap.keys());
  let captionsNoVotesQuery = supabase
    .from("captions")
    .select("id, content, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (votedCaptionIds.length > 0) {
    // Use "not in" filter: fetch captions whose id is NOT in the voted list
    captionsNoVotesQuery = captionsNoVotesQuery.not(
      "id",
      "in",
      `(${votedCaptionIds.join(",")})`
    );
  }

  const { data: noVoteCaptions } = await captionsNoVotesQuery;
  const captionsWithNoVotes = noVoteCaptions ?? [];
  const noVoteCount = captionCount - captionsWithVotes;

  // --- Recent Voting Activity ---
  const recentVotes = votes.slice(0, 20);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Caption Vote Statistics
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Detailed breakdown of user voting activity on captions
        </p>
      </div>

      {votesError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          Error loading votes: {votesError.message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white shadow-lg shadow-blue-200">
          <p className="text-sm font-medium text-white/80">Total Votes</p>
          <p className="text-3xl font-bold mt-1">
            {totalVotes.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-200">
          <p className="text-sm font-medium text-white/80">Thumbs Up</p>
          <p className="text-3xl font-bold mt-1">
            {thumbsUp.toLocaleString()}
          </p>
          <p className="text-xs text-white/60 mt-1">
            {totalVotes > 0
              ? ((thumbsUp / totalVotes) * 100).toFixed(1)
              : "0"}
            % of votes
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-5 text-white shadow-lg shadow-red-200">
          <p className="text-sm font-medium text-white/80">Thumbs Down</p>
          <p className="text-3xl font-bold mt-1">
            {thumbsDown.toLocaleString()}
          </p>
          <p className="text-xs text-white/60 mt-1">
            {totalVotes > 0
              ? ((thumbsDown / totalVotes) * 100).toFixed(1)
              : "0"}
            % of votes
          </p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white shadow-lg shadow-violet-200">
          <p className="text-sm font-medium text-white/80">Avg Votes/Caption</p>
          <p className="text-3xl font-bold mt-1">{avgVotesPerCaption}</p>
          <p className="text-xs text-white/60 mt-1">
            across {captionsWithVotes} voted captions
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl p-5 text-white shadow-lg shadow-slate-200">
          <p className="text-sm font-medium text-white/80">No Votes Yet</p>
          <p className="text-3xl font-bold mt-1">
            {noVoteCount.toLocaleString()}
          </p>
          <p className="text-xs text-white/60 mt-1">
            of {captionCount} total captions
          </p>
        </div>
      </div>

      {/* Vote Distribution Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Vote Distribution</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Thumbs up vs thumbs down ratio
          </p>
        </div>
        <div className="p-6">
          {totalVotes > 0 ? (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-sm text-slate-600">
                    Thumbs Up ({thumbsUp})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm text-slate-600">
                    Thumbs Down ({thumbsDown})
                  </span>
                </div>
              </div>
              <div className="w-full h-10 rounded-full overflow-hidden flex bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 flex items-center justify-center"
                  style={{
                    width: `${(thumbsUp / totalVotes) * 100}%`,
                  }}
                >
                  {thumbsUp > 0 && (
                    <span className="text-xs font-bold text-white drop-shadow-sm">
                      {((thumbsUp / totalVotes) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500 flex items-center justify-center"
                  style={{
                    width: `${(thumbsDown / totalVotes) * 100}%`,
                  }}
                >
                  {thumbsDown > 0 && (
                    <span className="text-xs font-bold text-white drop-shadow-sm">
                      {((thumbsDown / totalVotes) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">
              No votes recorded yet
            </div>
          )}
        </div>
      </div>

      {/* Most Voted Captions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">
              Most Voted Captions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Top 10 captions by total vote count
            </p>
          </div>
          <Link
            href="/captions"
            className="text-xs text-violet-600 hover:text-violet-700 font-medium"
          >
            View all captions
          </Link>
        </div>
        <div className="p-6">
          {topVoted.length > 0 ? (
            <div className="space-y-4">
              {topVoted.map((item, index) => {
                const percentage = Math.round(
                  (item.total / maxVotes) * 100
                );
                const barColors = [
                  "from-violet-500 to-purple-500",
                  "from-indigo-500 to-blue-500",
                  "from-blue-500 to-cyan-500",
                  "from-fuchsia-500 to-pink-500",
                  "from-purple-500 to-indigo-500",
                  "from-emerald-500 to-teal-500",
                  "from-amber-500 to-orange-500",
                  "from-rose-500 to-red-500",
                  "from-cyan-500 to-sky-500",
                  "from-lime-500 to-green-500",
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
                      <div className="flex-shrink-0 flex items-center gap-3 ml-3">
                        <span className="text-xs text-emerald-600 font-medium">
                          +{item.up}
                        </span>
                        <span className="text-xs text-red-500 font-medium">
                          -{item.down}
                        </span>
                        <span className="text-sm font-semibold text-slate-600 tabular-nums">
                          {item.total}{" "}
                          {item.total === 1 ? "vote" : "votes"}
                        </span>
                      </div>
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

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Captions with No Votes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">
              Captions with No Votes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {noVoteCount > 20
                ? `Showing 20 of ${noVoteCount} unvoted captions`
                : `${captionsWithNoVotes.length} captions without any votes`}
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {captionsWithNoVotes.length > 0 ? (
              captionsWithNoVotes.map((caption) => (
                <div
                  key={caption.id}
                  className="px-6 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {caption.content ?? "---"}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-400 font-mono">
                      {String(caption.id).slice(0, 8)}...
                    </span>
                    <span className="text-xs text-slate-400">
                      {caption.created_at
                        ? new Date(caption.created_at).toLocaleDateString()
                        : "---"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center text-sm text-slate-400">
                All captions have at least one vote
              </div>
            )}
          </div>
        </div>

        {/* Recent Voting Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">
              Recent Voting Activity
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Last 20 votes cast by users
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {recentVotes.length > 0 ? (
              recentVotes.map((vote) => {
                const caption = vote.captions as unknown as {
                  id: string;
                  content: string;
                } | null;
                return (
                  <div
                    key={vote.id}
                    className="px-6 py-3.5 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                          vote.vote_value === 1
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {vote.vote_value === 1 ? "+" : "-"}
                      </span>
                      <p className="text-sm text-slate-700 truncate flex-1">
                        {caption?.content ?? "Unknown caption"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 ml-9">
                      <span className="text-xs text-slate-400 font-mono">
                        {String(vote.caption_id).slice(0, 8)}...
                      </span>
                      <span className="text-xs text-slate-400">
                        {vote.created_at
                          ? new Date(vote.created_at).toLocaleString()
                          : "---"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-10 text-center text-sm text-slate-400">
                No voting activity yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
