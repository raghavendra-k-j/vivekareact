import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import UserPortalContainer from "../root/UserPortalContainer";
import { CourseList } from "./components/CourseList";
import { FormList } from "./components/FormsList";
import { HomePageContext, useHomePageStore } from "./HomePageContext";
import { HomePageStore } from "./HomePageStore";
import { CurrentFragment } from "./models/CurrentFragment";



function HomePageProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<HomePageStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new HomePageStore();
  }
  return (<HomePageContext.Provider value={storeRef.current}>
    {children}
  </HomePageContext.Provider>);
}


export default function HomePage() {
  return (<HomePageProvider>
    <HomePageInner />
  </HomePageProvider>);
}

function HomePageInner() {
  return (<UserPortalContainer>
    <MainContent />
    <MainContent />
  </UserPortalContainer>);
}


function MainContent() {
  const store = useHomePageStore();
  return (<Observer>
    {() => {
      if (store.currentFragment === CurrentFragment.COURSES) {
        return (<CourseList />);
      }
      else if (store.currentFragment === CurrentFragment.FORMS) {
        return (<FormList />);
      }
      return (<></>);
    }}
  </Observer>);
}