import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import "./ui/ds/core/core.css";

import { FormType } from "./domain/forms/models/FormType";
import { PageLoader } from "./ui/components/loaders/PageLoader";
import OrgThemeProvider from "./ui/portal/orgtheme/OrgThemeProvider";

const NotFoundPage = lazy(() => import("./ui/components/errorpages/NotFoundPage"));
const HomeIndexPage = lazy(() => import("./ui/portal/user/home/HomeIndexPage"));
const SubmitPage = lazy(() => import("./ui/portal/common/forms/submit/SubmitPage"));
const QPGenPage = lazy(() => import("./ui/portal/admin/qpgen/QPGenPage"));

// Core Layouts
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
const HomeLayout = lazy(() => import("./ui/portal/user/home/HomePage"));

// Scaffolded User Pages
const CourseListPage = lazy(() => import("./ui/portal/user/courselist/CourseListPage"));
const CoursePage = lazy(() => import("./ui/portal/user/course/CoursePage"));
const FormsListPage = lazy(() => import("./ui/portal/user/formslist/FormsListPage"));


// Admin Pages
const AdminHomePage = lazy(() => import("./ui/portal/admin/home/HomePage"));
const AdminUsersPage = lazy(() => import("./ui/portal/admin/usermgmt/userslist/UsersPage"));
const AdminRolesPage = lazy(() => import("./ui/portal/admin/usermgmt/roles/RolesPage"));
const AdminImportUsersPage = lazy(() => import("./ui/portal/admin/usermgmt/import/ImportPage"));
const AdminCategoriesPage = lazy(() => import("./ui/portal/admin/forms/categories/CategoriesPage"));

const AdminFormsModuleLayout = lazy(() => import("./ui/portal/admin/forms/layout/FormsLayout"));
const AdminFormsListPage = lazy(() => import("./ui/portal/admin/forms/formslist/AdminFormsListPage"));
const AdminFormDetailLayout = lazy(() => import("./ui/portal/admin/forms/details/layout/FormDetailLayout"));

const AdminLMSLayout = lazy(() => import("./ui/portal/admin/lms/layout/LMSLayout"));
const AdminLMSHomePage = lazy(() => import("./ui/portal/admin/lms/home/LMSHomePage"));
const AdminAllSpacesPage = lazy(() => import("./ui/portal/admin/lms/home/allspaces/AllSpacesPage"));
const AdminMyCoursesPage = lazy(() => import("./ui/portal/admin/lms/home/mycourses/MyCoursesPage"));

const AdminCourseLayout = lazy(() => import("./ui/portal/admin/lms/course/layout/CourseLayout"));
const AdminContentPage = lazy(() => import("./ui/portal/admin/lms/course/content/ContentPage"));
const AdminMembersPage = lazy(() => import("./ui/portal/admin/lms/course/members/MembersPage"));
const AdminTopicsPage = lazy(() => import("./ui/portal/admin/lms/course/topics/TopicsPage"));
const AdminReportsPage = lazy(() => import("./ui/portal/admin/lms/course/reports/ReportsPage"));
const AdminSettingsPage = lazy(() => import("./ui/portal/admin/lms/course/settings/SettingsPage"));
const AdminLMSHomePageNavigator = lazy(() => import("./ui/portal/admin/lms/home/LMSHomePageNavigator"));

// Org Settings Pages
const AdminOrgSettingsLayout = lazy(() => import("./ui/portal/admin/orgsettings/layout/OrgSettingsLayout"));
const AdminGeneralSettingsPage = lazy(() => import("./ui/portal/admin/orgsettings/general/GeneralSettingsPage"));
const AdminEntityDictSettingsPage = lazy(() => import("./ui/portal/admin/orgsettings/entitydict/EntityDictSettingsPage"));
const AdminUserAppSettingsPage = lazy(() => import("./ui/portal/admin/orgsettings/userapp/UserAppSettingsPage"));



export default function AppRouter() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route element={<AppLayout softLogin={true} />}>
                    <Route element={<OrgThemeProvider />}>
                        <Route path="*" element={<NotFoundPage />} />
                        <Route element={<PortalLayout />}>
                            {userPortalRoutes}
                            {adminPortalRoutes}
                        </Route>
                        {authRoutes}
                        {appCommonRoutes}
                    </Route>
                </Route>
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
            <Route path="courses" element={<CourseListPage />} />
            <Route path="assessments" element={<FormsListPage formType={FormType.Assessment} />} />
            <Route path="surveys" element={<FormsListPage formType={FormType.Survey} />} />
        </Route>
        <Route path="courses/:permalink" element={<CoursePage />} />
    </Route>
);


const appCommonRoutes = (
    <Route>
        <Route path="forms/:permalink" element={<SubmitPage />} />
    </Route>
);


const adminPortalRoutes = (
    <Route path="/console" element={<AdminPortalLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="forms" element={<AdminFormsModuleLayout />}>
            <Route index element={<AdminFormsListPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path=":permalink" element={<AdminFormDetailLayout />}>
                <Route index element={<Navigate replace to="questions" />} />
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
                <Route path=":permalink/*" element={<AdminAllSpacesPage />} />
            </Route>
            <Route path="my-courses" element={<AdminMyCoursesPage />} />


            <Route path="courses/:permalink" element={<AdminCourseLayout />}>
                <Route index element={<Navigate replace to="content" />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="members" element={<AdminMembersPage />} />
                <Route path="topics" element={<AdminTopicsPage />} />
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