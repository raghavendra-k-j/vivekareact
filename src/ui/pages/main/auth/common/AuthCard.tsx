import Card, { CardBody, CardFooter } from "~/ui/components/card";

export function AuthCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto my-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-lg mx-auto" radius="lg" shadow="lg" >
                {children}
            </Card>
        </div>
    );
}


export function AuthHeader({ title, subtitle }: { title: string | React.ReactNode, subtitle?: string | React.ReactNode }) {
    return (
        <div className="px-4 sm:px-6 py-4 sm:py-6">
            <h2 className="text-xl font-bold">{title}</h2>
            {subtitle && <p className="text-secondary">{subtitle}</p>}
        </div>
    );
}

export function AuthFormContainer({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <CardBody className={`px-4 sm:px-6 w-full pb-4 sm:pb-6 ${className}`}>
            {children}
        </CardBody>
    );
}


export function AuthCardFooter({ children }: { children: React.ReactNode }) {
    return (
        <CardFooter className="flex justify-between">
            {children}
        </CardFooter>
    );
}