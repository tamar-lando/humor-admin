import { createClient } from "@/utils/supabase/server";
import { updateSignupDomain } from "@/app/actions/signup-domains";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditSignupDomainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: domain } = await supabase
    .from("allowed_signup_domains")
    .select("*")
    .eq("id", id)
    .single();

  if (!domain) notFound();

  const updateWithId = updateSignupDomain.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/signup-domains" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Signup Domains
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Edit Signup Domain</h1>
        <p className="text-slate-500 text-xs mt-1 font-mono">{id}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form action={updateWithId} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Domain
            </label>
            <input
              type="text"
              name="domain"
              defaultValue={domain.domain ?? ""}
              required
              placeholder="e.g. example.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Save Changes
            </button>
            <Link
              href="/signup-domains"
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
