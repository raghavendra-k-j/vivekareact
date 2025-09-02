import { makeObservable, observable, reaction, runInAction } from "mobx";
import { FormService } from "~/domain/forms/services/FormsService";
import { FormRepo } from "~/infra/repos/forms/FormRepo";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { DataState } from "~/ui/utils/DataState";
import { AppError } from "~/core/error/AppError";
import { CurrentFragment } from "./models/CurrentFragment";
import type { FormDetail } from "~/domain/forms/models/FormDetail";
import type { Language } from "~/domain/forms/models/Language";
import { logger } from "~/core/utils/logger";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { AppStore } from "~/ui/pages/_layout/AppStore";
import { AppEnv } from "~/core/config/AppEnv";

export type SubmitStoreProps = {
    permalink: string;
    responseUid: string | null;
    appStore: AppStore;
};

export class SubmitStore {
    permalink: string;
    responseUid: string | null;
    currentFragment: CurrentFragment = CurrentFragment.Loading;
    selectedLanguage: Language | null = null;
    formService: FormService;
    formDetailState: DataState<FormDetail> = DataState.init();
    appStore: AppStore;
    startFormImmediatelyAfterLoadForm = false;
    selectedLanguageField = new InputValue<string>("");

    constructor(props: SubmitStoreProps) {
        this.permalink = props.permalink;
        this.responseUid = props.responseUid;
        this.formService = new FormService({
            formRepo: new FormRepo({ apiClient: ApiClient.findInstance() }),
        });
        this.appStore = props.appStore;
        this.formDetailState = DataState.init<FormDetail>();
        makeObservable(this, {
            currentFragment: observable,
            selectedLanguage: observable.ref,
            formDetailState: observable.ref,
        });
        reaction(() => this.selectedLanguageField.value, (langId) => {
            this.onLanguageSelected(langId);
        });
    }

    async loadFormDetail() {
        try {
            runInAction(() => this.formDetailState = DataState.loading());
            const formDetailRes = (await this.formService.getFormDetail({ permalink: this.permalink, responseUid: this.responseUid })).getOrError();
            this.onFormDetailLoaded(formDetailRes);
        }
        catch (error) {
            logger.error("Error loading form detail", error);
            const appError = AppError.fromAny(error);
            runInAction(() => this.formDetailState = DataState.error(appError));
        }
    }

    onFormDetailLoaded(formDetail: FormDetail) {
        runInAction(() => {
            this.formDetailState = DataState.data(formDetail);
            if (formDetail.hasResponse) {
                this.currentFragment = CurrentFragment.AlreadySubmitted;
            }
            else {
                if (!this.selectedLanguage) {
                    this.selectedLanguageField.value = formDetail.language.id;
                }
                if (this.startFormImmediatelyAfterLoadForm) {
                    this.onClickStart();
                }
                else {
                    this.currentFragment = CurrentFragment.Preview;
                }
            }
        });
    }

    onLanguageSelected(languageId: string) {
        const selected = this.formDetail.languages.find(lang => lang.id === languageId);
        if (!selected) return;
        runInAction(() => {
            this.selectedLanguage = selected;
        });
    }

    async onClickStart() {
        if (!this.formDetailState.isData) return;
        this.startFormImmediatelyAfterLoadForm = false;
        runInAction(() => {
            this.currentFragment = this.appStore.hasUser ? CurrentFragment.Interaction : CurrentFragment.Auth;
        });
    }

    get formDetail() {
        if (!this.formDetailState.data) {
            throw new Error("Form detail is not loaded yet");
        }
        return this.formDetailState.data!;
    }


    get hasBackNavigation() {
        return false;
    }

    get returnToHomeURL(): string {
        return AppEnv.instance.webBase;
    }

    setCurrentFragmentPreview() {
        runInAction(() => {
            this.currentFragment = CurrentFragment.Preview;
        });
    }

}
