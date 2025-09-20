
export function HomeGridContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="container p-4 sm:py-6 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {children}
        </div>
    );
}