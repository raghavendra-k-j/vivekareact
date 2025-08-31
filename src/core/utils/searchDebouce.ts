import { debounce } from "lodash";
import { SearchConst } from "~/domain/common/models/SearchConst";

export type SearchDebounceParams = {
    delay?: number;
};

export function createSearchDebounce<T extends (...args: any[]) => void>(
    callback: T,
    options: SearchDebounceParams = {}
): {
    invoke: (...args: Parameters<T>) => void;
    cancel: () => void;
} {
    const { delay = SearchConst.debounceDelay } = options;
    const debounced = debounce(callback, delay);
    return {
        invoke: (...args: Parameters<T>) => debounced(...args),
        cancel: () => debounced.cancel(),
    };
}
