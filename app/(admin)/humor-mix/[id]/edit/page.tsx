import { createClient } from "@/utils/supabase/server";
import { updateHumorMix } from "@/app/actions/humor-mix";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditHumorMixPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: mix } = await supabase
    .from("humor_mix")
    .select("*")
    .eq("id", id)
    .single();

  if (!mix) notFound();

  const updateWithId = updateHumorMix.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/humor-mix"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to Humor Mix
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">
          Edit Humor Mix
        </h1>
        <p className="text-slate-500 text-xs mt-1 font-mono">{id}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form action={updateWithId} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Humor Flavor ID
            </label>
            <input
              type="text"
              name="humor_flavor_id"
              defaultValue={mix.humor_flavor_id ?? ""}
              placeholder="Humor flavor UUID"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Weight
            </label>
            <input
              type="number"
              name="weight"
              step="0.01"
              defaultValue={mix.weight ?? ""}
              placeholder="e.g. 1.0"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              defaultChecked={mix.is_active ?? mix.enabled ?? false}
              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-slate-700"
            >
              Active
            </label>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Save Changes
            </button>
            <Link
              href="/humor-mix"
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
