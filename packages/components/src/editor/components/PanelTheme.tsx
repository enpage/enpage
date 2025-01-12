import {
  Tabs,
  Button,
  Callout,
  TextArea,
  Spinner,
  Select,
  useAutoAnimate,
  Text,
} from "@upstart.gg/style-system/system";
import { themes } from "@upstart.gg/sdk/shared/themes/all-themes";
import { forwardRef, useState, type ComponentProps, useMemo } from "react";
import { LuArrowRightCircle } from "react-icons/lu";
import { WiStars } from "react-icons/wi";
import { nanoid } from "nanoid";
import { BsStars } from "react-icons/bs";
import { tx } from "@upstart.gg/style-system/twind";
import { type Theme, themeSchema, getProcessedThemeSchema } from "@upstart.gg/sdk/shared/theme";
import { useDraft } from "~/editor/hooks/use-editor";
import { ColorFieldRow } from "./json-form/fields/color";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import type { ColorType } from "@upstart.gg/sdk/shared/themes/color-system";
import type { TUnion } from "@sinclair/typebox";

export default function ThemePanel() {
  const draft = useDraft();
  const [themeDescription, setThemeDescription] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThemes, setGeneratedThemes] = useState<Theme[]>([]);
  const [genListRef] = useAutoAnimate(/* optional config */);
  const themeSchemaProcessed = useMemo(
    () => getProcessedThemeSchema(themeSchema, draft.theme),
    [draft.theme],
  );

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
      <div className={tx("bg-white dark:bg-dark-800")}>
        <Tabs.List className="sticky top-0 z-50">
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
      </div>
      <ScrollablePanelTab tab="ai" className="p-2">
        <Callout.Root size="1">
          <Callout.Icon>
            <WiStars className="w-8 h-8 mt-3" />
          </Callout.Icon>
          <Callout.Text size="1">
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
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="current" className="p-2">
        <Callout.Root size="1">
          <Callout.Text size="1" className={tx("text-balance")}>
            Customize your theme colors and typography to match your brand. Please note that theme is applied
            to your entire site, not only the current page.
          </Callout.Text>
        </Callout.Root>
        <div className="mt-1 flex flex-col gap-y-5">
          <fieldset>
            <div className="font-medium text-sm my-2 bg-upstart-100 dark:bg-dark-600 py-1 -mx-2 px-2">
              Colors
            </div>
            <div className="text-sm flex flex-col gap-y-4 px-1">
              {Object.entries(draft.theme.colors).map(([colorType, color]) => (
                <ColorFieldRow
                  key={colorType}
                  /* @ts-ignore */
                  name={themeSchema.properties.colors.properties[colorType].title}
                  /* @ts-ignore */
                  description={themeSchema.properties.colors.properties[colorType].description}
                  color={color}
                  labelClassName="font-medium"
                  colorType={colorType as ColorType}
                  onChange={(newColor: string) => {
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
            <div className="font-medium text-sm mb-2 bg-upstart-100 dark:bg-dark-600 py-1 -mx-2 px-2">
              Typography
            </div>
            <div className="text-sm flex flex-col gap-y-4 px-1">
              {Object.entries(draft.theme.typography)
                .filter((obj) => obj[0] !== "base")
                .map(([fontType, font]) => (
                  <div key={fontType}>
                    <label className="font-medium">
                      {/* @ts-ignore */}
                      {themeSchemaProcessed.properties.typography.properties[fontType].title}
                    </label>
                    <Text color="gray" as="p" size="2" className="mb-1">
                      {/* @ts-ignore */}
                      {themeSchemaProcessed.properties.typography.properties[fontType].description}
                    </Text>
                    <Select.Root
                      defaultValue={font as string}
                      size="2"
                      onValueChange={(newFont) => {
                        draft.setTheme({
                          ...draft.theme,
                          typography: {
                            ...draft.theme.typography,
                            [fontType]: newFont,
                          },
                        });
                      }}
                    >
                      <Select.Trigger className="!w-full !capitalize">{font}</Select.Trigger>
                      <Select.Content>
                        <Select.Group>
                          {
                            //  @ts-ignore
                            (themeSchemaProcessed.properties.typography.properties[fontType] as TUnion).anyOf //  @ts-ignore
                              .filter((item) => !item["ui:option-hidden"])
                              .map((item) => (
                                <Select.Item key={item.const} value={item.const}>
                                  <span className={`font-${item.const}`}>{item.title}</span>
                                </Select.Item>
                              ))
                          }
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </div>
                ))}
            </div>
          </fieldset>
          {/*
          <fieldset>
            <pre className="text-xs">{JSON.stringify(draft.theme, null, 1)}</pre>
          </fieldset>
          */}
        </div>
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="list">
        <ThemeListWrapper>
          {themes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme} />
          ))}
        </ThemeListWrapper>
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

const ThemeListWrapper = forwardRef<HTMLDivElement, ComponentProps<"div">>(function ThemeListWrapper(
  { children, className }: ComponentProps<"div">,
  ref,
) {
  return (
    <div
      ref={ref}
      className={tx("flex flex-col divide-y divide-upstart-100 dark:divide-dark-600", className)}
    >
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
              className="w-7 h-7 rounded-full [&:not(:first-child)]:(-ml-1) ring-1 ring-white dark:ring-dark-300"
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
