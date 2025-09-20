import { Bell } from "lucide-react";
import AppBarIconButton from "~/ui/portal/components/appbar/AppBarIconButton";

export function NotificationBell() {
    return (
        <AppBarIconButton
            sizeClass="w-9 h-9"
            icon={<Bell size={20} />}
        />
    );
}