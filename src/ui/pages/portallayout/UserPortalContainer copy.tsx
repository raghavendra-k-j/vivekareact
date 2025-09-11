import React, { ReactNode } from "react";
import ResponsiveView from "~/ui/widgets/responsive";
import {
    Bell,
    User,
    Home,
    LayoutDashboard,
    Search,
    Calendar,
    MessageSquare,
    Bookmark,
    Settings,
} from "lucide-react";

// -------------------------------
// Layout constants
// -------------------------------
const APP_BAR_HEIGHT = 56;
const SIDEBAR_WIDTH = 264;
const BOTTOM_NAV_HEIGHT = 64;

// -------------------------------
// Root container
// -------------------------------
type UserPortalContainerProps = {
    children: React.ReactNode;
};

export default function UserPortalContainer({ children }: UserPortalContainerProps) {
    return (
        <ResponsiveView
            mobile={<MobileLayout>{children}</MobileLayout>}
            desktop={<DesktopLayout>{children}</DesktopLayout>}
        >
            {/* children used as universal fallback if needed */}
            <DesktopLayout>{children}</DesktopLayout>
        </ResponsiveView>
    );
}

// -------------------------------
// Desktop Layout
// -------------------------------
function DesktopLayout({ children }: { children: ReactNode }) {
    return (
        <div style={styles.desktop.root}>
            {/* Fixed App Bar */}
            <header style={styles.appbar.container}>
                <AppBar />
            </header>

            {/* Fixed Sidebar */}
            <aside style={styles.desktop.sidebar}>
                <Sidebar>
                        <SidebarItem icon={Home} label="Home" active />
                        <SidebarItem icon={Search} label="Summarizes" />
                        <SidebarItem icon={Bookmark} label="Files" />
                </Sidebar>
            </aside>

            {/* Scrollable main */}
            <main style={styles.desktop.main}>
                {children ?? <PlaceholderContent />}
            </main>
        </div>
    );
}

// -------------------------------
// Mobile Layout
// -------------------------------
function MobileLayout({ children }: { children: ReactNode }) {
    return (
        <div style={styles.mobile.root}>
            {/* Fixed App Bar */}
            <header style={styles.appbar.container}>
                <AppBar />
            </header>

            {/* Scrollable main (padded for bars) */}
            <main style={styles.mobile.main}>
                {children ?? <PlaceholderContent />}
            </main>

            {/* Fixed Bottom Navigation */}
            <nav style={styles.mobile.bottomNav}>
                    <BottomNav
                        items={[
                            { icon: Home, label: "Home", active: true },
                            { icon: Search, label: "Summarizes" },
                            { icon: Bookmark, label: "Files" },
                        ]}
                    />
            </nav>
        </div>
    );
}

// -------------------------------
// AppBar
// -------------------------------
function AppBar() {
    return (
        <div style={styles.appbar.inner}>
            {/* Left: Logo (dummy) */}
            <div style={styles.appbar.left}>
                <div style={styles.logoMark} aria-hidden />
                <span style={styles.logoText}>YourApp</span>
            </div>

            {/* Right: Actions */}
            <div style={styles.appbar.right}>
                <IconButton aria-label="Notifications">
                    <Bell size={18} />
                </IconButton>
                <AvatarButton aria-label="User profile">
                    <User size={16} />
                </AvatarButton>
            </div>
        </div>
    );
}

// -------------------------------
// Sidebar
// -------------------------------
type SidebarProps = { children: ReactNode };
function Sidebar({ children }: SidebarProps) {
    return (
        <div style={styles.sidebar.container}>
            <div style={styles.sidebar.sectionLabel}>Navigation</div>
            <div>{children}</div>
        </div>
    );
}

import type { LucideIcon } from "lucide-react";
type SidebarItemProps = {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    onClick?: () => void;
};
function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                ...styles.sidebar.item,
                ...(active ? styles.sidebar.itemActive : null),
            }}
            aria-current={active ? "page" : undefined}
        >
            <Icon size={18} style={styles.sidebar.itemIcon} />
            <span style={styles.sidebar.itemLabel}>{label}</span>
        </button>
    );
}

// -------------------------------
// BottomNav
// -------------------------------
type BottomNavItem = { icon: LucideIcon; label: string; active?: boolean; onClick?: () => void };
type BottomNavProps = { items: BottomNavItem[] };

function BottomNav({ items }: BottomNavProps) {
    return (
        <div style={styles.bottomNav.container}>
            {items.map((it, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={it.onClick}
                    style={{
                        ...styles.bottomNav.item,
                        ...(it.active ? styles.bottomNav.itemActive : null),
                    }}
                    aria-current={it.active ? "page" : undefined}
                >
                    <it.icon size={20} />
                    <span style={styles.bottomNav.label}>{it.label}</span>
                </button>
            ))}
        </div>
    );
}

// -------------------------------
// Small UI atoms
// -------------------------------
function IconButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            style={{
                padding: 8,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}
        >
            {children}
        </button>
    );
}

function AvatarButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            style={{
                marginLeft: 8,
                height: 32,
                width: 32,
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}
        >
            {children}
        </button>
    );
}

function PlaceholderContent() {
    return (
        <div style={{ display: "grid", gap: 16 }}>
            <h2 style={{ margin: 0 }}>Main Content</h2>
            <p style={{ margin: 0, color: "#666" }}>
                Replace this with your route content. The area is scrollable under a fixed AppBar and
                (on desktop) beside a sticky Sidebar, or (on mobile) above a fixed Bottom Navigation.
            </p>
            <div style={styles.cardRow}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={styles.card} />
                ))}
            </div>
        </div>
    );
}

// -------------------------------
/** Inline styles (no external CSS) */
// -------------------------------
const styles = {
    // App bar shared shell (fixed)
    appbar: {
        container: {
            position: "fixed" as const,
            top: 0,
            left: 0,
            right: 0,
            height: APP_BAR_HEIGHT,
            background: "#ffffff",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            zIndex: 20,
        },
        inner: {
            height: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        left: { display: "flex", alignItems: "center", gap: 10 },
        right: { display: "flex", alignItems: "center" },
    },

    // Desktop frame
    desktop: {
        root: {
            height: "100vh",
            overflow: "hidden",
            background: "#fafafa",
        },
        sidebar: {
            position: "fixed" as const,
            top: APP_BAR_HEIGHT,
            left: 0,
            bottom: 0,
            width: SIDEBAR_WIDTH,
            background: "#ffffff",
            borderRight: "1px solid rgba(0,0,0,0.06)",
            overflow: "auto",
            zIndex: 15,
        },
        main: {
            position: "relative" as const,
            height: "100%",
            overflow: "auto",
            padding: 20,
            paddingTop: APP_BAR_HEIGHT + 20,
            marginLeft: SIDEBAR_WIDTH,
        },
    },

    // Mobile frame
    mobile: {
        root: {
            height: "100vh",
            overflow: "hidden",
            background: "#fafafa",
        },
        main: {
            position: "relative" as const,
            height: "100%",
            overflow: "auto",
            padding: 16,
            paddingTop: APP_BAR_HEIGHT + 12,
            paddingBottom: BOTTOM_NAV_HEIGHT + 12,
        },
        bottomNav: {
            position: "fixed" as const,
            left: 0,
            right: 0,
            bottom: 0,
            height: BOTTOM_NAV_HEIGHT,
            background: "#ffffff",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            zIndex: 20,
        },
    },

    // Sidebar
    sidebar: {
        container: {
            padding: "12px 8px",
            display: "grid",
            gap: 6,
        },
        sectionLabel: {
            fontSize: 12,
            letterSpacing: 0.5,
            color: "#777",
            textTransform: "uppercase" as const,
            padding: "8px 12px",
        },
        item: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid transparent",
            background: "transparent",
            cursor: "pointer",
            textAlign: "left" as const,
        },
        itemActive: {
            background: "rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.06)",
        },
        itemIcon: { opacity: 0.9 },
        itemLabel: { fontSize: 14 },
    },

    // Bottom nav
    bottomNav: {
        container: {
            height: "100%",
            display: "flex",
            alignItems: "center",
            maxWidth: 480,
            margin: "0 auto",
            width: "100%",
        },
        item: {
            height: "100%",
            background: "transparent",
            border: "none",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            flex: 1,
        },
        itemActive: {
            color: "#111",
            fontWeight: 600,
        },
        label: { fontSize: 11 },
    },

    // Misc
    logoMark: {
        width: 24,
        height: 24,
        borderRadius: 6,
        background:
            "conic-gradient(from 180deg at 50% 50%, #111 0deg, #666 120deg, #bbb 240deg, #111 360deg)",
    },
    logoText: { fontWeight: 700 },
    cardRow: {
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    },
    card: {
        height: 120,
        borderRadius: 12,
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    },
} as const;
