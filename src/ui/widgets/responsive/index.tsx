// src/ui/widgets/responsive/index.tsx
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { mediaQueries } from "~/ui/utils/breakpoints";
import { Slot } from "@radix-ui/react-slot";

type ResponsiveViewProps = {
    mobile?: ReactNode;
    tablet?: ReactNode;
    desktop?: ReactNode;
    children?: ReactNode;
    asChild?: boolean;
};

export default function ResponsiveView({
    mobile,
    tablet,
    desktop,
    children,
    asChild,
}: ResponsiveViewProps) {
    const isMobile = useMediaQuery({ query: mediaQueries.isMobile });
    const isTablet = useMediaQuery({ query: mediaQueries.isTablet });
    const isDesktop = useMediaQuery({ query: mediaQueries.isDesktop });
    const specific = isMobile ? mobile : isTablet ? tablet : isDesktop ? desktop : undefined;
    const content = specific ?? mobile ?? children ?? null;
    if (content === null) return null;
    return asChild ? <Slot>{content}</Slot> : <>{content}</>;
}