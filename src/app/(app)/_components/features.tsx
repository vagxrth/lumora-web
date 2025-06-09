import { Camera, Monitor, Mic, Share, Clock, Shield } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Camera,
      title: "Camera Recording",
      description: "Record yourself with crystal clear video quality using your webcam or mobile camera."
    },
    {
      icon: Monitor,
      title: "Screen Capture",
      description: "Capture your entire screen, application window, or browser tab with one click."
    },
    {
      icon: Mic,
      title: "Audio Recording",
      description: "High-quality audio recording with noise cancellation for professional results."
    },
    {
      icon: Share,
      title: "Instant Sharing",
      description: "Share your videos instantly via link, email, or embed them anywhere."
    },
    {
      icon: Clock,
      title: "Quick Setup",
      description: "Start recording in seconds with no downloads or complex setup required."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your videos are protected with security and privacy controls."
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Everything you need to create
            <span className="text-white"> amazing videos</span>
          </h2>
          <p className="text-xl text-[#9D9D9D] max-w-3xl mx-auto">
            Powerful features that make video creation effortless, whether you&apos;re recording tutorials, 
            presentations, or quick updates for your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-2xl border border-[#2d2d2d] bg-[#1D1D1D]/50 hover:bg-[#1D1D1D] transition-all duration-300 hover:border-white/20"
            >
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-[#9D9D9D] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 