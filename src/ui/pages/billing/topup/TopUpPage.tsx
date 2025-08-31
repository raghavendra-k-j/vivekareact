import { TopUpPageProvider } from "./TopUpPageProvider";

export default function PaymentsPage() {
    return (
        <TopUpPageProvider>
            <TopUpPageInner />
        </TopUpPageProvider>
    );
}

function TopUpPageInner() {
    return <div>TopUp Page Inner</div>;
}
