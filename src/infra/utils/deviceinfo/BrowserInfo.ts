export enum Browser {
    Chrome = 'Chrome',
    Firefox = 'Firefox',
    Safari = 'Safari',
    Edge = 'Edge',
    Opera = 'Opera',
    InternetExplorer = 'Internet Explorer',
    Unknown = 'Unknown'
}

export enum OS {
    Windows = 'Windows',
    MacOS = 'MacOS',
    Linux = 'Linux',
    Android = 'Android',
    iOS = 'iOS',
    Unknown = 'Unknown'
}

export type BrowserInfoProps = {
    userAgent: string;
    browser: Browser;
    os: OS;
}

export class BrowserInfo {
    userAgent: string;
    browser: Browser;
    os: OS;

    constructor({ userAgent, browser, os }: BrowserInfoProps) {
        this.userAgent = userAgent;
        this.browser = browser;
        this.os = os;
    }
}

