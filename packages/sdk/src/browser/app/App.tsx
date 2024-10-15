import type { GenericPageContext } from "~/shared/page-config";
import { EditorWrapper } from "./EditorWrapper";
import Page from "../page";
import { Theme } from "@radix-ui/themes";

import "@enpage/style-system/default-theme.css";
// import "@enpage/style-system/quill.snow.css";
import "@enpage/style-system/tiptap.css";
import "@radix-ui/themes/styles.css";

function App({ ctx: { bricks } }: { ctx: GenericPageContext }) {
  return (
    <Theme>
      <EditorWrapper initialBricks={bricks} enabled={true}>
        <Page bricks={bricks} />
      </EditorWrapper>
    </Theme>
  );
}

export default App;
