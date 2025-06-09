import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="title text-white">LUMORA</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-[#9D9D9D] mb-12 leading-relaxed max-w-3xl mx-auto">
            Create instant video messages with your camera, microphone, and screen. 
            Share them in seconds to accelerate communication and collaboration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white hover:bg-white/90 text-black px-8 py-4 text-lg font-semibold rounded-full">
              Get started for free
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white/10">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 