export function FullCenteredView({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`flex items-center justify-center h-full ${className}`}>
            {children}
        </div>
    );
}