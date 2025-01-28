import { Input } from "@/components/ui/input";

interface TimezoneSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const TimezoneSearch = ({ value, onChange }: TimezoneSearchProps) => {
  return (
    <div className="p-2">
      <Input
        placeholder="Search timezone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mb-2"
      />
    </div>
  );
};

export default TimezoneSearch;