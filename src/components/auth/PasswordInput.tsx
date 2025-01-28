import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface PasswordInputProps {
  password: string;
  onChange: (value: string) => void;
}

const PasswordInput = ({ password, onChange }: PasswordInputProps) => {
  return (
    <div>
      <Label htmlFor="password" className="text-white">
        Password
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          placeholder="Enter your password"
          required
        />
      </div>
    </div>
  );
};

export default PasswordInput;