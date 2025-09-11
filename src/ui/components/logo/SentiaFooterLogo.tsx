import clsx from "clsx";
import { BaseEnv } from "~/core/config/BaseEnv";

export function ParentCompanyFooterLogo({ sizeClassName = "h-8 w-auto" }: { sizeClassName?: string }) {
    return (
        <a
            href={BaseEnv.instance.parentCompanyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Sensiacare Website"
            title="Sentiacare"
            className="inline-flex items-center"
        >
            <span className="inline-flex items-center rounded-full bg-white">
                <img
                    src={BaseEnv.instance.parentCompanyLogoUrl}
                    alt={`${BaseEnv.instance.parentCompanyName} Logo`}
                    className={clsx("object-contain", sizeClassName)}
                    loading="lazy"
                />
            </span>
        </a>
    );
}