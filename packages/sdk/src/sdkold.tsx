import { ElementType, FunctionComponent } from "react";
import { BlockProps, PropTypes } from "./types";
import { BaseBlock } from "./components/BaseBlock";
import { Container } from "./components/Container";
import { Section } from "./components/Section";
import { Sections } from "./components/Sections";
import { Element } from "./components/Element";
import { Text } from "./components/Text";
import { Page } from "./components/Page";
import { Image } from "./components/Image";
import { Icon } from "./components/Icon";

const baseObject = {
  Page,
  Container,
  Section,
  Sections,
  Element,
  img: Image, // override img to Image
  Image,
  Icon,
  Text,
};

const proxyHandler = {
  get(target: typeof baseObject, prop: string, receiver: typeof baseObject) {
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    return (props: Omit<BlockProps<ElementType, PropTypes>, "blockType">) => {
      return (
        <BaseBlock
          {...props}
          id={props.id}
          as={prop as ElementType}
          blockType="element"
        />
      );
    };
  },
};

type EnpageObject = typeof baseObject & {
  [T in keyof JSX.IntrinsicElements]: FunctionComponent<
    BlockProps<T, PropTypes>
  >;
};

export const Enpage = new Proxy(baseObject, proxyHandler) as EnpageObject;
