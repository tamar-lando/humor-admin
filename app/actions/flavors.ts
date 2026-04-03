"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function duplicateFlavor(flavorId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 1. Fetch the original flavor
  const { data: original, error: flavorError } = await supabase
    .from("humor_flavors")
    .select("*")
    .eq("id", flavorId)
    .single();

  if (flavorError || !original) {
    throw new Error("Failed to fetch flavor: " + (flavorError?.message ?? "Not found"));
  }

  // 2. Create the new flavor with "Copy of" prefix
  const { data: newFlavor, error: insertError } = await supabase
    .from("humor_flavors")
    .insert({
      name: `Copy of ${original.name}`,
      description: original.description,
    })
    .select()
    .single();

  if (insertError || !newFlavor) {
    throw new Error("Failed to create flavor copy: " + (insertError?.message ?? "Unknown error"));
  }

  // 3. Fetch all steps for the original flavor
  const { data: steps, error: stepsError } = await supabase
    .from("humor_flavor_steps")
    .select("*")
    .eq("humor_flavor_id", flavorId)
    .order("step_number", { ascending: true });

  if (stepsError) {
    throw new Error("Failed to fetch flavor steps: " + stepsError.message);
  }

  // 4. Copy steps to the new flavor
  if (steps && steps.length > 0) {
    const newSteps = steps.map((step) => ({
      humor_flavor_id: newFlavor.id,
      step_number: step.step_number,
      prompt_text: step.prompt_text,
    }));

    const { error: stepsInsertError } = await supabase
      .from("humor_flavor_steps")
      .insert(newSteps);

    if (stepsInsertError) {
      throw new Error("Failed to copy flavor steps: " + stepsInsertError.message);
    }
  }

  revalidatePath("/flavors");
  redirect("/flavors");
}
