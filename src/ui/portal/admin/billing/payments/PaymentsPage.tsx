import { useState } from "react";
import { Observer } from "mobx-react-lite";
import { usePaymentsPageStore } from "./PaymentsPageContext";
import { PaymentsPageProvider } from "./PaymentsPageProvider";

// Main Component
export default function PaymentsPage() {
    return (
        <PaymentsPageProvider>
            <PaymentsPageInner />
        </PaymentsPageProvider>
    );
}

function PaymentsPageInner() {
    const [invoiceOrderId, setInvoiceOrderId] = useState<string | null>(null);
    const store = usePaymentsPageStore();


    return (
        <div className="p-4">
            <Observer>
                {() => {
                    if (!store.ordersState.isData) return <div>No orders found</div>;

                    const selectedOrder = store.ordersRes.items.find(o => o.id.toString() === invoiceOrderId) || null;

                    if (invoiceOrderId && selectedOrder) {
                        return <InvoiceView order={selectedOrder} onBack={() => setInvoiceOrderId(null)} />;
                    }
                    return <MyOrdersList onInvoiceClick={setInvoiceOrderId} />;
                }}
            </Observer>
        </div>
    );
}

// Table Header Cell
function TableTh({ children, className = "", ...rest }: React.HTMLAttributes<HTMLTableCellElement>) {
    return (
        <th className={`px-4 py-2 border-b border-default text-left text-sm bg-gray-100 ${className}`} {...rest}>
            {children}
        </th>
    );
}

// Table Data Cell
function TableTd({ children, className = "", ...rest }: React.HTMLAttributes<HTMLTableCellElement>) {
    return (
        <td className={`px-4 py-2 border-b border-default text-sm ${className}`} {...rest}>
            {children}
        </td>
    );
}

// Badge for Order Status
function StatusBadge({ status }: { status: { label: string; value: string } }) {
    const statusColors: Record<string, string> = {
        initiated: "bg-yellow-500",
        created: "bg-gray-500",
        paid: "bg-green-600",
        refunded: "bg-blue-600",
        cancelled: "bg-orange-600",
        failed: "bg-red-600",
    };

    const colorClass = statusColors[status.value.toLowerCase()] ?? "bg-gray-400";
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white ${colorClass}`}>
            {status.label}
        </span>
    );
}

// Order List Table
function MyOrdersList({ onInvoiceClick }: { onInvoiceClick: (id: string) => void }) {
    const store = usePaymentsPageStore();
    const orders = store.ordersRes.items;

    if (!orders || orders.length === 0) {
        return <div className="text-center p-8 text-gray-500">No orders found.</div>;
    }

    return (
        <div className="overflow-x-auto w-full bg-white shadow-sm border border-default rounded">
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <TableTh className="w-[50px]">#</TableTh>
                        <TableTh>Type</TableTh>
                        <TableTh>Status</TableTh>
                        <TableTh className="text-right">Amount</TableTh>
                        <TableTh>Currency</TableTh>
                        <TableTh className="text-center">Actions</TableTh>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, idx) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <TableTd>{idx + 1}</TableTd>
                            <TableTd>{order.type.label}</TableTd>
                            <TableTd><StatusBadge status={order.status} /></TableTd>
                            <TableTd className="text-right">{order.amount.toFixed(2)}</TableTd>
                            <TableTd>{order.currencyCode}</TableTd>
                            <TableTd className="text-center">
                                {order.status.value === "paid" && (
                                    <button
                                        onClick={() => onInvoiceClick(order.id.toString())}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Download Invoice
                                    </button>
                                )}
                            </TableTd>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Dummy Invoice View
function InvoiceView({ order, onBack }: { order: any; onBack: () => void }) {
    const handlePrint = () => window.print();

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 shadow-md border rounded print:border-0 print:shadow-none">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Invoice</h1>
                <div className="space-x-2">
                    <button
                        onClick={onBack}
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 print:hidden"
                    >
                        Back to List
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden"
                    >
                        Print Invoice
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-medium">Billing Address</h2>
                <p className="text-sm text-gray-700 mt-1">
                    Raghavendra K J<br />
                    123 Main Street<br />
                    Bengaluru, Karnataka<br />
                    India - 560001
                </p>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-medium">Product Details</h2>
                <table className="w-full text-sm border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Item</th>
                            <th className="p-2 border">Quantity</th>
                            <th className="p-2 border">Unit Price</th>
                            <th className="p-2 border">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2 border">Online Course Access</td>
                            <td className="p-2 border">1</td>
                            <td className="p-2 border">{(order.amount * 0.9).toFixed(2)}</td>
                            <td className="p-2 border">{(order.amount * 0.9).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-medium">Tax & Total</h2>
                <div className="text-sm text-gray-800 space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{(order.amount * 0.9).toFixed(2)} {order.currencyCode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>GST (10%):</span>
                        <span>{(order.amount * 0.1).toFixed(2)} {order.currencyCode}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{order.amount.toFixed(2)} {order.currencyCode}</span>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-6 print:mt-12">
                Thank you for your purchase!
            </div>
        </div>
    );
}
