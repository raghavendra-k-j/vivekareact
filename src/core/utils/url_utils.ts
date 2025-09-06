
export function normalizeBaseUrl(url: string): string {
    if (!url) return "";
    return url.replace(/\/+$/, "");
}

export function joinUrl(base: string, path: string): string {
    const b = normalizeBaseUrl(base);
    const p = path.replace(/^\/+/, "");
    return `${b}/${p}`;
}