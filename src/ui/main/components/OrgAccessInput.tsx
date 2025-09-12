import clsx from "clsx";
import { useId, useState } from "react";
import { BaseEnv } from "~/core/config/BaseEnv";
import { Button } from "~/ui/widgets/button/Button";

export function OrgAccessInput({
    className,
    buttonLabel = "Continue",
    autoFocus = false,
    showHelpText = false,
    helpText = "If you don’t know your organization code, please contact your organization administrator.",
    onBeforeNavigate,
}: {
    className?: string;
    buttonLabel?: string;
    autoFocus?: boolean;
    showHelpText?: boolean;
    helpText?: string;
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

    const helpId = `${uid}-org-help`;
    const errId = `${uid}-org-error`;

    return (
        <div className={clsx("flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4", className)}>
            <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary-500 h-12 min-h-[48px]">
                <span className="px-3 text-base text-gray-500 select-none whitespace-nowrap leading-none">https://</span>
                <input
                    type="text"
                    value={orgCode}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="organization code"
                    aria-label="Organization code"
                    aria-invalid={!!error}
                    aria-describedby={clsx(showHelpText && helpId, error && errId) || undefined}
                    className="flex-1 min-w-0 h-full border-0 bg-transparent px-1 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 leading-none"
                    autoFocus={autoFocus}
                />
                <span className="px-3 text-base text-gray-500 select-none whitespace-nowrap leading-none">
                    .{BaseEnv.instance.rootDomain}
                </span>
            </div>

            <div className="flex sm:flex-none">
                <Button className="h-12 min-h-[48px] w-full sm:w-auto rounded-lg px-6 text-base" onClick={navigateToOrg}>
                    {buttonLabel}
                </Button>
            </div>

            <div className="sm:col-span-2 text-left">
                {showHelpText ? (
                    <p id={helpId} className="text-sm text-gray-600">
                        {helpText}
                    </p>
                ) : null}
                {error ? (
                    <p id={errId} aria-live="polite" className="text-sm text-pink-600 mt-1">
                        {error}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
