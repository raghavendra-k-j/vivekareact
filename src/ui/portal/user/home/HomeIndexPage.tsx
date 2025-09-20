import { useEffect } from "react";
import { useAppStore } from "../../layout/app/AppContext";
import { useUserPortalStore } from "../root/UserPortalContext";
import { navigateToDefault } from "./navigateUtils";

export default function HomeIndexPage() {
  const appStore = useAppStore();
  const userPortal = useUserPortalStore();

  useEffect(() => {
    if (!userPortal.userAppConfigState.isData) return;
    navigateToDefault({ appStore: appStore, userPortalStore: userPortal });
  }, [appStore, userPortal]);


  return null;
}
