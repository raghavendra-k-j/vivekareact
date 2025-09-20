import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import AppRouter from "./AppRouter";
import { BaseEnv } from "./core/config/BaseEnv";
import { BaseApiClient } from "./infra/datasources/BaseApiClient";
import { ServiceUrl } from "./infra/datasources/ServiceUrl";
import { AppUrl } from "./infra/utils/AppUrl";
import MainRouter from "./MainRouter";
import { DialogManagerProvider } from "./ui/widgets/dialogmanager";
// import ReportsApp from "./ui/pages/main/test/ReportsApp";

async function bootstrap() {
  const baseEnv = await BaseEnv.loadFromFile();
  console.log("BaseEnv Loaded", baseEnv);

  let basename = import.meta.env.BASE_URL;
  if (!basename || basename === "/") basename = "/";
  else basename = basename.replace(/\/+$/, "");

  // Create Api Clients
  BaseApiClient.createInstace({ baseURL: baseEnv.apiUrl });

  const ResolvedRouter = baseEnv.isMainSite ? MainRouter : AppRouter;
  ServiceUrl.createInstance({ baseUrl: baseEnv.apiUrl });
  AppUrl.createInstance({ baseUrl: baseEnv.websiteBaseUrl });

  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");


  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter basename={basename}>
        <DialogManagerProvider>
          <ResolvedRouter />
        </DialogManagerProvider>
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </StrictMode>
  );
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap app", err);
  document.write("Failed to load app");
});