"use client";

import { deleteTerm } from "@/app/actions/terms";
import { useTransition } from "react";

export default function DeleteTermButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this term? This cannot be undone.")) return;
    startTransition(() => {
      deleteTerm(id);
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
