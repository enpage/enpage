import {
  Enpage,
  attr,
  TemplateProps,
  useAttributes,
  useAttribute,
  useDatasource,
  dynamicStyles,
  createVar,
} from "@enpage/sdk";
import { Datasources, datasources } from "./datasources";
import { AttributesMap } from "@enpage/types";

import "@enpage/style-system/tailwind.css";
// Your template global styles
import "./global.css";

export default function Template() {
  const attrs = useAttributes<Attributes>();
  const title = useAttribute<Attributes>("title", "foo");
  // const [padding, setPadding] = useState<Styles["padding"]>("$md");
  // const [rounded, setRounded] = useState<Styles["rounded"]>("$none");
  const bgVar = createVar("background");
  const pageBackground = useAttribute<Attributes>("pageBackground", "red");
  const sections = <DefaultSections />;

  return (
    <Enpage.Page
      className="min-h-dvh place-content-center bg-gradient-to-r from-slate-900 to-slate-700
        text-white"
      customizations="all"
    >
      {sections}
    </Enpage.Page>
  );
}

function DefaultSections() {
  const sectionBg = createVar("background");
  const links = useDatasource<Datasources>("links", [
    {
      title: "Facebook",
      url: "https://facebook.com",
      icon: "facebook",
    },
    {
      title: "Twitter",
      url: "https://twitter.com",
      icon: "x",
    },
  ]);
  return (
    <Enpage.Sections className="max-sm:min-h:90vh max-sm:flex max-sm:p-4">
      {/* Only one section in this template */}
      <Enpage.Section
        id="section1"
        label="Main section"
        className="mx-auto flex max-w-screen-lg items-center justify-center gap-10 md:gap-16
          rounded-3xl bg-gradient-to-tl from-gray-800 to-gray-950 p-10 shadow-2xl
          max-sm:flex-col md:p-20"
      >
        <Enpage.Image
          id="profile-pic"
          src="/profile.webp"
          className="aspect-square w-auto rounded-xl max-h-64"
          label="Profile picture"
        />
        <div className="flex-1">
          <Enpage.Text
            id="section-2"
            as="p"
            label="Title"
            className="text-4xl font-extrabold md:text-5xl"
          >
            Samantha Smith
          </Enpage.Text>
          <Enpage.Text
            id="subtitle"
            as="p"
            label="Subtitle"
            className="text-base font-thin"
          >
            General Manager @ Acme Corp
          </Enpage.Text>
          <Enpage.Container
            id="links-container"
            direction="vertical"
            as="ul"
            label="Links"
            className="mt-10 flex w-full flex-col gap-2"
          >
            {links.map((link) => (
              <li
                className="flex items-center gap-3 rounded-md bg-white/10 text-white/80 hover:bg-white/20
                  group-hover/editor:bg-white/10"
                key={link.url}
              >
                <a
                  href="https://enpage.co"
                  className="flex flex-1 items-center gap-4 p-4"
                >
                  <Enpage.Icon
                    slug={link.icon}
                    id="facebook-icon"
                    color="white"
                    className="inline-block h-5 w-5 opacity-80"
                  />
                  {link.title}
                </a>
              </li>
            ))}
          </Enpage.Container>
        </div>
      </Enpage.Section>
      {/* <Enpage.Section
        label="2nd section"
        className="mx:gap-20  mx-auto flex max-w-screen-lg
        items-center justify-center gap-16 rounded-3xl
       bg-gradient-to-tl from-gray-800 to-gray-950 p-10 shadow-2xl max-sm:flex-col md:p-20"
      >
        <Enpage.Image
          src="/profile.webp"
          className="aspect-square w-auto rounded-xl md:w-60"
          label="Profile picture"
        />
        <div>
          <Enpage.Text
            as="p"
            label="Title"
            className="text-4xl font-extrabold md:text-5xl"
          >
            Samantha Smith
          </Enpage.Text>

          <Enpage.Text as="p" label="Subtitle" className="text-base font-thin">
            General Manager @ Acme Corp
          </Enpage.Text>

          <Enpage.Container
            direction="vertical"
            as="ul"
            label="Links"
            className="mt-10 flex w-full flex-col gap-2"
          >
            {data.links.map((link) => (
              <li
                className="flex items-center gap-3 rounded-md bg-white/10 p-4 text-white/80"
                key={link.url}
              >
                <img
                  src={facebook}
                  className="inline-block h-7 w-7 fill-white"
                />{" "}
                {link.title}
              </li>
            ))}
          </Enpage.Container>
        </div>
      </Enpage.Section> */}
    </Enpage.Sections>
  );
}

type PizzaType = "pepperoni" | "margherita" | "hawaiian";

export const attributes = {
  title: attr.text("Page title"),
  pageBackground: attr.color("Page background"),
  preferedPizza: attr.enum<PizzaType>("Prefered pizza", {
    options: [
      { value: "pepperoni", label: "Pepperoni" },
      { value: "margherita", label: "Margherita" },
      { value: "hawaiian", label: "Hawaiian" },
    ],
  }),
  // Add settings here
} satisfies AttributesMap;

type Attributes = typeof attributes;
