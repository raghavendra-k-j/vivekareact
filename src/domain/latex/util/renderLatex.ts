import katex from "katex";
import { macros } from "../const/macros";

export type RenderLatexOptions = {
    latex: string;
    dom: HTMLElement;
    displayMode?: boolean;
}

export function renderLatex(options: RenderLatexOptions) {
    const { latex, dom, displayMode = false } = options;
    try {
        katex.render(latex, dom, {
            throwOnError: true,
            displayMode: displayMode,
            macros: macros,
        });
    }
    catch (e) {
        dom.textContent = `${latex}`;
        console.error("Katex rendering error:", e);
    }
}


type RenderLatexToStringOptions = {
    latex: string;
    displayMode?: boolean;
    autoFallback?: boolean; // If true, will return the latex string if rendering fails
}


export function renderLatexToString(options: RenderLatexToStringOptions) {
    const { latex, displayMode = false, autoFallback = true } = options;
    try {
        return katex.renderToString(latex, {
            throwOnError: true,
            displayMode: displayMode,
            macros: macros,
            output: 'html',
        });
    }
    catch (e) {
        console.error("Katex rendering error:", e);
        if (autoFallback) {
            return latex;
        }
        return null;
    }
}
