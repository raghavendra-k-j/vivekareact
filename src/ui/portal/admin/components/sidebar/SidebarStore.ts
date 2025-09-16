// SidebarStore.ts
import {
    Building2,
    FileText,
    Folder,
    FolderOpen,
    HelpCircle,
    LifeBuoy,
    ScrollText,
    Sparkles,
    SplitSquareHorizontal,
    Star,
    Tags,
    UserCog,
    Users as UsersIcon,
} from "lucide-react";
import { BaseEnv } from "~/core/config/BaseEnv";
import { UserPermissions } from "~/domain/common/models/UserPermissions";
import { FormConst } from "~/domain/forms/const/FormConst";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { BaseNavItem, NavItem, NavItemActionType, NavSection } from "./SidebarModels";

export class SidebarStore {
    appStore: AppStore;
    items: BaseNavItem[] = [];
    activeKey: string = "";

    constructor({ appStore }: { appStore: AppStore }) {
        this.appStore = appStore;
        this.items = this.initItems();
    }

    hasPermission(permission: string): boolean {
        return this.appStore.authUser.hasPermission(permission);
    }

    setActiveKey = (key: string) => {
        this.activeKey = key;
    };

    get entityCatalog() {
        return this.appStore.entityCatalog;
    }

    private initItems(): BaseNavItem[] {
        const items: BaseNavItem[] = [];

        const formsSection = this.initFormsSection();
        if (formsSection) {
            items.push(formsSection);
        }

        const spacesSection = this.initSpacesSection();
        if (spacesSection) {
            items.push(spacesSection);
        }

        const otherTools = this.initOtherToolsSection();
        if (otherTools) {
            items.push(...otherTools);
        }

        const adminSection = this.initAdministrationSection();
        if (adminSection) {
            items.push(adminSection);
        }

        items.push(...this.initMiscellaneousItems());

        return items;
    }

    initOtherToolsSection(): BaseNavItem[] | null {
        const items: NavItem[] = [];

        if (this.hasPermission(UserPermissions.ADMIN_SUMMARIZER)) {
            items.push(
                new NavItem({
                    id: "summarizer",
                    label: "Summarizer",
                    icon: Sparkles,
                    actionType: NavItemActionType.LINK,
                    data: "/admin/summarizer",
                })
            );
        }

        if (this.hasPermission(UserPermissions.ADMIN_LEARNING_RESOURCES)) {
            items.push(
                new NavItem({
                    id: "files",
                    label: "Files",
                    icon: FolderOpen,
                    actionType: NavItemActionType.LINK,
                    data: "/admin/files",
                })
            );
        }

        items.push(
            new NavItem({
                id: "pdf-splitter",
                label: "PDF Splitter",
                icon: SplitSquareHorizontal,
                actionType: NavItemActionType.LINK,
                data: "/admin/pdf-splitter",
            })
        );

        if (this.appStore.planDetail.qpFeatureEnabled) {
            items.push(
                new NavItem({
                    id: "qpgenerator",
                    label: "Question Paper Generator",
                    icon: ScrollText,
                    actionType: NavItemActionType.LINK,
                    data: "/admin/question-paper-generator",
                })
            );
        }

        if (items.length === 0) {
            return null;
        }

        return items;
    }

    private initMiscellaneousItems(): BaseNavItem[] {
        const supportURL = BaseEnv.instance.contactUsUrl;
        const faqURL = BaseEnv.instance.faqUrl;
        const rateAppURL = BaseEnv.instance.rateAppURL;
        return [
            new NavItem({
                id: "faq",
                label: "FAQ",
                icon: HelpCircle,
                actionType: NavItemActionType.EXTERNAL_LINK,
                data: faqURL,
            }),
            new NavItem({
                id: "support",
                label: "Support",
                icon: LifeBuoy,
                actionType: NavItemActionType.EXTERNAL_LINK,
                data: supportURL,
            }),
            new NavItem({
                id: "rate-app",
                label: "Rate App",
                icon: Star,
                actionType: NavItemActionType.EXTERNAL_LINK,
                data: rateAppURL,
            }),
        ];
    }

    private initFormsSection(): BaseNavItem | null {
        if (!this.hasPermission(UserPermissions.ADMIN_FORMS)) {
            return null;
        }

        const allForms = new NavItem({
            id: "all-forms",
            label: `All Forms`,
            icon: FileText,
            actionType: NavItemActionType.LINK,
            data: "/admin/forms",
        });

        const categories = new NavItem({
            id: "form-categories",
            label: "Categories",
            icon: Tags,
            actionType: NavItemActionType.LINK,
            data: "/admin/forms/categories",
        });

        return new NavSection({
            id: "forms-section",
            label: "Forms",
            items: [allForms, categories],
        });
    }

    private initSpacesSection(): BaseNavItem | null {
        if (
            !this.hasPermission(UserPermissions.ADMIN_SPACES_ALL) && 
            !this.hasPermission(UserPermissions.ADMIN_SPACES_ASSIGNED)
        ) {
            return null;
        }

        return new NavItem({
            id: "lms",
            label: "LMS",
            icon: Folder,
            actionType: NavItemActionType.LINK,
            data: "/console/lms",
        });
    }

    private initAdministrationSection(): BaseNavItem | null {
        const items: NavItem[] = [];

        if (this.hasPermission(UserPermissions.ADMIN_USERS)) {
            items.push(
                new NavItem({
                    id: "users",
                    label: "Users",
                    icon: UsersIcon,
                    actionType: NavItemActionType.LINK,
                    data: "/console/users",
                })
            );
        }

        if (this.hasPermission(UserPermissions.ADMIN_ROLES)) {
            items.push(
                new NavItem({
                    id: "roles",
                    label: "Roles",
                    icon: UserCog,
                    actionType: NavItemActionType.LINK,
                    data: "/console/roles",
                })
            );
        }

        if (this.hasPermission(UserPermissions.ADMIN_ORG)) {
            items.push(
                new NavItem({
                    id: "org-settings",
                    label: "Organization Settings",
                    icon: Building2,
                    actionType: NavItemActionType.LINK,
                    data: "/console/org-settings",
                })
            );
        }

        if (items.length === 0) {
            return null;
        }

        return new NavSection({
            id: "administration",
            label: "Administration",
            items,
        });
    }
}