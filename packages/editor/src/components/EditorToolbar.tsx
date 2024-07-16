import { LuPlus, LuUndo, LuRedo, /*LuRocket,*/ LuMenu } from "react-icons/lu";
import { RxMobile } from "react-icons/rx";
// import { RxDesktop } from "react-icons/rx";
// import { BsTablet } from "react-icons/bs";
import clsx from "clsx";

export function EditorToolbar() {
  const standardBtn = `bg-enpage-600/95 hover:bg-enpage-700/90 disabled:text-white/40 disabled:hover:bg-enpage-600/95`;
  // const rocketBtn = `bg-orange-600/85 hover:bg-orange-700/90 px-4`;
  const btnClass = `flex flex-auto items-center justify-center py-2 px-5 gap-x-1.5
    md:first:rounded-l-lg md:last:rounded-r-lg hover:bg-gradient-to-t`;
  return (
    <nav
      data-editor-ui
      className="divide-enpage-500 fixed bottom-0 left-0 right-0
      flex h-[3.9rem] min-w-fit justify-start divide-x
    text-xl text-white shadow-xl md:bottom-auto
    md:left-1/2 md:right-auto md:top-4 md:-translate-x-1/2
    "
    >
      <button
        data-editor-ui
        type="button"
        onClick={() => console.log("gggg")}
        className={clsx(btnClass, standardBtn)}
      >
        <LuPlus className="h-2/3 w-auto" />
      </button>
      <button data-editor-ui disabled type="button" className={clsx(btnClass, standardBtn)}>
        <LuUndo className="h-2/3 w-auto" />
      </button>
      <button data-editor-ui disabled type="button" className={clsx(btnClass, standardBtn)}>
        <LuRedo className="h-2/3 w-auto" />
      </button>
      <button data-editor-ui type="button" className={clsx(btnClass, standardBtn)}>
        <RxMobile className="h-2/3 w-auto" />
      </button>
      <button data-editor-ui type="button" className={clsx(btnClass, standardBtn)}>
        <LuMenu className="h-2/3 w-auto" />
      </button>
    </nav>
  );
}
