import { getSupabaseClient } from "@/lib/supabase";
import { connection } from "next/server";

type Project = {
  id: string;
  title: string;
  description: string;
  slug: string;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  sort_order: number;
};

export const instant = false;

export default async function Page() {
  await connection();

  const { data: projects, error } = await getSupabaseClient()
    .from("projects")
    .select(
      "id, title, description, slug, github_url, live_url, image_url, sort_order",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .returns<Project[]>();

  if (error) {
    throw new Error(`Unable to load projects: ${error.message}`);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-8">
        Projects
      </h1>
      <p className="text-center text-lg mt-4">
        This is all the projects I have worked on. Use the link on each card to view a project.
      </p>
      <hr className="text-black" />
      {projects.length === 0 ? (
        <p className="mt-8 text-center">No projects to show yet.</p>
      ) : (
        <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-5 px-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="grid min-h-44 grid-cols-[minmax(0,1fr)_minmax(4rem,0.7fr)_auto] items-center gap-3 rounded-lg border-2 border-blue-900 bg-slate-950/90 p-4 text-white shadow-sm sm:gap-6 sm:p-6"
            >
              <div className="min-w-0">
                <h2 className="break-words text-lg font-semibold sm:text-xl">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="mt-2 break-words text-sm text-white sm:text-base">
                    {project.description}
                  </p>
                )}
              </div>
              {project.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt=""
                  className="h-24 w-full rounded object-cover sm:h-32"
                />
              ) : (
                <div aria-hidden="true" />
              )}
              <div className="flex flex-wrap justify-end gap-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                    className="rounded-md bg-sky-300 px-3 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200 sm:px-5 sm:text-base"
                  >
                    GitHub
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View live ${project.title}`}
                    className="rounded-md bg-green-300 px-3 py-2 text-center text-sm font-semibold text-slate-950 transition-colors hover:bg-green-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-200 sm:px-5 sm:text-base"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}