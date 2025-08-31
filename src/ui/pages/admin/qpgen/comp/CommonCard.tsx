

export function CommonCenterCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full p-6 flex-1 flex items-center justify-center bg-surface rounded-sm shadow-sm border border-default">
            {children}
        </div>
    );
}