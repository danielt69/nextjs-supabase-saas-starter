import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ConfigNotice } from "./components/ConfigNotice";
import { isConfigured } from "./lib/env";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>{isConfigured() ? <App /> : <ConfigNotice />}</StrictMode>
);
