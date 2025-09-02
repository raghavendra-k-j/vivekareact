import { Button } from "../buttons/button";
import { MainBaseAppBar } from "./MainBaseAppBar";

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
    {
        label: "Contact",
        isLink: false,
        onClick: () => {
            (window as any)?.Tawk_API?.toggle?.();
        },
    },
];

function closeChatWidgetIfOpen() {
    const api = (window as any)?.Tawk_API;
    api?.minimize?.();
}

export function MainHomeAppBar() {
    return <MainBaseAppBar className="justify-between" nav={<NavBar />} />;
}

function NavBar() {
    return (
        <div className="flex items-center flex-1">
            <div className="hidden md:flex flex-1 items-center justify-between">
                <div className="flex flex-row">
                    {navItems.map((item) => {
                        const wrappedOnClick =
                            item.label === "Contact"
                                ? item.onClick
                                : () => {
                                    closeChatWidgetIfOpen();
                                    item.onClick?.();
                                };

                        return (
                            <NavItem
                                key={item.label}
                                label={item.label}
                                href={item.isLink ? item.link : undefined}
                                active={item.active}
                                onClick={wrappedOnClick}
                            />
                        );
                    })}
                </div>
                <div className="flex flex-row gap-2">
                    <Button variant="outline" color="secondary">Login</Button>
                    <Button>Get Free Trial</Button>
                </div>
            </div>
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
    onClick?: () => void;
    block?: boolean;
}) {
    const className = [
        block ? "block w-full" : "",
        "px-3 py-2 rounded-md font-semibold transition-colors duration-200 cursor-pointer select-none",
        active ? "text-primary bg-muted/30" : "text-default hover:text-primary hover:bg-muted/20",
    ].join(" ");

    if (!href) {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-current={active ? "page" : undefined}
                className={className}
            >
                {label}
            </button>
        );
    }

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.();

        if (href.startsWith("#")) {
            e.preventDefault();
            const id = href.slice(1);
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", href);
            }
        }
    };

    return (
        <a
            href={href}
            onClick={handleAnchorClick}
            aria-current={active ? "page" : undefined}
            className={className}
        >
            {label}
        </a>
    );
}
