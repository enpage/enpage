import { stylePreset, type StylePreset } from "@upstart.gg/sdk/shared/bricks/props/common";

export default function PresetsView() {
  const styles = Object.entries(stylePreset.properties.style.anyOf).map(([name, value]) => {
    return {
      name: value.title,
      value: value.const,
    };
  });
  const variants = Object.entries(stylePreset.properties.variant.anyOf).map(([name, value]) => {
    return {
      name: value.title,
      value: value.const,
    };
  });

  return (
    <div className="grid grid-cols-2 gap-2">
      {styles.map((style) =>
        variants.map((variant) => {
          return (
            <div
              key={`${style.name}-${variant.name}`}
              className="outline outline-gray-200 p-2 rounded-lg gap-2 flex items-center justify-center h-20"
            >
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-center text-xs font-semibold">{style.name}</h2>
                <h3 className="text-center text-xs font-normal">{variant.name}</h3>
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
}
