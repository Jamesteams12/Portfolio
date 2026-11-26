import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | TJ Fraser Portfolio",
  description: "Learn about TJ Fraser, his experience, interests, and CV.",
  openGraph: {
    title: "About | TJ Fraser Portfolio",
    description: "Learn about TJ Fraser, his experience, interests, and CV.",
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

const profile = {
  name: "TJ Fraser",
  careerTitle: "Junior Software Developer",
  biography: "A Junior Software Developer with skills in HTML, CSS, JavaScript and Python. I have a passion for creating either websites or applications that are user-friendly and that anyone can use them. I am always looking for more ways to improve my skills and learn new methods to create better applications.",
  photoSrc: "",
};

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 text-white sm:py-16">
      <header className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
        {profile.photoSrc ? (
          <Image
            alt={profile.name}
            className="aspect-square size-28 rounded-full object-cover sm:size-48"
            height={192}
            src={profile.photoSrc}
            width={192}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex aspect-square size-28 items-center justify-center rounded-full bg-white/15 text-3xl font-bold sm:size-48 sm:text-5xl"
          >
            {profile.name
              .split(/\s+/)
              .map((part) => part[0])
              .join("")}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="break-words text-3xl font-bold sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-2 text-lg sm:text-2xl">{profile.careerTitle}</p>
        </div>
      </header>

      <section aria-labelledby="about-heading" className="mt-10">
        <h2 id="about-heading" className="text-2xl font-bold sm:text-3xl">
          About
        </h2>
        {profile.biography && (
          <p className="mt-4 whitespace-pre-line text-lg leading-relaxed">
            {profile.biography}
          </p>
        )}
      </section>

      <a
        className="mt-8 inline-block w-fit rounded bg-gray-900 px-5 py-2.5 font-semibold text-white hover:bg-gray-700"
        download="TJ-Fraser-CV.pdf"
        href="/cv/TJ-Fraser-CV.pdf"
      >
        Download CV
      </a>
    </section>
  );
}
