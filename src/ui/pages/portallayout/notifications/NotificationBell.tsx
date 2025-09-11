import { Bell } from "lucide-react";
import AppBarIconButton from "../appbar/AppBarIconButton";


export function NotificationBell() {
    return (<AppBarIconButton sizeClass="w-9 h-9" icon={<Bell size={20} />} badgeText="99+" />);
}