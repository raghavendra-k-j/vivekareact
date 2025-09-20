import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router";
import { FormDetailContext } from "./FormDetailContext";
import { FormDetailStore } from "./FormDetailStore";

function FormDetailPageProvider({ children }: { children: React.ReactNode }) {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'form';
    const store = useMemo(() => new FormDetailStore({ type, id }), [type, id]);

    return (
        <FormDetailContext.Provider value={store}>
            {children}
        </FormDetailContext.Provider>
    );
}

function FormDetailInner() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'form';

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                {type === 'assessment' ? 'Assessment' : type === 'survey' ? 'Survey' : 'Form'} Detail
            </h1>
            <div className="border rounded-lg p-4">
                <p className="text-gray-600">
                    Form ID: {id}<br />
                    Type: {type}<br />
                    Form detail content will be displayed here
                </p>
            </div>
        </div>
    );
}

export default function FormDetailPage() {
    return (
        <FormDetailPageProvider>
            <FormDetailInner />
        </FormDetailPageProvider>
    );
}