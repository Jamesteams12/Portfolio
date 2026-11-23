"use server";

import { auth } from "@/auth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ProjectFields = {
  title: string;
  description: string;
  slug: string;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

type SkillFields = {
  name: string;
  url: string | null;
  self_taught: boolean;
};

const POSTGRES_INTEGER_MIN = -2_147_483_648;
const POSTGRES_INTEGER_MAX = 2_147_483_647;

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
}

function getProjectFields(formData: FormData): ProjectFields {
  const title = formData.get("title");
  const description = formData.get("description");
  const slug = formData.get("slug");
  const githubUrl = formData.get("github_url");
  const liveUrl = formData.get("live_url");
  const imageUrl = formData.get("image_url");
  const sortOrder = formData.get("sort_order");

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    typeof slug !== "string" ||
    !slug.trim() ||
    typeof githubUrl !== "string" ||
    typeof liveUrl !== "string" ||
    typeof imageUrl !== "string" ||
    typeof sortOrder !== "string"
  ) {
    throw new Error("Please provide a title, slug, and valid project fields.");
  }

  const parsedSortOrder = Number(sortOrder);
  if (
    !sortOrder.trim() ||
    !Number.isSafeInteger(parsedSortOrder) ||
    parsedSortOrder < POSTGRES_INTEGER_MIN ||
    parsedSortOrder > POSTGRES_INTEGER_MAX
  ) {
    throw new Error(
      "Sort order must be a whole number within the supported range.",
    );
  }

  const githubUrlValue = parseOptionalWebUrl(githubUrl, "GitHub URL");
  const liveUrlValue = parseOptionalWebUrl(liveUrl, "Live URL");
  const imageUrlValue = parseOptionalWebUrl(imageUrl, "Image URL");

  return {
    title: title.trim(),
    description: description.trim(),
    slug: slug.trim(),
    github_url: githubUrlValue,
    live_url: liveUrlValue,
    image_url: imageUrlValue,
    published: formData.get("published") === "on",
    sort_order: parsedSortOrder,
  };
}

function getSkillFields(formData: FormData): SkillFields {
  const name = formData.get("name");
  const url = formData.get("url");
  const evidenceType = formData.get("evidence_type");

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 100 ||
    (evidenceType !== "website" && evidenceType !== "self_taught")
  ) {
    throw new Error("Please provide a skill name and valid evidence option.");
  }

  const selfTaught = evidenceType === "self_taught";
  if (!selfTaught && (typeof url !== "string" || !url.trim())) {
    throw new Error("A website URL is required for linked skills.");
  }

  return {
    name: name.trim(),
    url:
      selfTaught || typeof url !== "string"
        ? null
        : parseOptionalWebUrl(url, "Website URL"),
    self_taught: selfTaught,
  };
}

function parseOptionalWebUrl(value: string, fieldName: string): string | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedValue);
  } catch {
    throw new Error(`${fieldName} must be a valid absolute URL.`);
  }

  if (
    (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") ||
    parsedUrl.username ||
    parsedUrl.password
  ) {
    throw new Error(
      `${fieldName} must use HTTP or HTTPS and cannot include credentials.`,
    );
  }

  return parsedUrl.toString();
}

async function finishAction(
  message: string,
  tab: "projects" | "skills" = "projects",
) {
  revalidatePath("/admin");
  revalidatePath(tab === "skills" ? "/skills" : "/projects");
  redirect(`/admin?tab=${tab}&message=${encodeURIComponent(message)}`);
}

export async function createSkill(formData: FormData) {
  await requireAdmin();

  let skill: SkillFields;
  try {
    skill = getSkillFields(formData);
  } catch (error) {
    redirect(
      `/admin?tab=skills&error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid skill details.")}`,
    );
  }

  const { error } = await getSupabaseAdminClient().from("skills").insert(skill);

  if (error) {
    redirect(
      `/admin?tab=skills&error=${encodeURIComponent(`Unable to add skill: ${error.message}`)}`,
    );
  }

  await finishAction("Skill added.", "skills");
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirect("/admin?tab=skills&error=Missing%20skill%20ID.");
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("skills")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    redirect(
      `/admin?tab=skills&error=${encodeURIComponent(`Unable to remove skill: ${error.message}`)}`,
    );
  }
  if (!data) {
    redirect("/admin?tab=skills&error=Skill%20not%20found.");
  }

  await finishAction("Skill removed.", "skills");
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  let project: ProjectFields;
  try {
    project = getProjectFields(formData);
  } catch (error) {
    redirect(
      `/admin?error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid project details.")}`,
    );
  }

  const { error } = await getSupabaseAdminClient()
    .from("projects")
    .insert(project);

  if (error) {
    redirect(
      `/admin?error=${encodeURIComponent(`Unable to create project: ${error.message}`)}`,
    );
  }

  await finishAction("Project created.");
}

export async function updateProject(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirect("/admin?error=Missing%20project%20ID.");
  }

  let project: ProjectFields;
  try {
    project = getProjectFields(formData);
  } catch (error) {
    redirect(
      `/admin?error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid project details.")}`,
    );
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("projects")
    .update(project)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    redirect(
      `/admin?error=${encodeURIComponent(`Unable to update project: ${error.message}`)}`,
    );
  }
  if (!data) {
    redirect("/admin?error=Project%20not%20found.");
  }

  await finishAction("Project updated.");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirect("/admin?error=Missing%20project%20ID.");
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("projects")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    redirect(
      `/admin?error=${encodeURIComponent(`Unable to delete project: ${error.message}`)}`,
    );
  }
  if (!data) {
    redirect("/admin?error=Project%20not%20found.");
  }

  await finishAction("Project deleted.");
}
