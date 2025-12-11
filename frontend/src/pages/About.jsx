export default function About() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4 text-text-primary">
        About DevShowcase
      </h1>

      <p className="text-text-secondary leading-relaxed">
        A small platform to share developer projects. Built with{" "}
        <span className="text-text-primary">React</span>,{" "}
        <span className="text-text-primary">Tailwind</span>, and{" "}
        <span className="text-text-primary">Supabase</span>.
      </p>
    </section>
  );
}
