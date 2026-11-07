import Link from "next/link";
import { Splat, XMark } from "@/components/ui/Doodles";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center">
      <Splat seed={404} className="pointer-events-none absolute left-1/2 top-1/2 w-[70vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-20" />
      <p className="tech-label">| Error 404 |</p>
      <h1 className="relative mt-4 font-drip text-[34vw] leading-none text-acid md:text-[20vw]">404</h1>
      <XMark className="absolute right-[18%] top-[30%] w-16 md:w-24" color="var(--color-violet)" />
      <p className="relative mt-2 max-w-md font-grotesk text-xl">This wall is still blank. The piece you&apos;re looking for doesn&apos;t exist (yet).</p>
      <Link href="/" className="relative mt-8 -rotate-2 rounded-full bg-acid px-7 py-4 font-condensed text-2xl tracking-wide text-ink">
        Back to the exhibition
      </Link>
    </section>
  );
}
