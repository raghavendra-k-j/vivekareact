import { JsonObj } from "~/core/types/Json";

export class NavItem {
    id: string;
    label: string;
    enabled: boolean;
    webRoute: string;

    constructor({ id, label, enabled, webRoute }: { id: string; label: string, enabled: boolean; webRoute: string }) {
        this.id = id;
        this.label = label;
        this.enabled = enabled;
        this.webRoute = webRoute;
    }

    static fromJson(json: JsonObj): NavItem {
        return new NavItem({
            id: json.id,
            label: json.label,
            enabled: json.enabled,
            webRoute: json.webRoute,
        });
    }
}

export class Navigation {
    items: NavItem[]
    defaultItemId: string;
    private navMap: Map<string, NavItem> = new Map();

    constructor({ items, defaultItemId }: { items: NavItem[]; defaultItemId: string; }) {
        this.items = items;
        this.defaultItemId = defaultItemId;
        this.navMap = new Map(items.map(i => [i.id, i]));
    }

    getNavItem(id: string) {
        return this.navMap.get(id);
    }


    static fromJson(json: JsonObj): Navigation {
        return new Navigation({
            items: (json.items as JsonObj[]).map((it) => NavItem.fromJson(it)),
            defaultItemId: json.defaultItemId,
        });
    }
}


export type UserAppBarTheme = {
    bgColor: string;
    fgColor: string;
    textColorDefault: string;
    textSecondaryDefault: string;
    textTertiaryDefault: string;
    iconColorDefault: string;
    iconColorSecondary: string;
    controlsBgColor: string;
    controlsFgColor: string;
    controlFgColorActive: string;
}

export class UserAppTheme {
    id: string;
    name: string;
    appbar: UserAppBarTheme;

    constructor({ id, name, appbar }: { id: string; name: string; appbar: UserAppBarTheme; }) {
        this.id = id;
        this.name = name;
        this.appbar = appbar;
    }

    static default() {
        return new UserAppTheme({
            id: 'default',
            name: 'Default',
            appbar: {
                bgColor: "#ffffff",
                fgColor: "",
                textColorDefault: "var(--color-text-default)",
                textSecondaryDefault: "var(--color-text-secondary)",
                textTertiaryDefault: "var(--color-text-tertiary)",
                iconColorDefault: "var(--color-text-default)",
                iconColorSecondary: "var(--color-text-secondary)",
                controlsBgColor: "var(--color-surface)",
                controlsFgColor: "var(--color-text-secondary)",
                controlFgColorActive: "var(--color-primary)",
            }
        });
    }
}



export class UserAppConfig {

    public static readonly ID_COURSES = 'courses';
    public static readonly ID_ASSESSMENTS = 'assessments';
    public static readonly ID_SURVEY = 'surveys';

    navigation: Navigation;

    constructor({ navigation }: { navigation: Navigation }) {
        this.navigation = navigation;
    }

    static fromJson(json: JsonObj): UserAppConfig {
        return new UserAppConfig({
            navigation: Navigation.fromJson(json.navigation as JsonObj),
        });
    }

    hasEnabledNavItem(id: string) {
        return this.navigation.items.some(item => item.id === id && item.enabled);
    }
}