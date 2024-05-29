import Template from "../src/template";
import { RunContext, type RunContextType } from "@enpage/sdk";
// Import the enpage sdk reset
import "@enpage/style-system/reset.css";
import "@enpage/style-system/editor.css";

const ctx: RunContextType = {
  mode: "edit",
  attributes: {},
  data: {},
  styles: {},

  // onSelectBlock(blockId) {
  //   console.log("Selected block", blockId);
  // },
};

function App() {
  return (
    <>
      <RunContext.Provider value={ctx}>
        <Template
          attributes={{
            title: "foo",
            backgroundColor: "$gray-500",
            preferedPizza: Math.random() > 0.5 ? "pepperoni" : "hawaiian",
          }}
          styles={{
            page: {
              // background: "linear-gradient(45deg, #000 0%, #333 100%)",
            },
          }}
          data={{
            links: [
              {
                title: "Google",
                url: "https://google.com",
              },
              {
                title: "Facebook",
                url: "https://facebook.com",
              },
            ],
          }}
        />
      </RunContext.Provider>
    </>
  );
}

export default App;
