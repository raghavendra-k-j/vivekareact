import { useEffect } from "react";
import { useHomeLayoutStore } from "./HomeLayoutContext";

export default function HomeIndexPage() {
  const homeStore = useHomeLayoutStore();
  useEffect(() => {
    if (!homeStore.layoutDataState.isData) return;
    homeStore.rootLayoutStore.navigate(homeStore.homeLayout.navigation.defaultItemId);
  }, [homeStore]);
  return null;
}
