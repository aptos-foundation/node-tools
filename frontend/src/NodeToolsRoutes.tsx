import React from "react";
import {Route, Routes} from "react-router-dom";
import LandingPage from "./pages/LandingPage/Index";
import NotFoundPage from "./pages/NotFoundPage";
import NodeToolsLayout from "./pages/layout";
import {NodeCheckerPage} from "./pages/NodeChecker/Index";

export default function NodeToolsRoutes() {
  return (
    <NodeToolsLayout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/node_checker" element={<NodeCheckerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </NodeToolsLayout>
  );
}
