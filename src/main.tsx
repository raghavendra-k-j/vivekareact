import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppRouter from "./AppRouter";
import { BaseEnv } from "./core/config/BaseEnv";
import { ServiceURL } from "./infra/datasources/ServiceURL";
import MainRouter from "./MainRouter";

async function bootstrap() {
  const baseEnv = await BaseEnv.loadFromFile();
  console.log("BaseEnv Loaded", baseEnv);

  let basename = import.meta.env.BASE_URL;
  if (!basename || basename === "/") basename = "/";
  else basename = basename.replace(/\/+$/, "");

  const ResolvedRouter = baseEnv.isMainSite ? MainRouter : AppRouter;
  ServiceURL.createInstance({ baseUrl: baseEnv.apiBase });

  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter basename={basename}>
        <ResolvedRouter />
      </BrowserRouter>
    </StrictMode>
  );
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap app", err);
});