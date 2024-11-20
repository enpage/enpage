import BrickWrapper from "./EditableBrick";
import { useAttributes, useBricks } from "../hooks/use-editor";
import { usePageStyle } from "~/hooks/use-page-style";

export default function LivePage() {
  const attributes = useAttributes();
  const bricks = useBricks();
  const pageClassName = usePageStyle({ attributes });
  return (
    <div className={pageClassName}>
      {bricks.map((brick) => (
        <BrickWrapper key={brick.id} brick={brick} />
      ))}
    </div>
  );
}
