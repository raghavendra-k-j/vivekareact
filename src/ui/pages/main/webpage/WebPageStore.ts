import { AppError } from "~/core/error/AppError";
import { WebPageRes } from "~/domain/common/models/WebPageRes";
import { WebPageService } from "~/domain/common/services/WebPageService";
import { DataState } from "~/ui/utils/DataState";

export class WebPageStore {

    slug: string;
    webPageService: WebPageService;
    dataState: DataState<WebPageRes> = DataState.init();

    constructor({ slug }: { slug: string }) {
        this.slug = slug;
        this.webPageService = new WebPageService();
        this.loadWebPage();
    }

    async loadWebPage() {
        try {
            this.dataState = DataState.loading();
            const res = (await this.webPageService.getBySlug(this.slug)).getOrError();
            this.dataState = DataState.data(res);
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            this.dataState = DataState.error(appError);
        }
    }
}