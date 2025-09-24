
export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export const mediaQueries = {
    isMobile: `(max-width: ${breakpoints.md - 1}px)`,
    isTablet: `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
    isDesktop: `(min-width: ${breakpoints.lg}px)`,
};
