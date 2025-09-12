import clsx from "clsx";
import React, { useId, useState } from "react";
import { BaseEnv } from "~/core/config/BaseEnv";
import { Button } from "~/ui/widgets/button/Button";
import { MainLayoutContainer } from "../../home/comp/MainLayoutContainer";
import { MainAppBar } from "../../layout/compoents/MainAppBar";

export default function LoginPage() {
    return (
        <MainLayoutContainer header={<MainAppBar showLogin={false} signupLabel="Start Free Trial" />}>
            <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
                <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-default">
                        Log in to your organization
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-secondary">
                        Enter your <strong>organization code</strong> to go to your organization’s login page.
                    </p>
                </header>

                <section className="mt-6">
                    <OrgAccessInput autoFocus />
                </section>

                <section className="mt-8">
                    <ForgotOrgCodeHelp />
                </section>
            </main>
        </MainLayoutContainer>
    );
}

function OrgAccessInput({
    className,
    autoFocus = false,
    onBeforeNavigate,
}: {
    className?: string;
    buttonLabel?: string;
    autoFocus?: boolean;
    onBeforeNavigate?: (payload: { orgCode: string; url: string }) => boolean | void;
}) {
    const [orgCode, setOrgCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const uid = useId();

    const sanitize = (raw: string) => raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

    const handleChange = (v: string) => {
        const next = sanitize(v);
        setOrgCode(next);
        if (error && next) setError(null);
    };

    const navigateToOrg = () => {
        if (!orgCode) {
            setError("Please enter your organization code.");
            return;
        }
        const url = `https://${orgCode}.${BaseEnv.instance.rootDomain}`;
        const shouldContinue = onBeforeNavigate?.({ orgCode, url });
        if (shouldContinue === false) return;
        window.location.href = url;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") navigateToOrg();
    };

    const errId = `${uid}-org-error`;

    return (
        <div className={clsx("flex flex-col gap-3", className)}>
            <label htmlFor={`${uid}-org-input`} className="text-sm font-medium text-default">
                Organization code
            </label>
            <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary-500 h-12 min-h-[48px]">
                <span className="px-3 text-base text-secondary select-none whitespace-nowrap leading-none">https://</span>
                <input
                    id={`${uid}-org-input`}
                    type="text"
                    value={orgCode}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="organization-code"
                    aria-label="Organization code"
                    aria-invalid={!!error}
                    className="flex-1 min-w-0 h-full border-0 bg-transparent px-1 text-base text-default focus:outline-none focus:ring-0 leading-none"
                    autoFocus={autoFocus}
                />
                <span className="px-3 text-base text-secondary select-none whitespace-nowrap leading-none">
                    .{BaseEnv.instance.rootDomain}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    onClick={navigateToOrg}
                >
                    Continue
                </Button>
            </div>

            <div className="text-left">
                {error ? (
                    <p id={errId} aria-live="polite" className="text-sm text-danger mt-1">
                        {error}
                    </p>
                ) : null}
            </div>
        </div>
    );
}

function ForgotOrgCodeHelp() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<"owner" | "member" | null>(null);
    const rgId = useId();

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={`${rgId}-content`}
                className="w-full px-5 py-4 text-left flex items-center justify-between"
            >
                <span className="text-base font-semibold text-default">I forgot my organization code</span>
                <span className="text-sm text-secondary">{open ? "Hide" : "Show"}</span>
            </button>

            {open ? (
                <div id={`${rgId}-content`} className="px-5 pb-5">
                    <div
                        role="radiogroup"
                        aria-labelledby={`${rgId}-label`}
                        className="mt-1 grid gap-2 sm:grid-cols-2"
                    >
                        <RoleCard
                            id={`${rgId}-owner`}
                            title="I’m an organization owner"
                            description="I create and manage the organization."
                            selected={role === "owner"}
                            onSelect={() => setRole("owner")}
                        />
                        <RoleCard
                            id={`${rgId}-member`}
                            title="I’m a member of an organization"
                            description="I was invited to join an existing organization."
                            selected={role === "member"}
                            onSelect={() => setRole("member")}
                        />
                    </div>

                    <div className="mt-4">
                        {role === "owner" ? <OwnerHelp /> : null}
                        {role === "member" ? <MemberHelp /> : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function RoleCard({
    id,
    title,
    description,
    selected,
    onSelect,
}: {
    id: string;
    title: string;
    description: string;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            id={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={onSelect}
            className={clsx(
                "relative w-full text-left rounded-lg border transition focus:outline-none",
                "p-3 sm:p-3.5",
                selected
                    ? "border-primary-600 ring-2 ring-primary-500 bg-primary-50/40"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
        >
            <div className="flex items-start gap-2.5">
                <span
                    aria-hidden="true"
                    className={clsx(
                        "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border",
                        selected ? "border-primary-600" : "border-gray-300"
                    )}
                >
                    <span
                        className={clsx(
                            "h-2.5 w-2.5 rounded-full",
                            selected ? "bg-primary-600" : "bg-transparent border border-gray-300"
                        )}
                    />
                </span>

                <div className="flex-1">
                    <p className="text-sm font-medium leading-5 text-default">{title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-secondary">{description}</p>
                </div>
            </div>
        </button>
    );
}

function OwnerHelp() {
    return (
        <div className="space-y-2 text-sm text-secondary">
            <p>Check the welcome email you received when you created the organization—your organization code is included there.</p>
            <p>Can’t find it? Click <span className="font-medium">Contact</span> in the top menu to reach our support team. After verifying your details, we’ll help you recover your organization code.</p>
        </div>
    );
}

function MemberHelp() {
    return (
        <div className="space-y-2 text-sm text-secondary">
            <p>Ask your organization’s administrator for the organization code. If you received an invitation email, it may include the code or a direct login link.</p>
        </div>
    );
}
