import { useAppStore } from '~/ui/portal/layout/app/AppContext';
import { useDialogManager } from '~/ui/widgets/dialogmanager';
import { ResponseDialogViewer } from '../../responseview/models/ResponseViewViewer';
import { ResponseView, ResponseViewProps } from '../../responseview/ResponseView';
import { useSubmitStore } from '../SubmitContext';

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
