import { Browser, BrowserInfo, OS } from "./BrowserInfo";

export class BrowserInfoUtil {
    static getDeviceInfo(): BrowserInfo {
        const userAgent = BrowserInfoUtil.getUserAgent();
        const browser = BrowserInfoUtil.getBrowser(userAgent);
        const os = BrowserInfoUtil.getOS(userAgent);

        return new BrowserInfo({ userAgent, browser, os });
    }

    private static getUserAgent(): string {
        return navigator.userAgent;
    }

    private static getBrowser(userAgent: string): Browser {
        if (userAgent.includes('Edg')) {
            return Browser.Edge;
        } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
            return Browser.Opera; // optional: if you support Opera
        } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR')) {
            return Browser.Chrome;
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome') && !userAgent.includes('CriOS')) {
            return Browser.Safari;
        } else if (userAgent.includes('Firefox')) {
            return Browser.Firefox;
        } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
            return Browser.InternetExplorer;
        } else {
            return Browser.Unknown;
        }
    }

    private static getOS(userAgent: string): OS {
        if (userAgent.includes('Android')) {
            return OS.Android;
        } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
            return OS.iOS;
        } else if (userAgent.includes('Win')) {
            return OS.Windows;
        } else if (userAgent.includes('Mac')) {
            return OS.MacOS;
        } else if (userAgent.includes('Linux')) {
            return OS.Linux;
        } else {
            return OS.Unknown;
        }
    }
}
