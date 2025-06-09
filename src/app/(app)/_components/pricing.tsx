import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const benefits = [
    "Longer Videos",
    "More videos", 
    "Better quality of 1080p"
  ];

  return (
    <section id="pricing" className="py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
          Simple Pricing
        </h2>
        <p className="text-xl text-[#9D9D9D] mb-12">
          Upgrade to unlock premium features
        </p>
        
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-2 border-white/20 bg-[#1D1D1D]/50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-white">Pro Plan</CardTitle>
              <CardDescription className="text-lg text-[#9D9D9D]">Perfect for professionals</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-[#9D9D9D]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0" />
                  <span className="text-[#9D9D9D]">{benefit}</span>
                </div>
              ))}
              <Button className="w-full mt-6 bg-white hover:bg-white/90 text-black py-3 text-lg font-semibold rounded-full">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 