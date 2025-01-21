import BirthdayForm from "@/components/BirthdayForm";
import { PartyPopper } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 animate-float">
          <PartyPopper className="inline-block h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Birthday Wish Scheduler</h1>
        <p className="text-gray-600 mb-8">Schedule beautiful birthday wishes for your loved ones!</p>
        <BirthdayForm />
      </div>
    </div>
  );
};

export default Index;