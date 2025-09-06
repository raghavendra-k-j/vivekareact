import clsx from "clsx";
import { Home } from "lucide-react";
import { AppUrl } from "~/infra/utils/AppUrl";
import { Button } from "~/ui/widgets/button/Button";

export function NotFoundView({ className }: { className?: string }) {
    return (<div className={clsx("flex flex-col items-center text-center w-full max-w-xl", className)}>
        <h1 className="text-2xl font-bold text-default">
            Page Not Found
        </h1>
        <p className="mt-4 text-lg text-secondary">
            The page you’re looking for doesn’t exist, may have been moved,
            or the link you followed might be broken.
            You can return to the homepage to continue browsing.
        </p>
        <div className="mt-8">
            <a href={AppUrl.getBaseUrl()}>
                <Button>
                    <Home className="mr-1 h-4 w-4" />
                    Go Home
                </Button>
            </a>
        </div>
    </div>);
}