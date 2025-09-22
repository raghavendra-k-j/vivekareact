import { createContext, ReactNode, useContext } from "react";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";

import { RenameSpaceDialogStore } from "./RenameSpaceDialogStore";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";

const RenameSpaceDialogContext = createContext<RenameSpaceDialogStore | null>(null);

export interface RenameSpaceDialogProviderProps {
    item: AdminSpaceItem;
    adminSpacesService: AdminSpacesService;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
    children: ReactNode;
}

export function RenameSpaceDialogProvider({
    item,
    adminSpacesService,
    layoutStore,
    allSpacesStore,
    children,
}: RenameSpaceDialogProviderProps) {
    const store = new RenameSpaceDialogStore({
        item,
        adminSpacesService,
        layoutStore,
        allSpacesStore,
    });

    return (
        <RenameSpaceDialogContext.Provider value={store}>
            {children}
        </RenameSpaceDialogContext.Provider>
    );
}

export function useRenameSpaceDialogStore(): RenameSpaceDialogStore {
    const ctx = useContext(RenameSpaceDialogContext);
    if (!ctx) {
        throw new Error("useRenameSpaceDialogStore must be used within RenameSpaceDialogProvider");
    }
    return ctx;
}