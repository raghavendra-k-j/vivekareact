import { Card, CardBody } from "~/ui/components/card";

export function InputSourceCard({ children }: { children: React.ReactNode }) {
    return (<Card className="max-w-xl mx-auto w-full" shadow="sm" radius="sm">
        <CardBody className="flex items-center">
            {children}
        </CardBody>
    </Card>);
}