// todo: We should  move BrickWrapper to shared components
import BrickWrapper from "~/editor/components/EditableBrick";
import { useAttributes, useBricks } from "~/editor/hooks/use-editor";
import { usePageStyle } from "~/shared/hooks/use-page-style";

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
