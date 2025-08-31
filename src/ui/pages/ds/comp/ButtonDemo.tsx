import { Button } from "~/ui/widgets/button/Button";
import { Section } from "./Section";

export function ButtonDemo() {
  return <Section title="Button" content={<Content />} />;
}

function Content() {
  const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
  const variants = ["solid", "soft", "outline", "ghost"] as const;
  const colors = ["primary", "danger", "success", "secondary", "info"] as const;
  const states = ["default", "loading", "disabled"] as const;

  return (
    <div className="flex flex-col gap-8">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-4">
          <div className="font-semibold text-sm text-default">Size: {size}</div>

          {states.map((state) => (
            <div key={state} className="flex flex-col gap-1">
              <div className="text-xs text-muted">State: {state}</div>
              <div className="flex flex-wrap gap-3">
                {variants.map((variant) =>
                  colors.map((color) => (
                    <Button
                      key={`${size}-${variant}-${color}-${state}`}
                      size={size}
                      variant={variant}
                      color={color}
                      loading={state === "loading"}
                      disabled={state === "disabled"}
                    >
                      Save
                    </Button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
