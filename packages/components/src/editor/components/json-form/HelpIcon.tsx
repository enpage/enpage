import { Tooltip, IconButton } from "@upstart.gg/style-system/system";
import { IoIosHelpCircleOutline } from "react-icons/io";

export function HelpIcon({ help }: { help: string }) {
  return (
    <Tooltip content={help} className="!z-[10000]" align="end">
      <IconButton variant="ghost" size="1" radius="full" className="group !cursor-help !mt-0" disabled>
        <IoIosHelpCircleOutline className="text-upstart-300 group-hover:text-upstart-600" />
      </IconButton>
    </Tooltip>
  );
}
