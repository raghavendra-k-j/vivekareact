import { ChevronRight, Save } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { ReactNode, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "~/ui/components/card";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { FTextField } from "~/ui/widgets/form/TextField";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { useOrgSettingsStore } from "../layout/OrgSettingsContext";
import { EntityDictSettingsContext, useEntityDictSettingsStore } from "./EntityDictSettingsContext";
import { EntityDictSettingsStore } from "./EntityDictSettingsStore";
import { EntityModuleDetailVm } from "./models/EntityCatalogDetailVm";
import { EntityDictDefVm } from "./models/EntityDictDefVm";

function EntityDictSettingsProvider({ children }: { children: ReactNode }) {
    const store = useRef<EntityDictSettingsStore | null>(null);
    const appStore = useAppStore();
    const layoutStore = useOrgSettingsStore();
    if (store.current === null) {
        store.current = new EntityDictSettingsStore({
            appStore: appStore,
            layoutStore: layoutStore
        });
    }
    return <EntityDictSettingsContext.Provider value={store.current}>
        {children}
    </EntityDictSettingsContext.Provider>;
}

export default function EntityDictSettingsPage() {
    return (<EntityDictSettingsProvider>
        <PageInner />
    </EntityDictSettingsProvider>
    );
}

function PageInner() {
    const store = useEntityDictSettingsStore();

    useEffect(() => {
        store.loadCatalog();
    }, [store]);

    return (<Observer>
        {() => {
            return store.catalogState.stateWhen({
                initOrLoading: () => <CenteredView><LoaderView /></CenteredView>,
                loaded: () => <MainContent />,
                error: (error) => <CenteredView><SimpleRetryableAppView appError={error} onRetry={() => store.loadCatalog()} /></CenteredView>
            });
        }}
    </Observer>);
}

function CenteredView({ children }: { children: ReactNode }) {
    return (
        <div className="flex  flex-col h-full overflow-y-auto p-6 justify-center items-center">
            {children}
        </div>
    );
}


function MainContent() {
    return (
        <div className="h-full overflow-y-auto">
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-3">
                        <ModuleList />
                    </div>
                    <div className="lg:col-span-9">
                        <SelectedModuleDetailView />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModuleList() {
    const store = useEntityDictSettingsStore();
    return (
        <Card>
            <CardHeader className="px-4 py-2 border-b border-default">
                <h2 className="text-lg font-semibold text-default">Modules</h2>
            </CardHeader>
            <CardBody>
                <div>
                    {store.catalog.modules.map((module) => (
                        <ModuleListItem key={module.base.id} module={module} />
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}

function ModuleListItem({ module }: { module: EntityModuleDetailVm }) {
    const store = useEntityDictSettingsStore();
    return (
        <Observer>
            {() => {
                const isSelected = store.selectedModule?.base.id === module.base.id;
                return (
                    <button
                        type="button"
                        onClick={() => store.setModule(module)}
                        aria-selected={isSelected}
                        className={`relative w-full text-left px-3 py-2 transition-colors duration-200 border-b border-default last:border-b-0 ${isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                    >
                        <span
                            aria-hidden
                            className={`pointer-events-none absolute inset-y-0 left-0 w-0.5 ${isSelected ? 'bg-primary-500' : 'bg-transparent'}`}
                        />
                        <div className="flex items-center justify-between gap-3 min-w-0 pl-2">
                            <div className="min-w-0">
                                <div
                                    className={`font-semibold truncate ${isSelected ? 'text-primary' : 'text-default'}`}
                                    title={module.base.namePlural}
                                >
                                    {module.base.namePlural}
                                </div>
                               
                            </div>
                            <ChevronRight
                                className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-primary-500' : 'text-secondary'}`}
                            />
                        </div>
                    </button>
                );
            }}
        </Observer>
    );
}

function SelectedModuleDetailView() {
    const store = useEntityDictSettingsStore();
    return (
        <Observer>
            {() => {
                const selectedModule = store.selectedModule;
                return (<Card>
                    <ModuleHeader selectedModule={selectedModule} />
                    <CardBody>
                        <div className="divide-y divide-default">
                            {selectedModule.entities.map((item) => (
                                <EntityItem key={item.base.id} item={item} />
                            ))}
                        </div>
                    </CardBody>
                </Card>);
            }}
        </Observer>
    );
}

function ModuleHeader({ selectedModule }: { selectedModule: EntityModuleDetailVm }) {
    const store = useEntityDictSettingsStore();
    return (
        <CardHeader className="px-4 py-2 border-b border-default flex items-center gap-3 justify-between">
            <h2 className="text-lg font-bold text-default">{selectedModule.base.namePlural}</h2>
            <Button
                onClick={() => store.saveChanges()}
                className="flex items-center gap-2"
            >
                <Save className="w-4 h-4" />
                Save Changes
            </Button>
        </CardHeader>
    );
}



function EntityItem({ item }: { item: EntityDictDefVm }) {
    return (
        <div className="px-6 py-3">
            <h4 className="font-semibold">{item.base.defNameSingular}</h4>
            <div className="text-secondary text-sm">{item.base.description}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                <div>
                    <FTextField
                        label="Singular Name"
                        field={item.nameSingularField}
                        placeholder="Enter singular name"
                    />
                    <div className="mt-1 text-xs text-secondary">
                        Default: {item.base.defNameSingular}
                    </div>
                </div>
                <div>
                    <FTextField
                        label="Plural Name"
                        field={item.namePluralField}
                        placeholder="Enter plural name"
                    />
                    <div className="mt-1 text-xs text-secondary">
                        Default: {item.base.defNamePlural}
                    </div>
                </div>
            </div>
        </div>
    );
}

