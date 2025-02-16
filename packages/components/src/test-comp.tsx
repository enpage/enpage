import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "./shared/hooks/use-brick-style";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function FirstBlock(props: any) {
  const className = useBrickStyle(props);

  return (
    <div className={tx(apply("bg-black/40"), "rounded-[inherit] flex flex-col gap-6 p-3", className)}>
      <h2 className="text-2xl @desktop:text-3xl font-bold @mobile:text-center @desktop:text-left">
        Travel the space with us
      </h2>
      <div className="flex @mobile:flex-col @desktop:flex-row gap-6 text-base">
        <div className="@desktop:(basis-1/2 pl-6 block) @mobile:(flex justify-center)">
          <img
            src="/astro2.jpg"
            alt="astro"
            className="rounded-[inherit] @mobile:w-2/3 @desktop:w-48 h-auto border border-white/20"
          />
        </div>
        <div className="flex-col gap-4 flex">
          <div>
            <h2 className="font-semibold text-xl">Safety First</h2>
            <p className="mt-2">
              Triple-redundant safety systems and continuous mission monitoring ensure your journey is as safe
              as a commercial flight.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-xl">Expert Crew</h2>
            <p className=" mt-2">
              Our crews are trained by veteran astronauts with decades of space experience.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-xl">Flexible Scheduling</h2>
            <p className=" mt-2">
              Weekly launches to all destinations. Choose your perfect date with our year-round departure
              schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function SecondBlock(props: any) {
  const className = useBrickStyle(props);

  return (
    <div className={tx(apply("bg-black/40"), "rounded-[inherit] flex flex-col gap-6 p-3", className)}>
      <h2 className="text-2xl @desktop:text-3xl font-bold @mobile:text-center @desktop:text-left">
        Why Choose Us
      </h2>
      <div className="flex @mobile:flex-col @desktop:flex-row gap-6 text-base">
        <div className="@desktop:(basis-1/2 pl-6 block) @mobile:(flex justify-center)">
          <img
            src="/astro1.jpg"
            alt="astro"
            className="rounded-[inherit] @mobile:w-2/3 @desktop:w-48 h-auto border border-white/20"
          />
        </div>
        <div className="flex-col gap-4 flex">
          <div>
            <h2 className="font-semibold text-xl">Safety First</h2>
            <p className="mt-2">
              Triple-redundant safety systems and continuous mission monitoring ensure your journey is as safe
              as a commercial flight.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-xl">Expert Crew</h2>
            <p className=" mt-2">
              Our crews are trained by veteran astronauts with decades of space experience.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-xl">Flexible Scheduling</h2>
            <p className=" mt-2">
              Weekly launches to all destinations. Choose your perfect date with our year-round departure
              schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
