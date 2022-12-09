import React from "react";
import ReactDOM from "react-dom";
import {HashRouter, Route} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import NodeToolsRoutes from "./NodeToolsRoutes";

// Inform the compiler of the existence of the window.aptos API
declare global {
  interface Window {
    aptos: any;
  }
}

const queryClient = new QueryClient();

// Delay rendering the application until the window.onload event has fired when integrating with the window.aptos API
// Note: HashRouter is only needed because of GH pages, otherwise we should use BrowserRouter.
window.addEventListener("load", () => {
  ReactDOM.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <NodeToolsRoutes />
        </HashRouter>
      </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById("root"),
  );
});
