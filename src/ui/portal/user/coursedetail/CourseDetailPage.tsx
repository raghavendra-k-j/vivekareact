// CourseDetailPage.tsx
import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useUserPortalStore } from "../root/UserPortalContext";
import { CourseDetailContext, useCourseDetailStore } from "./CourseDetailContext";
import { CourseDetailStore } from "./CourseDetailStore";
import { CourseDetailAppBar } from "./components/AppBar";
import { CourseDetailMainContent } from "./components/MainContent";

function PageProvider({ children }: { children: React.ReactNode }) {
  const { permalink } = useParams<{ permalink: string }>();
  const userPortalStore = useUserPortalStore();
  const storeRef = useRef<CourseDetailStore | null>(null);

  if (permalink === undefined || permalink === null || permalink.trim() === "") {
    throw new Error("Permalink is required");
  }

  if (!storeRef.current || storeRef.current.permalink !== permalink) {
    storeRef.current = new CourseDetailStore({
      userPortalStore,
      permalink,
    });
  }

  return (
    <CourseDetailContext.Provider value={storeRef.current}>
      {children}
    </CourseDetailContext.Provider>
  );
}

function PageInner() {
  const store = useCourseDetailStore();

  useEffect(() => {
    if (store.loadState.isInit) {
      store.loadCourseDetail();
    }
  }, [store]);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-y-hidden">
      <CourseDetailAppBar />
      <CourseDetailMainContent />
    </div>
  );
}

export default function CourseDetailPage() {
  return (
    <PageProvider>
      <PageInner />
    </PageProvider>
  );
}
