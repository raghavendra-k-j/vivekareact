import { renderLatexToString } from "~/domain/latex/util/renderLatex";

export function renderMath(content: string): string {
  if (!content) return '';

  const displayPatterns = [
    { regex: /\$\$([^$]+?)\$\$/g, display: true },      // $$...$$
    { regex: /\\\[([\s\S]+?)\\\]/g, display: true },     // \[...\]
  ];

  const inlinePatterns = [
    { regex: /\$(.+?)\$/g, display: false },             // $...$
    { regex: /\\\((.+?)\\\)/g, display: false },         // \(...\)
  ];

  let rendered = content;

  // Render display math first to avoid nested inline matching inside
  displayPatterns.forEach(({ regex, display }) => {
    rendered = rendered.replace(regex, (_, tex) => {
      const html = renderLatexToString({
        latex: tex,
        displayMode: display,
      })!;
      return html;
    });
  });

  inlinePatterns.forEach(({ regex, display }) => {
    rendered = rendered.replace(regex, (_, tex) => {
      const html = renderLatexToString({
        latex: tex,
        displayMode: display,
      })!;
      return html;
    });
  });

  return rendered;
}