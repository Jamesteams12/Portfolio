export default async function Footer() {
  "use cache";

  return (
    <footer className="bg-gray-900 text-gray-400 p-6 text-center border-t border-gray-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
        <span>
          &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
        </span>
        <a
          href="https://www.linkedin.com/in/tj-fraser-419252433/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline underline-offset-4 transition-colors hover:text-blue-400"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
