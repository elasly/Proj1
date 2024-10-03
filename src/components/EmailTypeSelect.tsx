import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailTypeSelectProps {
  value: 'individual' | 'campaign';
  onChange: (value: 'individual' | 'campaign') => void;
}

const EmailTypeSelect: React.FC<EmailTypeSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an email type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type</SelectLabel>
          <SelectItem value="individual">Individual</SelectItem>
          <SelectItem value="campaign">Campaign</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default EmailTypeSelect;