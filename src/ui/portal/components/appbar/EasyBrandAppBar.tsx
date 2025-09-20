import { ReactNode } from "react";
import { BrandAppBarContainer } from "./BrandAppBarContainer";

type EasyBrandAppBarProps = {
    leading?: ReactNode;
    trailing?: ReactNode;
};

export function EasyBrandAppBar({ leading, trailing }: EasyBrandAppBarProps) {
    return (
        <BrandAppBarContainer
            className={"flex flex-row items-center justify-between shadow-sm min-h-[48px] px-3 py-2 z-10"} >
            <div className="flex-1">{leading}</div>
            {trailing && <div className="flex-none">{trailing}</div>}
        </BrandAppBarContainer>
    );
}
