import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { AdminSpacesService } from "~/domain/lms/services/AdminSpacesService";
import { DialogCloseButton, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import {
    Dialog,
    DialogOverlay,
    DialogScaffold
} from "~/ui/widgets/dialogmanager";
import { useDialogManager } from "~/ui/widgets/dialogmanager/DialogManagerContext";
import { TextareaField } from "~/ui/widgets/form/TextareaField";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AllSpacesStore } from "../allspaces/AllSpacesStore";
import { AiCreateSpaceDialogProvider, useAiCreateSpaceDialogStore } from "./AiCreateSpaceDialogContext";
import { AiCreateSpaceDialogStore } from "./AiCreateSpaceDialogStore";
import { HierarchyPreview } from "./HierarchyPreview";

export interface AiCreateSpaceDialogProps {
    parentId: number | null;
    adminSpacesService: AdminSpacesService;
    layoutStore: LMSLayoutStore;
    allSpacesStore: AllSpacesStore;
}

function DialogInner() {
    const store = useAiCreateSpaceDialogStore();
    return (
        <Dialog onClose={() => store.closeDialog()}>
            <DialogOverlay />
            <DialogScaffold>
                <div className="w-full max-w-6xl h-full max-h-[90vh] flex flex-col bg-white rounded-lg shadow-xl">
                    <DialogHeader
                        className="border-b flex-shrink-0"
                        onClose={<DialogCloseButton onClick={() => store.closeDialog()} />}
                        title="Create Spaces with AI"
                    />
                    <div className="flex-1 overflow-y-auto min-h-0">
                        <DialogForm />
                    </div>
                </div>
            </DialogScaffold>
        </Dialog>
    );
}

function DialogForm() {
    const store = useAiCreateSpaceDialogStore();
    
    return (
        <div className="flex h-full">
            {/* Left Panel - Chat Interface */}
            <div className="flex-1 flex flex-col border-r border-gray-200">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">
                        AI Chat Assistant
                    </h3>
                    <p className="text-sm text-gray-600">
                        Describe your learning structure and get AI-powered suggestions
                    </p>
                </div>
                
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Welcome Message */}
                    {store.conversationHistory.length === 0 && (
                        <div className="flex items-start space-x-3 justify-start">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                AI
                            </div>
                            <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 max-w-md shadow-sm border border-gray-200">
                                <p className="text-sm leading-relaxed">
                                    Hello! I'm here to help you create learning structures. 
                                    Tell me what kind of course or module you'd like to build.
                                </p>
                                <p className="text-xs mt-2 text-gray-500">
                                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* Conversation History */}
                    <Observer>
                        {() => (
                            <div className="space-y-4">
                                {store.conversationHistory.map((message) => (
                                    <div 
                                        key={message.id} 
                                        className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.type !== 'user' && (
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                                AI
                                            </div>
                                        )}
                                        <div className={`rounded-2xl px-4 py-3 max-w-md shadow-sm ${
                                            message.type === 'user' 
                                                ? 'bg-blue-600 text-white' 
                                                : message.type === 'ai'
                                                    ? 'bg-white text-gray-800 border border-gray-200'
                                                    : 'bg-red-50 text-red-800 border border-red-200'
                                        }`}>
                                            <p className="text-sm leading-relaxed">
                                                {message.content}
                                            </p>
                                            <p className={`text-xs mt-2 ${
                                                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                        {message.type === 'user' && (
                                            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                                You
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Observer>
                </div>
                
                {/* Chat Input Area */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-3">
                        <TextareaField
                            required
                            label="Your Prompt"
                            placeholder="Describe the space structure you want AI to create..."
                            rows={3}
                            field={store.promptField}
                        />
                        
                        <div className="flex justify-end">
                            <Observer>
                                {() => (
                                    <Button
                                        onClick={() => store.generateStructure()}
                                        loading={store.generateState.isLoading}
                                        disabled={!store.promptField.value.trim()}
                                        variant="solid"
                                        size="sm"
                                    >
                                        Send Message
                                    </Button>
                                )}
                            </Observer>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col">
                {/* Preview Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Structure Preview
                    </h3>
                    <p className="text-sm text-gray-600">
                        See how your learning structure will look
                    </p>
                </div>
                
                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <Observer>
                        {() => store.hasGeneratedStructure && store.generatedStructure ? (
                            <div className="space-y-4">
                                <HierarchyPreview 
                                    items={store.generatedStructure.items}
                                    className=""
                                />
                                
                                {/* Action Buttons */}
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => store.clearGenerated()}
                                        disabled={store.generateState.isLoading}
                                    >
                                        Generate New Structure
                                    </Button>
                                    
                                    <Observer>
                                        {() => (
                                            <Button
                                                onClick={() => store.createStructure()}
                                                disabled={!store.canCreateStructure}
                                                loading={store.createState.isLoading}
                                                variant="solid"
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Create This Structure
                                            </Button>
                                        )}
                                    </Observer>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <p className="text-lg mb-2">No structure generated yet</p>
                                    <p className="text-sm">Send a message to the AI to get started</p>
                                </div>
                            </div>
                        )}
                    </Observer>
                </div>
            </div>
        </div>
    );
}

export function AiCreateSpaceDialog(props: AiCreateSpaceDialogProps) {
    const storeRef = useRef<AiCreateSpaceDialogStore | null>(null);
    const dialogManager = useDialogManager();
    
    if (!storeRef.current) {
        storeRef.current = new AiCreateSpaceDialogStore({
            adminSpacesService: props.adminSpacesService,
            parentId: props.parentId,
            layoutStore: props.layoutStore,
            allSpacesStore: props.allSpacesStore,
            dialogManager: dialogManager,
        });
    }
    
    return (
        <AiCreateSpaceDialogProvider store={storeRef.current}>
            <DialogInner />
        </AiCreateSpaceDialogProvider>
    );
}