"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCaptionExample(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = formData.get("content") as string;
  const image_id = formData.get("image_id") as string | null;
  const humor_flavor_id = formData.get("humor_flavor_id") as string | null;

  await supabase.from("caption_examples").insert({
    content,
    image_id: image_id || null,
    humor_flavor_id: humor_flavor_id || null,
    created_by_user_id: user.id,
    modified_by_user_id: user.id,
  });

  revalidatePath("/caption-examples");
  redirect("/caption-examples");
}

export async function updateCaptionExample(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = formData.get("content") as string;
  const image_id = formData.get("image_id") as string | null;
  const humor_flavor_id = formData.get("humor_flavor_id") as string | null;

  await supabase.from("caption_examples").update({
    content,
    image_id: image_id || null,
    humor_flavor_id: humor_flavor_id || null,
    modified_by_user_id: user.id,
  }).eq("id", id);

  revalidatePath("/caption-examples");
  redirect("/caption-examples");
}

export async function deleteCaptionExample(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("caption_examples").delete().eq("id", id);

  revalidatePath("/caption-examples");
}
