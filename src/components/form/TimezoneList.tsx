import { SelectItem } from "@/components/ui/select";
import { timezones } from "@/data/timezones";

interface TimezoneListProps {
  searchQuery: string;
}

const TimezoneList = ({ searchQuery }: TimezoneListProps) => {
  const filteredTimezones = timezones.filter((timezone) =>
    timezone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {filteredTimezones.map((timezone) => (
        <SelectItem key={timezone} value={timezone}>
          {timezone.replace(/_/g, ' ')}
        </SelectItem>
      ))}
    </div>
  );
};

export default TimezoneList;