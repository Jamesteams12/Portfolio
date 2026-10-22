export default async function Footer() {
  "use cache";

  return (
    <footer className="bg-gray-900 text-gray-400 p-6 text-center border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <span>
          &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
