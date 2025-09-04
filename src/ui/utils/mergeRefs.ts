export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
    return (node: T) => {
        for (const ref of refs) {
            if (!ref) continue;
            if (typeof ref === "function") ref(node);
            else (ref as React.RefObject<T | null>).current = node as any;
        }
    };
}