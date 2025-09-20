import { useRef } from "react";
import { Outlet } from "react-router";
import { useUserPortalStore } from "../root/UserPortalContext";
import { HomeAppBar } from "../components/homeappbar/HomeAppBar";
import { HomePageContext } from "./HomePageContext";
import { HomePageStore } from "./HomePageStore";

function PageProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<HomePageStore | null>(null);
  const userPortal = useUserPortalStore();

  if (!storeRef.current) {
    storeRef.current = new HomePageStore({
      userPortal: userPortal
    });
  }

  return (<HomePageContext.Provider value={storeRef.current}>
    {children}
  </HomePageContext.Provider>);
}

export default function HomePage() {
  return (<PageProvider>
    <div className="bg-background h-full w-full overflow-y-hidden flex flex-col min-h-0">
      <HomeAppBar />
      <Outlet />
    </div>
  </PageProvider>);
}