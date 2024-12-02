import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { lazy, Suspense, type ComponentProps, type ComponentType, type LazyExoticComponent } from "react";

// Load all bricks in the bricks directory
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const bricks = import.meta.glob<false, string, { default: ComponentType<any> }>(["../bricks/*.tsx"]);

const bricksMap = Object.entries(bricks).reduce(
  (acc, [path, importFn]) => {
    // Extract component name from path (e.g., ./components/Button.jsx -> Button)
    const componentName = path.match(/\.\/bricks\/(.*)\.tsx$/)![1];
    // Create lazy component using React.lazy
    acc[componentName] = lazy(importFn);
    return acc;
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  {} as Record<string, LazyExoticComponent<ComponentType<any>>>,
);

const BaseBrick = ({
  brick,
  editable,
  ...otherProps
}: { brick: Brick; editable?: boolean } & ComponentProps<"div">) => {
  // const BrickModule = lazy(() => import(`../bricks/${brick.type}.js`));
  const BrickModule = bricksMap[brick.type];
  if (!BrickModule) {
    return null;
  }
  return (
    <Suspense>
      <BrickModule {...brick.props} {...otherProps} editable={editable} />
    </Suspense>
  );
};

export default BaseBrick;
