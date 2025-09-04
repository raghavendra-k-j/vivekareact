import { CheckCircle2, XCircle } from "lucide-react";
import * as React from "react";
import { type PasswordOk } from "~/domain/common/models/PasswordOk";


export type PasswordOkViewProps = {
    passwordOk: PasswordOk;
    columns?: number;
    className?: string;
};

export function PasswordOkView({
    passwordOk,
    columns = 2,
    className,
}: PasswordOkViewProps) {
    const items = [
        { key: "uppercase", label: "At least one uppercase", ok: passwordOk.uppercase },
        { key: "lowercase", label: "At least one lowercase", ok: passwordOk.lowercase },
        { key: "number", label: "At least one number", ok: passwordOk.number },
        { key: "symbol", label: "At least one symbol", ok: passwordOk.symbol },
    ];

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "0.375rem",
    };

    return (
        <div className={className} aria-live="polite">
            <ul style={gridStyle}>
                {items.map((it) => (
                    <li key={it.key} className="flex items-center gap-1.5 text-sm">
                        {it.ok ? (
                            <CheckCircle2 width={14} height={14} className="text-emerald-700" aria-hidden />
                        ) : (
                            <XCircle width={14} height={14} className="text-tertiary" aria-hidden />
                        )}
                        <span className={it.ok ? "text-emerald-700" : "text-tertiary"}>{it.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
