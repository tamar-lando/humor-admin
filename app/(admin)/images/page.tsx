import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import DeleteImageButton from "@/components/DeleteImageButton";

const PAGE_SIZE = 20;

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; view?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const view = params.view === "grid" ? "grid" : "table";
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const { count } = await supabase
    .from("images")
    .select("*", { count: "exact", head: true });

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const { data: images, error } = await supabase
    .from("images")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Images</h1>
          <p className="text-slate-500 text-sm mt-1">
            {totalCount} image{totalCount !== 1 ? "s" : ""}{" "}
            {totalPages > 1 && (
              <span className="text-slate-400">
                &middot; Page {currentPage} of {totalPages}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <Link
              href={`/images?page=${currentPage}&view=table`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === "table"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
              </svg>
              Table
            </Link>
            <Link
              href={`/images?page=${currentPage}&view=grid`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                view === "grid"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <svg className="w-4 h-4 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Grid
            </Link>
          </div>
          <Link
            href="/images/new"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Image
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          Error loading images: {error.message}
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {images?.map((image) => (
            <div
              key={image.id}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-violet-300 hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.image_description || image.caption || "Image"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/images/${image.id}/edit`}
                      className="bg-white text-slate-700 hover:text-violet-700 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteImageButton id={String(image.id)} />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-slate-700 font-medium truncate">
                  {image.caption || image.image_description || "Untitled"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {image.created_at
                    ? new Date(image.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          ))}
          {(!images || images.length === 0) && (
            <div className="col-span-full py-16 text-center text-slate-400">
              No images yet.{" "}
              <Link href="/images/new" className="text-violet-600 hover:underline">
                Add one.
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 font-semibold text-slate-600 w-20">Preview</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Description</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Caption</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Created</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {images?.map((image) => (
                <tr
                  key={image.id}
                  className="hover:bg-violet-50/30 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={image.image_description || image.caption || "Image"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 max-w-[280px]">
                    <p className="text-slate-700 truncate font-medium text-sm">
                      {image.image_description || "—"}
                    </p>
                    {image.url && (
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-500 hover:text-violet-700 text-xs truncate block mt-0.5"
                      >
                        {image.url}
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-[250px] truncate">
                    {image.caption ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {image.created_at
                      ? new Date(image.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/images/${image.id}/edit`}
                        className="text-slate-500 hover:text-violet-600 text-xs font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteImageButton id={String(image.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {(!images || images.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-slate-400">
                    No images yet.{" "}
                    <Link href="/images/new" className="text-violet-600 hover:underline">
                      Add one.
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {from + 1}&ndash;{Math.min(to + 1, totalCount)} of{" "}
            {totalCount}
          </p>
          <div className="flex items-center gap-1">
            <Link
              href={`/images?page=${currentPage - 1}&view=${view}`}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentPage <= 1
                  ? "text-slate-300 pointer-events-none"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              }`}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
            >
              &larr; Prev
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first, last, and pages near current
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - currentPage) <= 1) return true;
                return false;
              })
              .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                  acc.push("ellipsis");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1.5 text-sm text-slate-400"
                  >
                    &hellip;
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={`/images?page=${item}&view=${view}`}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                      item === currentPage
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}
            <Link
              href={`/images?page=${currentPage + 1}&view=${view}`}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentPage >= totalPages
                  ? "text-slate-300 pointer-events-none"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              }`}
              aria-disabled={currentPage >= totalPages}
              tabIndex={currentPage >= totalPages ? -1 : undefined}
            >
              Next &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
