import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import NotFoundPage from "./ui/components/errorpages/NotFoundPage";
import { PageLoader } from "./ui/components/loaders/PageLoader";
import "./ui/ds/core/core.css";
import AdminLayout from "./ui/portal/admin/_layout/AdminLayout";

// Core Layouts
const RootLayout = lazy(() => import("./ui/portal/layout/root/RootLayout"));
const AppLayout = lazy(() => import("./ui/portal/layout/app/AppLayout"));
const PortalLayout = lazy(() => import("./ui/portal/layout/portal/PortalLayout"));

// Admin And User Portal Layouts
const UserPortalLayout = lazy(() => import("./ui/portal/user/root/UserPortalLayout"));
const AdminPortalLayout = lazy(() => import("./ui/portal/admin/root/AdminPortalLayout"));

// Auth Pages
const AuthLoginPage = lazy(() => import("./ui/portal/auth/login/LoginPage"));
const AuthSignUpPage = lazy(() => import("./ui/portal/auth/signup/SignUpPage"));
const AuthResetPasswordPage = lazy(() => import("./ui/portal/auth/reset/ResetPasswordPage"));
const AuthForgotPage = lazy(() => import("./ui/portal/auth/forgot/ForgotPage"));


// User Pages
const HomePage = lazy(() => import("./ui/portal/user/home/HomePage"));




// Admin Pages
const AdminUsersPage = lazy(() => import("./ui/portal/admin/usermgmt/userslist/UsersPage"));
const AdminRolesPage = lazy(() => import("./ui/portal/admin/usermgmt/roles/RolesPage"));
const AdminImportUsersPage = lazy(() => import("./ui/portal/admin/usermgmt/import/ImportPage"));



const AdminFormsLayout = lazy(() => import("./ui/portal/admin/forms/formdetail/layout/AdminFormLayout"));
const SubmitPage = lazy(() => import("./ui/portal/common/forms/submit/SubmitPage"));
const QuestionsPage = lazy(() => import("./ui/portal/admin/forms/formdetail/questions/QuestionsPage"));
const EditTranslationView = lazy(() => import("./ui/portal/admin/forms/formdetail/edittranslation/EditTranslationView"));
const UpsertQuestionPage = lazy(() => import("./ui/portal/admin/forms/formdetail/upsertquestion/UpsertQuestionPage"));
const AdminFormComparePage = lazy(() => import("./ui/portal/admin/forms/formdetail/compare/ComparePage"));
const TokenLoginPage = lazy(() => import("./ui/portal/linklogin/TokenLoginPage"));
const AutoLoginPage = lazy(() => import("./ui/portal/linklogin/AutoLoginPage"));
const QPGenPage = lazy(() => import("./ui/portal/admin/qpgen/QPGenPage"));


// Billing
const BillingLayout = lazy(() => import("./ui/portal/admin/billing/layout/BillingLayout"));
const MyPlanPage = lazy(() => import("./ui/portal/admin/billing/myplan/MyPlanPage"));
const PlansPage = lazy(() => import("./ui/portal/admin/billing/plans/PlansPage"));
const PaymentsPage = lazy(() => import("./ui/portal/admin/billing/payments/PaymentsPage"));
const TopUpPage = lazy(() => import("./ui/portal/admin/billing/topup/TopUpPage"));
const CheckoutPage = lazy(() => import("./ui/portal/admin/billing/checkout/CheckoutPage"));


export default function AppRouter() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>

                <Route element={<RootLayout />}>
                    <Route element={<AppLayout softLogin={true} />}>
                        <Route element={<PortalLayout />}>
                            {userPortalRoutes}
                            {adminPortalRoutes}
                        </Route>
                        {authRoutes}
                    </Route>
                </Route>


                {/* AppLayout with default props */}
                <Route element={<AppLayout softLogin={true} />}>
                    {/* Public routes */}
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

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

        </Suspense>
    );
}



const authRoutes = (
    <Route path="auth">
        <Route path="login" element={<AuthLoginPage />} />
        <Route path="signup" element={<AuthSignUpPage />} />
        <Route path="reset-password" element={<AuthResetPasswordPage />} />
        <Route path="forgot-password" element={<AuthForgotPage />} />
    </Route>
);

const userPortalRoutes = (
    <Route element={<UserPortalLayout />}>
        <Route path="/" element={<HomePage />} />
    </Route>
);

const adminPortalRoutes = (
    <Route path="/console" element={<AdminPortalLayout />}>
        <Route path="forms">
            <Route index element={<div>All Forms</div>} />
            <Route path="categories" element={<div>Categories</div>} />
            <Route path=":permalink">
                <Route path="questions" element={<div>Sigle Form Details</div>} />
                <Route path="settings">
                    <Route path="general" element={<div>General Settings</div>} />
                    <Route path="translations" element={<div>Translations Settings</div>} />
                </Route>
                <Route path="sharing">
                    <Route path="invite" element={<div>Invite</div>} />
                    <Route path="link" element={<div>Public Link</div>} />
                    <Route path="notifications" element={<div>Notifications</div>} />
                </Route>
                <Route path="responses" element={<div>Responses</div>} />
                <Route path="compare-results" element={<div>Compare Results</div>} />
                <Route path="reports" element={<div>Reports</div>} />
            </Route>
        </Route>
        <Route path="spaces">
            <Route index element={<div>Spaces</div>} />
            <Route path=":id">
                <Route path="content" element={<div>Content</div>} />
                <Route path="members" element={<div>Members</div>} />
                <Route path="reports" element={<div>Reports</div>} />
                <Route path="settings" element={<div>Settings</div>} />
            </Route>
        </Route>
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="roles" element={<AdminRolesPage />} />
        <Route path="import-users" element={<AdminImportUsersPage />} />
        <Route path="org-settings">
            <Route path="general" element={<div>Org Settings</div>} />
            <Route path="terminologies" element={<div>Terminologies</div>} />
        </Route>
    </Route>
);