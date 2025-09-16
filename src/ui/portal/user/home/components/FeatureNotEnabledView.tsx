export function FeatureNotEnabledView() {
    return (
        <div className="flex flex-col justify-center text-center p-6 py-12">
            <h2 className="text-xl font-semibold mb-2">Feature Not Enabled</h2>
            <p className="text-base text-muted-foreground">This feature is not enabled for your account. Please contact support if you believe this is an error.</p>
        </div>
    );
}