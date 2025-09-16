import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { NavItem } from "~/domain/common/models/HomeLayout";
import { useEnableDragScroll } from "~/ui/hooks/useEnableDragScroll";
import { useIsLinkActive } from "~/ui/hooks/useIsLinkActive";
import { PortalAppBarLogo } from "../../../components/appbar/PortalAppBarLogo";
import { AppBarUserAvatar } from "../../../components/avatar/AppBarUserAvatar";
import { NotificationBell } from "../../notifications/NotificationBell";
import { useHomeLayoutStore } from "../HomeLayoutContext";
import styles from "./HomeAppBar.module.css";

export function HomeAppBar() {
    const homeStore = useHomeLayoutStore();
    return (
        <header className="bg-surface shadow sticky top-0 z-10">
            <div className="mx-auto container flex flex-row items-center justify-between px-4 sm:px-6 h-16 ">
                <div className="flex flex-row items-center gap-2">
                    <PortalAppBarLogo />
                </div>
                <div className="flex flex-row items-center gap-4">
                    <NotificationBell />
                    <AppBarUserAvatar />
                </div>
            </div>
            <Observer>{() => (homeStore.layoutDataState.isData ? <NavLayout /> : null)}</Observer>
        </header>
    );
}

function NavLayout() {
    const store = useHomeLayoutStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    useEnableDragScroll(scrollRef);
    const navItems = store.homeLayout.navigation.items.filter(item => item.enabled);
    if (!navItems?.length) return null;
    return (
        <LayoutGroup id="home-nav">
            <div className={clsx(styles.navItems, "container mx-auto")} ref={scrollRef}>
                {navItems.map((item) => (
                    <NavItemView key={item.id} item={item} className={styles.navItem} />
                ))}
            </div>
        </LayoutGroup>
    );
}

function NavItemView({ item }: { item: NavItem; className?: string }) {
    const navigate = useNavigate();
    const isActive = useIsLinkActive(item.id);
    return (
        <button
            onClick={() => navigate(item.id)}
            className={clsx(styles.navItem, isActive ? styles.active : styles.inactive)}
        >
            <span>{item.label}</span>
            {isActive && <motion.span layoutId="nav-underline" className={styles.underline} />}
        </button>
    );
}
