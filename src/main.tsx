import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import CreateSimulation from "./pages/CreateSimulation.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.tsx";
import SimulationDetail from "./pages/SimulationDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import SimulationStep from "./pages/SimulationStep.tsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: App,
      children: [
        { index: true, Component: Home },
        { path: "dashboard", Component: Dashboard },
        {
          path: "simulation/new",
          Component: CreateSimulation,
          children: [{ path: ":stepNumber", Component: SimulationStep }],
        },
        { path: "simulation/:id", Component: SimulationDetail },
        { path: "*", Component: NotFound },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
