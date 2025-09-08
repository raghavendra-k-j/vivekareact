import { useSubmitStore } from '../SubmitContext';
import { useDialogManager } from '~/ui/widgets/dialogmanager';
import { ResponseView } from '~/ui/pages/common/forms/responseview/ResponseView';
import { ResponseDialogViewer } from '~/ui/pages/common/forms/responseview/models/ResponseViewViewer';
import { ResponseViewProps } from '~/ui/pages/common/forms/responseview/ResponseView';
import { useAppStore } from '~/ui/pages/_layout/AppContext';

export function useViewResponse(): () => void {
    const appStore = useAppStore();
    const store = useSubmitStore();
    const dialogManager = useDialogManager();

    return () => {
        const props: ResponseViewProps = {
            formId: store.formDetail.id,
            responseUid: store.formDetail.formResponse!.uid,
            viewer: ResponseDialogViewer.user,
            formService: store.formService,
            onClose: () => {
                dialogManager.closeById('response-dialog');
            },
            appStore: appStore,
        };

        dialogManager.show({
            id: 'response-dialog',
            component: ResponseView,
            props,
        });
    };
}
