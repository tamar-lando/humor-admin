import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import DeleteWhitelistedEmailButton from "@/components/DeleteWhitelistedEmailButton";

export default async function WhitelistedEmailsPage() {
  const supabase = await createClient();
  const { data: emails, error } = await supabase
    .from("whitelisted_email_addresses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Whitelisted Emails</h1>
          <p className="text-slate-500 text-sm mt-1">
            {emails?.length ?? 0} emails
          </p>
        </div>
        <Link
          href="/whitelisted-emails/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Email
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          Error loading emails: {error.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 font-semibold text-slate-600">ID</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Email</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Created</th>
              <th className="text-left px-5 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails?.map((entry, i) => (
              <tr
                key={entry.id}
                className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
              >
                <td className="px-5 py-3 font-mono text-slate-400 text-xs">
                  {String(entry.id).slice(0, 8)}…
                </td>
                <td className="px-5 py-3 text-slate-800">
                  {entry.email ?? "—"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {entry.created_at
                    ? new Date(entry.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/whitelisted-emails/${entry.id}/edit`}
                      className="text-slate-600 hover:text-violet-600 text-xs font-medium"
                    >
                      Edit
                    </Link>
                    <DeleteWhitelistedEmailButton id={String(entry.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {(!emails || emails.length === 0) && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                  No whitelisted emails yet.{" "}
                  <Link href="/whitelisted-emails/new" className="text-violet-600 hover:underline">
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
