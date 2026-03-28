import { createWhitelistedEmail } from "@/app/actions/whitelisted-emails";
import Link from "next/link";

export default function NewWhitelistedEmailPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/whitelisted-emails" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Whitelisted Emails
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">Add Whitelisted Email</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <form action={createWhitelistedEmail} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@example.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Create Email
            </button>
            <Link
              href="/whitelisted-emails"
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
