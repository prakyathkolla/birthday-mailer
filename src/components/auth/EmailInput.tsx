import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface EmailInputProps {
  email: string;
  onChange: (value: string) => void;
}

const EmailInput = ({ email, onChange }: EmailInputProps) => {
  return (
    <div>
      <Label htmlFor="email" className="text-white">
        Email
      </Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          placeholder="Enter your email"
          required
        />
      </div>
    </div>
  );
};

export default EmailInput;