import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[90svh] flex-col justify-center pt-32">
      <p className="label flex items-center gap-3">
        <span className="h-1.5 w-1.5 rounded-full bg-lime ring-1 ring-ink/30" />
        Error 404
      </p>
      <h1 className="h-display mt-6 text-[clamp(3rem,14vw,12rem)]">
        Not <span className="text-muted">found.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink/80">This wall is still empty — the page you are looking for does not exist.</p>
      <div className="mt-8">
        <Button href="/">Back to home</Button>
      </div>
    </section>
  );
}
