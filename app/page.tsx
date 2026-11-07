import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import SelectedWorks from "@/components/home/SelectedWorks";
import GalleryWall from "@/components/home/GalleryWall";
import Contact from "@/components/home/Contact";
import { Marquee } from "@/components/ui/Misc";
import { Star } from "@/components/ui/Doodles";

function Divider({ words, reverse }: { words: string[]; reverse?: boolean }) {
  return (
    <div className="border-y border-bone/10 py-5">
      <Marquee duration={40} reverse={reverse}>
        {words.map((w) => (
          <span key={w} className="flex items-center gap-8 px-8 font-condensed text-5xl uppercase leading-none text-bone/90 md:text-7xl">
            {w}
            <Star className="h-8 w-8" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Divider words={["Concept", "Identity", "Interface", "Prototype", "Code", "Launch"]} />
      <SelectedWorks />
      <GalleryWall />
      <Divider words={["Open for collaborations", "Freelance", "Side quests", "Weird ideas welcome"]} reverse />
      <Contact />
    </>
  );
}
