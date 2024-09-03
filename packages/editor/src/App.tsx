import { EditorWrapper } from "./components/EditorWrapper";
import { useEffect, useState } from "react";

export default function App({ html, templateUrl }: { html?: string; templateUrl?: string }) {
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);
  if (!client) return null;

  return (
    <div className="h-dvh flex">
      <EditorWrapper html={html} templateUrl={templateUrl} />
    </div>
  );
}
