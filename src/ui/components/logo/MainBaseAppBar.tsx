import clsx from "clsx";
import { BaseNamedLogo } from "./BaseLogo";

export function MainBaseAppBar({ nav, className }: { nav?: React.ReactNode, className?: string }) {
    return (
        <div className="bg-white/70 backdrop-blur-md shadow-sm min-h-[56px] border-b border-default flex items-center sticky top-0 z-50">
            <div className={clsx("container flex flex-row items-center gap-4 px-4 py-2 w-full mx-auto", className)}>
                <BrandingPart />
                {nav}
            </div>
        </div>
    );
}

function BrandingPart() {
    return (
        <div className="flex flex-row items-center gap-2 select-none me-8">
            <BaseNamedLogo iconSize={40} textSize={22} />
        </div>
    );
}
