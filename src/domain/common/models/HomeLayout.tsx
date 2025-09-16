import { JsonObj } from "~/core/types/Json";

export class NavItem {
    id: string;
    label: string;
    enabled: boolean;

    constructor({ id, label, enabled }: { id: string; label: string, enabled: boolean; }) {
        this.id = id;
        this.label = label;
        this.enabled = enabled;
    }

    static fromJson(json: JsonObj): NavItem {
        return new NavItem({
            id: json.id,
            label: json.label,
            enabled: json.enabled,
        });
    }
}

export class Navigation {
    items: NavItem[]
    defaultItemId: string;

    constructor({ items, defaultItemId }: { items: NavItem[]; defaultItemId: string; }) {
        this.items = items;
        this.defaultItemId = defaultItemId;
    }

    static fromJson(json: JsonObj): Navigation {
        return new Navigation({
            items: (json.items as JsonObj[]).map((it) => NavItem.fromJson(it)),
            defaultItemId: json.defaultItemId,
        });
    }
}

export class HomeLayoutData {

    public static readonly ID_COURSES = 'courses';
    public static readonly ID_ASSESSMENTS = 'assessments';
    public static readonly ID_SURVEY = 'surveys';


    navigation: Navigation;
    constructor({ navigation }: { navigation: Navigation }) {
        this.navigation = navigation;
    }

    static fromJson(json: JsonObj): HomeLayoutData {
        return new HomeLayoutData({
            navigation: Navigation.fromJson(json.navigation as JsonObj),
        });
    }

    hasEnabledNavItem(id: string) {
        return this.navigation.items.some(item => item.id === id && item.enabled);
    }

}