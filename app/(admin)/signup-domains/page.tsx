import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import DeleteSignupDomainButton from "@/components/DeleteSignupDomainButton";

export default async function SignupDomainsPage() {
  const supabase = await createClient();
  const { data: domains, error } = await supabase
    .from("allowed_signup_domains")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Allowed Signup Domains</h1>
          <p className="text-slate-500 text-sm mt-1">
            {domains?.length ?? 0} domains
          </p>
        </div>
        <Link
          href="/signup-domains/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Domain
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading domains: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Domain</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Created</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {domains?.map((domain, i) => (
              <tr
                key={domain.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(domain.id).slice(0, 8)}…
                </td>
                <td className="px-5 py-3 text-slate-800">
                  {domain.domain ?? "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {domain.created_at
                    ? new Date(domain.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/signup-domains/${domain.id}/edit`}
                      className="text-slate-600 hover:text-violet-600 text-xs font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteSignupDomainButton id={String(domain.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {(!domains || domains.length === 0) && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  No signup domains yet.{" "}
                  <Link href="/signup-domains/new" className="text-violet-600 hover:underline">
                    Add one.
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
