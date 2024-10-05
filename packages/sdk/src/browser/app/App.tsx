import type { GenericPageContext } from "~/shared/page-config";
import "@enpage/style-system/default-theme.css";
import { EditorWrapper } from "./EditorWrapper";
import Page from "../page";

function App({ ctx: { bricks } }: { ctx: GenericPageContext }) {
  return (
    <EditorWrapper initialBricks={bricks} enabled={true}>
      <Page bricks={bricks} />
    </EditorWrapper>
  );
}

export default App;
