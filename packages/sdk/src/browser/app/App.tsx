import type { GenericPageContext } from "~/shared/page-config";
import { EditorWrapper } from "./EditorWrapper";
import Page from "../page";

import "@enpage/style-system/default-theme.css";
// import "@enpage/style-system/quill.snow.css";
import "@enpage/style-system/quill.css";

function App({ ctx: { bricks } }: { ctx: GenericPageContext }) {
  return (
    <EditorWrapper initialBricks={bricks} enabled={true}>
      <Page bricks={bricks} />
    </EditorWrapper>
  );
}

export default App;
