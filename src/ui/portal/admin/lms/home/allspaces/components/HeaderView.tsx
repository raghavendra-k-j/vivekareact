import { Sparkle } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { LMSConst } from "~/domain/lms/models/LMSConst";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import { Button } from "~/ui/widgets/button/Button";
import { LMSPageHeader, LMSPageHeaderSearch } from "../../components/LMSPageHeader";
import { useAllSpacesStore } from "../AllSpacesContext";
import { LMSBreadcrumbs } from "../../components/LMSBreadcrumbs";

export function AppBarView() {
    const store = useAllSpacesStore();
    return (
        <Observer>
            {() => {
                return (
                    <LMSPageHeader
                        title="Learning Management System"
                        search={<Observer>{() => (
                            <LMSPageHeaderSearch
                                placeholder={`Search ${store.layoutStore.ed(LMSConst.ENTITY_COURSE).namePlural} and Folders`}
                                value={store.searchQuery}
                                onChange={(value) => store.updateSearchQuery(value)}
                            />
                        )}</Observer>}
                        bottom={<Observer>
                            {() => (<LMSBreadcrumbs
                                folder={store.dataVmOpt?.folder ?? null}
                                isLoading={store.queryState.isLoading}
                                isError={store.queryState.isError}
                                onNavigateToFolder={(permalink) => { store.navigateToFolder(permalink); }}
                            />)}
                        </Observer>}
                        trailingButtons={
                            <>
                                <Button
                                    color="secondary"
                                    variant="outline"
                                    onClick={() => store.showAiCreateDialog()}
                                    size="md"
                                >
                                    <Sparkle className="w-4 h-4 mr-2 text-purple-600" />
                                    Create with AI
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="outline"
                                    onClick={() => store.showCreateDialog(SpaceType.FOLDER)}
                                    size="md"
                                >
                                    New Folder
                                </Button>
                                <Button
                                    color="primary"
                                    variant="solid"
                                    onClick={() => store.showCreateDialog(SpaceType.COURSE)}
                                    size="md"
                                >
                                    New {store.layoutStore.ed(LMSConst.ENTITY_COURSE).nameSingular}
                                </Button>
                            </>
                        }
                    />
                );
            }}
        </Observer>
    );
}
