/**
 * Basic usage example of EasySelect component
 * This file demonstrates the core functionality
 */

import { EasySelect } from "./index";
import { Button } from "../button/Button";

// Example data types
interface User {
    id: string;
    name: string;
    email: string;
}

// Sample data
const users: User[] = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com" },
    { id: "2", name: "Bob Smith", email: "bob@example.com" },
    { id: "3", name: "Carol Williams", email: "carol@example.com" },
];

// Basic single select usage
export function SingleSelectExample() {
    return (
        <EasySelect<User>
            items={users}
            getItemId={(user) => user.id}
            getItemLabel={(user) => user.name}
            onResult={(selectedUsers) => {
                console.log("Selected:", selectedUsers);
            }}
            trigger={<Button>Select User</Button>}
        />
    );
}

// Multi select with rich content
export function MultiSelectExample() {
    return (
        <EasySelect<User>
            items={users}
            getItemId={(user) => user.id}
            getItemLabel={(user) => (
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                </div>
            )}
            onResult={(selectedUsers) => {
                console.log("Selected users:", selectedUsers.map(u => u.name));
            }}
            isMultiSelect={true}
            searchPlaceholder="Search users..."
            trigger={<Button variant="outline">Select Multiple Users</Button>}
        />
    );
}

// Usage with pre-selected items
export function PreSelectedExample() {
    return (
        <EasySelect<User>
            items={users}
            getItemId={(user) => user.id}
            getItemLabel={(user) => user.name}
            onResult={(selectedUsers) => {
                console.log("Updated selection:", selectedUsers);
            }}
            isMultiSelect={true}
            initialSelection={new Set(["1", "3"])} // Pre-select Alice and Carol
            trigger={<Button color="success">Users (Pre-selected)</Button>}
        />
    );
}