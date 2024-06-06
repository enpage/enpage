import React from "react";
// @ts-ignore
import Template from "virtual:enpage-template";
import {
  RunContext,
  useRunContext,
  DynamicCSS,
  type RunContextType,
  registry,
} from "@enpage/sdk";
// Import the enpage sdk reset
import "@enpage/style-system/editor.css";

const ctx: RunContextType = {
  mode: "edit",
  attributes: {},
  data: {},
  styles: {},
  cssRegistry: registry,
};

function Editor() {
  // const context = useRunContext();
  return (
    <>
      <Template />
      <DynamicCSS />
    </>
  );
}

function App() {
  return (
    <RunContext.Provider value={ctx}>
      <Editor />
    </RunContext.Provider>
  );
}

export default App;
