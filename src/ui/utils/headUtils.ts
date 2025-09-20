export function updateBrowserThemeColor(color: string): void {
    let metaTag: HTMLMetaElement | null = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = "theme-color";
        document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", color);
}
