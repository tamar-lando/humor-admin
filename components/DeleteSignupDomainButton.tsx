"use client";

import { deleteSignupDomain } from "@/app/actions/signup-domains";
import { useTransition } from "react";

export default function DeleteSignupDomainButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this signup domain? This cannot be undone.")) return;
    startTransition(() => {
      deleteSignupDomain(id);
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
