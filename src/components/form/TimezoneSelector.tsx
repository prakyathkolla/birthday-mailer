import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import TimezoneSearch from "./TimezoneSearch";
import TimezoneList from "./TimezoneList";
import type { Timezone } from "@/data/timezones";

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const TimezoneSelector = ({ value, onChange, label }: TimezoneSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">{label} *</label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger className="bg-white/20 text-white">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <TimezoneSearch value={searchQuery} onChange={setSearchQuery} />
          <TimezoneList searchQuery={searchQuery} />
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimezoneSelector;