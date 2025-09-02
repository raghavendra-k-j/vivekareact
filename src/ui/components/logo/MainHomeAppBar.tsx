import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "../buttons/button";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { MainBaseAppBar } from "./MainBaseAppBar";
import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";

declare global {
    interface Window {
        Tawk_API?: { toggle?: () => void; minimize?: () => void };
    }
}

export type NavItemProps = {
    label: string;
    isLink: boolean;
    link?: string;
    onClick?: () => void;
    active?: boolean;
};

const navItems: NavItemProps[] = [
    { label: "Features", isLink: true, link: "#features" },
    { label: "Use Cases", isLink: true, link: "#use-cases" },
    { label: "Pricing", isLink: true, link: "#pricing" },
    { label: "About", isLink: true, link: "about" },
    { label: "Contact", isLink: false, onClick: () => window.Tawk_API?.toggle?.() },
];

function closeChatWidgetIfOpen() {
    window.Tawk_API?.minimize?.();
}

function isHashLink(href?: string): href is `#${string}` {
    return !!href && href.startsWith("#");
}

function createNavItemHandler(item: NavItemProps, after?: () => void) {
    return (e?: React.MouseEvent<HTMLAnchorElement>) => {
        const run = () => item.onClick?.();
        if (item.label === "Contact") run();
        else {
            closeChatWidgetIfOpen();
            run();
        }
        if (item.isLink && isHashLink(item.link)) {
            e?.preventDefault();
            const id = item.link.slice(1);
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", item.link);
            }
        }
        after?.();
    };
}

type ActionItem = {
    key: "login" | "signup";
    label: string;
    to: string;
    variant?: "outline";
    color?: "secondary";
    fullWidth?: boolean;
    withRightArrow?: boolean;
};

const ACTION_BUTTONS: ActionItem[] = [
    { key: "login", label: "Login", to: "/login", variant: "outline", color: "secondary" },
    { key: "signup", label: "Get Free Trial", to: "/signup", withRightArrow: true },
];

function ActionButtons({
    layout,
    fullWidth = false,
}: {
    layout: "desktop" | "mobile";
    fullWidth?: boolean;
}) {
    const containerClass =
        layout === "desktop" ? "flex flex-row gap-2" : "pt-6 flex flex-col gap-y-3";
    return (
        <div className={containerClass}>
            {ACTION_BUTTONS.map(({ key, label, to, variant, color, withRightArrow }) => (
                <Link to={to} key={key}>
                    <Button
                        variant={variant as any}
                        color={color as any}
                        className={fullWidth ? "w-full" : undefined}
                    >
                        {label}
                        {withRightArrow ? <ArrowRight className="ml-2" size={16} /> : null}
                    </Button>
                </Link>
            ))}
        </div>
    );
}

export function MainHomeAppBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((v) => !v), []);
    return (
        <>
            <MainBaseAppBar className="justify-between" nav={<NavBar toggleMobileMenu={toggleMobileMenu} />} />
            <MobileMenuOverlay
                isOpen={isMobileMenuOpen}
                onClose={toggleMobileMenu}
                onItemClick={() => setIsMobileMenuOpen(false)}
            />
        </>
    );
}

function MobileMenuOverlay({
    isOpen,
    onClose,
    onItemClick,
}: {
    isOpen: boolean;
    onClose: () => void;
    onItemClick: () => void;
}) {
    if (!isOpen) return null;
    return (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={onClose}>
            <div
                className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[60]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end px-4 pt-2">
                    <IconButton variant="ghost" color="secondary" icon={<X size={24} />} onClick={onClose} />
                </div>
                <div className="px-4 py-2 space-y-1">
                    <NavigationList className="" block afterClick={onItemClick} />
                    <ActionButtons layout="mobile" fullWidth />
                </div>
            </div>
        </div>
    );
}

function NavBar({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
    return (
        <div className="flex items-center flex-1">
            <div className="hidden md:flex flex-1 items-center justify-between">
                <NavigationList className="flex flex-row" />
                <ActionButtons layout="desktop" />
            </div>
            <div className="md:hidden flex-1 flex justify-end">
                <IconButton variant="ghost" color="secondary" icon={<Menu size={24} />} onClick={toggleMobileMenu} />
            </div>
        </div>
    );
}

function NavigationList({
    className,
    block = false,
    afterClick,
}: {
    className?: string;
    block?: boolean;
    afterClick?: () => void;
}) {
    const items = useMemo(
        () => navItems.map((item) => ({ item, handler: createNavItemHandler(item, afterClick) })),
        [afterClick]
    );
    return (
        <div className={className}>
            {items.map(({ item, handler }) => (
                <NavItem
                    key={item.label}
                    label={item.label}
                    href={item.isLink ? item.link : undefined}
                    active={item.active}
                    onClick={handler}
                    block={block}
                />
            ))}
        </div>
    );
}

function NavItem({
    label,
    href,
    active,
    onClick,
    block = false,
}: {
    label: string;
    href?: string;
    active?: boolean;
    onClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
    block?: boolean;
}) {
    const className = [
        block ? "block w-full" : "",
        "px-3 py-2 rounded-md font-semibold transition-colors duration-200 cursor-pointer select-none",
        active ? "text-primary bg-muted/30" : "text-default hover:text-primary hover:bg-primary-50",
    ]
        .filter(Boolean)
        .join(" ");

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (!href || isHashLink(href)) e.preventDefault();
            onClick?.(e);
        },
        [href, onClick]
    );

    return (
        <a href={href ?? "#"} onClick={handleClick} aria-current={active ? "page" : undefined} className={className}>
            {label}
        </a>
    );
}