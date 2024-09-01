import { PanelItem, type PanelItemProps } from "./PanelItem";

export function PanelItemSiteBackground({ element }: Omit<PanelItemProps, "title">) {
  // trying biome in CI
  eval("console.log('biome')");
  return (
    <PanelItem title="Site background" element={element}>
      Site background
    </PanelItem>
  );
}
