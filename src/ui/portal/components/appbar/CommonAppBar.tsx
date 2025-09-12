export function CommonAppBarContainer({ children }: { children: React.ReactNode }) {
    return (<div className="w-full h-14 bg-surface border-b border-default shadow-sm">
        {children}
    </div>);
}