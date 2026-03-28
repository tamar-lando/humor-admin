"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLLMModel(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = formData.get("name") as string;
  const provider_id = formData.get("provider_id") as string | null;
  const model_id = formData.get("model_id") as string;

  await supabase.from("llm_models").insert({
    name,
    provider_id: provider_id || null,
    model_id,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  });

  revalidatePath("/llm-models");
  redirect("/llm-models");
}

export async function updateLLMModel(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = formData.get("name") as string;
  const provider_id = formData.get("provider_id") as string | null;
  const model_id = formData.get("model_id") as string;

  await supabase.from("llm_models").update({
    name,
    provider_id: provider_id || null,
    model_id,
    modified_by_user_id: user.id,
  }).eq("id", id);

  revalidatePath("/llm-models");
  redirect("/llm-models");
}

export async function deleteLLMModel(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("llm_models").delete().eq("id", id);

  revalidatePath("/llm-models");
}
