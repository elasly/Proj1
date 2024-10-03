// ReusableSelect.tsx
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ReusableSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export function ReusableSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
}: ReusableSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select onValueChange={(value) => field.onChange(typeof field.value === 'number' ? Number(value) : value)} value={field.value}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

interface ReusableSelectNumberProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: { value: number; label: string }[];
  placeholder?: string;
}

export function ReusableSelectNumber<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
}: ReusableSelectNumberProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value}>
          <SelectTrigger>
            <SelectValue placeholder={name} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}