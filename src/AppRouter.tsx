import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
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
const HomeLayout = lazy(() => import("./ui/portal/user/home/HomeLayout"));
const HomeIndexPage = lazy(() => import("./ui/portal/user/home/HomeIndexPage"));
const CoursesPage = lazy(() => import("./ui/portal/user/courses/CoursesPage"));
const FormsPage = lazy(() => import("./ui/portal/user/forms/FormsPage"));



// Admin Pages
const AdminHomePage = lazy(() => import("./ui/portal/admin/home/HomePage"));
const AdminUsersPage = lazy(() => import("./ui/portal/admin/usermgmt/userslist/UsersPage"));
const AdminRolesPage = lazy(() => import("./ui/portal/admin/usermgmt/roles/RolesPage"));
const AdminImportUsersPage = lazy(() => import("./ui/portal/admin/usermgmt/import/ImportPage"));
const AdminCategoriesPage = lazy(() => import("./ui/portal/admin/forms/categories/CategoriesPage"));

const AdminLMSLayout = lazy(() => import("./ui/portal/admin/lms/layout/LMSLayout"));
const AdminLMSHomePage = lazy(() => import("./ui/portal/admin/lms/home/LMSHomePage"));
const AdminAllSpacesPage = lazy(() => import("./ui/portal/admin/lms/home/allspaces/AllSpacesPage"));
const AdminCoursesPage = lazy(() => import("./ui/portal/admin/lms/home/AdminCoursesPage"));
const AdminCourseLayout = lazy(() => import("./ui/portal/admin/lms/course/layout/CourseLayout"));
const AdminContentPage = lazy(() => import("./ui/portal/admin/lms/course/content/ContentPage"));
const AdminMembersPage = lazy(() => import("./ui/portal/admin/lms/course/members/MembersPage"));
const AdminReportsPage = lazy(() => import("./ui/portal/admin/lms/course/reports/ReportsPage"));
const AdminSettingsPage = lazy(() => import("./ui/portal/admin/lms/course/settings/SettingsPage"));
const AdminLMSHomePageNavigator = lazy(() => import("./ui/portal/admin/lms/home/LMSHomePageNavigator"));


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

// Org Settings Pages
const AdminOrgSettingsLayout = lazy(() => import("./ui/portal/admin/orgsettings/layout/OrgSettingsLayout"));
const AdminGeneralSettingsPage = lazy(() => import("./ui/portal/admin/orgsettings/general/GeneralSettingsPage"));
const AdminEntityDictSettingsPage = lazy(() => import("./ui/portal/admin/orgsettings/entitydict/EntityDictSettingsPage"));
const AdminUserAppSettingsPage = lazy(() => import("./ui/portal/admin/orgsettings/userapp/UserAppSettingsPage"));



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
        <Route element={<HomeLayout />}>
            <Route index element={<HomeIndexPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="assessments" element={<FormsPage />} />
            <Route path="surveys" element={<FormsPage />} />
        </Route>
    </Route>
);

const adminPortalRoutes = (
    <Route path="/console" element={<AdminPortalLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="forms">
            <Route index element={<AdminFormsLayout />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
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

        <Route path="lms" element={<AdminLMSLayout />}>
            <Route index element={<AdminLMSHomePageNavigator />} />
            <Route path="spaces" element={<AdminLMSHomePage />}>
                <Route index element={<AdminAllSpacesPage />} />
                <Route path=":id/*" element={<AdminAllSpacesPage />} />
            </Route>
            <Route path="my-courses" element={<AdminCoursesPage />} />
            <Route path="courses/:courseId" element={<AdminCourseLayout />}>
                <Route index element={<Navigate replace to="content" />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="members" element={<AdminMembersPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
        </Route>

        <Route path="users" element={<AdminUsersPage />} />
        <Route path="roles" element={<AdminRolesPage />} />
        <Route path="import-users" element={<AdminImportUsersPage />} />
        <Route path="question-paper-generator" element={<QPGenPage />} />
        <Route path="org-settings" element={<AdminOrgSettingsLayout />}>
            <Route index element={<Navigate replace to="general" />} />
            <Route path="general" element={<AdminGeneralSettingsPage />} />
            <Route path="entitydict" element={<AdminEntityDictSettingsPage />} />
            <Route path="userapp" element={<AdminUserAppSettingsPage />} />
        </Route>
    </Route>
);
