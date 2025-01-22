import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const BirthdayForm = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !formData.time || !formData.email || !formData.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const birthdayDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        parseInt(formData.time.split(':')[0]),
        parseInt(formData.time.split(':')[1])
      );

      // Insert the birthday wish into Supabase
      const { data: wish, error } = await supabase
        .from('birthday_wishes')
        .insert({
          recipient_name: formData.name,
          recipient_email: formData.email,
          message: formData.message,
          birthday_date: birthdayDateTime.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger the email sending function
      const { data, error: functionError } = await supabase.functions.invoke('send-birthday-email', {
        body: { wishId: wish.id }
      });

      if (functionError) throw functionError;

      // Reset form
      setDate(undefined);
      setFormData({
        name: '',
        email: '',
        message: '',
        time: ''
      });

      toast({
        title: "Success!",
        description: "Birthday wish has been scheduled and email will be sent!",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule birthday wish. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Recipient's Name</label>
        <Input
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter recipient's name"
          className="bg-white/20 text-white placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Recipient's Email</label>
        <Input
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter recipient's email"
          className="bg-white/20 text-white placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Birthday Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-white/20 text-white",
                !date && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Time</label>
        <Input
          required
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="bg-white/20 text-white"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Custom Message (Optional)</label>
        <Textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Enter your custom birthday message"
          className="bg-white/20 text-white placeholder:text-gray-400"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Scheduling..." : "Schedule Birthday Wish"}
      </Button>
    </form>
  );
};

export default BirthdayForm;