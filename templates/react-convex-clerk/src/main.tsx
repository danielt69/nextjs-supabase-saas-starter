import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import App from "./App";
import { ConfigNotice } from "./components/ConfigNotice";
import { getClerkPublishableKey, getConvexUrl, isConfigured } from "./lib/env";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

if (!isConfigured()) {
  // No real env yet — render a friendly setup screen instead of constructing
  // the Convex/Clerk clients (which would throw on empty values).
  root.render(
    <StrictMode>
      <ConfigNotice />
    </StrictMode>
  );
} else {
  const convex = new ConvexReactClient(getConvexUrl());
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={getClerkPublishableKey()}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </StrictMode>
  );
}
