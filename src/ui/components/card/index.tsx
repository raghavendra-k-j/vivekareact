// ~/ui/components/card.tsx
import * as React from "react";
import clsx from "clsx";
import { cva, type VariantProps } from "class-variance-authority";

/* ---------- Card: solid only, radius + shadow ---------- */
const cardStyles = cva(
  // base (no padding/margins here)
  "bg-content1 text-foreground border border-default",
  {
    variants: {
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow",
        lg: "shadow-md",
      },
    },
    defaultVariants: {
      radius: "md",
      shadow: "sm",
    },
  }
);

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardStyles> & { as?: React.ElementType };

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ as: Comp = "div", className, radius, shadow, ...rest }, ref) => {
    return (
      <Comp
        ref={ref}
        className={clsx(cardStyles({ radius, shadow }), className)}
        {...rest}
      />
    );
  }
);
Card.displayName = "Card";

/* ---------- Sections: no spacing defaults; optional divider ---------- */
const headerStyles = cva("", {
  variants: {
    divider: { true: "border-b border-default", false: "" },
  },
});
type HeaderProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof headerStyles>;

export const CardHeader = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, divider, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(headerStyles({ divider }), className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const bodyStyles = cva("", { variants: {} });
type BodyProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof bodyStyles>;

export const CardBody = React.forwardRef<HTMLDivElement, BodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx(bodyStyles({}), className)} {...props} />
  )
);
CardBody.displayName = "CardBody";

const footerStyles = cva("", {
  variants: { divider: { true: "border-t border-default", false: "" } },
});
type FooterProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof footerStyles>;

export const CardFooter = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, divider, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(footerStyles({ divider }), className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export default Card;
