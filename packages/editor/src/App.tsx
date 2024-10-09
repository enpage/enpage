import { EditorWrapper } from "./components/EditorWrapper";
import { ClientOnly } from "./utils/client-only";

export default function App(props: { html: string; body: string; templateUrl: string }) {
  return (
    <ClientOnly>
      <div className={"h-dvh flex"}>
        <EditorWrapper {...props} />
      </div>
    </ClientOnly>
  );
}
