"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWhitelistedEmail(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = formData.get("email") as string;

  await supabase.from("whitelisted_email_addresses").insert({
    email,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  });

  revalidatePath("/whitelisted-emails");
  redirect("/whitelisted-emails");
}

export async function updateWhitelistedEmail(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = formData.get("email") as string;

  await supabase.from("whitelisted_email_addresses").update({
    email,
    modified_by_user_id: user.id,
  }).eq("id", id);

  revalidatePath("/whitelisted-emails");
  redirect("/whitelisted-emails");
}

export async function deleteWhitelistedEmail(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("whitelisted_email_addresses").delete().eq("id", id);

  revalidatePath("/whitelisted-emails");
}
