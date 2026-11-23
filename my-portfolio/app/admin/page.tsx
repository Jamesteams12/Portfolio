import type { Metadata } from "next";
import { auth } from "@/auth";
import Link from "next/link";
import {
  createProject,
  deleteProject,
  deleteSkill,
  updateProject,
} from "./actions";
import SkillForm from "./SkillForm";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Admin | TJ Fraser Portfolio",
  description:
    "Administrator dashboard for managing portfolio skills and projects.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Admin | TJ Fraser Portfolio",
    description:
      "Administrator dashboard for managing portfolio skills and projects.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TJ Fraser Portfolio",
      },
    ],
  },
};

type Project = {
  id: string;
  title: string;
  description: string;
  slug: string;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

type Skill = {
  id: string;
  name: string;
  url: string | null;
  self_taught: boolean;
};

type AdminPageProps = {
  searchParams: Promise<{
    tab?: string | string[];
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

  const params = await searchParams;
  const activeTab = params.tab === "skills" ? "skills" : "projects";
  const supabase = getSupabaseAdminClient();
  let projects: Project[] = [];
  let skills: Skill[] = [];

  if (activeTab === "skills") {
    const { data, error } = await supabase
      .from("skills")
      .select("id, name, url, self_taught")
      .order("name", { ascending: true })
      .returns<Skill[]>();

    if (error) {
      throw new Error(`Unable to load skills: ${error.message}`);
    }
    skills = data;
  } else {
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, title, description, slug, github_url, live_url, image_url, published, sort_order",
      )
      .order("sort_order", { ascending: true })
      .returns<Project[]>();

    if (error) {
      throw new Error(`Unable to load projects: ${error.message}`);
    }
    projects = data;
  }

  const message = Array.isArray(params.message)
    ? params.message[0]
    : params.message;
  const errorMessage = Array.isArray(params.error)
    ? params.error[0]
    : params.error;

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <nav
        aria-label="Admin pages"
        className="mb-8 flex flex-wrap gap-3 border-b border-white/30 pb-4"
      >
        <Link
          aria-current={activeTab === "projects" ? "page" : undefined}
          className={`rounded px-4 py-2 font-semibold ${activeTab === "projects" ? "bg-white text-gray-900" : "bg-gray-900/70 text-white hover:bg-gray-800"}`}
          href="/admin?tab=projects"
        >
          Projects
        </Link>
        <Link
          aria-current={activeTab === "skills" ? "page" : undefined}
          className={`rounded px-4 py-2 font-semibold ${activeTab === "skills" ? "bg-white text-gray-900" : "bg-gray-900/70 text-white hover:bg-gray-800"}`}
          href="/admin?tab=skills"
        >
          Skills
        </Link>
      </nav>

      <h1 className="mb-8 text-3xl font-bold">
        {activeTab === "skills" ? "Manage skills" : "Manage projects"}
      </h1>
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

      {activeTab === "skills" ? (
        <>
          <SkillForm />

          <h2 className="mb-4 text-2xl font-semibold">
            Skills ({skills.length})
          </h2>
          {skills.length === 0 ? (
            <p>No skills yet. Add one using the form above.</p>
          ) : (
            <ul className="grid gap-4">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex min-w-0 items-center justify-between gap-4 rounded-lg border border-gray-300 bg-white/90 p-4 text-gray-900 shadow-sm"
                >
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-semibold">
                      {skill.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-700">
                      {skill.self_taught ? "Self-taught" : skill.url}
                    </p>
                  </div>
                  <form action={deleteSkill}>
                    <input name="id" type="hidden" value={skill.id} />
                    <button
                      className="rounded bg-red-900 px-4 py-2 font-semibold text-white hover:bg-red-700"
                      type="submit"
                    >
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <form
            action={createProject}
            className="mb-10 grid min-w-0 gap-4 rounded-lg border border-gray-300 bg-white/90 p-4 text-gray-900 shadow-sm sm:p-6"
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
                  className="min-w-0 rounded-lg border border-gray-300 bg-white/90 p-4 text-gray-900 shadow-sm sm:p-6"
                >
                  <form action={updateProject} className="grid gap-4">
                    <input name="id" type="hidden" value={project.id} />
                    <h3 className="text-lg font-semibold">
                      Edit: {project.title}
                    </h3>
                    <ProjectFields project={project} />
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="rounded bg-blue-800 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        type="submit"
                      >
                        Save changes
                      </button>
                      <button
                        className="rounded bg-red-900 px-4 py-2 font-semibold text-white hover:bg-red-600"
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
        </>
      )}
    </section>
  );
}

function ProjectFields({ project }: { project?: Project }) {
  return (
    <>
      <label className="grid min-w-0 gap-1">
        Title
        <input
          className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
          name="title"
          required
          defaultValue={project?.title}
        />
      </label>
      <label className="grid min-w-0 gap-1">
        Slug
        <input
          className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
          name="slug"
          required
          defaultValue={project?.slug}
        />
      </label>
      <label className="grid min-w-0 gap-1">
        Description
        <textarea
          className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
          name="description"
          rows={3}
          defaultValue={project?.description}
        />
      </label>
      <label className="grid min-w-0 gap-1">
        GitHub URL
        <input
          className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
          name="github_url"
          type="url"
          defaultValue={project?.github_url ?? ""}
        />
      </label>
      <label className="grid min-w-0 gap-1">
        Live URL
        <input
          className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
          name="live_url"
          type="url"
          defaultValue={project?.live_url ?? ""}
        />
      </label>
      <label className="grid min-w-0 gap-1">
        Image URL
        <input
          className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
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
