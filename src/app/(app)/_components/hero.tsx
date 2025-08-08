"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="gradient-shimmer">LUMORA</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-[#9D9D9D] mb-12 leading-relaxed max-w-3xl mx-auto justify-center">
          Create instant video messages with your camera, microphone, and screen. 
          Share them in seconds to accelerate communication and collaboration.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white hover:bg-white/90 text-black px-8 py-4 text-lg font-semibold rounded-full">
              Get started for free
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-white/50 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/70"
            onClick={scrollToPricing}
          >
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 