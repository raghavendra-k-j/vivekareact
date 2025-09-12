export function ProductsHero() {
    return (
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-50 to-primary-50" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-r from-primary-400/20 via-primary-500/20 to-primary-400/20 blur-3xl" />
            <div className="relative container px-4 py-12">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-default leading-snug">
                        Streamline your business with{" "}
                        <span className="text-primary-600">Viveka</span>’s{" "}
                        <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                            AI products
                        </span>
                    </h1>
                </div>
            </div>
        </section>
    );
}
