"use client";

import { deleteLLMModel } from "@/app/actions/llm-models";
import { useTransition } from "react";

export default function DeleteLLMModelButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this LLM model? This cannot be undone.")) return;
    startTransition(() => {
      deleteLLMModel(id);
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
