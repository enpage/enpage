import { defineProject, mergeConfig } from "vitest/config";
import configShared from "../../vitest.shared";

export default mergeConfig(
  // @ts-ignore
  configShared,
  defineProject({
    test: {
      environment: "node",
    },
  }),
);
