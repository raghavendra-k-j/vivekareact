import { useState } from "react";
import { EasySelect } from "./EasySelect";
import { Button } from "../button/Button";

// Sample data types
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface Product {
    id: string;
    title: string;
    category: string;
    price: number;
}

// Sample data
const sampleUsers: User[] = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User" }, 
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
    { id: "4", name: "Alice Wilson", email: "alice@example.com", role: "User" },
    { id: "5", name: "Charlie Brown", email: "charlie@example.com", role: "Admin" },
];

const sampleProducts: Product[] = [
    { id: "p1", title: "Laptop", category: "Electronics", price: 999 },
    { id: "p2", title: "Phone", category: "Electronics", price: 599 },
    { id: "p3", title: "Book", category: "Education", price: 29 },
    { id: "p4", title: "Headphones", category: "Electronics", price: 199 },
    { id: "p5", title: "Desk Chair", category: "Furniture", price: 299 },
];

export function EasySelectDemo() {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product[]>([]);

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-2xl font-bold">EasySelect Component Demo</h2>
            
            {/* Single Select Example */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Single Select - Products</h3>
                <div className="flex items-center gap-4">
                    <EasySelect<Product>
                        items={sampleProducts}
                        getItemId={(product) => product.id}
                        getItemLabel={(product) => (
                            <div className="flex flex-col">
                                <span className="font-medium">{product.title}</span>
                                <span className="text-xs text-tertiary">
                                    {product.category} - ${product.price}
                                </span>
                            </div>
                        )}
                        onResult={(selected) => setSelectedProduct(selected)}
                        isMultiSelect={false}
                        trigger={
                            <Button variant="outline" color="secondary">
                                Select Product ({selectedProduct.length})
                            </Button>
                        }
                        searchPlaceholder="Search products..."
                    />
                    
                    {selectedProduct.length > 0 && (
                        <div className="text-sm text-secondary">
                            Selected: {selectedProduct[0].title}
                        </div>
                    )}
                </div>
            </div>

            {/* Multi Select Example */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Multi Select - Users</h3>
                <div className="flex items-center gap-4">
                    <EasySelect<User>
                        items={sampleUsers}
                        getItemId={(user) => user.id}
                        getItemLabel={(user) => (
                            <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-tertiary">
                                    {user.email} • {user.role}
                                </span>
                            </div>
                        )}
                        onResult={(selected) => setSelectedUsers(selected)}
                        isMultiSelect={true}
                        trigger={
                            <Button variant="outline" color="primary">
                                Select Users ({selectedUsers.length})
                            </Button>
                        }
                        searchPlaceholder="Search users..."
                        popoverProps={{
                            side: "bottom",
                            align: "start",
                            matchTriggerWidth: false
                        }}
                    />
                    
                    {selectedUsers.length > 0 && (
                        <div className="text-sm text-secondary">
                            Selected: {selectedUsers.map(u => u.name).join(", ")}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Trigger Examples */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Custom Triggers</h3>
                
                <div className="flex gap-4">
                    {/* Button trigger */}
                    <EasySelect<User>
                        items={sampleUsers}
                        getItemId={(user) => user.id}
                        getItemLabel={(user) => user.name}
                        onResult={(selected) => console.log("Button trigger selected:", selected)}
                        trigger={
                            <Button size="sm" variant="solid" color="success">
                                Choose User
                            </Button>
                        }
                    />

                    {/* Custom div trigger */}
                    <EasySelect<Product>
                        items={sampleProducts}
                        getItemId={(product) => product.id}
                        getItemLabel={(product) => product.title}
                        onResult={(selected) => console.log("Div trigger selected:", selected)}
                        trigger={
                            <div className="px-4 py-2 border border-default rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                Custom Trigger
                            </div>
                        }
                    />
                </div>
            </div>

            {/* Pre-selected Items Example */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pre-selected Items</h3>
                <EasySelect<User>
                    items={sampleUsers}
                    getItemId={(user) => user.id}
                    getItemLabel={(user) => user.name}
                    onResult={(selected) => console.log("Pre-selected result:", selected)}
                    isMultiSelect={true}
                    initialSelection={new Set(["1", "3"])} // Pre-select John and Bob
                    trigger={
                        <Button variant="outline">
                            Users (Pre-selected: John & Bob)
                        </Button>
                    }
                />
            </div>
        </div>
    );
}