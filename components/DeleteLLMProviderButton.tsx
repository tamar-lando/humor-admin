"use client";

import { deleteLLMProvider } from "@/app/actions/llm-providers";
import { useTransition } from "react";

export default function DeleteLLMProviderButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this LLM provider? This cannot be undone.")) return;
    startTransition(() => {
      deleteLLMProvider(id);
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
