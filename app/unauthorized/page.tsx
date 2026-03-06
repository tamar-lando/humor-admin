import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function UnauthorizedPage() {
  const supabase = await createClient();

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-500 text-sm mb-2">
          You need superadmin privileges to access this panel.
        </p>
        {user && (
          <p className="text-slate-400 text-xs mb-8">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
