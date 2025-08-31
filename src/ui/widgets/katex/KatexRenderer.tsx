import { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import { renderLatex } from "~/domain/latex/util/renderLatex";

interface KatexRendererProps extends React.HTMLAttributes<HTMLElement> {
    tex: string;
    inline?: boolean;
}

function KatexRenderer({
    tex,
    inline = false,
    ...restProps
}: KatexRendererProps) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = inline ? spanRef.current : divRef.current;
        if (el) {
            renderLatex({
                latex: tex,
                dom: el,
                displayMode: !inline,
            });
        }
    }, [tex, inline]);

    if (inline) {
        return <span ref={spanRef} {...restProps} />;
    } else {
        return <div ref={divRef} {...restProps} />;
    }
}

export default KatexRenderer;
