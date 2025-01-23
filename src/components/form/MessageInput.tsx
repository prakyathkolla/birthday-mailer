import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MessageInput = ({ value, onChange }: MessageInputProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-white">Custom Message (Optional)</label>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your custom birthday message"
      className="bg-white/20 text-white placeholder:text-gray-400"
    />
  </div>
);

export default MessageInput;