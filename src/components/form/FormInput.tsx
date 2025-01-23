import { Input } from "@/components/ui/input";

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}

const FormInput = ({ label, value, onChange, placeholder, type = "text", required = false }: FormInputProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white">{label}</label>
    <Input
      required={required}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-white/20 text-white placeholder:text-gray-400"
    />
  </div>
);

export default FormInput;