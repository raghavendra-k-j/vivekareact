import React from "react";
import { Mail } from "lucide-react";
import { BaseNamedLogo } from "~/ui/components/logo/BaseLogo";
import { BaseEnv } from "~/core/config/BaseEnv";
import { openTawkToChat } from "~/infra/tawkto/types";
import { AppUrl } from "~/infra/utils/AppUrl";
import { ParentCompanyFooterLogo } from "~/ui/components/logo/SentiaFooterLogo";

export function Footer() {
    const year = new Date().getFullYear();

    const openMail = (subject: string) => {
        const s = encodeURIComponent(subject);
        window.open(`mailto:${BaseEnv.instance.primaryEmail}?subject=${s}`, "_blank");
    };

    return (
        <footer className="text-white bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            <div className="container px-4 py-10">
                <div className="grid items-start gap-10 md:grid-cols-2">
                    <FooterBrand email={BaseEnv.instance.primaryEmail} onEmailClick={() => openMail("General Inquiry")} />
                    <FooterLinks
                        items={[
                            { label: "About Us", href: AppUrl.autoTo({ path: BaseEnv.instance.aboutUsUrl }) },
                            { label: "Terms of Service", href: AppUrl.autoTo({ path: BaseEnv.instance.termsOfServiceUrl }) },
                            { label: "Privacy Policy", href: AppUrl.autoTo({ path: BaseEnv.instance.privacyPolicyUrl }) },
                            { label: "All Products", href: AppUrl.autoTo({ path: "products" }) },
                            { label: "Contact Us", onClick: () => openTawkToChat() },
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
    email?: string;
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
            {email && <FooterEmail email={email} onClick={onEmailClick} />}
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
                <span>© {year} {BaseEnv.instance.productName} · All rights reserved.</span>
                <span className="inline-flex items-center gap-2">
                    <span>Designed & developed by</span>
                    <ParentCompanyFooterLogo />
                </span>
            </div>
        </div>
    );
}