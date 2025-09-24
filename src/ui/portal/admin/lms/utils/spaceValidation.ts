export function validateSpaceName({ value, label, minLength = 1, maxLength = 255 }: { value: string, label: string, minLength?: number, maxLength?: number }): string | null {
    value = value.trim();
    if (!value) {
        return `${label} is required`;
    }
    if (value.length < minLength) {
        return `${label} must be at least ${minLength} characters long`;
    }
    if (value.length > maxLength) {
        return `${label} must be at most ${maxLength} characters long`;
    }
    return null;
}

export function validateSpaceCode({ value, label, minLength = 1, maxLength = 50 }: { value: string, label: string, minLength?: number, maxLength?: number }): string | null {
    value = value.trim();
    if (!value) {
        return `${label} is required`;
    }
    if (value.length < minLength) {
        return `${label} must be at least ${minLength} characters long`;
    }
    if (value.length > maxLength) {
        return `${label} must be at most ${maxLength} characters long`;
    }
    return null;
}

export function validateInternalName({ value, label, minLength = 1, maxLength = 100 }: { value: string, label: string, minLength?: number, maxLength?: number }): string | null {
    value = value.trim();
    if (!value) {
        return null;
    }
    if (value.length < minLength) {
        return `${label} must be at least ${minLength} characters long`;
    }
    if (value.length > maxLength) {
        return `${label} must be at most ${maxLength} characters long`;
    }
    return null;
}