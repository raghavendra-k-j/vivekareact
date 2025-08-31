export function createDebounce<T extends (...args: any[]) => void>(
    callback: T,
    delay = 300
): {
    invoke: (...args: Parameters<T>) => void;
    cancel: () => void;
} {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const invoke = (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    const cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return { invoke, cancel };
}
