// import {
//     BookOpenCheck,
//     CheckCircle2,
//     FileSearch,
//     FileText,
//     Users,
//     XCircle
// } from "lucide-react";
// import { Link } from "react-router";
// import { DateFmt } from "~/core/utils/DateFmt";
// import { Badge } from "~/ui/widgets/badges/Badge";
// import { Button } from "~/ui/widgets/button/Button";
// import { useMyPlanPageStore } from "./MyPlanPageContext";
// import { MyPlanPageProvider } from "./MyPlanPageProvider";

// export default function MyPlanPage() {
//     return (
//         <div className="h-full overflow-y-auto">
//             <MyPlanPageProvider>
//                 <MyPlanPageInner />
//             </MyPlanPageProvider>
//         </div>
//     );
// }

// function MyPlanPageInner() {
//     return (
//         <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
//             <PlanOverviewCard />
//             <PlanUsageBreakdownGrid />
//         </div>
//     );
// }

// function PlanOverviewCard() {
//     const { plan } = useMyPlanPageStore();
//     const isExpired = !plan.isActive;
//     const isFree = plan.isFree;

//     return (
//         <div className="bg-surface border border-default rounded-sm shadow-sm p-4 flex justify-between items-start">
//             <div>
//                 <Badge variant="soft" color={isExpired ? "red" : "primary"}>
//                     {isExpired ? "Expired" : "Active"}
//                 </Badge>
//                 <div className="text-base font-semibold mt-1">{plan.name}</div>
//                 <div className="text-sm text-secondary">
//                     {isFree ? (
//                         <>You're on the Free Plan. Upgrade to unlock more features and higher usage limits.</>
//                     ) : plan.endsAt ? (
//                         <>Your plan {isExpired ? "expired" : "expires"} on {DateFmt.datetime(plan.endsAt)}</>
//                     ) : (
//                         <>Your plan does not expire</>
//                     )}
//                 </div>
//             </div>
//             <Link to="/billing/plans">
//                 <Button size="sm">
//                     {isFree ? "Upgrade Plan" : "Manage Subscription"}
//                 </Button>
//             </Link>
//         </div>
//     );
// }

// function PlanUsageBreakdownGrid() {
//     return (
//         <div>
//             <h2 className="text-xl font-bold mb-2">Plan Usage</h2>
//             <div className="columns-1 md:columns-2 gap-4 space-y-4">
//                 <UsersUsageDetail />
//                 {/* <FormsUsageDetail /> */}
//                 {/* <QuestionPaperUsageDetail />
//                 <SummarizerUsageDetail /> */}
//             </div>
//         </div>
//     );
// }

// type FeatureItemProps = {
//     label: string;
//     value: React.ReactNode;
// };

// type UsageBlockProps = {
//     label: string;
//     remaining: number;
//     unitLabel: string;
//     icon: React.ReactNode;
//     features?: FeatureItemProps[];
//     showTopup?: boolean;
// };

// export function UsageBlock({
//     label,
//     remaining,
//     unitLabel,
//     icon,
//     features = [],
//     showTopup = true
// }: UsageBlockProps) {
//     return (
//         <div className="border border-default rounded-sm bg-surface break-inside-avoid shadow-sm">
//             <div className="flex items-start gap-4 p-4">
//                 {icon}
//                 <div className="flex flex-row flex-1 justify-between">
//                     <div>
//                         <div className="text-base font-semibold">{label}</div>
//                         <div className="flex justify-between items-start text-sm text-secondary">
//                             <span className="leading-5">
//                                 <span className="font-semibold text-primary">
//                                     {remaining.toLocaleString()}
//                                 </span>{" "}
//                                 {unitLabel} remaining
//                             </span>
//                         </div>
//                     </div>
//                     {showTopup && (
//                         <Link to="/billing/plans">
//                             <Button size="xs" variant="outline" className="ml-4">
//                                 Top up
//                             </Button>
//                         </Link>
//                     )}
//                 </div>
//             </div>
//             {features.length > 0 && (
//                 <>
//                     <div className="border-t border-default" />
//                     <FeatureList features={features} />
//                 </>
//             )}
//         </div>
//     );
// }

// function FeatureList({ features }: { features: FeatureItemProps[] }) {
//     return (
//         <ul className="text-sm divide-y divide-secondary">
//             {features.map((f, idx) => (
//                 <li
//                     key={idx}
//                     className="flex justify-between items-center px-4 py-2 first:pt-3 last:pb-3"
//                 >
//                     <span className="text-gray-700">{f.label}</span>
//                     <span>{f.value}</span>
//                 </li>
//             ))}
//         </ul>
//     );
// }

// function FeatureYesNoView({ value }: { value: boolean }) {
//     return value ? (
//         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//     ) : (
//         <XCircle className="w-4 h-4 text-gray-400" />
//     );
// }

// function UsageBlockIcon({
//     icon: Icon,
//     bgColor,
//     iconColor
// }: {
//     icon: React.ElementType;
//     bgColor: string;
//     iconColor: string;
// }) {
//     return (
//         <div className={`w-12 h-12 p-3 rounded-sm ${bgColor}`}>
//             <Icon className={`w-full h-full ${iconColor}`} />
//         </div>
//     );
// }

// function UsersUsageDetail() {
//     const { plan } = useMyPlanPageStore();
//     return (
//         <UsageBlock
//             label="Number of Users"
//             remaining={plan.usersLimit}
//             unitLabel="users"
//             icon={
//                 <UsageBlockIcon
//                     icon={Users}
//                     bgColor="bg-blue-50"
//                     iconColor="text-blue-500"
//                 />
//             }
//             showTopup={false}
//         />
//     );
// }

// // function FormsUsageDetail() {
// //     const { plan } = useMyPlanPageStore();
// //     return (
// //         <UsageBlock
// //             label="Assessments and Surveys"
// //             remaining={plan.formRemainingUnits}
// //             unitLabel="forms"
// //             icon={
// //                 <UsageBlockIcon
// //                     icon={FileText}
// //                     bgColor="bg-indigo-50"
// //                     iconColor="text-indigo-500"
// //                 />
// //             }
// //             features={[
// //                 {
// //                     label: "AI Translation",
// //                     value: <FeatureYesNoView value={plan.formAITranslationEnabled} />
// //                 },
// //                 {
// //                     label: "AI Evaluation",
// //                     value: <FeatureYesNoView value={plan.formAIEvaluationEnabled} />
// //                 },
// //                 {
// //                     label: "AI Equation Support",
// //                     value: <FeatureYesNoView value={plan.formAIEquationEnabled} />
// //                 },
// //                 {
// //                     label: "Maximum File Size",
// //                     value: "20 MB"
// //                 },
// //             ]}
// //         />
// //     );
// // }

// // function QuestionPaperUsageDetail() {
// //     const { plan } = useMyPlanPageStore();
// //     return (
// //         <UsageBlock
// //             label="Question Papers"
// //             remaining={plan.qpRemainingUnits}
// //             unitLabel="papers"
// //             icon={
// //                 <UsageBlockIcon
// //                     icon={BookOpenCheck}
// //                     bgColor="bg-teal-50"
// //                     iconColor="text-teal-500"
// //                 />
// //             }
// //             features={[
// //                 {
// //                     label: "AI Equation Support",
// //                     value: <FeatureYesNoView value={plan.qpAIEquationEnabled} />
// //                 },
// //                 {
// //                     label: "Maximum File Size",
// //                     value: "25 MB"
// //                 },
// //             ]}
// //         />
// //     );
// // }

// // function SummarizerUsageDetail() {
// //     const { plan } = useMyPlanPageStore();
// //     return (
// //         <UsageBlock
// //             label="Summaries"
// //             remaining={plan.summarizerRemainingUnits}
// //             unitLabel="summaries"
// //             icon={
// //                 <UsageBlockIcon
// //                     icon={FileSearch}
// //                     bgColor="bg-rose-50"
// //                     iconColor="text-rose-500"
// //                 />
// //             }
// //             features={[
// //                 {
// //                     label: "Maximum File Size",
// //                     value: "15 MB"
// //                 }
// //             ]}
// //         />
// //     );
// // }
