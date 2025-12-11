export default function Dashboard({ user }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-text-primary">
        My Dashboard
      </h1>

      <p className="text-text-secondary">
        Hello, <span className="font-semibold text-text-primary">{user?.name}</span>.
        Your projects will appear here.
      </p>
    </section>
  );
}
