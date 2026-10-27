import { auth } from "@/auth";
import { createProject, deleteProject, updateProject } from "./actions";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { connection } from "next/server";

type Project = {
  id: string;
  title: string;
  description: string;
  slug: string;
  url: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

type AdminPageProps = {
  searchParams: Promise<{
    message?: string | string[];
    error?: string | string[];
  }>;
};

export const instant = false;

export default async function Page({ searchParams }: AdminPageProps) {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [{ data: projects, error }, params] = await Promise.all([
    getSupabaseAdminClient()
      .from("projects")
      .select(
        "id, title, description, slug, url, image_url, published, sort_order",
      )
      .order("sort_order", { ascending: true })
      .returns<Project[]>(),
    searchParams,
  ]);

  if (error) {
    throw new Error(`Unable to load projects: ${error.message}`);
  }

  const message = Array.isArray(params.message)
    ? params.message[0]
    : params.message;
  const errorMessage = Array.isArray(params.error)
    ? params.error[0]
    : params.error;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Manage projects</h1>
      {message && (
        <p
          className="mb-6 rounded border border-green-300 bg-green-50 p-3 text-green-900"
          role="status"
        >
          {message}
        </p>
      )}
      {errorMessage && (
        <p
          className="mb-6 rounded border border-red-300 bg-red-50 p-3 text-red-900"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <form
        action={createProject}
        className="mb-10 grid gap-4 rounded-lg border border-gray-300 bg-white/90 p-6 text-gray-900 shadow-sm"
      >
        <h2 className="text-xl font-semibold">Create project</h2>
        <ProjectFields />
        <button
          className="w-fit rounded bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-700"
          type="submit"
        >
          Create project
        </button>
      </form>

      <h2 className="mb-4 text-2xl font-semibold">
        Projects ({projects.length})
      </h2>
      {projects.length === 0 ? (
        <p>No projects yet. Create one using the form above.</p>
      ) : (
        <ul className="grid gap-6">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded-lg border border-gray-300 bg-white/90 p-6 text-gray-900 shadow-sm"
            >
              <form action={updateProject} className="grid gap-4">
                <input name="id" type="hidden" value={project.id} />
                <h3 className="text-lg font-semibold">Edit: {project.title}</h3>
                <ProjectFields project={project} />
                <div className="flex flex-wrap gap-3">
                  <button
                    className="rounded bg-blue-800 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    type="submit"
                  >
                    Save changes
                  </button>
                  <button
                    className="rounded bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-600"
                    formAction={deleteProject}
                    formNoValidate
                    type="submit"
                  >
                    Delete project
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ProjectFields({ project }: { project?: Project }) {
  return (
    <>
      <label className="grid gap-1">
        Title
        <input
          className="rounded border border-gray-400 px-3 py-2"
          name="title"
          required
          defaultValue={project?.title}
        />
      </label>
      <label className="grid gap-1">
        Slug
        <input
          className="rounded border border-gray-400 px-3 py-2"
          name="slug"
          required
          defaultValue={project?.slug}
        />
      </label>
      <label className="grid gap-1">
        Description
        <textarea
          className="rounded border border-gray-400 px-3 py-2"
          name="description"
          rows={3}
          defaultValue={project?.description}
        />
      </label>
      <label className="grid gap-1">
        Project URL
        <input
          className="rounded border border-gray-400 px-3 py-2"
          name="url"
          type="url"
          defaultValue={project?.url ?? ""}
        />
      </label>
      <label className="grid gap-1">
        Image URL
        <input
          className="rounded border border-gray-400 px-3 py-2"
          name="image_url"
          type="url"
          defaultValue={project?.image_url ?? ""}
        />
      </label>
      <label className="grid gap-1">
        Sort order
        <input
          className="w-32 rounded border border-gray-400 px-3 py-2"
          name="sort_order"
          type="number"
          step="1"
          defaultValue={project?.sort_order ?? 0}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          name="published"
          type="checkbox"
          defaultChecked={project?.published ?? false}
        />
        Published
      </label>
    </>
  );
}
