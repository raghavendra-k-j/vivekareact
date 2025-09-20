import { useRef, useState } from "react";
import { Outlet } from "react-router";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useUserPortalStore } from "../root/UserPortalContext";
import { CoursePageContext } from "./CoursePageContext";
import { CoursePageStore } from "./CoursePageStore";
import { CourseAssessmentsView } from "./CourseAssessmentsView";
import { CourseReportsView } from "./CourseReportsView";
import { CourseOverviewView } from "./CourseOverviewView";
import { CourseAvatar } from "~/ui/portal/components/avatar/CourseAvatar";

function PageProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<CoursePageStore | null>(null);
  const userPortal = useUserPortalStore();

  if (!storeRef.current) {
    storeRef.current = new CoursePageStore({
      userPortal: userPortal
    });
  }

  return (
    <CoursePageContext.Provider value={storeRef.current}>
      {children}
    </CoursePageContext.Provider>
  );
}

function CoursePageInner() {
  const [showReports, setShowReports] = useState(false);

  return (
    <div className="bg-background h-full w-full flex flex-col min-h-0">
      {/* Sticky Header */}
      <div className="bg-surface border-b border-default shadow-sm lg:shadow-none sticky top-0 z-[200]">
        <div className="container mx-auto px-4 sm:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Back Button + Course Info */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-2 py-1 lg:px-3 lg:py-2 text-tertiary hover:text-default hover:bg-gray-50 rounded-md transition-colors"
                title="Back to courses"
              >
                <ArrowLeft size={14} className="lg:w-4 lg:h-4" />
                <span className="hidden sm:inline text-sm lg:text-base">Back</span>
              </button>
              
              {/* Course Details in Header */}
              <div className="flex items-center gap-2 lg:gap-3">
                <CourseAvatar 
                  name="Advanced Mathematics" 
                  color="#3b82f6" 
                  className="w-8 h-8 lg:w-10 lg:h-10"
                />
                <div>
                  <h1 className="text-lg lg:text-xl font-bold text-default">Advanced Mathematics</h1>
                  <p className="hidden lg:block text-sm text-tertiary">Instructor: Dr. Sarah Johnson</p>
                </div>
              </div>
            </div>
            
            {/* View Reports Button - Mobile Only */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReports(!showReports)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                title="View Reports"
              >
                <BarChart3 size={16} />
                <span className="text-sm font-medium">
                  {showReports ? 'Hide Reports' : 'View Reports'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 8/4 Column Layout */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="space-y-8">
            <CourseOverviewView onViewDetailedReports={() => setShowReports(true)} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Course Contents - Left Side (8 columns) */}
            <div className="lg:col-span-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-default mb-2">Course Contents</h2>
                <p className="text-tertiary text-sm">Complete assessments to track your progress</p>
              </div>
              <CourseAssessmentsView />
            </div>

              {/* Course Reports - Right Side (4 columns) - Desktop Only */}
              <div className="hidden lg:block lg:col-span-4 space-y-6">
                <CourseReportsView />
              </div>

            </div>
          </div>

          {/* Mobile Reports Modal/Overlay */}
          {showReports && (
            <div className="lg:hidden fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-4 border-b border-default flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-default">Course Reports</h3>
                  <button
                    onClick={() => setShowReports(false)}
                    className="text-tertiary hover:text-default p-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <CourseReportsView />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Outlet />
    </div>
  );
}export default function CoursePage() {
  return (
    <PageProvider>
      <CoursePageInner />
    </PageProvider>
  );
}