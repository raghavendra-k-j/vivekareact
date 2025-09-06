type OrgNameMessages = {
    empty?: string;
    tooShort?: (min: number) => string;
    tooLong?: (max: number) => string;
    multipleSpaces?: string;
}

type SubdomainMessages = {
    empty?: string;
    tooShort?: (min: number) => string;
    tooLong?: (max: number) => string;
    invalidFormat?: string;
}

export function validateOrgName(
    name: string | null,
    options: { minLength: number; maxLength: number; messages?: OrgNameMessages }
): string | null {
    const { minLength, maxLength, messages } = options;
    const m: Required<OrgNameMessages> = {
        empty: "Please enter organization name",
        tooShort: (n) => `Organization name must be at least ${n} characters`,
        tooLong: (n) => `Organization name must be at most ${n} characters`,
        multipleSpaces: "Organization name must not contain multiple consecutive spaces",
        ...messages,
    };

    const value = (name ?? "").trim();
    if (!value) return m.empty;
    if (value.length < minLength) return m.tooShort(minLength);
    if (value.length > maxLength) return m.tooLong(maxLength);
    if (/  +/.test(value)) return m.multipleSpaces;
    return null;
}


export function validateSubdomain(
    subdomain: string | null,
    options: { minLength: number; maxLength: number; messages?: SubdomainMessages }
): string | null {
    const { minLength, maxLength, messages } = options;
    const m: Required<SubdomainMessages> = {
        empty: "Please enter website address",
        tooShort: (n) => `Website address must be at least ${n} characters`,
        tooLong: (n) => `Website address must be at most ${n} characters`,
        invalidFormat: "Website address can only contain lowercase letters, numbers, and hyphens. It cannot start or end with a hyphen.",
        ...messages,
    };

    const value = (subdomain ?? "").trim();
    if (!value) return m.empty;
    if (value.length < minLength) return m.tooShort(minLength);
    if (value.length > maxLength) return m.tooLong(maxLength);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) return m.invalidFormat;
    return null;
}


/* 
            return validateOrgCustomType(value, { maxLength: this.validationData.customOrgTypeMaxLength, minLength: this.validationData.customOrgTypeMinLength });

*/

type OrgCustomTypeMessages = {
    empty?: string;
    tooShort?: (min: number) => string;
    tooLong?: (max: number) => string;
    multipleSpaces?: string;
}

export function validateOrgCustomType(
    name: string | null,
    options: { minLength: number; maxLength: number; messages?: OrgCustomTypeMessages }
): string | null {
    const { minLength, maxLength, messages } = options;
    const m: Required<OrgCustomTypeMessages> = {
        empty: "Please enter organization type",
        tooShort: (n) => `Organization type must be at least ${n} characters`,
        tooLong: (n) => `Organization type must be at most ${n} characters`,
        multipleSpaces: "Organization type must not contain multiple consecutive spaces",
        ...messages,
    };
    const value = (name ?? "").trim();
    if (!value) return m.empty;
    if (value.length < minLength) return m.tooShort(minLength);
    if (value.length > maxLength) return m.tooLong(maxLength);
    if (/  +/.test(value)) return m.multipleSpaces;
    return null;
}
