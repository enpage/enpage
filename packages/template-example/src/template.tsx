import {
  Enpage,
  attr,
  TemplateProps,
  useAttributes,
  useAttribute,
  useDatasource,
} from "@enpage/sdk";
import { Styles, properties } from "@enpage/style-system";
import { Datasources, datasources } from "./datasources";
import { useState } from "react";
import { AttributesMap } from "@enpage/types";

// Your template global styles
import "./global.css";

//TODO: styles are different from settings ????

export default function Template(
  props: TemplateProps<typeof datasources, Attributes>,
) {
  const { styles, data, attributes: settings } = props;
  const attrs = useAttributes<Attributes>();
  const title = useAttribute<Attributes>("title", "foo");
  const links = useDatasource<Datasources>("links", []);

  const [color, setColor] = useState("red");
  const [padding, setPadding] = useState<Styles["padding"]>("$md");
  const [rounded, setRounded] = useState<Styles["rounded"]>("$none");

  const sections = <DefaultSections {...props} />;

  return (
    <Enpage.Page
      minHeight="$dvh"
      background={settings.backgroundColor ?? "$gray-900"}
      customizations="all"
    >
      <DefaultSections {...props} />
    </Enpage.Page>
  );
}

function DefaultSections({
  data,
}: TemplateProps<typeof datasources, typeof attributes>) {
  return (
    <Enpage.Sections bg="$amber-300" h="$dvh" placeContent="center">
      {/* Only one section in this template */}
      <Enpage.Section maxWidth="$screen-md" mx="$auto" p="$4xl" bg="$gray-800">
        <Enpage.Element
          background="linear-gradient(#000, #FF9900)"
          label="Main block"
        >
          Hello, world!
        </Enpage.Element>
        <div className="bg-red-700">I'm in reddddd'</div>
        <Enpage.Container
          direction="vertical"
          as="ul"
          label="My group"
          className="active"
        >
          {data.links.map((link) => (
            <li key={link.url}>{link.title}</li>
          ))}
        </Enpage.Container>
        <Enpage.Element as="p">
          <Enpage.Text>Hello, world #1</Enpage.Text>
        </Enpage.Element>
        <Enpage.Element>
          <Enpage.Text>Hello, world #2</Enpage.Text>
        </Enpage.Element>
        <Enpage.Element>
          <Enpage.Text>Hello, world #3</Enpage.Text>
        </Enpage.Element>
      </Enpage.Section>
    </Enpage.Sections>
  );
}

type PizzaType = "pepperoni" | "margherita" | "hawaiian";

export const attributes = {
  title: attr.text("Page title"),
  backgroundColor: attr.color("Page background"),
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
