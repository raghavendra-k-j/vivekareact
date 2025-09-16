import { useEffect, useState } from "react";

export function useScrollShadows(ref: React.RefObject<HTMLElement>) {
  const [state, setState] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const left = scrollLeft > 0;
      const right = scrollLeft + clientWidth < scrollWidth - 1;
      setState({ left, right });
    };
    update();

    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true, subtree: true });

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      mo.disconnect();
    };
  }, [ref]);

  return state;
}
