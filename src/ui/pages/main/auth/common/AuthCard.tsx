import clsx from "clsx";
import { AppError } from "~/core/error/AppError";
import Card, { CardBody, CardFooter, CardHeader } from "~/ui/components/card";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";

export function AuthCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-lg mx-auto" radius="lg" shadow="lg" >
                {children}
            </Card>
        </div>
    );
}


export function AuthHeader({ title, subtitle }: { title: string | React.ReactNode, subtitle?: string | React.ReactNode }) {
    return (
        <CardHeader>
            <div className="p-6">
                <h2 className="text-xl font-bold">{title}</h2>
                {subtitle && <p className="text-secondary">{subtitle}</p>}
            </div>
        </CardHeader>
    );
}

export function AuthFooter({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <CardFooter className={clsx("px-6 py-6 border-t border-default", className)}>
            {children}
        </CardFooter>
    );
}

export function AuthFormContainer({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <CardBody className={`px-6 w-full pb-6 ${className}`}>
            {children}
        </CardBody>
    );
}


export function AuthLoader({ message }: { message?: string }) {
    return (
        <AuthCard>
            <CardBody className="p-6 flex justify-center">
                <LoaderView />
                {message && <p className="ml-2 text-default">{message}</p>}
            </CardBody>
        </AuthCard>
    );
}


export function AuthError({ error, onClickRetry }: { error: AppError, onClickRetry: () => void }) {
    return (
        <AuthCard>
            <CardBody className="p-6 flex justify-center">
                <SimpleRetryableAppView appError={error} onRetry={onClickRetry} />
            </CardBody>
        </AuthCard>
    );
}