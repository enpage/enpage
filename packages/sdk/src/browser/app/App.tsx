import { EditorWrapper } from "../EditorWrapper";
import type { GenericPageConfig } from "~/shared/page-config.ts";

function App({ config }: { config: GenericPageConfig }) {
  return <EditorWrapper config={config} enabled={true} />;
}

export default App;
