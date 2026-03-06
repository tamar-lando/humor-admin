"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createImage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const url = formData.get("url") as string;
  const caption = formData.get("caption") as string;

  await supabase.from("images").insert({ url, caption });

  revalidatePath("/images");
  redirect("/images");
}

export async function updateImage(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const url = formData.get("url") as string;
  const caption = formData.get("caption") as string;

  await supabase.from("images").update({ url, caption }).eq("id", id);

  revalidatePath("/images");
  redirect("/images");
}

export async function deleteImage(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("images").delete().eq("id", id);

  revalidatePath("/images");
}
