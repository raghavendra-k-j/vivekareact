import { Trash, Search } from "lucide-react";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { Section } from "./Section";

export function IconButtonDemo() {
    return <Section title="Icon Button" content={<Content />} />;
}

function Content() {
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
    const variants = ["solid", "soft", "outline", "ghost"] as const;
    const colors = ["primary", "danger", "success", "secondary"] as const;
    const states = ["default", "loading", "disabled"] as const;

    return (
        <div className="flex flex-col gap-8">
            {sizes.map((size) => (
                <div key={size} className="flex flex-col gap-3">
                    <div className="font-semibold text-sm text-default">Size: {size}</div>

                    {states.map((state) => (
                        <div key={state} className="flex flex-col gap-1">
                            <div className="text-xs text-muted">State: {state}</div>
                            <div className="flex flex-wrap gap-3">
                                {variants.map((variant) =>
                                    colors.map((color) => {
                                        const icon =
                                            color === "danger" ? (
                                                <Trash size={16} />
                                            ) : (
                                                <Search size={16} />
                                            );

                                        return (
                                            <IconButton
                                                key={`${size}-${variant}-${color}-${state}`}
                                                size={size}
                                                variant={variant}
                                                color={color}
                                                icon={icon}
                                                loading={state === "loading"}
                                                disabled={state === "disabled"}
                                            />
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
