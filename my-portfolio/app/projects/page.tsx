import { getSupabaseClient } from "@/lib/supabase";
import { connection } from "next/server";

type Project = {
  id: string;
  title: string;
  description: string;
  slug: string;
  url: string | null;
  image_url: string | null;
  sort_order: number;
};

export const instant = false;

export default async function Page() {
  await connection();

  const { data: projects, error } = await getSupabaseClient()
    .from("projects")
    .select("id, title, description, slug, url, image_url, sort_order")
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
        This is all the projects I have worked on. You can find more details about each project by clicking on the project title.
      </p>
      <hr className="text-black" />
      {projects.length === 0 ? (
        <p className="mt-8 text-center">No projects to show yet.</p>
      ) : (
        <ul className="mx-auto mt-8 grid max-w-5xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="rounded-lg border border-gray-200 p-5 shadow-sm"
            >
              {project.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt=""
                  className="mb-4 aspect-video w-full rounded object-cover"
                />
              )}
              <h2 className="text-xl font-semibold">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h2>
              {project.description && (
                <p className="mt-2">{project.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}