import { createContext, useContext, ReactNode } from "react";
import { UsersSelectDialogStore } from "./UsersSelectDialogStore";

const UsersSelectDialogContext = createContext<UsersSelectDialogStore | null>(null);

export function useUsersSelectDialogStore(): UsersSelectDialogStore {
	const context = useContext(UsersSelectDialogContext);
	if (!context) {
		throw new Error("useUsersSelectDialogStore must be used within UsersSelectDialogProvider");
	}
	return context;
}

export function UsersSelectDialogProvider({ children, store }: { children: ReactNode; store: UsersSelectDialogStore; }) {
	return (
		<UsersSelectDialogContext.Provider value={store}>{children}</UsersSelectDialogContext.Provider>
	);
}

export default UsersSelectDialogProvider;
