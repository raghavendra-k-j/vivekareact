import { useMatch, useResolvedPath } from "react-router";

export function useIsLinkActive(to: string, exact: boolean = false): boolean {
    const resolved = useResolvedPath(to);
    const match = useMatch({ path: resolved.pathname, end: exact });
    return !!match;
}