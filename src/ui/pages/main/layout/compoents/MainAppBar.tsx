import { ArrowRight, Menu, X } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { BaseEnv } from "~/core/config/BaseEnv";
import { minimizeTawkToChat, openTawkToChat } from "~/infra/tawkto/types";
import { AppUrl } from "~/infra/utils/AppUrl";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { Button } from "../../../../components/buttons/button";
import { MainBaseAppBar } from "../../../../components/logo/MainBaseAppBar";

/** ---------------------------------------
 * Types & Config
 * ------------------------------------- */

export type NavItemProps = {
    label: string;
    isLink: boolean;
    link?: string;
    onClick?: () => void;
    active?: boolean;
};

const NAV_ITEMS: NavItemProps[] = [
    { label: "Features", isLink: true, link: "#features" },
    { label: "Use Cases", isLink: true, link: "#use-cases" },
    { label: "Pricing", isLink: true, link: "#pricing" },
    { label: "About", isLink: true, link: AppUrl.autoTo({ path: BaseEnv.instance.aboutUsUrl }) },
    { label: "Contact", isLink: false, onClick: () => openTawkToChat() },
];

type ActionItemKey = "login" | "signup";

type ActionItem = {
    key: ActionItemKey;
    label: string;
    to: string;
    variant?: "outline";
    color?: "secondary";
    fullWidth?: boolean;
    withRightArrow?: boolean;
};

type MainAppBarProps = {
    showLogin?: boolean;
    showSignup?: boolean;
    signupLabel?: string;
    showNavItems?: boolean;
};

/** ---------------------------------------
 * Navigation Helpers (extracted logic)
 * ------------------------------------- */

/** Hash-link guard */
function isHashLink(href?: string): href is `#${string}` {
    return !!href && href.startsWith("#");
}

/** Home-page check (kept identical to previous behavior) */
function isHomePagePathname(pathname: string) {
    return AppUrl.isHomePage(pathname);
}

/** Build app-friendly href from a potential hash or app-relative path */
function resolveHref(link?: string): string | undefined {
    if (!link) return undefined;
    if (isHashLink(link)) {
        const id = link.slice(1);
        return AppUrl.to({ path: `/#${id}` });
    }
    return AppUrl.autoTo({ path: link });
}

/**
 * Scroll to the given hash-id if present in the current DOM;
 * otherwise navigate to the home page with the hash.
 * Mirrors original semantics.
 */
function handleHashOnHomeNavigation(id: string) {
    const href = AppUrl.to({ path: `/#${id}` });
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
    } else {
        window.location.href = href;
    }
}

/**
 * Full click behavior for nav items (Contact + Tawk.to, hash routing, etc.)
 * Returns a stable click handler that preserves original behavior.
 */
function createNavItemClickHandler(
    item: NavItemProps,
    after?: () => void
) {
    return (e?: React.MouseEvent<HTMLAnchorElement>) => {
        // Tawk.to behavior preserved exactly
        const run = () => item.onClick?.();
        if (item.label === "Contact") run();
        else {
            minimizeTawkToChat();
            run();
        }

        // Hash link handling (kept identical)
        if (item.isLink && isHashLink(item.link)) {
            const id = item.link.slice(1);
            const href = AppUrl.to({ path: `/#${id}` });

            if (isHomePagePathname(window.location.pathname)) {
                e?.preventDefault();
                handleHashOnHomeNavigation(id);
            } else {
                e?.preventDefault();
                window.location.href = href;
            }
        }

        after?.();
    };
}

/**
 * Whether the NavItem anchor should prevent default based on href and current page.
 * Preserves original "don't let the browser jump when already on home + hash" behavior.
 */
function shouldPreventDefaultForHref(href?: string) {
    const isHome = isHomePagePathname(window.location.pathname);
    if (!href) return true;
    if (href.includes("/#") && isHome) return true;
    return false;
}

/** Map raw nav items into render-friendly data, memoized */
function useResolvedNavItems(afterClick?: () => void) {
    return useMemo(
        () =>
            NAV_ITEMS.map((item) => ({
                item,
                handler: createNavItemClickHandler(item, afterClick),
                href: resolveHref(item.link),
            })),
        [afterClick]
    );
}

/** ---------------------------------------
 * Action Buttons (configurable visibilities)
 * ------------------------------------- */

function buildActionButtonsConfig(
    showLogin: boolean,
    showSignup: boolean,
    signupLabel: string
): ActionItem[] {
    const buttons: ActionItem[] = [];

    if (showLogin) {
        buttons.push({
            key: "login",
            label: "Login",
            to: "/login",
            variant: "outline",
            color: "secondary",
        });
    }

    if (showSignup) {
        buttons.push({
            key: "signup",
            label: signupLabel || "Get Free Trial",
            to: "/signup",
            withRightArrow: true,
        });
    }

    return buttons;
}

function ActionButtons({
    layout,
    fullWidth = false,
    showLogin = true,
    showSignup = true,
    signupLabel = "Get Free Trial",
}: {
    layout: "desktop" | "mobile";
    fullWidth?: boolean;
    showLogin?: boolean;
    showSignup?: boolean;
    signupLabel?: string;
}) {
    const items = useMemo(
        () => buildActionButtonsConfig(showLogin, showSignup, signupLabel),
        [showLogin, showSignup, signupLabel]
    );

    // If both hidden, render nothing (matches "ability to hide both")
    if (items.length === 0) return null;

    const containerClass =
        layout === "desktop" ? "flex flex-row gap-2" : "pt-6 flex flex-col gap-y-3";

    return (
        <div className={containerClass}>
            {items.map(({ key, label, to, variant, color, withRightArrow }) => (
                <Link to={AppUrl.autoTo({ path: to })} key={key}>
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

/** ---------------------------------------
 * Public Component
 * ------------------------------------- */

export function MainAppBar({
    showLogin = true,
    showSignup = true,
    signupLabel = "Get Free Trial",
    showNavItems = true,
}: MainAppBarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = useCallback(
        () => setIsMobileMenuOpen((v) => !v),
        []
    );

    return (
        <>
            <MainBaseAppBar
                className="justify-between"
                nav={
                    <NavBar
                        toggleMobileMenu={toggleMobileMenu}
                        showLogin={showLogin}
                        showSignup={showSignup}
                        signupLabel={signupLabel}
                        showNavItems={showNavItems}
                    />
                }
            />
            <MobileMenuOverlay
                isOpen={isMobileMenuOpen}
                onClose={toggleMobileMenu}
                onItemClick={() => setIsMobileMenuOpen(false)}
                showLogin={showLogin}
                showSignup={showSignup}
                signupLabel={signupLabel}
                showNavItems={showNavItems}
            />
        </>
    );
}

/** ---------------------------------------
 * Internal UI
 * ------------------------------------- */

function MobileMenuOverlay({
    isOpen,
    onClose,
    onItemClick,
    showLogin = true,
    showSignup = true,
    signupLabel = "Get Free Trial",
    showNavItems = true,
}: {
    isOpen: boolean;
    onClose: () => void;
    onItemClick: () => void;
    showLogin?: boolean;
    showSignup?: boolean;
    signupLabel?: string;
    showNavItems?: boolean;
}) {
    if (!isOpen) return null;
    return (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={onClose}>
            <div
                className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[60]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end px-4 pt-2">
                    <IconButton
                        variant="ghost"
                        color="secondary"
                        icon={<X size={24} />}
                        onClick={onClose}
                    />
                </div>
                <div className="px-4 py-2 space-y-1">
                    {showNavItems ? (
                        <NavigationList className="" block afterClick={onItemClick} />
                    ) : null}
                    <ActionButtons
                        layout="mobile"
                        fullWidth
                        showLogin={showLogin}
                        showSignup={showSignup}
                        signupLabel={signupLabel}
                    />
                </div>
            </div>
        </div>
    );
}

function NavBar({
    toggleMobileMenu,
    showLogin = true,
    showSignup = true,
    signupLabel = "Get Free Trial",
    showNavItems = true,
}: {
    toggleMobileMenu: () => void;
    showLogin?: boolean;
    showSignup?: boolean;
    signupLabel?: string;
    showNavItems?: boolean;
}) {
    return (
        <div className="flex items-center flex-1">
            <div className="hidden lg:flex flex-1 items-center justify-between">
                {showNavItems ? (
                    <NavigationList className="flex flex-row" />
                ) : (
                    <div />
                )}
                <ActionButtons
                    layout="desktop"
                    showLogin={showLogin}
                    showSignup={showSignup}
                    signupLabel={signupLabel}
                />
            </div>
            <div className="lg:hidden flex-1 flex justify-end">
                <IconButton
                    variant="ghost"
                    color="secondary"
                    icon={<Menu size={24} />}
                    onClick={toggleMobileMenu}
                />
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
    const items = useResolvedNavItems(afterClick);
    return (
        <div className={className}>
            {items.map(({ item, handler, href }) => (
                <NavItem
                    key={item.label}
                    label={item.label}
                    href={item.isLink ? href : undefined}
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
            if (shouldPreventDefaultForHref(href)) e.preventDefault();
            onClick?.(e);
        },
        [href, onClick]
    );

    return (
        <a
            href={href ?? AppUrl.to({ path: "/" })}
            onClick={handleClick}
            aria-current={active ? "page" : undefined}
            className={className}
        >
            {label}
        </a>
    );
}
