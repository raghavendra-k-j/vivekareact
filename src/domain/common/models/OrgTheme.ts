import { JsonObj } from "~/core/types/Json";

export enum ColorStop {
    _50 = "50",
    _100 = "100",
    _200 = "200",
    _300 = "300",
    _400 = "400",
    _500 = "500",
    _600 = "600",
    _700 = "700",
    _800 = "800",
    _900 = "900",
    _950 = "950",
    DEFAULT = "DEFAULT",
}

export class Emphasis {
    strong: string;
    default: string;
    secondary: string;
    tertiary: string;

    constructor(params: {
        strong: string;
        default: string;
        secondary: string;
        tertiary: string;
    }) {
        this.strong = params.strong;
        this.default = params.default;
        this.secondary = params.secondary;
        this.tertiary = params.tertiary;
    }
}

export class RoleColor {
    scale: Map<ColorStop, string>;
    text: Emphasis;

    constructor(params: {
        scale: Map<ColorStop, string>;
        text: Emphasis;
    }) {
        this.scale = params.scale;
        this.text = params.text;
    }
}

export class BrandContainer {
    bg: string;
    text: Emphasis;

    iconBg: string;
    iconBgHover: string;

    iconFg: string;
    iconFgHover: string;

    // Tabs
    tabBg: string;
    tabBgHover: string;
    tabFg: string;
    tabFgHover: string;
    tabActiveBg: string;
    tabActiveFg: string;
    tabActiveBorder: string;

    constructor(params: {
        bg: string;
        text: Emphasis;
        iconBg: string;
        iconBgHover: string;
        iconFg: string;
        iconFgHover: string;
        tabBg: string;
        tabBgHover: string;
        tabFg: string;
        tabFgHover: string;
        tabActiveBg: string;
        tabActiveFg: string;
        tabBorderActive: string;
    }) {
        this.bg = params.bg;
        this.text = params.text;
        this.iconBg = params.iconBg;
        this.iconBgHover = params.iconBgHover;
        this.iconFg = params.iconFg;
        this.iconFgHover = params.iconFgHover;
        this.tabBg = params.tabBg;
        this.tabBgHover = params.tabBgHover;
        this.tabFg = params.tabFg;
        this.tabFgHover = params.tabFgHover;
        this.tabActiveBg = params.tabActiveBg;
        this.tabActiveFg = params.tabActiveFg;
        this.tabActiveBorder = params.tabBorderActive;
    }
}

export class OrgTheme {

    id: string;
    name: string;
    primary: RoleColor;
    bc: BrandContainer;

    constructor(params: {
        id: string;
        name: string;
        primary: RoleColor;
        bc: BrandContainer;
    }) {
        this.id = params.id;
        this.name = params.name;
        this.primary = params.primary;
        this.bc = params.bc;
    }

    static default() {
        return new OrgTheme({
            id: "default",
            name: "Default",
            primary: new RoleColor({
                scale: new Map<ColorStop, string>([
                    [ColorStop._50, "#eff6ff"],
                    [ColorStop._100, "#dbeafe"],
                    [ColorStop._200, "#bfdbfe"],
                    [ColorStop._300, "#93c5fd"],
                    [ColorStop._400, "#60a5fa"],
                    [ColorStop._500, "#3b82f6"],
                    [ColorStop._600, "#2563eb"],
                    [ColorStop._700, "#1d4ed8"],
                    [ColorStop._800, "#1e40af"],
                    [ColorStop._900, "#1e3a8a"],
                    [ColorStop._950, "#172554"],
                    [ColorStop.DEFAULT, "#2563eb"],
                ]),
                text: new Emphasis({
                    strong: "#ffffff",
                    default: "#ffffff",
                    secondary: "#ffffffcc",
                    tertiary: "#ffffff99",
                }),
            }),
            bc: new BrandContainer({
                bg: "#ffffff",

                text: new Emphasis({
                    strong: "#102020",
                    default: "#202020",
                    secondary: "#495057",
                    tertiary: "#6c757d",
                }),

                iconBg: "#ffffff",
                iconBgHover: "#f9fafb",
                iconFg: "#495057",
                iconFgHover: "#202020",


                tabBg: "#ffffff",
                tabBgHover: "#f9fafb",
                tabFg: "#495057",
                tabFgHover: "#202020",
                tabActiveBg: "#eff6ff",
                tabActiveFg: "#2563eb",
                tabBorderActive: "#3b82f6",
            }),
        });
    }

    static fromJson(json: JsonObj): OrgTheme {
        return new OrgTheme({
            id: String(json.id),
            name: String(json.name),
            primary: new RoleColor({
                scale: new Map<ColorStop, string>(
                    Object.entries(json.primary.scale).map(([key, value]) => [
                        key as ColorStop,
                        String(value),
                    ])
                ),
                text: new Emphasis({
                    strong: String(json.primary.text.strong),
                    default: String(json.primary.text.default),
                    secondary: String(json.primary.text.secondary),
                    tertiary: String(json.primary.text.tertiary),
                }),
            }),
            bc: new BrandContainer({
                bg: String(json.bc.bg),
                text: new Emphasis({
                    strong: String(json.bc.text.strong),
                    default: String(json.bc.text.default),
                    secondary: String(json.bc.text.secondary),
                    tertiary: String(json.bc.text.tertiary),
                }),
                iconBg: String(json.bc.iconBg),
                iconBgHover: String(json.bc.iconBgHover),
                iconFg: String(json.bc.iconFg),
                iconFgHover: String(json.bc.iconFgHover),
                tabBg: String(json.bc.tabBg),
                tabBgHover: String(json.bc.tabBgHover),
                tabFg: String(json.bc.tabFg),
                tabFgHover: String(json.bc.tabFgHover),
                tabActiveBg: String(json.bc.tabActiveBg),
                tabActiveFg: String(json.bc.tabActiveFg),
                tabBorderActive: String(json.bc.tabActiveBorder),
            }),
        });
    }

    static vairanvan() {
        return new OrgTheme({
            id: "vairanvan",
            name: "Vairanvan",
            primary: new RoleColor({
                // Reuse the default primary scale
                scale: new Map<ColorStop, string>([
                    [ColorStop._50, "#eff6ff"],
                    [ColorStop._100, "#dbeafe"],
                    [ColorStop._200, "#bfdbfe"],
                    [ColorStop._300, "#93c5fd"],
                    [ColorStop._400, "#60a5fa"],
                    [ColorStop._500, "#3b82f6"],
                    [ColorStop._600, "#2563eb"],
                    [ColorStop._700, "#1d4ed8"],
                    [ColorStop._800, "#1e40af"],
                    [ColorStop._900, "#1e3a8a"],
                    [ColorStop._950, "#172554"],
                    [ColorStop.DEFAULT, "#2563eb"],
                ]),
                text: new Emphasis({
                    strong: "#ffffff",
                    default: "#ffffff",
                    secondary: "#ffffffcc",
                    tertiary: "#ffffff99",
                }),
            }),
            bc: new BrandContainer({
                // Brand container on a dark violet background
                bg: "#39225e",

                // High-contrast text for dark background
                text: new Emphasis({
                    strong: "#ffffff",
                    default: "#f8fafc",
                    secondary: "#ffffffcc", // 80%
                    tertiary: "#ffffff99",  // 60%
                }),

                // Icon button / chip styling on dark bg
                iconBg: "#ffffff1a",       // ~10% white
                iconBgHover: "#ffffff26",  // ~15% white
                iconFg: "#e5e7eb",         // light gray
                iconFgHover: "#ffffff",

                // Tabs on dark bg
                tabBg: "transparent",
                tabBgHover: "#ffffff0d",   // ~5% white
                tabFg: "#e5e7eb",
                tabFgHover: "#ffffff",
                tabActiveBg: "#ffffff14",  // ~8% white
                tabActiveFg: "#ffffff",
                tabBorderActive: "#a78bfa", // violet-400-ish for a subtle accent line
            }),
        });
    }

    static aurora() {
        return new OrgTheme({
            id: "aurora",
            name: "Aurora",
            primary: new RoleColor({
                scale: new Map<ColorStop, string>([
                    [ColorStop._50, "#ecfdf5"],
                    [ColorStop._100, "#d1fae5"],
                    [ColorStop._200, "#a7f3d0"],
                    [ColorStop._300, "#6ee7b7"],
                    [ColorStop._400, "#34d399"],
                    [ColorStop._500, "#10b981"],
                    [ColorStop._600, "#059669"],
                    [ColorStop._700, "#047857"],
                    [ColorStop._800, "#065f46"],
                    [ColorStop._900, "#064e3b"],
                    [ColorStop._950, "#022c22"],
                    [ColorStop.DEFAULT, "#059669"],
                ]),
                text: new Emphasis({
                    strong: "#ffffff",
                    default: "#ffffff",
                    secondary: "#ffffffcc",
                    tertiary: "#ffffff99",
                }),
            }),
            bc: new BrandContainer({
                bg: "#0f172a", // navy slate
                text: new Emphasis({
                    strong: "#ffffff",
                    default: "#f1f5f9",
                    secondary: "#ffffffcc",
                    tertiary: "#ffffff99",
                }),
                iconBg: "#ffffff1a",
                iconBgHover: "#ffffff26",
                iconFg: "#e2e8f0",
                iconFgHover: "#ffffff",
                tabBg: "transparent",
                tabBgHover: "#ffffff0d",
                tabFg: "#e2e8f0",
                tabFgHover: "#ffffff",
                tabActiveBg: "#ffffff14",
                tabActiveFg: "#ffffff",
                tabBorderActive: "#2dd4bf", // teal-400 accent
            }),
        });
    }


    static solstice() {
        return new OrgTheme({
            id: "solstice",
            name: "Solstice",
            primary: new RoleColor({
                scale: new Map<ColorStop, string>([
                    [ColorStop._50, "#fff7ed"],
                    [ColorStop._100, "#ffedd5"],
                    [ColorStop._200, "#fed7aa"],
                    [ColorStop._300, "#fdba74"],
                    [ColorStop._400, "#fb923c"],
                    [ColorStop._500, "#f97316"],
                    [ColorStop._600, "#ea580c"],
                    [ColorStop._700, "#c2410c"],
                    [ColorStop._800, "#9a3412"],
                    [ColorStop._900, "#7c2d12"],
                    [ColorStop._950, "#431407"],
                    [ColorStop.DEFAULT, "#f97316"],
                ]),
                text: new Emphasis({
                    strong: "#ffffff",
                    default: "#ffffff",
                    secondary: "#ffffffcc",
                    tertiary: "#ffffff99",
                }),
            }),
            bc: new BrandContainer({
                bg: "#1c1917", // deep warm gray
                text: new Emphasis({
                    strong: "#ffffff",
                    default: "#fafaf9",
                    secondary: "#ffffffcc",
                    tertiary: "#ffffff99",
                }),
                iconBg: "#ffffff1a",
                iconBgHover: "#ffffff26",
                iconFg: "#f5f5f4",
                iconFgHover: "#ffffff",
                tabBg: "transparent",
                tabBgHover: "#ffffff0d",
                tabFg: "#f5f5f4",
                tabFgHover: "#ffffff",
                tabActiveBg: "#ffffff14",
                tabActiveFg: "#ffffff",
                tabBorderActive: "#fbbf24", // amber-400 accent
            }),
        });
    }



    static nebula() {
    return new OrgTheme({
        id: "nebula",
        name: "Nebula",
        primary: new RoleColor({
            scale: new Map<ColorStop, string>([
                [ColorStop._50, "#fdf4ff"],
                [ColorStop._100, "#fae8ff"],
                [ColorStop._200, "#f5d0fe"],
                [ColorStop._300, "#f0abfc"],
                [ColorStop._400, "#e879f9"],
                [ColorStop._500, "#d946ef"],
                [ColorStop._600, "#c026d3"],
                [ColorStop._700, "#a21caf"],
                [ColorStop._800, "#86198f"],
                [ColorStop._900, "#701a75"],
                [ColorStop._950, "#4a044e"],
                [ColorStop.DEFAULT, "#c026d3"],
            ]),
            text: new Emphasis({
                strong: "#ffffff",
                default: "#ffffff",
                secondary: "#ffffffcc",
                tertiary: "#ffffff99",
            }),
        }),
        bc: new BrandContainer({
            bg: "#1e1b4b", // midnight indigo
            text: new Emphasis({
                strong: "#ffffff",
                default: "#f8fafc",
                secondary: "#ffffffcc",
                tertiary: "#ffffff99",
            }),
            iconBg: "#ffffff1a",
            iconBgHover: "#ffffff26",
            iconFg: "#e0e7ff",
            iconFgHover: "#ffffff",
            tabBg: "transparent",
            tabBgHover: "#ffffff0d",
            tabFg: "#e0e7ff",
            tabFgHover: "#ffffff",
            tabActiveBg: "#ffffff14",
            tabActiveFg: "#ffffff",
            tabBorderActive: "#c084fc", // violet-400 accent
        }),
    });
}


}