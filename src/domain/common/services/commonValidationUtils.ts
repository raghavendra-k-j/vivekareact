type EmailOtpMessages = {
    empty?: string;
    nonNumeric?: string;
    wrongLength?: (length: number) => string;
};

type EmailOtpOptions = {
    length: number;
    messages?: EmailOtpMessages;
};

export function validateEmailOtp(
    otp: string | null,
    options: EmailOtpOptions
): string | null {
    const { length, messages } = options;
    const m: Required<EmailOtpMessages> = {
        empty: "Please enter OTP",
        nonNumeric: "OTP must contain only digits",
        wrongLength: (n) => `OTP must be exactly ${n} digits`,
        ...messages,
    };
    const value = (otp ?? "").trim();
    if (!value) return m.empty;
    if (!/^[0-9]+$/.test(value)) return m.nonNumeric;
    if (value.length !== length) return m.wrongLength(length);
    return null;
}

import { CallingCode } from "../models/CallingCode";

export type PasswordOk = {
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    symbol: boolean;
};

type EmailMessages = {
    empty?: string;
    tooShort?: (min: number) => string;
    tooLong?: (max: number) => string;
    format?: string;
};

type MobileMessages = {
    empty?: string;
    nonNumeric?: string;
    tooShort?: (min: number) => string;
    tooLong?: (max: number) => string;
    missingCode?: string;
    fixedLength?: (length: number) => string;
};

type PersonNameMessages = {
    empty?: string;
    tooShort?: (min: number) => string;
    tooLong?: (max: number) => string;
    multipleSpaces?: string;
};

type PasswordMessages = {
    empty?: string;
    tooShort?: (min: number) => string;
    tooLong?: (max: number) => string;
    missingUppercase?: string;
    missingLowercase?: string;
    missingNumber?: string;
    missingSymbol?: string;
};

type EmailOptions = {
    minLength?: number;
    maxLength?: number;
    messages?: EmailMessages;
};

type PersonNameOptions = {
    minLength: number;
    maxLength: number;
    messages?: PersonNameMessages;
};

type PasswordOptions = {
    minLength?: number;
    maxLength?: number;
    messages?: PasswordMessages;
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

export function validateEmail(
    email: string | null,
    options: EmailOptions = {}
): string | null {
    const min = options.minLength ?? 1;
    const max = options.maxLength ?? 60;

    const m: Required<EmailMessages> = {
        empty: "Please enter email address",
        tooShort: (n) => `Email must be at least ${n} characters`,
        tooLong: (n) => `Email must be at most ${n} characters`,
        format: "Invalid email address",
        ...options.messages,
    };

    const value = (email ?? "").trim();
    if (!value) return m.empty;
    if (value.length < min) return m.tooShort(min);
    if (value.length > max) return m.tooLong(max);
    if (!EMAIL_REGEX.test(value)) return m.format;

    const domain = value.slice(value.indexOf("@") + 1);
    const parts = domain.split(".");
    if (parts.length > 3) return m.format;
    for (const p of parts) {
        if (p.length < 2) return m.format;
    }
    return null;
}

export function validateMobile(
    mobile: string | null,
    options?: { callingCode?: CallingCode | null; messages?: MobileMessages }
): string | null {
    const code = options?.callingCode;
    const messages = options?.messages ?? {};
    const min = code?.mobileMinLength ?? 6;
    const max = code?.mobileMaxLength ?? 15;
    const isFixedLength = min === max;

    const m: Required<MobileMessages> = {
        empty: "Please enter mobile number",
        nonNumeric: "Mobile number must contain only digits",
        tooShort: (n) => `Mobile number must be at least ${n} digits`,
        tooLong: (n) => `Mobile number must be at most ${n} digits`,
        missingCode: "Please select country code",
        fixedLength: (n) => `Mobile number must be exactly ${n} digits`,
        ...messages,
    };

    if (!code) {
        return m.missingCode;
    }

    const value = (mobile ?? "").trim();
    if (!value) return m.empty;
    if (!/^[0-9]+$/.test(value)) return m.nonNumeric;
    if (isFixedLength) {
        if (value.length !== min) return m.fixedLength(min);
    } else {
        if (value.length < min) return m.tooShort(min);
        if (value.length > max) return m.tooLong(max);
    }
    return null;
}

export function validatePersonName(
    name: string | null,
    options: PersonNameOptions
): string | null {
    const { minLength, maxLength, messages } = options;

    const m: Required<PersonNameMessages> = {
        empty: "Please enter name",
        tooShort: (n) => `Name must be at least ${n} characters`,
        tooLong: (n) => `Name must be at most ${n} characters`,
        multipleSpaces: "Name must not contain multiple consecutive spaces",
        ...messages,
    };

    const value = (name ?? "").trim();
    if (!value) return m.empty;
    if (value.length < minLength) return m.tooShort(minLength);
    if (value.length > maxLength) return m.tooLong(maxLength);
    if (/  +/.test(value)) return m.multipleSpaces;
    return null;
}

export function validatePassword(
    password: string | null | undefined,
    options: PasswordOptions = {}
): { error: string | null; ok: PasswordOk } {
    const min = options.minLength ?? 8;
    const max = options.maxLength ?? 20;

    const m: Required<PasswordMessages> = {
        empty: "Please enter password",
        tooShort: (n) => `Password must be at least ${n} characters`,
        tooLong: (n) => `Password must be at most ${n} characters`,
        missingUppercase: "Password must include at least one uppercase letter",
        missingLowercase: "Password must include at least one lowercase letter",
        missingNumber: "Password must include at least one number",
        missingSymbol: "Password must include at least one symbol",
        ...options.messages,
    };

    const value = (password ?? "").trim();

    const ok: PasswordOk = {
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        symbol: /[^A-Za-z0-9]/.test(value),
    };

    if (!value) return { error: m.empty, ok };
    if (value.length < min) return { error: m.tooShort(min), ok };
    if (value.length > max) return { error: m.tooLong(max), ok };
    if (!ok.uppercase) return { error: m.missingUppercase, ok };
    if (!ok.lowercase) return { error: m.missingLowercase, ok };
    if (!ok.number) return { error: m.missingNumber, ok };
    if (!ok.symbol) return { error: m.missingSymbol, ok };

    return { error: null, ok };
}
