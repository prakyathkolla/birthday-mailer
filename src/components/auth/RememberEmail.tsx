import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface RememberEmailProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const RememberEmail = ({ checked, onCheckedChange }: RememberEmailProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="rememberMe"
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <Label htmlFor="rememberMe" className="text-sm text-white cursor-pointer">
        Remember email
      </Label>
    </div>
  );
};

export default RememberEmail;