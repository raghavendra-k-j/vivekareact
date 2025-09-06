import { MainAppBar } from "~/ui/pages/main/layout/compoents/MainAppBar";
import { Footer } from "../../layout/compoents/MainFooter";

export function MainLayoutContainer({ children, header = true, footer = true }: { children: React.ReactNode, header?: React.ReactNode | false | true, footer?: React.ReactNode | false | true }) {
    return (
        <div className="h-full overflow-y-auto scroll-smooth" data-scroll-root>
            {header === false ? null : (header === true ? <MainAppBar /> : header)}
            {children}
            {footer === false ? null : (footer === true ? <Footer /> : footer)}
        </div>
    );
}