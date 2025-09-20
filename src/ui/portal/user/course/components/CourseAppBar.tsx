import clsx from "clsx";
import { PortalAppBarLogo } from "~/ui/portal/components/appbar/PortalAppBarLogo";
import styles from "./CourseAppBar.module.css";

export function CourseAppBar() {
    return (
        <header className={clsx(styles.courseAppBar)}>
            <div className="mx-auto container flex flex-row items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
                {/* Only Organization Branding Logo */}
                <div className="flex flex-row items-center gap-2">
                    <PortalAppBarLogo />
                </div>
                
                {/* Right side can be used for user actions later */}
                <div className="flex flex-row items-center gap-4">
                    {/* Future: notifications, user avatar, etc. */}
                </div>
            </div>
        </header>
    );
}