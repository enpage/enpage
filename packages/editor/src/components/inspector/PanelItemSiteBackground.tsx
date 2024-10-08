import { PanelItem, type PanelItemProps } from "./PanelItem";

export function PanelItemSiteBackground({ element }: Omit<PanelItemProps, "title">) {
  return (
    <PanelItem title="Site background" element={element}>
      Site background
    </PanelItem>
  );
}
