import {
  Tabs,
  Button,
  Callout,
  TextArea,
  Spinner,
  TextField,
  Select,
  useAutoAnimate,
} from "@enpage/style-system";
import { themes } from "@enpage/sdk/shared/themes/all-themes";
import { forwardRef, useCallback, useRef, useState, type ComponentProps } from "react";
import { LuArrowRightCircle } from "react-icons/lu";
import { WiStars } from "react-icons/wi";
import { nanoid } from "nanoid";
import { BsStars } from "react-icons/bs";
import { tx, css, tw } from "@enpage/sdk/browser/twind";
import { type Theme, themeSchema } from "@enpage/sdk/shared/theme";
import { useDraft } from "@enpage/sdk/browser/use-editor";
import { ColorFieldRow } from "./json-form/fields/color";

const tabContentScrollClass = css({
  scrollbarColor: "var(--violet-4) var(--violet-2)",
  scrollBehavior: "smooth",
  scrollbarWidth: "thin",
  "&:hover": {
    scrollbarColor: "var(--violet-6) var(--violet-3)",
  },
});

export default function ThemePanel() {
  const draft = useDraft();
  const [themeDescription, setThemeDescription] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThemes, setGeneratedThemes] = useState<Theme[]>([]);
  const [genListRef] = useAutoAnimate(/* optional config */);

  const generateTheme = async () => {
    if (!themeDescription) {
      return;
    }
    setIsGenerating(true);

    const newThemes = await generateThemeWithAI(themeDescription);

    if (newThemes) {
      setGeneratedThemes((prevThemes) => {
        const count = prevThemes.length;
        return [
          ...newThemes.map((theme, index) => ({
            ...theme,
            id: nanoid(),
            name: `Theme #${count + index + 1}`,
          })),
          ...prevThemes,
        ];
      });
    }
    setIsGenerating(false);
  };

  return (
    <Tabs.Root defaultValue="current">
      <Tabs.List className="sticky top-0 !bg-white z-50">
        <Tabs.Trigger value="current" className="!flex-1">
          Current
        </Tabs.Trigger>
        <Tabs.Trigger value="list" className="!flex-1">
          List
        </Tabs.Trigger>
        <Tabs.Trigger value="ai" className="!flex-1">
          Upstart AI <BsStars className="ml-1 w-4 h-4 text-upstart-600" />
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="ai"
        className={tx("p-2 h-[calc(100dvh-99px)] overflow-y-auto", tabContentScrollClass)}
      >
        <Callout.Root size="1">
          <Callout.Icon>
            <WiStars className="w-8 h-8 mt-3" />
          </Callout.Icon>
          <Callout.Text>
            Tell us about your website / page purpose and color preferences, and our AI will generate
            personalized themes for you!
          </Callout.Text>
        </Callout.Root>
        <TextArea
          onInput={(e) => {
            setThemeDescription(e.currentTarget.value);
          }}
          className="w-full my-2 h-24"
          size="2"
          placeholder="Describe your website purpose, color preferences, etc..."
          spellCheck={false}
        />
        <Button
          size="2"
          disabled={themeDescription.length < 10 || isGenerating}
          className="block !w-full"
          onClick={generateTheme}
        >
          <Spinner loading={isGenerating}>
            <BsStars className="w-4 h-4" />
          </Spinner>
          {isGenerating ? "Generating themes" : "Generate themes"}
        </Button>
        <ThemeListWrapper className="mt-2" ref={genListRef}>
          {generatedThemes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme} />
          ))}
        </ThemeListWrapper>
      </Tabs.Content>
      <Tabs.Content value="current" className={tx("p-2 overflow-y-auto", tabContentScrollClass)}>
        <Callout.Root size="1">
          <Callout.Text>
            Customize your theme colors and typography to match your brand.
            <br />
            <strong className="font-semibold">Note</strong>: Theme is applied to your entire site, not only
            the current page.
          </Callout.Text>
        </Callout.Root>
        <div className="mt-1 flex flex-col gap-y-6">
          <fieldset>
            <div className="font-semibold text-sm my-2 bg-gray-200 py-1 -mx-2 px-2">Colors</div>
            <div className="text-sm flex flex-col gap-y-4 px-1">
              {Object.entries(draft.theme.colors).map(([colorType, color]) => (
                <ColorFieldRow
                  key={colorType}
                  /* @ts-ignore */
                  name={themeSchema.properties.colors.properties[colorType].title}
                  /* @ts-ignore */
                  description={themeSchema.properties.colors.properties[colorType].description}
                  color={color}
                  pillClassName={tw(`bg-[${color}]`)}
                  labelClassName="font-medium"
                  descClassName="text-xs text-gray-500"
                  colorType={colorType === "neutral" ? "neutral" : "theme-base"}
                  colorName={colorType as keyof Theme["colors"]}
                  onChange={(newColor) => {
                    console.log("updating theme color %s with %s", colorType, newColor);
                    draft.setTheme({
                      ...draft.theme,
                      colors: {
                        ...draft.theme.colors,
                        [colorType]: newColor,
                      },
                    });
                  }}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <div className="font-semibold text-sm my-2 bg-gray-200 py-1 -mx-2 px-2">Typography</div>
            <div className="text-sm flex flex-col gap-y-4 px-1">
              {Object.entries(draft.theme.typography)
                .filter((obj) => obj[0] !== "base")
                .map(([fontType, font]) => (
                  <div key={fontType}>
                    <label className="font-medium">
                      {/* @ts-ignore */}
                      {themeSchema.properties.typography.properties[fontType].title}
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      {/* @ts-ignore */}
                      {themeSchema.properties.typography.properties[fontType].description}
                    </p>
                    <Select.Root
                      defaultValue={font as string}
                      size="2"
                      onValueChange={(newFont) => {
                        console.log("new font!", newFont);
                        draft.setTheme({
                          ...draft.theme,
                          typography: {
                            ...draft.theme.typography,
                            [fontType]: newFont,
                          },
                        });
                      }}
                    >
                      <Select.Trigger className="!w-full" />
                      <Select.Content>
                        <Select.Group>
                          {themeSchema.properties.typography.properties.body.anyOf.map((item) => (
                            <Select.Item key={item.const} value={item.const}>
                              <span className={`font-${item.const}`}>{item.title}</span>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </div>
                ))}
            </div>
          </fieldset>
        </div>
      </Tabs.Content>
      <Tabs.Content
        value="list"
        className={tx(
          "h-[calc(100dvh-99px)] overflow-y-auto transition-colors duration-200",
          tabContentScrollClass,
        )}
      >
        <ThemeListWrapper>
          {themes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme} />
          ))}
        </ThemeListWrapper>
      </Tabs.Content>
    </Tabs.Root>
  );
}

const ThemeListWrapper = forwardRef<HTMLDivElement, ComponentProps<"div">>(function ThemeListWrapper(
  { children, className }: ComponentProps<"div">,
  ref,
) {
  return (
    <div ref={ref} className={tx("flex flex-col divide-y divide-upstart-100", className)}>
      {children}
    </div>
  );
});

function ThemePreview({ theme }: { theme: Theme }) {
  const draft = useDraft();
  return (
    <div className="flex-1 py-2 pl-3 pr-2 text-sm mb-2.5" key={theme.id}>
      <h3 className="font-semibold">{theme.name}</h3>
      {/* <p className="text-sm">{theme.description}</p> */}
      <div className="flex justify-between items-center">
        <div className="flex mt-1">
          {Object.entries(theme.colors).map(([colorName, color]) => (
            <div
              key={colorName}
              className="w-7 h-7 rounded-full [&:not(:first-child)]:(-ml-1) ring-1 ring-white"
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
        <Button size="1" variant="soft" radius="full" onClick={() => draft.setPreviewTheme(theme)}>
          Preview
          <LuArrowRightCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

async function generateThemeWithAI(
  query: string,
  url = "https://test-matt-ai.flippable.workers.dev/",
): Promise<Theme[] | null> {
  const urlObj = new URL(url);
  urlObj.searchParams.append("q", query);
  const abortCtrl = new AbortController();
  const resp = await fetch(urlObj, { signal: abortCtrl.signal });
  try {
    let text = await resp.text();
    // replace the begining of the string until it matches a "[" character
    text = text.replace(/^[^\[]*/, "");
    // replace potential "```" characters
    text = text.replace(/`/g, "");

    console.log("resp", text);
    // const json = await resp.json();
    return JSON.parse(text);
  } catch (e) {
    // console.log("resp", await resp.text());
    console.error("Cannot parse JSON response", e);
    return null;
  }
}
