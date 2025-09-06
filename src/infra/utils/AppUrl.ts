export class AppUrl {
    
    private static instance: AppUrl;
    private readonly baseUrl: string;

    private constructor({ baseUrl }: { baseUrl: string }) {
        this.baseUrl = baseUrl.endsWith("/")
            ? baseUrl.slice(0, -1)
            : baseUrl;
    }

    public static createInstance({ baseUrl }: { baseUrl: string }): AppUrl {
        if (!this.instance) {
            this.instance = new AppUrl({ baseUrl });
        }
        return this.instance;
    }

    public static findInstance(): AppUrl {
        return this.instance!;
    }

    public static getUrl(path: string): string {
        return `${this.findInstance().baseUrl}${path}`;
    }

    public static getBaseUrl(): string {
        return this.findInstance().baseUrl;
    }

    public static to({ path }: { path?: string }): string {
        return `${this.getBaseUrl()}${path}`;
    }

    public static autoTo({ path }: { path: string }): string {
        // If it's an external link (starts with http/https)
        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        // If it's a root-relative internal path (starts with "/")
        if (path.startsWith("/")) {
            return `${this.getBaseUrl()}${path}`;
        }

        // Otherwise treat it as a relative path
        return `${this.getBaseUrl()}/${path}`;
    }

    static isHomePage(pathname: string) {
        const basePath = new URL(this.getBaseUrl()).pathname;
        return pathname === basePath || pathname === `${basePath}/`;
    }

}
