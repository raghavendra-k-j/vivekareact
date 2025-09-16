const SPECIAL_CHAR_REGEX = /[^a-zA-Z0-9 _-]/;

export function validateEntityDicName({ name, label, minLength = 2, maxLength = 120 }: { name: string, label: string, minLength?: number, maxLength?: number }): string | null {
    name = name.trim();
    if (name.length === 0) {
        return `${label} cannot be empty.`;
    }
    if (name.length < minLength) {
        return `${label} must be at least ${minLength} characters long.`;
    }
    if (name.length > maxLength) {
        return `${label} cannot exceed ${maxLength} characters.`;
    }

    // Must not contain special characters except spaces, hyphens, and underscores
    if (SPECIAL_CHAR_REGEX.test(name)) {
        return `${label} can only contain letters, numbers, spaces, hyphens, and underscores.`;
    }

    // must not contain consecutive spaces, hyphens, or underscores
    if (/( {2,}|-{2,}|_{2,})/.test(name)) {
        return `${label} cannot contain consecutive spaces, hyphens, or underscores.`;
    }
    // must not start or end with hyphen, underscore, except spaces(since we trim)
    if (/^[-_]|[-_]$/.test(name)) {
        return `${label} cannot start or end with a hyphen or underscore.`;
    }
    return null;
}