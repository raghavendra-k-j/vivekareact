import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { PageLoader } from "./ui/components/loaders/PageLoader";
import "./ui/ds/core/core.css";
import AdminLayout from "./ui/pages/admin/_layout/AdminLayout";
import NotFoundPage from "./ui/pages/error/NotFoundPage";


const UserPortalLayout = lazy(() => import("./ui/pages/portallayout/UserPortalLayout"));

const AuthLoginPage = lazy(() => import("./ui/pages/auth/login/LoginPage"));
const AuthSignUpPage = lazy(() => import("./ui/pages/auth/signup/SignUpPage"));
const AuthResetPasswordPage = lazy(() => import("./ui/pages/auth/reset/ResetPasswordPage"));
const AuthForgotPage = lazy(() => import("./ui/pages/auth/forgot/ForgotPage"));
const AdminPortalLayout = lazy(() => import("./ui/pages/portallayout/AdminPortalLayout"));
const AdminUsersPage = lazy(() => import("./ui/pages/admin/users/userslist/UsersPage"));
const AdminRolesPage = lazy(() => import("./ui/pages/admin/users/roles/RolesPage"));
const AdminImportUsersPage = lazy(() => import("./ui/pages/admin/users/import/ImportPage"));

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

                    {/* Admin Layout */}
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
                </Route>

                {/* Token login wrapped with AppLayout and softLogin = false */}
                <Route element={<AppLayout softLogin={false} />}>
                    <Route path="/token-login" element={<TokenLoginPage />} />
                    <Route path="/auto-login" element={<AutoLoginPage />} />
                    <Route path="/question-paper-generator" element={<QPGenPage />} />
                    <Route path="/auth">
                        <Route path="login" element={<AuthLoginPage />} />
                        <Route path="signup" element={<AuthSignUpPage />} />
                        <Route path="reset" element={<AuthResetPasswordPage />} />
                        <Route path="forgot" element={<AuthForgotPage />} />
                    </Route>
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
