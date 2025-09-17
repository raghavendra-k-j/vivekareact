import { action, makeObservable, observable } from "mobx";
import { AppError } from "~/core/error/AppError";
import { UUIDUtil } from "~/core/utils/UUIDUtil";
import { AiSpaceItem, AiSpacesCreatorRes } from "~/domain/lms/models/AiSpacesCreatorModels";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import { DataState } from "~/ui/utils/DataState";

export class AiSpacesCreatorResVm {
    public message: string | null;
    public items: AiSpaceItemVm[];

    constructor({ message, items }: { message: string | null; items: AiSpaceItemVm[] }) {
        this.message = message;
        this.items = items;
        makeObservable(this, {
            items: observable.shallow,
        });
    }

    static fromModel(model: AiSpacesCreatorRes): AiSpacesCreatorResVm {
        return new AiSpacesCreatorResVm({
            message: model.message,
            items: model.items.map(item => AiSpaceItemVm.fromModel(item))
        });
    }
}


export class AiSpaceItemVm {
    public uuid: string;
    public type: SpaceType;
    public name: string;
    public children: AiSpaceItemVm[];
    public isExpanded: boolean = true;
    public createState: DataState<number> = DataState.init();

    get createdId(): number | null {
        return this.createState.isData ? (this.createState.data as number) : null;
    }

    constructor({ type, name, children }: { type: SpaceType; name: string; children: AiSpaceItemVm[] }) {
        this.uuid = UUIDUtil.compact;
        this.type = type;
        this.name = name;
        this.children = children;
        makeObservable(this, {
            name: observable.ref,
            children: observable.shallow,
            isExpanded: observable,
            removeItem: action,
            rename: action,
            toggleExpanded: action,
            createState: observable.ref,
            setCreating: action,
            setCreateError: action,
            setCreated: action,
        });
    }

    setCreating() {
        this.createState = DataState.loading();
    }

    setCreateError(error: AppError) {
        this.createState = DataState.error(error);
    }

    setCreated(createdId: number) {
        this.createState = DataState.data(createdId);
    }

    get isCourse() {
        return this.type.isCourse;
    }

    get isFolder() {
        return this.type.isFolder;
    }

    removeItem(item: AiSpaceItemVm) {
        if (!this.isFolder) {
            throw new Error("Cannot remove item from a course");
        }
        if(this.createState.isLoading || this.createState.isData) {
            return;
        }
        this.children = this.children.filter(i => i.uuid !== item.uuid);
    }

    rename(newName: string) {
        if(this.createState.isLoading || this.createState.isData) {
            return;
        }
        this.name = newName;
    }

    toggleExpanded() {
        this.isExpanded = !this.isExpanded;
    }


    public static fromModel(model: AiSpaceItem): AiSpaceItemVm {
        return new AiSpaceItemVm({
            type: model.type,
            name: model.name,
            children: model.children.map(child => AiSpaceItemVm.fromModel(child))
        });
    }

    public toModel(): AiSpaceItem {
        return new AiSpaceItem(
            this.type,
            this.name,
            this.children.map(child => child.toModel())
        );
    }
}