import BirthdayForm from "@/components/BirthdayForm";
import { PartyPopper, Cake } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Balloons */}
        <div className="absolute top-10 left-1/4 animate-float text-red-500">
          <span className="text-6xl">🎈</span>
        </div>
        <div className="absolute top-20 right-1/4 animate-float delay-1000 text-blue-500">
          <span className="text-6xl">🎈</span>
        </div>
        <div className="absolute bottom-40 left-1/3 animate-float delay-2000 text-purple-500">
          <span className="text-6xl">🎈</span>
        </div>
        {/* Floating Cakes */}
        <div className="absolute top-1/3 right-1/3 animate-float delay-1500">
          <span className="text-5xl">🎂</span>
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float delay-2500">
          <span className="text-5xl">🎂</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-12 px-4">
        <div className="mb-8 animate-float flex justify-center gap-4">
          <PartyPopper className="inline-block h-16 w-16 text-primary" />
          <Cake className="inline-block h-16 w-16 text-secondary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">Birthday Wish Scheduler</h1>
        <p className="text-gray-300 mb-8">Schedule beautiful birthday wishes for your loved ones!</p>
        <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6">
          <BirthdayForm />
        </div>
      </div>
    </div>
  );
};

export default Index;