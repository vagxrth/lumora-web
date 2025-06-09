import Hero from "./_components/hero";
import Features from "./_components/features";
import Pricing from "./_components/pricing";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Features />
      <Pricing />
    </main>
  );
}