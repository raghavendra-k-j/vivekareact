export class ServiceUrl {
    private static instance: ServiceUrl;
    private readonly baseUrl: string;

    private constructor({ baseUrl }: { baseUrl: string }) {
        this.baseUrl = baseUrl;
    }

    public static createInstance({ baseUrl }: { baseUrl: string }): ServiceUrl {
        if (!this.instance) {
            this.instance = new ServiceUrl({ baseUrl });
        }
        return this.instance;
    }


    public static findInstance(): ServiceUrl {
        return this.instance!;
    }

    // Public method to generate a full URL
    public static getUrl(path: string): string {
        return `${this.findInstance().baseUrl}${path}`;
    }

    // Optional: expose base URL directly
    public static getBaseUrl(): string {
        return this.findInstance().baseUrl;
    }
}
