import clsx from "clsx";
import { BaseEnv } from "~/core/config/BaseEnv";
import { ParentCompanyFooterLogo } from "~/ui/components/logo/SentiaFooterLogo";

export function AppBrandingFooter({ className }: { className?: string }) {
    const year = new Date().getFullYear();
    return (
        <footer className={clsx("bg-white/50 py-1 border-t border-gray-100 text-default", className)}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col-reverse gap-2 text-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col items-center md:items-start w-full md:w-auto">
                        <span className="text-center md:text-left">© {year} {BaseEnv.instance.productName} · All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-end w-full md:w-auto">
                        <span>Designed & developed by</span>
                        <ParentCompanyFooterLogo />
                    </div>
                </div>
            </div>
        </footer>
    );
}