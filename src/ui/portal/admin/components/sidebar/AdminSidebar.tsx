// AdminSidebar.tsx
import clsx from "clsx";
import { ChevronDown, Power } from "lucide-react";
import { useRef } from "react";
import { ProductLogoPng } from "~/ui/components/AppBarLogo";
import { ProfileMenu } from "~/ui/portal/components/avatar/ProfileMenu";
import { UserAvatar } from "~/ui/portal/components/avatar/UserAvatar";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";
import { usePortalLayoutStore } from "~/ui/portal/layout/portal/PortalLayoutContext";
import { SidebarContext, useSidebarStore } from "./SidebarContext";
import { NavItem, NavItemActionType, NavItemType, NavSection } from "./SidebarModels";
import { SidebarStore } from "./SidebarStore";
import styles from "./styles.module.css";
import { NavLink } from "react-router";

const ICON_SIZE = 18;

export function AdminSidebar() {
    return (
        <SidebarStoreProvider>
            <SidebarLayout />
        </SidebarStoreProvider>
    );
}

function SidebarStoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<SidebarStore | null>(null);
    const appStore = useAppStore();

    if (!storeRef.current) {
        storeRef.current = new SidebarStore({
            appStore: appStore
        });
    }

    return (
        <SidebarContext.Provider value={storeRef.current}>
            {children}
        </SidebarContext.Provider>
    );
}

function SidebarLayout() {
    return (
        <aside className={clsx(styles.sidebarContainer)}>
            <SidebarBrand />
            <SidebarUserProfile />
            <NavList />
            <SidebarBottom />
        </aside>
    );
}

function SidebarBrand() {
    return (
        <div className={styles.headerContainer}>
            <ProductLogoPng />
        </div>
    );
}

function SidebarUserProfile() {
    const appStore = useAppStore();
    const user = appStore.authUser;

    return (
        <ProfileMenu>
            <div className={styles.profileContainer}>
                <div>
                    <UserAvatar id={user.id} name={user.name} />
                </div>
                <div className={styles.profileDetails}>
                    <div className={styles.profileName}>{user.name}</div>
                    <div className={styles.profileRole}>{user.role.name}</div>
                </div>
                <ChevronDown size={16} />
            </div>
        </ProfileMenu>
    );
}

function NavItemView({
    item,
    isSection = false,
}: {
    item: NavItem;
    isSection?: boolean;
}) {
    const Icon = item.icon;

    const wrapperClass = clsx(
        styles.navItem,
        isSection && styles.navItemSection
    );

    const itemContent = (
        <>
            <Icon className={styles.iconNoShrink} size={ICON_SIZE} />
            <span className={styles.navItemLabel}>{item.label}</span>
        </>
    );

    switch (item.actionType) {
        case NavItemActionType.ACTION:
            return (
                <button
                    className={wrapperClass}
                    onClick={item.data as () => void}
                >
                    {itemContent}
                </button>
            );

        case NavItemActionType.LINK:
            return (
                <NavLink
                    to={item.data as string}
                    className={wrapperClass}
                >
                    {itemContent}
                </NavLink>
            );

        case NavItemActionType.EXTERNAL_LINK:
            return (
                <a
                    href={item.data as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={wrapperClass}
                >
                    {itemContent}
                </a>
            );

        default:
            return null;
    }
}

function NavSectionHeader({ section }: { section: NavSection }) {
    return (
        <div className={styles.navSectionHeader} role="heading" aria-level={3}>
            <div className={styles.navSectionLabel}>{section.label}</div>
        </div>
    );
}

function NavSectionView({ section }: { section: NavSection }) {
    return (
        <div className={styles.navSection}>
            <NavSectionHeader section={section} />
            <div className={styles.navSectionItems}>
                {section.items.map((item) => (
                    <NavItemView
                        key={item.id}
                        item={item}
                        isSection={true}
                    />
                ))}
            </div>
        </div>
    );
}

function NavList() {
    const store = useSidebarStore();
    return (
        <nav className={clsx(styles.nav)} aria-label="Main navigation">
            {store.items.map((item) => {
                if (item.type === NavItemType.ITEM) {
                    return (
                        <NavItemView
                            key={item.id}
                            item={item as NavItem}
                        />
                    );
                }
                if (item.type === NavItemType.SECTION) {
                    return (
                        <NavSectionView
                            key={item.id}
                            section={item as NavSection}
                        />
                    );
                }
                return null;
            })}
        </nav>
    );
}

function SidebarBottom() {
    const portalStore = usePortalLayoutStore();
    return (
        <div className={clsx(styles.footer)}>
            <button
                className={clsx(styles.navItem, styles.logoutButton)}
                onClick={() => {
                    portalStore.logout();
                }}
            >
                <Power size={ICON_SIZE} />
                <span className={styles.navItemLabel}>Log out</span>
            </button>
        </div>
    );
}