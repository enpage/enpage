import type { BlockType } from "@enpage/sdk/browser/components/blocks/types";
import type { ReactNode } from "react";
import { BsTextLeft } from "react-icons/bs";
import { BsType } from "react-icons/bs";
import { RxButton } from "react-icons/rx";
import { GoColumns } from "react-icons/go";
import { FaIcons } from "react-icons/fa";
import { CgSpaceBetweenV } from "react-icons/cg";
import { IoImageOutline } from "react-icons/io5";
import { GoVideo } from "react-icons/go";

type BlockDescription = {
  type: BlockType;
  label: string;
  icon: ReactNode;
};

const iconsProps = { size: 20 };

export const blockDescriptions: BlockDescription[] = [
  {
    type: "text",
    label: "Text",
    icon: <BsTextLeft {...iconsProps} />,
  },
  {
    type: "heading",
    label: "Heading",
    icon: <BsType {...iconsProps} />,
  },
  {
    type: "button",
    label: "Button",
    icon: <RxButton {...iconsProps} />,
  },
  {
    type: "icon",
    label: "Icon",
    icon: <FaIcons {...iconsProps} />,
  },
  {
    type: "image",
    label: "Image",
    icon: <IoImageOutline {...iconsProps} />,
  },

  {
    type: "video",
    label: "Video",
    icon: <GoVideo {...iconsProps} />,
  },
  {
    type: "container",
    label: "Container",
    icon: <GoColumns {...iconsProps} />,
  },

  {
    type: "vertical-spacer",
    label: "Vertical Space",
    icon: <CgSpaceBetweenV {...iconsProps} />,
  },
];
