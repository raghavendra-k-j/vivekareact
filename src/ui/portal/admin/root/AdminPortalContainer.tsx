import AdminSidebar from "./AdminSidebar";

export function AdminPortalContainer({ children }: { children: React.ReactNode }) {
    return (<div>
        <div className="flex flex-row">
            <AdminSidebar />
            {children}
        </div>
    </div>);
}