import { clsx, type ClassValue } from "clsx";

/**
 * Utility to merge class names. Simple version for now,
 * will be enhanced when shadcn/ui is initialized with twMerge.
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}
