import clsx from "clsx";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";

/* 

    const themeVariables: Record<string, string> = {
        "--color-primary-50": cp(ColorStop._50),
        "--color-primary-100": cp(ColorStop._100),
        "--color-primary-200": cp(ColorStop._200),
        "--color-primary-300": cp(ColorStop._300),
        "--color-primary-400": cp(ColorStop._400),
        "--color-primary-500": cp(ColorStop._500),
        "--color-primary-600": cp(ColorStop._600),
        "--color-primary-700": cp(ColorStop._700),
        "--color-primary-800": cp(ColorStop._800),
        "--color-primary-900": cp(ColorStop._900),
        "--color-primary-950": cp(ColorStop._950),
        "--color-primary": cp(ColorStop.DEFAULT),

        "--color-on-primary-strong": orgTheme.primary.text.strong,
        "--color-on-primary-default": orgTheme.primary.text.default,
        "--color-on-primary-secondary": orgTheme.primary.text.secondary,
        "--color-on-primary-tertiary": orgTheme.primary.text.tertiary,

        "--bc-bg": orgTheme.bc.bg,
        "--bc-text-strong": orgTheme.bc.text.strong,
        "--bc-text-default": orgTheme.bc.text.default,
        "--bc-text-secondary": orgTheme.bc.text.secondary,
        "--bc-text-tertiary": orgTheme.bc.text.tertiary,

        "--bc-icon-bg": orgTheme.bc.iconBg,
        "--bc-icon-bg-hover": orgTheme.bc.iconBgHover,
        "--bc-icon-fg": orgTheme.bc.iconFg,
        "--bc-icon-fg-hover": orgTheme.bc.iconFgHover,

        "--bc-tab-bg": orgTheme.bc.tabBg,
        "--bc-tab-bg-hover": orgTheme.bc.tabBgHover,
        "--bc-tab-fg": orgTheme.bc.tabFg,
        "--bc-tab-fg-hover": orgTheme.bc.tabFgHover,
        "--bc-tab-active-bg": orgTheme.bc.tabActiveBg,
        "--bc-tab-active-fg": orgTheme.bc.tabActiveFg,
        "--bc-tab-active-border": orgTheme.bc.tabActiveBorder,
    };
*/

export function UserBaseAppBar({
    children,
    className
}: {
    children: React.ReactNode,
    className?: string
}) {
    return (<div
        className={clsx("shadow-sm bg-[var(--bc-bg)] text-[var(--bc-text-default)] z-appbar", className)}
    >
        {children}
    </div>);
}