"use client";

import { deleteImage } from "@/app/actions/images";
import { useTransition } from "react";

export default function DeleteImageButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    startTransition(() => {
      deleteImage(id);
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
