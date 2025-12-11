import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="text-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-4 text-text-primary">
        404 — Page Not Found
      </h1>

      <p className="text-text-secondary mb-6">
        The page you requested does not exist.
      </p>

      <Link
        to="/"
        className="px-4 py-2 rounded-md bg-accent text-white hover:bg-accent-hover"
      >
        Back to Home
      </Link>
    </section>
  );
}
