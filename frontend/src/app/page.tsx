import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-text">
      <h1 className="text-3xl font-bold tracking-tight">SCEMAS</h1>
      <p className="text-text-secondary">
        Smart City Environmental Monitoring & Alert System
      </p>
      <p className="text-sm text-text-muted">
        Scaffold ready — milestones coming online.
      </p>
      <Link
        href="/login"
        className="text-sm text-accent hover:text-accent-hover"
      >
        Continue →
      </Link>
    </main>
  );
}
