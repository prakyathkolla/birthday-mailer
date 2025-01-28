import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";

interface AuthFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onSecondaryAction: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  primaryButtonText: string;
  secondaryButtonText: string;
}

const AuthForm = ({
  onSubmit,
  onSecondaryAction,
  isLoading,
  primaryButtonText,
  secondaryButtonText,
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const handleSecondaryAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onSecondaryAction(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
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
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

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
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {primaryButtonText}
        </Button>
        <Button
          type="button"
          onClick={handleSecondaryAction}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {secondaryButtonText}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;