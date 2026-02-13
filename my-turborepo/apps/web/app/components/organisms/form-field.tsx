import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

/**
 * FormField component following Atomic Design (Molecule)
 * Combines a Label and an Input for semantic cohesion.
 */
interface FormFieldProps extends React.ComponentProps<typeof Input> {
    label: string;
    id: string;
}

export function FormField({ label, id, ...props }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} {...props} />
        </div>
    );
}