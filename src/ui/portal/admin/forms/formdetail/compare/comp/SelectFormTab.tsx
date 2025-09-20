import { ChartNoAxesCombined } from "lucide-react";
import { NumFmt } from "~/core/utils/NumFmt";
import { FormCompareItem } from "~/domain/forms/admin/models/compare/FormCompareItem";
import { AssmntTypeBadge } from "~/ui/components/form/commons/AssmntTypeBadge";
import { Button } from "~/ui/widgets/button/Button";
import { useAdminFormCompareStore } from "../ComparePageContext";

export default function SelectFormTab() {
    const store = useAdminFormCompareStore();
    const recommendedForm = store.formMetadata.recommendedForm;

    return (
        <div className="p-6">
            <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
                <SelectFormIntro onSelect={() => store.showSelectFormDialog()} />

                {recommendedForm && (
                    <RecommendationList
                        form={recommendedForm}
                        onSelect={() => store.onRecommendedFormSelected(recommendedForm)}
                    />
                )}
            </div>
        </div>
    );
}

function SelectFormIntro({ onSelect }: { onSelect: () => void }) {
    return (
        <div className="text-center flex flex-col items-center">
            <ChartNoAxesCombined className="w-16 h-16 text-primary" />
            <h2 className="text-lg font-semibold text-default mt-4">Compare Assessment Performance</h2>
            <p className="text-base text-secondary mt-1">
                Compare marks, time taken, and pass rate between two assessments to see how users have improved
            </p>
            <Button className="mt-6" onClick={onSelect}>
                Select Assessment to Compare
            </Button>
        </div>
    );
}

type RecommendationListProps = {
    form: FormCompareItem;
    onSelect: (form: FormCompareItem) => void;
};

function RecommendationList({ form, onSelect }: RecommendationListProps) {
    return (
        <>
            {/* "OR" Divider */}
            <div className="flex items-center my-2">
                <div className="flex-grow border-t border-default"></div>
                <span className="mx-4 text-secondary">OR</span>
                <div className="flex-grow border-t border-default"></div>
            </div>

            <div>
                <h3 className="tex-base font-semibold text-default mb-2">
                    Compare with {form.assessmentType?.name} Assessment
                </h3>
                <div className="w-full space-y-4">
                    <RecommendationItem
                        form={form}
                        onClick={(form) => onSelect(form)}
                    />
                </div>
            </div>
        </>
    );
}

type RecommendationItemProps = {
    form: FormCompareItem;
    onClick: (form: FormCompareItem) => void;
};

function RecommendationItem({ form, onClick }: RecommendationItemProps) {
    return (
        <div
            onClick={() => onClick(form)}
            className="flex justify-between items-center border border-default p-4 shadow-sm bg-surface cursor-pointer rounded-sm"
        >
            <div>
                {form.assessmentType && (
                    <div>
                        <AssmntTypeBadge type={form.assessmentType} />
                    </div>
                )}
                <p className="font-semibold text-base text-default mt-2">{form.title}</p>
                <p className="text-sm text-secondary">
                    {form.totalQuestions} Questions • {NumFmt.roundToStr(form.totalMarks, 2)} Marks • {form.totalResponses} Responses
                </p>
            </div>

            <Button variant="outline" color="secondary"
                size="md"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(form);
                }}
            >
                Select
            </Button>
        </div>
    );
}
