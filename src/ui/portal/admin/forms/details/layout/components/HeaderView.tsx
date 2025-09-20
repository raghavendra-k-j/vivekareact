import { useAdminFormDetailStore } from "../FormDetailContext";
import { FormTypeBade } from "~/ui/components/form/commons/FormTypeBadge";
import { AdminFormStatusBadge } from "~/ui/components/form/commons/AdminFormStatusBadge";
import { DateFmt } from "~/core/utils/DateFmt";
import { useIsLinkActive } from "~/ui/hooks/useIsLinkActive";
import { useNavigate } from "react-router";
import { Button } from "~/ui/widgets/button/Button";
import { Copy } from "lucide-react";
import { TabItem } from "~/ui/widgets/tabs/TabItem";
import { Observer } from "mobx-react-lite";
import { TabsList } from "~/ui/widgets/tabs/TabList";

const TAB_CONFIGS = {
    questions: { to: "questions", label: "Questions" },
    settings: { to: "settings", label: "Settings" },
    sharing: { to: "sharing", label: "Sharing" },
    reports: { to: "reports", label: "Reports" },
    compareResults: { to: "compare-results", label: "Compare Results" },
} as const;

interface InfoItem {
    text: string;
    title?: string;
    cursor: boolean;
}

function buildInfoItems(vm: any): InfoItem[] {
    const lastUpdatedTitle = `Created by: ${vm.creator.name} on ${DateFmt.datetime(vm.createdAt)}\nLast updated by: ${vm.updatedBy.name} on ${DateFmt.datetime(vm.updatedAt)}`;
    const formEndedText = vm.endDate ? `Ended: ${DateFmt.datetime(vm.endDate)}` : null;
    const formEndedTitle = vm.startDate && vm.endDate ?
        `Start: ${DateFmt.datetime(vm.startDate)}\nEnd: ${DateFmt.datetime(vm.endDate)}` :
        vm.endDate ? `End: ${DateFmt.datetime(vm.endDate)}` : undefined;

    const items: InfoItem[] = [
        { text: `Last updated: ${DateFmt.datetime(vm.updatedAt)}`, title: lastUpdatedTitle, cursor: true },
        { text: `${vm.totalQuestions} ${vm.totalQuestions === 1 ? 'Question' : 'Questions'}`, cursor: false },
    ];

    if (formEndedText) {
        items.splice(1, 0, { text: formEndedText, title: formEndedTitle, cursor: !!formEndedTitle });
    }

    if (vm.isAssessment && vm.totalMarks !== null) {
        items.push({ text: `${vm.totalMarks} Marks`, cursor: false });
    }

    return items;
}

function buildTabs(vm: any) {
    const tabs: Array<{ to: string; label: string }> = [
        TAB_CONFIGS.questions,
        TAB_CONFIGS.settings,
    ];

    if (vm.status.isPublished) {
        tabs.push(TAB_CONFIGS.sharing);
        tabs.push(TAB_CONFIGS.reports);
        if (vm.isAssessment) {
            tabs.push(TAB_CONFIGS.compareResults);
        }
    }

    return tabs;
}

function InfoItem({ item }: { item: InfoItem }) {
    return (
        <div className="px-3 first:pl-0">
            <span
                className={`text-sm text-secondary ${item.cursor ? 'cursor-pointer' : ''}`}
                title={item.title}
            >
                {item.text}
            </span>
        </div>
    );
}

function InfoSection({ vm }: { vm: any }) {
    const infoItems = buildInfoItems(vm);

    return (
        <div className="flex items-center divide-x divide-default gap-0">
            {infoItems.map((item, index) => (
                <InfoItem key={index} item={item} />
            ))}
        </div>
    );
}

function BadgesSection({ vm }: { vm: any }) {
    return (
        <div className="flex items-center gap-3">
            <FormTypeBade type={vm.type} />
            <AdminFormStatusBadge status={vm.adminFormStatus} />
        </div>
    );
}

function TitleSection({ vm }: { vm: any }) {
    return (
        <div className="flex items-center justify-between px-6 py-3">
            <h1 className="font-bold text-lg text-primary flex-1 truncate">{vm.title}</h1>
            <Button
                variant="outline"
                color="secondary"
                size="sm"
                onClick={() => { }}
                className="flex items-center gap-1 ml-4"
            >
                <Copy className="w-4 h-4" />
                Duplicate
            </Button>
        </div>
    );
}

function MetadataSection({ vm }: { vm: any }) {
    return (
        <div className="flex items-center justify-between px-6 py-2 border-t border-default">
            <div className="flex items-center gap-3">
                <BadgesSection vm={vm} />
                <InfoSection vm={vm} />
            </div>
        </div>
    );
}

function AppBarView() {
    const store = useAdminFormDetailStore();

    return (
        <Observer>
            {() => {
                const vm = store.vm;
                return (
                    <div className="border-b border-default min-h-12 flex flex-col">
                        <TitleSection vm={vm} />
                        <MetadataSection vm={vm} />
                    </div>
                );
            }}
        </Observer>
    );
}

function TabsListView() {
    const store = useAdminFormDetailStore();
    const navigate = useNavigate();

    return (
        <Observer>
            {() => {
                const vm = store.vm;
                const tabs = buildTabs(vm);
                return (
                    <TabsList className="px-6">
                        {tabs.map(t => {
                            const isTabActive = useIsLinkActive(t.to, true);
                            return (
                                <TabItem
                                    key={t.to}
                                    isActive={isTabActive}
                                    onClick={() => navigate(t.to)}
                                >
                                    {t.label}
                                </TabItem>
                            );
                        })}
                    </TabsList>
                );
            }}
        </Observer>
    );
}

export function AdminFormDetailHeaderView() {
    return (
        <div className="bg-surface shadow-sm">
            <AppBarView />
            <TabsListView />
        </div>
    );
}