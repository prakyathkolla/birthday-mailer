import BirthdayForm from "@/components/BirthdayForm";
import { PartyPopper, Cake, Gift, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-purple-900 to-black overflow-hidden">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/20"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* 3D Decorative Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Balloons with 3D transform */}
        <div className="absolute top-10 left-1/4 animate-float transform-gpu rotate-12 scale-110 transition-transform duration-1000">
          <span className="text-6xl">🎈</span>
        </div>
        <div className="absolute top-20 right-1/4 animate-float delay-1000 transform-gpu -rotate-12 scale-125 transition-transform duration-1000">
          <span className="text-6xl">🎈</span>
        </div>
        <div className="absolute bottom-40 left-1/3 animate-float delay-2000 transform-gpu rotate-45 scale-110 transition-transform duration-1000">
          <span className="text-6xl">🎈</span>
        </div>

        {/* Floating Gifts with 3D transform */}
        <div className="absolute top-1/3 right-1/3 animate-float delay-1500 transform-gpu rotate-12 scale-110 transition-transform duration-1000">
          <span className="text-5xl">🎁</span>
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float delay-2500 transform-gpu -rotate-12 scale-125 transition-transform duration-1000">
          <span className="text-5xl">🎂</span>
        </div>

        {/* Animated confetti */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animation: `confetti ${3 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              <span className="text-2xl">✨</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center py-12 px-4">
        <div className="mb-8 flex justify-center gap-4 animate-float">
          <PartyPopper className="inline-block h-16 w-16 text-primary transform-gpu hover:scale-110 transition-transform duration-300" />
          <Cake className="inline-block h-16 w-16 text-secondary transform-gpu hover:scale-110 transition-transform duration-300" />
          <Gift className="inline-block h-16 w-16 text-accent transform-gpu hover:scale-110 transition-transform duration-300" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
          Birthday Wish Scheduler
        </h1>
        <p className="text-xl text-gray-300 mb-8 animate-fade-in delay-200">
          Schedule beautiful birthday wishes for your loved ones!
        </p>
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl transform-gpu hover:scale-[1.01] transition-transform duration-300">
          <BirthdayForm />
        </div>
      </div>
    </div>
  );
};

export default Index;