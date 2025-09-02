import React from "react";
import { Mail } from "lucide-react";
import { BaseNamedLogo } from "~/ui/components/logo/BaseLogo";

const SENTIACARE_URL = "https://www.sentiacare.com/";
const SENTIACARE_SM_LOGO = "https://www.sentiacare.com/images/logo-sentiacare-sm.png";

export function Footer() {
    const year = new Date().getFullYear();
    const email = "askus@sentiacare.com";

    const openMail = (subject: string) => {
        const s = encodeURIComponent(subject);
        window.open(`mailto:${email}?subject=${s}`, "_blank");
    };

    const openChat = () => {
        (window as any)?.Tawk_API?.toggle?.();
    };

    return (
        <footer className="text-white bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            <div className="container px-4 py-10">
                <div className="grid items-start gap-10 md:grid-cols-2">
                    <FooterBrand email={email} onEmailClick={() => openMail("General Inquiry")} />
                    <FooterLinks
                        items={[
                            { label: "About Us", href: "/about" },
                            { label: "Terms of Service", href: "/terms" },
                            { label: "Privacy Policy", href: "/privacy" },
                            { label: "Contact Us", onClick: openChat },
                        ]}
                    />
                </div>

                <FooterBottom year={year} />
            </div>
        </footer>
    );
}

function FooterBrand({
    email,
    onEmailClick,
}: {
    email: string;
    onEmailClick: () => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <BaseNamedLogo iconSize={28} textSize={20} textClassName="text-white" />
            </div>
            <p className="text-base text-gray-300">
                AI-powered platform to create Assessments & Surveys, auto-evaluate
                responses, and deliver actionable analytics.
            </p>
            <FooterEmail email={email} onClick={onEmailClick} />
        </div>
    );
}

function FooterEmail({
    email,
    onClick,
}: {
    email: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-2 text-base text-gray-300 hover:text-white"
        >
            <Mail className="h-4 w-4" />
            {email}
        </button>
    );
}

type FooterLinkItem =
    | { label: string; href: string; onClick?: never }
    | { label: string; href?: never; onClick: () => void };

function FooterLinks({ items }: { items: FooterLinkItem[] }) {
    return (
        <nav aria-label="Footer" className="grid gap-3 md:justify-end text-base">
            <div className="flex flex-wrap gap-6">
                {items.map((item) => (
                    <FooterNavLink
                        key={item.label}
                        href={"href" in item ? item.href : undefined}
                        onClick={"onClick" in item ? item.onClick : undefined}
                    >
                        {item.label}
                    </FooterNavLink>
                ))}
            </div>
        </nav>
    );
}

function FooterNavLink({
    href,
    onClick,
    children,
}: {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
}) {
    const cls =
        "text-gray-300 hover:text-white transition-colors underline-offset-4 decoration-transparent hover:decoration-gray-600/60";

    if (href) {
        return (
            <a href={href} className={cls}>
                {children}
            </a>
        );
    }
    return (
        <button type="button" onClick={onClick} className={cls}>
            {children}
        </button>
    );
}

function FooterBottom({ year }: { year: number }) {
    return (
        <div className="mt-10 border-t border-gray-800 pt-6">
            <div className="flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
                <span>© {year} VIVEKA · All rights reserved.</span>
                <span className="inline-flex items-center gap-2">
                    <span>Designed & developed by</span>
                    <SentiaCareLogo />
                </span>
            </div>
        </div>
    );
}

function SentiaCareLogo() {
    return (
        <a
            href={SENTIACARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Sensiacare Website"
            title="Sentiacare"
            className="inline-flex items-center"
        >
            <span className="inline-flex items-center rounded-full bg-white">
                <img
                    src={SENTIACARE_SM_LOGO}
                    alt="Sensiacare Logo"
                    className="h-8 w-auto object-contain"
                    loading="lazy"
                />
            </span>
        </a>
    );
}
