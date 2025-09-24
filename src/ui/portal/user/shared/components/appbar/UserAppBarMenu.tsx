import clsx from "clsx";
import { Menu } from "lucide-react";

export function UserAppBarMenu({ className }: { className?: string } = {}) {
    return (<button className={clsx("p-2 rounded hover:bg-gray-200", className)}>
        <Menu className="w-5 h-5" />
    </button>);
}