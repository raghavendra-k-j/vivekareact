import { useRef } from "react";
import { EditTranslationContext } from "./EditTranslationContext";
import { EditTranslationStore } from "./EditTranslationStore";
import { useAdminFormStore } from "../layout/AdminFormContext";
import { useParams } from "react-router";
import { useAppStore } from "~/ui/pages/_layout/AppContext";

export type EditTranslationProviderProps = {
    children: React.ReactNode;
}

export function EditTranslationProvider(props: EditTranslationProviderProps) {
    const urlParams = useParams();
    const appStore = useAppStore();
    const languageId = urlParams.languageId || "";

    const adminFormStore = useAdminFormStore();
    const storeRef = useRef<EditTranslationStore>(null);
    if (!storeRef.current) {
        storeRef.current = new EditTranslationStore({
            adminFormStore: adminFormStore,
            languageId: languageId,
            appStore: appStore,
        });
    }

    return (
        <EditTranslationContext.Provider value={storeRef.current!}>
            {props.children}
        </EditTranslationContext.Provider>
    );
}