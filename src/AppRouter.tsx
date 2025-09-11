import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { PageLoader } from "./ui/components/loaders/PageLoader";
import "./ui/ds/core/core.css";
import AdminLayout from "./ui/pages/admin/_layout/AdminLayout";
import NotFoundPage from "./ui/pages/error/NotFoundPage";


const UserPortalLayout = lazy(() => import("./ui/pages/portallayout/UserPortalLayout"));
const AdminPortalLayout = lazy(() => import("./ui/pages/portallayout/AdminPortalLayout"));
const AppLayout = lazy(() => import("./ui/pages/_layout/AppLayout"));
const AdminFormsLayout = lazy(() => import("./ui/pages/admin/forms/formdetail/layout/AdminFormLayout"));
const HomePage = lazy(() => import("./ui/pages/home/HomePage"));
const DSPage = lazy(() => import("./ui/pages/ds/DSPage"));
const TTSTestPage = lazy(() => import("./ui/pages/ttstest/TTSTestPage"));
const SubmitPage = lazy(() => import("./ui/pages/common/forms/submit/SubmitPage"));
const QuestionsPage = lazy(() => import("./ui/pages/admin/forms/formdetail/questions/QuestionsPage"));
const EditTranslationView = lazy(() => import("./ui/pages/admin/forms/formdetail/edittranslation/EditTranslationView"));
const UpsertQuestionPage = lazy(() => import("./ui/pages/admin/forms/formdetail/upsertquestion/UpsertQuestionPage"));
const AdminFormComparePage = lazy(() => import("./ui/pages/admin/forms/formdetail/compare/ComparePage"));
const TokenLoginPage = lazy(() => import("./ui/pages/tokenlogin/TokenLoginPage"));
const AutoLoginPage = lazy(() => import("./ui/pages/autologin/AutoLoginPage"));
const QPGenPage = lazy(() => import("./ui/pages/admin/qpgen/QPGenPage"));


// Billing
const BillingLayout = lazy(() => import("./ui/pages/billing/layout/BillingLayout"));
const MyPlanPage = lazy(() => import("./ui/pages/billing/myplan/MyPlanPage"));
const PlansPage = lazy(() => import("./ui/pages/billing/plans/PlansPage"));
const PaymentsPage = lazy(() => import("./ui/pages/billing/payments/PaymentsPage"));
const TopUpPage = lazy(() => import("./ui/pages/billing/topup/TopUpPage"));
const CheckoutPage = lazy(() => import("./ui/pages/billing/checkout/CheckoutPage"));


// MainDomain 
const MainHome = lazy(() => import("./ui/pages/main/home/HomePage"));

export default function AppRouter() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* AppLayout with default props */}
                <Route element={<AppLayout softLogin={true} />}>
                    {/* Public routes */}
                    <Route path="/ds" element={<DSPage />} />
                    <Route path="/ttstest" element={<TTSTestPage />} />
                    <Route path="/forms/:permalink/submit" element={<SubmitPage />} />


                    {/* Admin Layout */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route path="forms/:permalink" element={<AdminFormsLayout />}>
                            <Route index element={<QuestionsPage />} />
                            <Route path="questions" element={<QuestionsPage />} />
                            <Route path="upsert-question" element={<UpsertQuestionPage />} />
                            <Route path="compare" element={<AdminFormComparePage />} />
                            <Route path="translations/:languageId" element={<EditTranslationView />} />
                        </Route>
                    </Route>

                </Route>

                {/* Token login wrapped with AppLayout and softLogin = false */}
                <Route element={<AppLayout softLogin={false} />}>
                    <Route path="/token-login" element={<TokenLoginPage />} />
                    <Route path="/auto-login" element={<AutoLoginPage />} />
                    <Route path="/question-paper-generator" element={<QPGenPage />} />
                </Route>

                <Route element={<AppLayout softLogin={true} />}>
                    <Route element={<UserPortalLayout />}>
                        <Route path="/" element={<HomePage />} />
                    </Route>
                </Route>


                <Route element={<AppLayout softLogin={true} />}>
                    <Route path="/billing" element={<BillingLayout showAppbar={true} />}>
                        <Route path="my-plan" element={<MyPlanPage />} />
                        <Route path="plans" element={<PlansPage />} />
                        <Route path="payments" element={<PaymentsPage />} />
                        <Route path="topup" element={<TopUpPage />} />
                    </Route>

                    {/* Checkout without appbar */}
                    <Route path="/billing" element={<BillingLayout showAppbar={false} />}>
                        <Route path="checkout" element={<CheckoutPage />} />
                    </Route>
                </Route>

                <Route path="/main">
                    <Route path="" element={<MainHome />} />
                </Route>


                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

        </Suspense>
    );
}
