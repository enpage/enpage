// todo: We should  move BrickWrapper to shared components
import type { GenericPageContext } from "@upstart.gg/sdk/shared/page";
import BrickWrapper from "./Brick";
import { usePageStyle } from "~/shared/hooks/use-page-style";

export default function Page({ page }: { page: GenericPageContext }) {
  const pageClassName = usePageStyle({ attributes: page.attr });
  return (
    <div className={pageClassName}>
      {page.bricks.map((brick) => (
        <BrickWrapper key={brick.id} brick={brick} />
      ))}
    </div>
  );
}
