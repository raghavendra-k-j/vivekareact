export enum NavItemType {
    ITEM = "item",
    SECTION = "section",
}

export enum NavItemActionType {
    LINK = "link",
    ACTION = "action",
    EXTERNAL_LINK = "external_link",
}

export interface BaseNavItemParams {
    id: string;
    label: string;
    type?: NavItemType;
}

export abstract class BaseNavItem {
    id: string;
    label: string;
    type: NavItemType;

    constructor({ id, label, type = NavItemType.ITEM }: BaseNavItemParams) {
        this.id = id;
        this.label = label;
        this.type = type;
    }
}

export interface NavItemParams {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    type?: NavItemType;
    actionType?: NavItemActionType;
    data: string | (() => void);
}

export class NavItem extends BaseNavItem {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    actionType: NavItemActionType;
    data: string | (() => void);

    constructor({
        id,
        label,
        icon,
        type = NavItemType.ITEM,
        actionType = NavItemActionType.LINK,
        data,
    }: NavItemParams) {
        super({ id, label, type });
        this.icon = icon;
        this.actionType = actionType;
        this.data = data;
    }
}

export interface NavSectionParams {
    id: string;
    label: string;
    items?: NavItem[];
    type?: NavItemType;
}

export class NavSection extends BaseNavItem {
    items: NavItem[];
    constructor({ id, label, items = [], type = NavItemType.SECTION }: NavSectionParams) {
        super({ id, label, type });
        this.items = items;
    }
}
