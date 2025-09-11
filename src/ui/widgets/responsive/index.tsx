// src/ui/widgets/responsive/index.tsx
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import { mediaQueries } from "~/ui/utils/breakpoints";
import { Slot } from "@radix-ui/react-slot";

type ResponsiveViewProps = {
    mobile?: ReactNode;
    desktop?: ReactNode;
    children?: ReactNode;
    asChild?: boolean;
};

export default function ResponsiveView({
    mobile,
    desktop,
    children,
    asChild,
}: ResponsiveViewProps) {
    const isMobile = useMediaQuery({ query: mediaQueries.isMobile });
    const isDesktop = useMediaQuery({ query: mediaQueries.isDesktop });
    const specific = isMobile ? mobile : isDesktop ? desktop : undefined;
    const content = specific ?? children ?? null;
    if (content === null) return null;
    return asChild ? <Slot>{content}</Slot> : <>{content}</>;
}