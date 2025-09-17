
import { Observer } from "mobx-react-lite";
import { Send, X } from "lucide-react";
import { useRef } from "react";
import { useAiCreateSpaceDialogStore } from "./AiCreateSpaceDialogContext";
import { PromptsView } from "./PromptsView";
import { IconButton } from "~/ui/widgets/button/IconButton";


export function AiCreateSpaceInputView() {
    const store = useAiCreateSpaceDialogStore();
    return (
        <div className="flex flex-col h-full overflow-y-hidden relative">
            <div className="flex-1 overflow-y-auto px-6 pt-6">
                <PromptsView
                    onPromptSelected={(prompt) => store.updatePrompt(prompt)}
                />
            </div>
            <AIPromptInputView />
            <IconButton
                icon={<X />}
                size="sm"
                variant="ghost"
                color="secondary"
                onClick={() => store.closeDialog()}
                title="Close dialog"
                className="absolute top-4 right-4"
            />
        </div>
    );
}



function AIPromptInputView() {
    const store = useAiCreateSpaceDialogStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (store.canGenerateStructure) {
                store.generateStructureFromPrompt();
            }
        }
    };
    return (
        <Observer>
            {() => (
                <div className="relative mx-6 mb-6 rounded shadow-lg border border-strong focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
                    <div className="p-3 relative">
                        <textarea
                            ref={textareaRef}
                            value={store.promptString}
                            onChange={(e) => store.updatePrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter your prompt..."
                            className="w-full rounded border-0 outline-none bg-transparent px-2 py-1.5 pr-10 text-sm text-default min-h-[40px] max-h-[120px] field-sizing-content resize-none"
                            rows={1}
                            disabled={store.generateState.isLoading}
                        />

                        <button
                            onClick={() => store.generateStructureFromPrompt()}
                            disabled={!store.canGenerateStructure}
                            className="absolute right-2 bottom-2 px-3 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-md text-sm font-medium flex items-center gap-1.5"
                        >
                            {store.generateState.isLoading ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Send</span>
                                </>
                            )}
                        </button>
                    </div>

                    {store.promptError && <hr className="border-default/20" />}
                    {store.promptError && (
                        <div className="text-error text-xs p-3 pt-1">
                            {store.promptError}
                        </div>
                    )}
                    {!store.promptError && <hr className="border-default/20" />}
                    {!store.promptError && (
                        <div className="text-secondary text-xs p-3 pt-1">
                            Enter to send • Shift+Enter for new line
                        </div>
                    )}
                </div>
            )}
        </Observer>
    );
}
