/**
 * From https://modernfontstacks.com/
 */
import { token } from "./token-helpers";

export const fontFamilies = {
  "font-system": token.fontFamily("system", "system-ui, sans-serif"),
  "font-transitional": token.fontFamily(
    "transitional",
    "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
  ),
  "font-old": token.fontFamily(
    "old-style",
    "'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif",
  ),
  "font-humanist": token.fontFamily(
    "humanist",
    "Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif",
  ),
  "font-geometric": token.fontFamily(
    "geometric",
    "Avenir, Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif",
  ),
  "font-classical": token.fontFamily(
    "classical",
    "Optima, Candara, 'Noto Sans', source-sans-pro, sans-serif",
  ),
  "font-grotesque": token.fontFamily(
    "grotesque",
    "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
  ),
  "font-mono-slab": token.fontFamily("mono-slab", "'Nimbus Mono PS', 'Courier New', monospace"),
  "font-code": token.fontFamily(
    "code",
    "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
  ),
  "font-industrial": token.fontFamily(
    "industrial",
    "Bahnschrift, 'DIN Alternate', 'Franklin Gothic Medium', 'Nimbus Sans Narrow', sans-serif-condensed, sans-serif",
  ),
  "font-rounded": token.fontFamily(
    "rounded",
    "ui-rounded, 'Hiragino Maru Gothic ProN', Quicksand, Comfortaa, Manjari, 'Arial Rounded MT', 'Arial Rounded MT Bold', Calibri, source-sans-pro, sans-serif",
  ),
  "font-slab": token.fontFamily(
    "slab",
    "Rockwell, 'Rockwell Nova', 'Roboto Slab', 'DejaVu Serif', 'Sitka Small', serif",
  ),
  "font-antique": token.fontFamily(
    "antique",
    "Superclarendon, 'Bookman Old Style', 'URW Bookman', 'URW Bookman L', 'Georgia Pro', Georgia, serif",
  ),
  "font-didone": token.fontFamily(
    "didone",
    "Didot, 'Bodoni MT', 'Noto Serif Display', 'URW Palladio L', P052, Sylfaen, serif",
  ),
  "font-handwritten": token.fontFamily(
    "handwritten",
    "'Segoe Print', 'Bradley Hand', Chilanka, TSCu_Comic, casual, cursive",
  ),
};
