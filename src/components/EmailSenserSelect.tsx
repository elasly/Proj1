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

//type EmailSender = 'info@strattrader.app' | 'alerts@strattrader.app' | 'admin@strattrader.app' | 'subscription@strattrader.app';

interface EmailSenderSelectProps {
  value: 'info@strattrader.app' | 'alerts@strattrader.app' | 'admin@strattrader.app' | 'subscription@strattrader.app';
  onChange: (value: 'info@strattrader.app' | 'alerts@strattrader.app' | 'admin@strattrader.app' | 'subscription@strattrader.app') => void;
}

const EmailSenderSelect: React.FC<EmailSenderSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a sender" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>From</SelectLabel> 
          <SelectItem value="info@strattrader.app">Info</SelectItem>
          <SelectItem value="alerts@strattrader.app">Alerts</SelectItem>
          <SelectItem value="admin@strattrader.app">Admin</SelectItem>
          <SelectItem value="subscription@strattrader.app">Subscription</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default EmailSenderSelect;