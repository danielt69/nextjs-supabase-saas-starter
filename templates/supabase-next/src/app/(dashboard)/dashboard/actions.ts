"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Find the user's first org membership to scope the project.
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) return;

  // RLS ensures this insert only succeeds for an org the user belongs to.
  await supabase.from("projects").insert({
    org_id: membership.org_id,
    name,
    description: description || null,
  });

  revalidatePath("/dashboard");
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  // RLS scopes the delete to projects in the user's org.
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/dashboard");
}
