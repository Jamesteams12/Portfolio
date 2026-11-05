"use server";

import { auth } from "@/auth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ProjectFields = {
  title: string;
  description: string;
  slug: string;
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

type UploadedProjectImage = {
  path: string;
  publicUrl: string;
};

const PROJECT_IMAGE_BUCKET = "project-images";
const MAX_PROJECT_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const;
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
  const liveUrl = formData.get("live_url");
  const githubUrl = formData.get("github_url");
  const imageUrl = formData.get("image_url");
  const sortOrder = formData.get("sort_order");

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    typeof slug !== "string" ||
    !slug.trim() ||
    typeof liveUrl !== "string" ||
    typeof githubUrl !== "string" ||
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

  const liveUrlValue = parseOptionalWebUrl(liveUrl, "Live Site URL");
  const githubUrlValue = parseOptionalWebUrl(
    githubUrl,
    "GitHub Repository URL",
  );
  const imageUrlValue = parseOptionalWebUrl(imageUrl, "Image URL");

  return {
    title: title.trim(),
    description: description.trim(),
    slug: slug.trim(),
    live_url: liveUrlValue,
    github_url: githubUrlValue,
    image_url: imageUrlValue,
    published: formData.get("published") === "on",
    sort_order: parsedSortOrder,
  };
}

function getProjectImageFile(formData: FormData): File | null {
  const imageFile = formData.get("image_file");
  if (!(imageFile instanceof File)) {
    throw new Error("Please choose a valid image file.");
  }
  if (!imageFile.name) {
    return null;
  }
  if (!getImageExtension(imageFile.type)) {
    throw new Error("Image must be a PNG, JPG, or WebP file.");
  }
  if (imageFile.size > MAX_PROJECT_IMAGE_SIZE) {
    throw new Error("Image must be 5 MB or smaller.");
  }
  if (imageFile.size === 0) {
    throw new Error("The selected image file is empty.");
  }

  return imageFile;
}

function getImageExtension(contentType: string): string | null {
  return (
    Object.entries(IMAGE_TYPES).find(
      ([mimeType]) => mimeType === contentType,
    )?.[1] ??
    null
  );
}

async function uploadProjectImage(
  imageFile: File,
): Promise<UploadedProjectImage> {
  const extension = getImageExtension(imageFile.type);
  if (!extension) {
    throw new Error("Image must be a PNG, JPG, or WebP file.");
  }
  const header = new Uint8Array(
    await imageFile.slice(0, 12).arrayBuffer(),
  );
  const hasValidSignature =
    (imageFile.type === "image/png" &&
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
        (byte, index) => header[index] === byte,
      )) ||
    (imageFile.type === "image/jpeg" &&
      header[0] === 0xff &&
      header[1] === 0xd8 &&
      header[2] === 0xff) ||
    (imageFile.type === "image/webp" &&
      header[0] === 0x52 &&
      header[1] === 0x49 &&
      header[2] === 0x46 &&
      header[3] === 0x46 &&
      header[8] === 0x57 &&
      header[9] === 0x45 &&
      header[10] === 0x42 &&
      header[11] === 0x50);
  if (!hasValidSignature) {
    throw new Error("The selected file does not match its image type.");
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const storage = getSupabaseAdminClient().storage.from(PROJECT_IMAGE_BUCKET);
  const { error } = await storage.upload(path, imageFile, {
    cacheControl: "3600",
    contentType: imageFile.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Unable to upload image: ${error.message}`);
  }

  return {
    path,
    publicUrl: storage.getPublicUrl(path).data.publicUrl,
  };
}

async function removeUploadedImage(path: string): Promise<string | null> {
  const { error } = await getSupabaseAdminClient()
    .storage.from(PROJECT_IMAGE_BUCKET)
    .remove([path]);

  return error ? error.message : null;
}

function getProjectImagePath(imageUrl: string | null): string | null {
  if (!imageUrl) {
    return null;
  }

  let parsedImageUrl: URL;
  let parsedSupabaseUrl: URL;
  try {
    parsedImageUrl = new URL(imageUrl);
    parsedSupabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  } catch {
    return null;
  }

  const bucketPath = `/storage/v1/object/public/${PROJECT_IMAGE_BUCKET}/`;
  if (
    parsedImageUrl.origin !== parsedSupabaseUrl.origin ||
    !parsedImageUrl.pathname.startsWith(bucketPath)
  ) {
    return null;
  }

  const path = parsedImageUrl.pathname.slice(bucketPath.length);
  return /^[0-9a-f-]{36}\.(png|jpg|webp)$/i.test(path) ? path : null;
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

async function finishAction(message: string) {
  revalidatePath("/admin");
  revalidatePath("/projects");
  redirect(`/admin?message=${encodeURIComponent(message)}`);
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  let project: ProjectFields;
  let imageFile: File | null;
  try {
    project = getProjectFields(formData);
    imageFile = getProjectImageFile(formData);
  } catch (error) {
    redirect(
      `/admin?error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid project details.")}`,
    );
  }

  let uploadedImage: UploadedProjectImage | null = null;
  if (imageFile) {
    try {
      uploadedImage = await uploadProjectImage(imageFile);
    } catch (error) {
      redirect(
        `/admin?error=${encodeURIComponent(error instanceof Error ? error.message : "Unable to upload image.")}`,
      );
    }
    project.image_url = uploadedImage.publicUrl;
  }

  const { error } = await getSupabaseAdminClient()
    .from("projects")
    .insert(project);

  if (error) {
    const cleanupError = uploadedImage
      ? await removeUploadedImage(uploadedImage.path)
      : null;
    redirect(
      `/admin?error=${encodeURIComponent(`Unable to create project: ${error.message}${cleanupError ? ` Image cleanup also failed: ${cleanupError}` : ""}`)}`,
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
  let imageFile: File | null;
  try {
    project = getProjectFields(formData);
    imageFile = getProjectImageFile(formData);
  } catch (error) {
    redirect(
      `/admin?error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid project details.")}`,
    );
  }

  const { data: existingProject, error: existingProjectError } =
    await getSupabaseAdminClient()
      .from("projects")
      .select("image_url")
      .eq("id", id)
      .maybeSingle();

  if (existingProjectError) {
    redirect(
      `/admin?error=${encodeURIComponent(`Unable to load project before update: ${existingProjectError.message}`)}`,
    );
  }
  if (!existingProject) {
    redirect("/admin?error=Project%20not%20found.");
  }

  let uploadedImage: UploadedProjectImage | null = null;
  if (imageFile) {
    try {
      uploadedImage = await uploadProjectImage(imageFile);
    } catch (error) {
      redirect(
        `/admin?error=${encodeURIComponent(error instanceof Error ? error.message : "Unable to upload image.")}`,
      );
    }
    project.image_url = uploadedImage.publicUrl;
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("projects")
    .update(project)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    const cleanupError = uploadedImage
      ? await removeUploadedImage(uploadedImage.path)
      : null;
    redirect(
      `/admin?error=${encodeURIComponent(`Unable to update project: ${error.message}${cleanupError ? ` Image cleanup also failed: ${cleanupError}` : ""}`)}`,
    );
  }
  if (!data) {
    const cleanupError = uploadedImage
      ? await removeUploadedImage(uploadedImage.path)
      : null;
    redirect(
      `/admin?error=${encodeURIComponent(`Project not found.${cleanupError ? ` Image cleanup also failed: ${cleanupError}` : ""}`)}`,
    );
  }

  if (existingProject.image_url !== project.image_url) {
    const previousImagePath = getProjectImagePath(existingProject.image_url);
    if (previousImagePath) {
      const cleanupError = await removeUploadedImage(previousImagePath);
      if (cleanupError) {
        redirect(
          `/admin?error=${encodeURIComponent(`Project updated, but the previous uploaded image could not be removed: ${cleanupError}`)}`,
        );
      }
    }
  }

  await finishAction("Project updated.");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    redirect("/admin?error=Missing%20project%20ID.");
  }

  const { data: project, error: projectError } = await getSupabaseAdminClient()
    .from("projects")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  if (projectError) {
    redirect(
      `/admin?error=${encodeURIComponent(`Unable to load project before deletion: ${projectError.message}`)}`,
    );
  }
  if (!project) {
    redirect("/admin?error=Project%20not%20found.");
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

  const imagePath = getProjectImagePath(project.image_url);
  if (imagePath) {
    const cleanupError = await removeUploadedImage(imagePath);
    if (cleanupError) {
      redirect(
        `/admin?error=${encodeURIComponent(`Project deleted, but its uploaded image could not be removed: ${cleanupError}`)}`,
      );
    }
  }

  await finishAction("Project deleted.");
}