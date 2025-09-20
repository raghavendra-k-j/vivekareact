import { UserFormStatus } from '~/domain/forms/models/UserFormStatus';
import { useFormsListStore } from '../FormsListContext';
import { FormsListStore } from '../FormsListStore';

export function HeaderView() {
    const store = useFormsListStore();
    return (
        <div className="flex items-center justify-end container mx-auto">
            <div className="flex items-center space-x-2">
                {UserFormStatus.values.map(status => (
                    <FilterChip
                        key={status.status}
                        status={status}
                        store={store}
                    />
                ))}
            </div>
        </div>
    );
}


function FilterChip({ status, store }: { status: UserFormStatus; store: FormsListStore }) {
    const isSelected = store.selectedStatus?.status === status.status;
    return (
        <button
            onClick={() => store.updateSelectedStatus(isSelected ? null : status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
            {status.name}
        </button>
    );
}