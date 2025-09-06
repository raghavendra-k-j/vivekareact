import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRouter from "./AppRouter";
import { BaseEnv } from "./core/config/BaseEnv";
import { ServiceURL } from "./infra/datasources/ServiceURL";
import MainRouter from "./MainRouter";
import { BaseApiClient } from "./infra/datasources/BaseApiClient";
import { DialogManagerProvider } from "./ui/widgets/dialogmanager";
import { ToastContainer } from "react-toastify";
import { AppUrl } from "./infra/utils/AppUrl";

async function bootstrap() {
  const baseEnv = await BaseEnv.loadFromFile();
  console.log("BaseEnv Loaded", baseEnv);

  let basename = import.meta.env.BASE_URL;
  if (!basename || basename === "/") basename = "/";
  else basename = basename.replace(/\/+$/, "");

  // Create Api Clients
  BaseApiClient.createInstace({ baseURL: baseEnv.apiUrl });

  const ResolvedRouter = baseEnv.isMainSite ? MainRouter : AppRouter;
  ServiceURL.createInstance({ baseUrl: baseEnv.apiUrl });
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
});