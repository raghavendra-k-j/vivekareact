import { Observer } from "mobx-react-lite";
import { AiSpaceItem } from "~/domain/lms/models/AiSpacesCreatorModels";

interface HierarchyPreviewProps {
    items: AiSpaceItem[];
    className?: string;
}

interface SpaceItemProps {
    item: AiSpaceItem;
    level: number;
}

function SpaceItemComponent({ item, level }: SpaceItemProps) {
    const indentClass = level > 0 ? `ml-${level * 4}` : "";
    const typeIcon = item.type.isFolder ? "Folder" : "File";
    
    return (
        <div className={`${indentClass} py-1`}>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">{typeIcon}</span>
                <span className="font-medium text-gray-700">{item.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.type.label}
                </span>
            </div>
            {item.children && item.children.length > 0 && (
                <div className="mt-1">
                    {item.children.map((child, index) => (
                        <SpaceItemComponent 
                            key={`${child.name}-${index}`} 
                            item={child} 
                            level={level + 1} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function HierarchyPreview({ items, className = "" }: HierarchyPreviewProps) {
    if (!items || items.length === 0) {
        return (
            <div className={`text-gray-500 text-center py-8 ${className}`}>
                No structure generated yet
            </div>
        );
    }

    return (
        <Observer>
            {() => (
                <div className={`bg-gray-50 border rounded-lg p-4 ${className}`}>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        Generated Space Structure
                    </h4>
                    <div className="space-y-1">
                        {items.map((item, index) => (
                            <SpaceItemComponent 
                                key={`${item.name}-${index}`} 
                                item={item} 
                                level={0} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </Observer>
    );
}