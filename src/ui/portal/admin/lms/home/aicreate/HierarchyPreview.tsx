import { Observer } from "mobx-react-lite";
import { AiSpaceItemVm } from "./models/AiSpacesCreatorResVm";
import { Folder, BookOpen, Loader, CheckCircle, AlertCircle, MessageSquare, AlertTriangle, X, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useAiCreateSpaceDialogStore } from "./AiCreateSpaceDialogContext";
import { useState } from "react";

interface ItemViewProps {
    item: AiSpaceItemVm;
    level: number;
    onDeleteItem?: (item: AiSpaceItemVm) => void;
}

// Space Item Icon Component
function SpaceItemIcon({ isCourse }: { isCourse: boolean }) {
    if (isCourse) {
        return (
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
            <Folder className="w-4 h-4 text-amber-600" />
        </div>
    );
}

// Space Item Status Component
function SpaceItemStatus({ 
    createState, 
    onErrorClick 
}: { 
    createState: any; 
    onErrorClick?: () => void; 
}) {
    return createState.stateWhen({
        initOrLoading: () => createState.isLoading ? (
            <div title="Creating..." className="flex items-center justify-center w-5 h-5">
                <Loader className="w-3.5 h-3.5 text-blue-500 animate-spin" />
            </div>
        ) : null,
        loaded: (id: number) => (
            <div title={`Created successfully (ID: ${id})`} className="flex items-center justify-center w-5 h-5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            </div>
        ),
        error: (error: any) => (
            <button
                title={`Creation failed: ${error.message}. Click to show options`}
                onClick={onErrorClick}
                className="flex items-center justify-center w-5 h-5 hover:bg-red-50 rounded transition-colors cursor-pointer"
            >
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            </button>
        )
    });
}

// Error Details Component
function ErrorDetailsView({ 
    item, 
    onDelete, 
    onClose 
}: { 
    item: AiSpaceItemVm; 
    onDelete: () => void; 
    onClose: () => void; 
}) {
    const error = item.createState.error!;

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-1 mx-2">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-red-800">Creation Failed</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-red-400 hover:text-red-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <p className="text-sm text-red-700 mb-3 leading-relaxed">
                {error.message}
            </p>
            <div className="flex items-center justify-between">
                <span className="text-xs text-red-600">Item: {item.name}</span>
                <button
                    onClick={onDelete}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition-colors"
                >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                </button>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyStateView() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 rounded-lg border border-default/10">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-strong mb-2">
                Sorry, something went wrong
            </h3>
            <p className="text-sm text-secondary max-w-md leading-relaxed">
                We couldn't generate a structure for your request. Please try rephrasing your prompt or try again later.
            </p>
        </div>
    );
}

// Message Only View - Chat bubble style
function MessageOnlyView({ message }: { message: string }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-2xl w-full">
                    {/* Chat bubble container */}
                    <div className="flex justify-start mb-4">
                        <div className="rounded-2xl rounded-tl-md px-6 py-4 shadow-sm border border-default/20 max-w-lg">
                            <div className="flex items-start space-x-3">
                                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0 border border-primary/20">
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-strong leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Note about empty structure */}
                    <div className="text-center">
                        <p className="text-xs text-secondary px-3 py-2 rounded-lg border border-default/10">
                            No folder structure was generated from this response
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple ItemView component - read-only display of folder or course items
function ItemView({ item, level, onDeleteItem }: ItemViewProps) {
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const indentPadding = level * 16;

    const handleDelete = () => {
        if (onDeleteItem) {
            onDeleteItem(item);
        }
        setShowErrorDetails(false);
    };

    const hasChildren = item.children && item.children.length > 0;

    return (
        <Observer>
            {() => (
                <>
                    <div className="border-b border-default/10 last:border-b-0 hover:bg-default/5 transition-all duration-200 group">
                        <div
                            className="flex items-center px-2 py-1.5"
                            style={{ paddingLeft: `${6 + indentPadding}px` }}
                        >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                {/* Expand/Collapse Toggle */}
                                {hasChildren && (
                                    <button
                                        onClick={() => item.toggleExpanded()}
                                        className="flex items-center justify-center w-4 h-4 text-secondary hover:text-strong transition-colors"
                                    >
                                        {item.isExpanded ? (
                                            <ChevronDown className="w-3 h-3" />
                                        ) : (
                                            <ChevronRight className="w-3 h-3" />
                                        )}
                                    </button>
                                )}
                                {!hasChildren && <div className="w-4" />} {/* Spacer for alignment */}

                                <SpaceItemIcon isCourse={item.isCourse} />
                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <span className={`text-sm truncate font-medium ${
                                        item.isCourse
                                            ? 'text-strong'
                                            : 'text-strong font-semibold'
                                    }`}>
                                        {item.name}
                                    </span>
                                    <SpaceItemStatus
                                        createState={item.createState}
                                        onErrorClick={() => setShowErrorDetails(!showErrorDetails)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Details */}
                    {showErrorDetails && item.createState.isError && (
                        <ErrorDetailsView
                            item={item}
                            onDelete={handleDelete}
                            onClose={() => setShowErrorDetails(false)}
                        />
                    )}

                    {/* Children items */}
                    {hasChildren && item.isExpanded && (
                        <div className="ml-4">
                            {item.children.map((child, index) => (
                                <ItemView
                                    key={`${child.uuid}-${index}`}
                                    item={child}
                                    level={level + 1}
                                    onDeleteItem={onDeleteItem}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </Observer>
    );
}export function HierarchyPreview() {
    const store = useAiCreateSpaceDialogStore();

    const handleDeleteItem = (itemToDelete: AiSpaceItemVm) => {
        // Find the parent and remove the item
        const removeFromHierarchy = (items: AiSpaceItemVm[], targetItem: AiSpaceItemVm): boolean => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].uuid === targetItem.uuid) {
                    items.splice(i, 1);
                    return true;
                }
                if (items[i].children && items[i].children.length > 0) {
                    if (removeFromHierarchy(items[i].children, targetItem)) {
                        return true;
                    }
                }
            }
            return false;
        };

        if (store.generateState.isData) {
            removeFromHierarchy(store.generateState.data!.items, itemToDelete);
        }
    };

    return (
        <Observer>
            {() => {
                const data = store.generateState.data;
                const items = data?.items || [];
                const message = data?.message;

                // Case 1: No data at all - show error
                if (!data) {
                    return <EmptyStateView />;
                }

                // Case 2: Message only, no items - show chat bubble
                if (message && (!items || items.length === 0)) {
                    return <MessageOnlyView message={message} />;
                }

                // Case 3: No items but no message either - show error
                if (!items || items.length === 0) {
                    return <EmptyStateView />;
                }

                // Case 4: Both message and items - show full view
                return (
                    <div className="h-full flex flex-col rounded-lg border border-default/5">
                        {/* AI Message Section */}
                        {message && (
                            <div className="border-b border-default/10 px-4 py-3">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0 border border-primary/20">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-secondary leading-relaxed">
                                            {message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hierarchy Structure */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="divide-y divide-default/10">
                                {items.map((item, index) => (
                                    <ItemView
                                        key={`${item.uuid}-${index}`}
                                        item={item}
                                        level={0}
                                        onDeleteItem={handleDeleteItem}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            }}
        </Observer>
    );
}