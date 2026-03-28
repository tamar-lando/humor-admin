"use client";

import { deleteWhitelistedEmail } from "@/app/actions/whitelisted-emails";
import { useTransition } from "react";

export default function DeleteWhitelistedEmailButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this whitelisted email? This cannot be undone.")) return;
    startTransition(() => {
      deleteWhitelistedEmail(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 cursor-pointer"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
