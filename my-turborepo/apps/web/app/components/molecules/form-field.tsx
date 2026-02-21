import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

/**
 * MOLECULE: FormField
 * 
 * Role: The fundamental reusable block for any form input in the application.
 * Architecture:
 * - Atomic Design: Combines Atoms (Label, Input) for semantic cohesion.
 * - Source of Truth: This is the ONLY component to use for labeled inputs to ensure UI consistency.
 */
interface FormFieldProps extends React.ComponentProps<typeof Input> {
    label: string;
    id: string;
}

export function FormField({ label, id, ...props }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-foreground/80">
                {label}
            </Label>
            <Input
                id={id}
                {...props}
            /* Consistent styling applied at the molecule level overrides atom defaults if needed */
            />
        </div>
    );
}