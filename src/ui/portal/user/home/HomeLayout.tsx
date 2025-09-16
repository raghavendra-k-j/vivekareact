import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { useRootLayoutStore } from "../../layout/root/RootLayoutContext";
import { HomeAppBar } from "./components/HomeAppBar";
import { HomeLayoutContext, useHomeLayoutStore } from "./HomeLayoutContext";
import { HomeLayoutStore } from "./HomeLayouteStore";

function HomeLayoutProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<HomeLayoutStore | null>(null);
  const rootLayoutStore = useRootLayoutStore();
  if (!storeRef.current) {
    storeRef.current = new HomeLayoutStore({
      rootLayoutStore: rootLayoutStore
    });
  }
  return (<HomeLayoutContext.Provider value={storeRef.current}>
    {children}
  </HomeLayoutContext.Provider>);
}


export default function HomeLayout() {
  return (<HomeLayoutProvider>
    <HomePageInner />
  </HomeLayoutProvider>);
}

function HomePageInner() {
  const store = useHomeLayoutStore();
  useEffect(() => {
    console.log("Loading home layout");
    store.loadLayout();
  }, [store]);
  return (<div className="bg-background h-full overflow-y-hidden">
    <HomeAppBar />
    <Observer>
      {() => {
        if (store.layoutDataState.isLoading) {
          return (<div className="h-full flex justify-center items-center"><LoaderView /></div>);
        }
        return (<Outlet />);
      }}
    </Observer>
  </div>);
}