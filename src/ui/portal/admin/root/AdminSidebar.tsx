import { AnimatePresence, motion } from "framer-motion";
import {
    Building2,
    ChevronDown,
    FileText,
    Folder,
    HelpCircle,
    LayoutGrid,
    LogOut,
    LucideIcon,
    Scissors,
    Sparkles,
    Star,
    Tags,
    UserCog,
    Users as UsersIcon,
} from "lucide-react";
import React from "react";

import { BaseNamedLogo } from "~/ui/components/logo/BaseLogo";
import { GradientAvatarView } from "../../components/avatar/GradientAvatarView";
import { ProfileMenu } from "../../components/avatar/ProfileMenu";
import { UserAvatar } from "../../components/avatar/UserAvatar";
import { useAppStore } from "../../layout/app/AppContext";


interface NavItemData {
    key: string;
    label: string;
    icon?: LucideIcon;
}

interface NavSectionData {
    type: "section";
    label: string;
    items: NavItemData[];
}

interface SingleNavItemData {
    type: "item";
    key: string;
    label: string;
    icon?: LucideIcon;
}

type NavigationNode = NavSectionData | SingleNavItemData;

interface User {
    name: string;
    email?: string;
}

interface AdminSidebarProps {
    logoUrl?: string;
    user?: User;
}

interface NavItemViewProps {
    icon?: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
    depth?: number;
}

interface NavSectionHeaderProps {
    label: string;
    open: boolean;
    onToggle: () => void;
}

interface NavSectionViewProps {
    section: NavSectionData;
    isOpen: boolean;
    activeKey: string;
    onToggle: () => void;
    onItemClick: (key: string) => void;
}

interface NavItemsViewProps {
    structure: NavigationNode[];
    activeKey: string;
    openGroups: Record<string, boolean>;
    onItemClick: (key: string) => void;
    onToggleGroup: (label: string) => void;
}

interface UserProfileViewProps {
    user: User;
}

interface SidebarHeaderViewProps {
    logoUrl?: string;
    user: User;
}

interface LogoutButtonViewProps {
    onLogout: () => void;
}

// ===========================
// INDIVIDUAL COMPONENTS
// ===========================

/**
 * Single navigation item component
 */
function NavItemView({ icon: Icon, label, active, onClick, depth = 0 }: NavItemViewProps) {
    return (
        <button
            onClick={onClick}
            className={`relative flex items-center gap-2 w-full px-3 py-2 rounded-xl transition-colors text-sm
        ${active ? "text-white" : "text-blue-100/80 hover:text-white"}`}
            style={{ paddingLeft: 12 + depth * 12 }}
            title={label}
        >
            {Icon && <Icon className="shrink-0" size={18} />}
            <span className="font-medium">{label}</span>
            {active && (
                <motion.span
                    layoutId="activeBubble"
                    className="absolute inset-0 -z-10 rounded-xl bg-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
            )}
        </button>
    );
}

/**
 * Navigation section header with expand/collapse functionality
 */
function NavSectionHeaderView({ label, open, onToggle }: NavSectionHeaderProps) {
    return (
        <div className="flex items-center justify-between px-3 py-2 select-none">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-200/70">
                {label}
            </div>
            <button
                aria-label={`Toggle ${label}`}
                onClick={onToggle}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/5"
            >
                <motion.span animate={{ rotate: open ? 0 : -90 }}>
                    <ChevronDown size={16} className="text-blue-200/80" />
                </motion.span>
            </button>
        </div>
    );
}

/**
 * Navigation section containing multiple items
 */
function NavSectionView({ section, isOpen, activeKey, onToggle, onItemClick }: NavSectionViewProps) {
    return (
        <div className="mt-1">
            <NavSectionHeaderView
                label={section.label}
                open={isOpen}
                onToggle={onToggle}
            />
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key={`${section.label}-items`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "tween", duration: 0.18 }}
                        className="flex flex-col gap-1"
                    >
                        {section.items.map((item) => (
                            <NavItemView
                                key={item.key}
                                icon={item.icon}
                                label={item.label}
                                active={activeKey === item.key}
                                onClick={() => onItemClick(item.key)}
                                depth={1}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Container for all navigation items and sections
 */
function NavItemsView({
    structure,
    activeKey,
    openGroups,
    onItemClick,
    onToggleGroup
}: NavItemsViewProps) {
    return (
        <nav className="mt-1 flex flex-col gap-1 px-2">
            {structure.map((node) => {
                if (node.type === "item") {
                    const active = activeKey === node.key;
                    return (
                        <NavItemView
                            key={node.key}
                            icon={node.icon}
                            label={node.label}
                            active={active}
                            onClick={() => onItemClick(node.key)}
                        />
                    );
                }

                const isOpen = openGroups[node.label] ?? true;
                return (
                    <NavSectionView
                        key={node.label}
                        section={node}
                        isOpen={isOpen}
                        activeKey={activeKey}
                        onToggle={() => onToggleGroup(node.label)}
                        onItemClick={onItemClick}
                    />
                );
            })}
        </nav>
    );
}

/**
 * User profile display component
 */
function UserProfileView() {
    const appStore = useAppStore();
    const user = appStore.appUser;
    return (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 p-2">
            <GradientAvatarView id={user.id} name={user.name} />
            <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">{user.name}</div>
                {user.email && (
                    <div className="truncate text-[11px] text-blue-200/70">{user.email}</div>
                )}
            </div>
        </div>
    );
}

/**
 * Sidebar header with logo and user profile
 */
function SidebarHeaderView() {
    return (
        <div>
            <div className="px-6 py-4 flex items-center justify-center">
                <BaseNamedLogo textClassName="text-white" />
            </div>
            <UserProfileView />
        </div >
    );
}

/**
 * Logout button component
 */
function LogoutButtonView({ onLogout }: LogoutButtonViewProps) {
    return (
        <div className="mt-auto p-3">
            <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/0 px-3 py-2 text-sm text-blue-100/90 hover:bg-white/5 hover:text-white"
            >
                <LogOut size={16} />
                <span>Log out</span>
            </button>
        </div>
    );
}

export function AdminSidebar() {
    const [activeKey, setActiveKey] = React.useState("forms");
    const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
        Forms: true,
        Administration: true,
        Tools: true,
    });


    const navigationStructure: NavigationNode[] = [
        {
            type: "section",
            label: "Forms",
            items: [
                { key: "forms", label: "Forms", icon: FileText },
                { key: "categories", label: "Categories", icon: Tags },
            ],
        },
        { type: "item", key: "spaces", label: "Spaces", icon: LayoutGrid },
        { type: "item", key: "files", label: "Files", icon: Folder },
        {
            type: "section",
            label: "Administration",
            items: [
                { key: "users", label: "Users", icon: UsersIcon },
                { key: "roles", label: "Roles", icon: UserCog },
                { key: "organization-settings", label: "Organization Settings", icon: Building2 },
            ],
        },
        {
            type: "section",
            label: "Tools",
            items: [
                { key: "pdf-splitter", label: "PDF Splitter", icon: Scissors },
                { key: "summarizer", label: "Summarizer", icon: Sparkles },
                { key: "question-paper-creator", label: "Question Paper Creator", icon: FileText },
            ],
        },
        { type: "item", key: "rate-app", label: "Rate App", icon: Star },
        { type: "item", key: "faq", label: "FAQ", icon: HelpCircle },
    ];

    const handleToggleGroup = (label: string) => {
        setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const handleItemClick = (key: string) => {
        setActiveKey(key);
        // Add your navigation logic here
        console.log(`Navigating to: ${key}`);
    };

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logging out...");
    };

    return (
        <aside className="h-screen w-64 border-r border-[#15305a] bg-primary-950 text-blue-100 flex flex-col">
            <SidebarHeaderView />
            <NavItemsView
                structure={navigationStructure}
                activeKey={activeKey}
                openGroups={openGroups}
                onItemClick={handleItemClick}
                onToggleGroup={handleToggleGroup}
            />
            <LogoutButtonView onLogout={handleLogout} />
        </aside>
    );
}




const AdminSidebarUserProfile = () => {
    const user = {
        id: 1,
        name: "John Doe",
        email: "16102000.rghu@gmail.com",
        role: "Admin"
    };
    return (<ProfileMenu><UserAvatar id={user.id} name={user.name} /></ProfileMenu>);
};



export default AdminSidebar;