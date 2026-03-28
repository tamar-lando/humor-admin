"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTerm(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const term = formData.get("term") as string;
  const definition = formData.get("definition") as string;
  const term_type_id = formData.get("term_type_id") as string | null;

  await supabase.from("terms").insert({
    term,
    definition,
    term_type_id: term_type_id || null,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  });

  revalidatePath("/terms");
  redirect("/terms");
}

export async function updateTerm(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const term = formData.get("term") as string;
  const definition = formData.get("definition") as string;
  const term_type_id = formData.get("term_type_id") as string | null;

  await supabase.from("terms").update({
    term,
    definition,
    term_type_id: term_type_id || null,
    modified_by_user_id: user.id,
  }).eq("id", id);

  revalidatePath("/terms");
  redirect("/terms");
}

export async function deleteTerm(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("terms").delete().eq("id", id);

  revalidatePath("/terms");
}
