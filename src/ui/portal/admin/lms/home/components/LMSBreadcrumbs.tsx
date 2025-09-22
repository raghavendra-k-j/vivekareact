import { Folder } from "lucide-react";
import { LMSFolderInfo } from "~/domain/lms/models/LMSFolderInfo";
import { EasyBreadcrumbs, EasyBreadcrumbItem, type BreadcrumbItem } from "~/ui/components/easybreadcrumbs";

interface LMSBreadcrumbData {
    permalink: string | null;
}

export interface LMSBreadcrumbsProps {
    folder: LMSFolderInfo | null;
    isLoading: boolean;
    isError: boolean;
    onNavigateToFolder: (permalink: string | null) => void;
}

export function LMSBreadcrumbs({ folder, isLoading, isError, onNavigateToFolder }: LMSBreadcrumbsProps) {
    const buildBreadcrumbPath = (current: LMSFolderInfo | null): LMSFolderInfo[] => {
        const path: LMSFolderInfo[] = [];
        while (current) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    };

    const breadcrumbPath = folder ? buildBreadcrumbPath(folder) : [];
    const breadcrumbItems: BreadcrumbItem<LMSBreadcrumbData>[] = [
        {
            id: "home",
            name: "Home",
            isClickable: true,
            data: { permalink: null }
        },
        ...breadcrumbPath.map((folder, index) => ({
            id: folder.id.toString(),
            name: folder.name,
            isClickable: true,
            isCurrent: index === breadcrumbPath.length - 1,
            data: { permalink: folder.permalink }
        }))
    ];

    const handleItemClick = (item: BreadcrumbItem<LMSBreadcrumbData>) => {
        onNavigateToFolder(item.data?.permalink ?? null);
    };

    const renderBreadcrumbItem = (item: BreadcrumbItem<LMSBreadcrumbData>, _index: number, isItemLoading?: boolean) => {
        return (
            <EasyBreadcrumbItem
                name={item.name}
                onClick={item.isClickable ? () => handleItemClick(item) : undefined}
                isCurrent={item.isCurrent}
                isLoading={isItemLoading}
                icon={<Folder className="w-4 h-4 text-amber-600" />}
            />
        );
    };

    const renderLoadingItem = () => (
        <EasyBreadcrumbItem 
            name="loading" 
            isLoading 
            icon={<Folder className="w-4 h-4 text-amber-600" />}
        />
    );
    return (
        <EasyBreadcrumbs<LMSBreadcrumbData>
            items={breadcrumbItems}
            isLoading={isLoading}
            isError={isError}
            containerMinHeightClassName="min-h-11"
            onItemClick={handleItemClick}
            renderItem={renderBreadcrumbItem}
            renderLoadingItem={renderLoadingItem}
        />
    );
}