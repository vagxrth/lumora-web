import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

const Pricing = () => {
  const benefits = [
    {
      title: "Record Longer Videos",
      description: "Capture videos up to 30 minutes—ideal for in-depth walkthroughs, demos, and tutorials."
    },
    {
      title: "Unlimited Video Creation",
      description: "Produce as many videos as you need with the Pro plan—no limits holding you back."
    },
    {
      title: "Full HD Recording (1080p)",
      description: "Deliver stunning, high-definition videos with sharp visuals and pro-level clarity."
    }
  ];

  return (
    <section id="pricing" className="py-16 relative overflow-hidden scroll-mt-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1D1D1D]/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Pricing
          </h2>
          <p className="text-xl text-[#9D9D9D] mb-4">
            Upgrade to unlock premium features and take your video communication to the next level.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Monthly Plan */}
          <Card className="w-full border-2 border-white/20 bg-[#1D1D1D]/50 backdrop-blur-sm relative h-full">
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-3xl font-bold text-white mb-3">Pro Monthly</CardTitle>
              <CardDescription className="text-xl text-[#9D9D9D]">Flexible month-to-month billing</CardDescription>
              <div className="mt-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-5xl font-bold text-white">$29</span>
                  <span className="text-xl text-[#9D9D9D]">/month</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-[#9D9D9D] text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <Link href="/checkout?plan=monthly" className="block">
                  <Button className="bg-white hover:bg-white/90 text-black px-12 py-6 text-lg font-semibold rounded-full w-full">
                    Subscribe Monthly
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="w-full border-2 border-white/20 bg-[#1D1D1D]/50 backdrop-blur-sm relative h-full">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Zap className="w-4 h-4" /> Save 23%
              </span>
            </div>

            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-3xl font-bold text-white mb-3">Pro Annual</CardTitle>
              <CardDescription className="text-xl text-[#9D9D9D]">Best value for long-term users</CardDescription>
              <div className="mt-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-5xl font-bold text-white">$269</span>
                  <span className="text-xl text-[#9D9D9D]">/year</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-[#9D9D9D] text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <Link href="/checkout?plan=annual" className="block">
                  <Button className="bg-white hover:bg-white/90 text-black px-12 py-6 text-lg font-semibold rounded-full w-full">
                    Subscribe Annually
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 