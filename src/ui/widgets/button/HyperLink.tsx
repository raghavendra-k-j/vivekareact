import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import * as React from "react";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type HyperLinkProps = {
  /** Render child element as the clickable surface */
  asChild?: boolean;
  /** Force underline + primary color (default true) */
  emphasize?: boolean;
  className?: string;
} & (AnchorProps | ButtonProps);

/**
 * HyperLink
 * - Primary-colored, underline-styled link you can use everywhere.
 * - Supports Radix `asChild` to slot any child component (e.g., router Link).
 * - Renders <a> when `href` is provided, else <button>.
 */
export const HyperLink = React.forwardRef<
  HTMLAnchorElement & HTMLButtonElement,
  HyperLinkProps
>(function HyperLink(
  { asChild, emphasize = true, className, children, ...props },
  ref
) {
  const baseClasses = clsx(
    emphasize && "text-primary underline",
    "text-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-sm",
    "disabled:opacity-50 disabled:pointer-events-none",
    className
  );

  if (asChild) {
    // Use Radix Slot to pass styles/handlers to the child element
    return (
      <Slot ref={ref as any} className={baseClasses} {...(props as any)}>
        {children}
      </Slot>
    );
  }

  // If an href exists, render an anchor; otherwise, fallback to a button
  const hasHref = Object.prototype.hasOwnProperty.call(props, "href");
  if (hasHref) {
    const anchorProps = props as AnchorProps;
    return (
      <a ref={ref as any} className={baseClasses} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonProps;
  return (
    <button type="button" ref={ref as any} className={baseClasses} {...buttonProps}>
      {children}
    </button>
  );
});
