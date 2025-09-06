import { showSuccessToast } from "~/ui/widgets/toast/toast";

declare global {
    interface Window {
        Tawk_API?: {
            onLoad?: () => void;
            toggle?: () => void;
            minimize?: () => void;
            maximize?: () => void;
            hideWidget?: () => void;
            showWidget?: () => void;
            toggleVisibility?: () => void;
            isChatMaximized?: () => boolean;
            isChatMinimized?: () => boolean;
            isChatHidden?: () => boolean;
        };
    }
}

export function getTawkApi() {
    return window.Tawk_API;
}

export function openTawkToChat() {
    if (!getTawkApi()) return;
    if (getTawkApi()?.isChatMaximized?.()) {
        showSuccessToast({
            message: "Chat is already open",
            description: "Feel free to ask us any questions you have!",
            position: "top-center",
        });
        return;
    }
    getTawkApi()?.maximize?.();
}

export function minimizeTawkToChat() {
    if (!getTawkApi()) return;
    getTawkApi()?.minimize?.();
}