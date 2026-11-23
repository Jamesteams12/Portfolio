import type { Metadata } from "next";
import { getSupabaseClient } from "@/lib/supabase";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Skills | TJ Fraser Portfolio",
  description:
    "Explore TJ Fraser's programming languages, frameworks, development tools, and technical skills.",
  openGraph: {
    title: "Skills | TJ Fraser Portfolio",
    description:
      "Explore TJ Fraser's programming languages, frameworks, development tools, and technical skills.",
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

type Skill = {
  id: string;
  name: string;
  url: string | null;
  self_taught: boolean;
};

export const instant = false;

export default async function Page() {
  await connection();

  const { data: skills, error } = await getSupabaseClient()
    .from("skills")
    .select("id, name, url, self_taught")
    .order("name", { ascending: true })
    .returns<Skill[]>();

  if (error) {
    throw new Error(`Unable to load skills: ${error.message}`);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6">
      <h1 className="text-center text-3xl font-bold">Skills</h1>
      <p className="mx-auto mt-4 max-w-3xl text-center text-lg">
        The skills I have developed and the evidence behind them.
      </p>
      <hr className="mt-6 text-black" />
      {skills.length === 0 ? (
        <p className="mt-8 text-center">No skills to show yet.</p>
      ) : (
        <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="rounded-lg border-2 border-blue-900 bg-slate-950/90 p-5 text-white shadow-sm"
            >
              <h2 className="break-words text-lg font-semibold sm:text-xl">
                {skill.url && !skill.self_taught ? (
                  <a
                    className="underline decoration-sky-300 underline-offset-4 hover:text-sky-200"
                    href={skill.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {skill.name}
                  </a>
                ) : (
                  skill.name
                )}
              </h2>
              {skill.self_taught && (
                <p className="mt-2 text-sm text-sky-200">Self-taught</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
