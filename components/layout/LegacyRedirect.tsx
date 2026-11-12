"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/** Client-side redirect that also works on static hosting (GitHub Pages). */
export default function LegacyRedirect({ to, label }: { to: string; label: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return (
    <section className="wrap flex min-h-[70svh] flex-col justify-center pt-32">
      <p className="label">This page has moved</p>
      <Link href={to} className="mt-4 font-display text-4xl font-medium tracking-[-0.03em]">
        <span className="u-link">Continue to {label} →</span>
      </Link>
    </section>
  );
}
