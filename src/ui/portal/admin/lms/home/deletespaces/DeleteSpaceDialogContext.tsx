import { createContext, ReactNode, useContext } from "react";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DeleteSpaceDialogStore } from "./DeleteSpaceDialogStore";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";

const DeleteSpaceDialogContext = createContext<DeleteSpaceDialogStore | null>(null);

export interface DeleteSpaceDialogProviderProps {
    item: AdminSpaceItem;
    adminSpacesService: AdminSpacesService;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
    children: ReactNode;
}

export function DeleteSpaceDialogProvider({
    item,
    adminSpacesService,
    layoutStore,
    allSpacesStore,
    children,
}: DeleteSpaceDialogProviderProps) {
    const store = new DeleteSpaceDialogStore({
        item,
        adminSpacesService,
        layoutStore,
        allSpacesStore,
    });

    return (
        <DeleteSpaceDialogContext.Provider value={store}>
            {children}
        </DeleteSpaceDialogContext.Provider>
    );
}

export function useDeleteSpaceDialogStore(): DeleteSpaceDialogStore {
    const ctx = useContext(DeleteSpaceDialogContext);
    if (!ctx) {
        throw new Error("useDeleteSpaceDialogStore must be used within DeleteSpaceDialogProvider");
    }
    return ctx;
}