"use client";

import { deleteCaptionExample } from "@/app/actions/caption-examples";
import { useTransition } from "react";

export default function DeleteCaptionExampleButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this caption example? This cannot be undone.")) return;
    startTransition(() => {
      deleteCaptionExample(id);
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
