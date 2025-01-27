import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimezoneSelector = ({ value, onChange }: TimezoneSelectorProps) => {
  // Get all available timezones
  const timezones = Intl.supportedValuesOf('timeZone');

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">Timezone *</label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger className="bg-white/20 text-white">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          {timezones.map((timezone) => (
            <SelectItem key={timezone} value={timezone}>
              {timezone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimezoneSelector;