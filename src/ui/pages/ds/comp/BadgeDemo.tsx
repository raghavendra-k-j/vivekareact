import { Badge } from "~/ui/widgets/badges/Badge";
import { Section } from "./Section";

export function BadgeDemo() {
  return <Section title="Badge" content={<Content />} />;
}

function Content() {
  const sizes = ["sm", "md", "lg"] as const; // Assuming your Badge component supports these
  const variants = ["solid", "soft", "outline"] as const;
  const colors = [
    "primary", "secondary", "danger", "success", "info", "warning", "neutral",
    // Extended Tailwind palette
    "slate", "gray", "zinc", "neutralAlt", "stone", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-4">
          <div className="font-semibold text-sm text-default">Size: {size}</div>
          {variants.map((variant) => (
            <div key={variant} className="flex flex-col gap-1">
              <div className="text-xs text-muted">Variant: {variant}</div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <Badge
                    key={`${size}-${variant}-${color}`}
                    size={size}
                    variant={variant}
                    color={color}
                  >
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
