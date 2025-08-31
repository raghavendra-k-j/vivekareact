import { Link } from "react-router";
import { Button } from "~/ui/widgets/button/Button";

type UsageBlockProps = {
    title: string | React.ReactNode;
    description?: string | React.ReactNode;
    headerButton?: React.ReactNode;
    icon: React.ReactNode;
};

export function UsageCard(props: UsageBlockProps) {
    return (
        <div className="border border-default rounded-sm bg-surface break-inside-avoid shadow-sm">
            <div className="flex items-start gap-4 p-4">
                {props.icon}
                <div className="flex flex-row flex-1 justify-between">
                    <div>
                        <div className="text-base font-semibold">{props.title}</div>
                        {props.description && (
                            <div className="text-base text-secondary">
                                {props.description}
                            </div>
                        )}
                    </div>
                    {props.headerButton && props.headerButton}
                </div>
            </div>
        </div>
    );
}

export function UsageCardIcon({
    icon: Icon,
    bgColor,
    iconColor
}: {
    icon: React.ElementType;
    bgColor: string;
    iconColor: string;
}) {
    return (
        <div className={`w-12 h-12 p-3 rounded-sm ${bgColor}`}>
            <Icon className={`w-full h-full ${iconColor}`} />
        </div>
    );
}



export function UsageTopupButton() {
    return (
        <Link to="/billing/topup">
            <Button size="xs" variant="outline" className="ml-4">
                Top up
            </Button>
        </Link>
    );
}