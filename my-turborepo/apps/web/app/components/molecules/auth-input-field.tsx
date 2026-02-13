"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AuthInputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Molecule: AuthInputField
 * Combines a Label and an Input into a reusable field.
 */
export function AuthInputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
}: AuthInputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-600">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="rounded-xl h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
