import { UserPortalStore } from "../root/UserPortalStore";

export class HomePageStore {
    userPortal: UserPortalStore;

    constructor({ userPortal }: { userPortal: UserPortalStore; }) {
        this.userPortal = userPortal;
    }
}