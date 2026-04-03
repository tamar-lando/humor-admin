import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const navGroups = [
  {
    label: "Overview",
    items: [{ href: "/", label: "Dashboard", icon: "📊" }],
  },
  {
    label: "Content",
    items: [
      { href: "/users", label: "Users", icon: "👥" },
      { href: "/images", label: "Images", icon: "🖼️" },
      { href: "/captions", label: "Captions", icon: "💬" },
      { href: "/caption-stats", label: "Caption Stats", icon: "📈" },
      { href: "/caption-requests", label: "Caption Requests", icon: "📨" },
      { href: "/caption-examples", label: "Caption Examples", icon: "📝" },
    ],
  },
  {
    label: "AI / Generation",
    items: [
      { href: "/flavors", label: "Humor Flavors", icon: "🎭" },
      { href: "/humor-mix", label: "Humor Mix", icon: "🎲" },
      { href: "/llm-models", label: "LLM Models", icon: "🤖" },
      { href: "/llm-providers", label: "LLM Providers", icon: "🏢" },
      { href: "/prompt-chains", label: "Prompt Chains", icon: "🔗" },
      { href: "/llm-responses", label: "LLM Responses", icon: "📊" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/terms", label: "Terms", icon: "📖" },
      { href: "/signup-domains", label: "Signup Domains", icon: "🌐" },
      { href: "/whitelisted-emails", label: "Whitelisted Emails", icon: "📧" },
    ],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 h-full z-10">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">😂</span>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">
                Humor Admin
              </p>
              <p className="text-xs text-slate-400">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors text-sm font-medium group"
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 truncate mb-2">{user.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left text-xs text-slate-500 hover:text-red-500 transition-colors py-1 cursor-pointer"
            >
              Sign out →
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">{children}</main>
    </div>
  );
}
