import { useRef } from "react";
import { QMediaPickerStore } from "./QMediaPickerStore";
import { QMediaPickerContext } from "./QMediaPickerContext";
import { QMediaTile } from "~/domain/forms/models/qmedia/QMediaTile";
import { useDialogManager } from "~/ui/widgets/dialogmanager";
import { AppStore } from "~/ui/portal/layout/app/AppStore";

export type QMediaPickerProviderProps = {
    children: React.ReactNode;
    appStore: AppStore;
    onClose: () => void;
    onSelect: (items: QMediaTile) => void;
}

export function QMediaPickerProvider(props: QMediaPickerProviderProps) {
    const storeRef = useRef<QMediaPickerStore | null>(null);
    const dialogManager = useDialogManager();
    if (!storeRef.current) {
        storeRef.current = new QMediaPickerStore({
            onClose: props.onClose,
            onSelect: props.onSelect,
            appStore: props.appStore,
            dialogManage: dialogManager,
        });
    }
    const store = storeRef.current;
    return (<QMediaPickerContext.Provider value={store}>
        {props.children}
    </QMediaPickerContext.Provider>);
}