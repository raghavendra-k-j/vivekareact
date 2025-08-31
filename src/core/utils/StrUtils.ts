export class StrUtils {
    static trimToNull(value: string | null | undefined): string | null {
        const trimmed = this._safeTrim(value);
        return trimmed.length > 0 ? trimmed : null;
    }

    static trimToEmpty(value: string | null | undefined): string {
        return this._safeTrim(value);
    }

    static isEmpty(value: string | null | undefined): boolean {
        return this._safeTrim(value).length === 0;
    }

    static ltrim(value: string | null | undefined): string {
        return this._safeString(value).replace(/^\s+/, "");
    }

    static rtrim(value: string | null | undefined): string {
        return this._safeString(value).replace(/\s+$/, "");
    }

    private static _safeTrim(value: string | null | undefined): string {
        return this._safeString(value).trim();
    }

    private static _safeString(value: string | null | undefined): string {
        return value ?? "";
    }
}
