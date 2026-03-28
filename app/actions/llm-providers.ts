"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLLMProvider(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = formData.get("name") as string;
  const api_base_url = formData.get("api_base_url") as string | null;

  await supabase.from("llm_providers").insert({
    name,
    api_base_url: api_base_url || null,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  });

  revalidatePath("/llm-providers");
  redirect("/llm-providers");
}

export async function updateLLMProvider(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = formData.get("name") as string;
  const api_base_url = formData.get("api_base_url") as string | null;

  await supabase.from("llm_providers").update({
    name,
    api_base_url: api_base_url || null,
    modified_by_user_id: user.id,
  }).eq("id", id);

  revalidatePath("/llm-providers");
  redirect("/llm-providers");
}

export async function deleteLLMProvider(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("llm_providers").delete().eq("id", id);

  revalidatePath("/llm-providers");
}
