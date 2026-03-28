"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateHumorMix(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const weight = formData.get("weight");
  const isActive = formData.get("is_active") === "on";
  const humorFlavorId = formData.get("humor_flavor_id") as string;

  const updateData: Record<string, unknown> = {
    modified_by_user_id: user.id,
  };

  if (weight !== null && weight !== "") {
    updateData.weight = parseFloat(weight as string);
  }
  if (humorFlavorId) {
    updateData.humor_flavor_id = humorFlavorId;
  }
  updateData.is_active = isActive;

  await supabase.from("humor_mix").update(updateData).eq("id", id);

  revalidatePath("/humor-mix");
  redirect("/humor-mix");
}
