"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSignupDomain(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const domain = formData.get("domain") as string;

  await supabase.from("allowed_signup_domains").insert({
    domain,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  });

  revalidatePath("/signup-domains");
  redirect("/signup-domains");
}

export async function updateSignupDomain(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const domain = formData.get("domain") as string;

  await supabase.from("allowed_signup_domains").update({
    domain,
    modified_by_user_id: user.id,
  }).eq("id", id);

  revalidatePath("/signup-domains");
  redirect("/signup-domains");
}

export async function deleteSignupDomain(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("allowed_signup_domains").delete().eq("id", id);

  revalidatePath("/signup-domains");
}
