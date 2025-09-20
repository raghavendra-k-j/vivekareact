export interface FormDetailStoreProps {
    type?: string;
    id?: string;
}

export class FormDetailStore {
    public readonly type: string;
    public readonly id: string;

    constructor(props: FormDetailStoreProps) {
        this.type = props.type || 'form';
        this.id = props.id || '';
    }
}