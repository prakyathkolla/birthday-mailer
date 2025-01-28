import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import RememberEmail from "./RememberEmail";

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
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rememberMe) {
      localStorage.setItem("savedEmail", email);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("rememberMe");
    }

    await onSubmit(email, password);
  };

  const handleSecondaryAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onSecondaryAction(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <EmailInput email={email} onChange={setEmail} />
        <PasswordInput password={password} onChange={setPassword} />
        <RememberEmail checked={rememberMe} onCheckedChange={setRememberMe} />
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