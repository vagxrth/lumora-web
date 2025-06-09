import Hero from "./_components/hero";
import Features from "./_components/features";
import Pricing from "./_components/pricing";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 min-h-screen grid place-items-center">
        <Hero />
      </div>
      <Features />
      <Pricing />
    </main>
  );
}