import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import FormInput from './form/FormInput';
import DateTimeSelector from './form/DateTimeSelector';
import MessageInput from './form/MessageInput';

const BirthdayForm = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    time: '',
    senderName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !formData.time || !formData.email || !formData.name || !formData.senderName) {
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

      // Insert the birthday wish
      const { data: wish, error: insertError } = await supabase
        .from('birthday_wishes')
        .insert({
          recipient_name: formData.name,
          recipient_email: formData.email,
          message: formData.message,
          birthday_date: birthdayDateTime.toISOString(),
          sender_name: formData.senderName
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log("Created wish:", wish);

      // Call the edge function to send the email
      const { data, error: functionError } = await supabase.functions.invoke('send-birthday-email', {
        body: { wishId: wish.id }
      });

      if (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(`Failed to schedule email: ${functionError.message}`);
      }

      console.log("Edge function response:", data);

      setDate(undefined);
      setFormData({
        name: '',
        email: '',
        message: '',
        time: '',
        senderName: ''
      });

      toast({
        title: "Success!",
        description: "Birthday wish has been scheduled!",
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to schedule birthday wish. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <FormInput
        label="Your Name"
        value={formData.senderName}
        onChange={(value) => updateFormData('senderName', value)}
        placeholder="Enter your name"
        required
      />

      <FormInput
        label="Recipient's Name"
        value={formData.name}
        onChange={(value) => updateFormData('name', value)}
        placeholder="Enter recipient's name"
        required
      />

      <FormInput
        label="Recipient's Email"
        value={formData.email}
        onChange={(value) => updateFormData('email', value)}
        placeholder="Enter recipient's email"
        type="email"
        required
      />

      <DateTimeSelector
        date={date}
        time={formData.time}
        onDateChange={setDate}
        onTimeChange={(value) => updateFormData('time', value)}
      />

      <MessageInput
        value={formData.message}
        onChange={(value) => updateFormData('message', value)}
      />

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