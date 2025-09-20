import { HomeGridContainer } from "../../home/HomeGridContainer";
import { useFormsListStore } from "../FormsListContext";
import { FormCard, FormCardSkeleton } from "./FormCard";

export function FormGrid() {
    const store = useFormsListStore();
    return (
        <HomeGridContainer>
            {store.forms.map(form => (
                <FormCard key={form.base.id} form={form} />
            ))}
        </HomeGridContainer>
    );
}

export function FormGridSkeleton() {
    return (
        <HomeGridContainer>
            {Array.from({ length: 8 }).map((_, index) => (
                <FormCardSkeleton key={index} />
            ))}
        </HomeGridContainer>
    );
}