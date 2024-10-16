type Gradient = {
  name: string;
  type: "linear" | "radial";
  direction?: string;
  stops: Array<{
    color: string;
    position?: string;
  }>;
};

export const gradient = (
  name: string,
  type: Gradient["type"],
  stops: Array<{ color: string; position?: string }>,
  opts?: Omit<Gradient, "name" | "type" | "stops">,
) => {
  const processedStops = stops.map((stop, index) => ({
    color: stop.color,
    position: stop.position || `${(index / (stops.length - 1)) * 100}%`,
  }));

  return { name, type, stops: processedStops, ...opts };
};

// Helper function to generate CSS gradient string
export const generateGradientCSS = (gradient: Gradient): string => {
  const { type, stops, direction } = gradient;
  const stopsCSS = stops.map((stop) => `${stop.color} ${stop.position}`).join(", ");
  switch (type) {
    case "linear":
      return `linear-gradient(${direction || "to right"}, ${stopsCSS})`;
    case "radial":
      return `radial-gradient(${direction || "circle"}, ${stopsCSS})`;
  }
};

export const defaultGradients = [
  gradient("Sunset Blaze", "linear", [{ color: "#FF512F" }, { color: "#F09819" }, { color: "#FFDB3A" }]),
  gradient("Ocean Depths", "linear", [{ color: "#1CB5E0" }, { color: "#000851" }, { color: "#021B79" }]),
  gradient("Tropical Paradise", "linear", [{ color: "#00C9FF" }, { color: "#92FE9D" }, { color: "#FFD700" }]),
  gradient("Cherry Blossom Dream", "linear", [
    { color: "#FFC3A0" },
    { color: "#FFAFBD" },
    { color: "#FFA0AB" },
  ]),
  gradient("Mystic Amethyst", "linear", [{ color: "#9D50BB" }, { color: "#6E48AA" }, { color: "#8A2BE2" }]),
  gradient("Northern Lights", "linear", [
    { color: "#00C9FF" },
    { color: "#00FF9D" },
    { color: "#92FE9D" },
    { color: "#FFA500" },
  ]),
  gradient("Autumn Leaves", "linear", [
    { color: "#DAA520" },
    { color: "#D2691E" },
    { color: "#8B4513" },
    { color: "#A0522D" },
  ]),
  gradient("Rainbow Burst", "linear", [
    { color: "#FF0000" },
    { color: "#FF7F00" },
    { color: "#FFFF00" },
    { color: "#00FF00" },
    { color: "#0000FF" },
    { color: "#8B00FF" },
  ]),
  gradient("Peacock Feather", "radial", [
    { color: "#016464" },
    { color: "#00CCCC" },
    { color: "#33CC33" },
    { color: "#B2D732" },
  ]),
  gradient("Neon Glow", "linear", [{ color: "#FF00FF" }, { color: "#00FFFF" }, { color: "#FF00FF" }]),
  gradient("Cosmic Fusion", "radial", [{ color: "#3A1C71" }, { color: "#D76D77" }, { color: "#FFAF7B" }]),
  gradient("Candy Crush", "linear", [{ color: "#FC466B" }, { color: "#3F5EFB" }, { color: "#A9FF68" }]),
  gradient("Deep Sea", "linear", [{ color: "#000080" }, { color: "#0000FF" }, { color: "#00FFFF" }]),
  gradient("Lava Flow", "linear", [
    { color: "#FF4500" },
    { color: "#FF6347" },
    { color: "#FF7F50" },
    { color: "#FFD700" },
  ]),
  gradient("Forest Mist", "linear", [{ color: "#2C3E50" }, { color: "#3498DB" }, { color: "#2ECC71" }]),
  gradient("Strawberry Lemonade", "linear", [
    { color: "#ff9a9e" },
    { color: "#fad0c4" },
    { color: "#ffecd2" },
  ]),
  gradient("Emerald Forest", "linear", [{ color: "#007991" }, { color: "#78ffd6" }]),
  gradient("Desert Sunset", "linear", [{ color: "#eb3349" }, { color: "#f45c43" }]),
  gradient("Cotton Candy", "linear", [{ color: "#d4fc79" }, { color: "#96e6a1" }]),
  gradient("Deep Space", "radial", [{ color: "#000000" }, { color: "#434343" }]),
  gradient("Mango Tango", "linear", [{ color: "#FFD700" }, { color: "#FFA500" }, { color: "#FF4500" }]),
  gradient("Arctic Aurora", "linear", [
    { color: "#4facfe" },
    { color: "#00f2fe" },
    { color: "#00ff87" },
    { color: "#60efff" },
  ]),
  gradient("Wildflower Meadow", "linear", [{ color: "#a8edea" }, { color: "#fed6e3" }]),
  gradient("Volcanic Heat", "radial", [{ color: "#8a2387" }, { color: "#e94057" }, { color: "#f27121" }]),
  gradient("Mystic Fog", "linear", [{ color: "#bdc3c7" }, { color: "#2c3e50" }]),
  gradient("Blueberry Blast", "linear", [{ color: "#4481eb" }, { color: "#04befe" }]),
  gradient("Citrus Splash", "linear", [{ color: "#fccb90" }, { color: "#d57eeb" }]),
  gradient("Midnight Romance", "linear", [{ color: "#22289a" }, { color: "#0f0c29" }]),
  gradient("Tropical Lagoon", "linear", [{ color: "#43c6ac" }, { color: "#191654" }]),
  gradient("Cherry Cola", "linear", [{ color: "#b91d73" }, { color: "#f953c6" }]),
  gradient("Electric Violet", "linear", [{ color: "#4776E6" }, { color: "#8E54E9" }]),
  gradient("Sun Flare", "radial", [{ color: "#f6d365" }, { color: "#fda085" }]),
  gradient("Frozen Tundra", "linear", [{ color: "#c8d7e3" }, { color: "#f9fcff" }]),
  gradient("Lush Meadow", "linear", [{ color: "#56ab2f" }, { color: "#a8e063" }]),
  gradient("Cosmic Fusion", "linear", [{ color: "#ff00cc" }, { color: "#333399" }]),
  gradient("Velvet Night", "linear", [{ color: "#0f2027" }, { color: "#203a43" }, { color: "#2c5364" }]),
  gradient("Summer Popsicle", "linear", [{ color: "#FA8BFF" }, { color: "#2BD2FF" }, { color: "#2BFF88" }]),
  gradient("Golden Hour", "linear", [{ color: "#FDEB71" }, { color: "#F8D800" }]),
  gradient("Frosty Mint", "linear", [{ color: "#AAFFA9" }, { color: "#11FFBD" }]),
  gradient("Lunar Eclipse", "radial", [{ color: "#283E51" }, { color: "#4B79A1" }]),
  gradient("Butterfly Wings", "linear", [{ color: "#C6FFDD" }, { color: "#FBD786" }, { color: "#f7797d" }]),
  gradient("Neon Lights", "linear", [{ color: "#5f2c82" }, { color: "#49a09d" }]),
  gradient("Ripe Peach", "linear", [{ color: "#ED4264" }, { color: "#FFEDBC" }]),
  gradient("Stormy Sea", "linear", [{ color: "#4b6cb7" }, { color: "#182848" }]),
  gradient("Phoenix Fire", "linear", [{ color: "#f83600" }, { color: "#f9d423" }]),
  gradient("Lavender Haze", "linear", [{ color: "#E3E3E3" }, { color: "#C7D3DD" }, { color: "#9FB1C2" }]),
  gradient("Cosmic Dust", "radial", [{ color: "#1A2980" }, { color: "#26D0CE" }]),
  gradient("Fairy Tale", "linear", [{ color: "#FF75C3" }, { color: "#FFA647" }, { color: "#FFE83F" }]),
  gradient("Frozen Berry", "linear", [{ color: "#e52d27" }, { color: "#b31217" }]),
  gradient("Lemon Lime", "linear", [{ color: "#7ec6bc" }, { color: "#ebe717" }]),
  gradient("Nebula Dream", "linear", [{ color: "#3E5151" }, { color: "#DECBA4" }]),
  gradient("Royal Velvet", "linear", [{ color: "#141E30" }, { color: "#243B55" }]),
  gradient("Sherbet Sunset", "linear", [{ color: "#f7b733" }, { color: "#fc4a1a" }]),
  gradient("Mystic Meadow", "linear", [{ color: "#1f4037" }, { color: "#99f2c8" }]),
  gradient("Electric Dreams", "linear", [{ color: "#3494E6" }, { color: "#EC6EAD" }]),
  gradient("Coral Reef", "linear", [{ color: "#FF8008" }, { color: "#FFC837" }]),
  gradient("Twilight Zone", "radial", [{ color: "#2B3A42" }, { color: "#3F5765" }, { color: "#BDD4DE" }]),
  gradient("Cyber Punk", "linear", [{ color: "#FF00FF" }, { color: "#00FFFF" }]),
  gradient("Sahara Desert", "linear", [{ color: "#F09819" }, { color: "#EDDE5D" }]),
  gradient("Midnight Bloom", "linear", [{ color: "#00012D" }, { color: "#0E0E52" }, { color: "#1F1F7A" }]),
  gradient("Pastel Paradise", "linear", [{ color: "#FFB7B2" }, { color: "#FFDAC1" }, { color: "#E2F0CB" }]),
  gradient("Galaxy Swirl", "linear", [
    { color: "#000000" },
    { color: "#4B0082" },
    { color: "#0000FF" },
    { color: "#00FFFF" },
  ]),
  gradient("Crimson Tide", "linear", [{ color: "#8E0E00" }, { color: "#1F1C18" }]),
  gradient("Winter Breeze", "linear", [{ color: "#A1FFCE" }, { color: "#FAFFD1" }]),
  gradient("Neon Noir", "linear", [{ color: "#2B2E4A" }, { color: "#E84545" }]),
  gradient("Tropical Sunshine", "linear", [{ color: "#FCE38A" }, { color: "#F38181" }]),
  gradient("Mystical Forest", "linear", [{ color: "#0F3443" }, { color: "#34E89E" }]),
  gradient("Cotton Candy Sky", "linear", [{ color: "#FEC5BB" }, { color: "#FCD5CE" }, { color: "#FAE1DD" }]),
  gradient("Deep Ocean", "radial", [{ color: "#051937" }, { color: "#004D7A" }, { color: "#008793" }]),
  gradient("Autumn Whisper", "linear", [{ color: "#DAD299" }, { color: "#B0DAB9" }]),
  gradient("Futuristic Neon", "linear", [{ color: "#FF00FF" }, { color: "#00FFFF" }, { color: "#FF00FF" }]),
  gradient("Misty Morning", "linear", [{ color: "#E6DADA" }, { color: "#274046" }]),
  gradient("Retro Wave", "linear", [{ color: "#FF057C" }, { color: "#8D0B93" }, { color: "#321575" }]),
  gradient("Enchanted Garden", "linear", [{ color: "#2F7336" }, { color: "#AA3A38" }]),
  gradient("Icy Glacier", "linear", [{ color: "#CDDCDC" }, { color: "#E2EBF0" }]),
  gradient("Liquid Metal", "linear", [{ color: "#D5DEE7" }, { color: "#E8EBF2" }, { color: "#E2E7ED" }]),
  gradient("Starry Night", "radial", [{ color: "#00223E" }, { color: "#FFA17F" }]),
  gradient("Citrus Peel", "linear", [{ color: "#FDC830" }, { color: "#F37335" }]),
  gradient("Berry Smoothie", "linear", [{ color: "#E8CBC0" }, { color: "#636FA4" }]),
  gradient("Turquoise Flow", "linear", [{ color: "#136a8a" }, { color: "#267871" }]),
  gradient("Burning Sunset", "linear", [{ color: "#FF416C" }, { color: "#FF4B2B" }]),
  gradient("Frosty Mint", "linear", [{ color: "#00b09b" }, { color: "#96c93d" }]),
  gradient("Cosmic Fusion", "radial", [{ color: "#ff00cc" }, { color: "#333399" }]),
  gradient("Lush Vegetation", "linear", [{ color: "#0fd850" }, { color: "#f9f047" }]),
  gradient("Dusty Rose", "linear", [{ color: "#d3959b" }, { color: "#bfe6ba" }]),
  gradient("Electric Violet", "linear", [{ color: "#4776E6" }, { color: "#8E54E9" }]),
  gradient("Sunny Morning", "linear", [{ color: "#f6d365" }, { color: "#fda085" }]),
  gradient("Midnight City", "linear", [{ color: "#232526" }, { color: "#414345" }]),
  gradient("Serene Sea", "linear", [{ color: "#2193b0" }, { color: "#6dd5ed" }]),
  gradient("Purple Haze", "linear", [{ color: "#7F00FF" }, { color: "#E100FF" }]),
  gradient("Sahara Sand", "linear", [{ color: "#eacda3" }, { color: "#d6ae7b" }]),
  gradient("Neon Lights", "linear", [
    { color: "#FF00FF" },
    { color: "#00FFFF" },
    { color: "#FF00FF" },
    { color: "#00FFFF" },
  ]),
  gradient("Mystic River", "linear", [{ color: "#4CA1AF" }, { color: "#2C3E50" }]),
  gradient("Golden Leaves", "linear", [{ color: "#DAA520" }, { color: "#D2691E" }]),
  gradient("Frozen Crystal", "radial", [{ color: "#CFDEF3" }, { color: "#E0EAFC" }]),
  gradient("Velvet Rope", "linear", [{ color: "#5D4157" }, { color: "#A8CABA" }]),
  gradient("Celestial", "linear", [{ color: "#C33764" }, { color: "#1D2671" }]),
  gradient("Fresh Grass", "linear", [{ color: "#56AB2F" }, { color: "#A8E063" }]),
  gradient("Vintage Poster", "linear", [{ color: "#EF3B36" }, { color: "#FFFFFF" }]),
  gradient("Ocean Breeze", "linear", [{ color: "#02AAB0" }, { color: "#00CDAC" }]),
  gradient("Sunrise Blush", "linear", [{ color: "#FF512F" }, { color: "#DD2476" }]),
  gradient("Lunar Eclipse", "radial", [{ color: "#283E51" }, { color: "#4B79A1" }]),
  gradient("Autumn Foliage", "linear", [{ color: "#DAD299" }, { color: "#B0DAB9" }]),
  gradient("Icy Peaks", "linear", [{ color: "#00c6ff" }, { color: "#0072ff" }]),
  gradient("Molten Core", "radial", [{ color: "#F83600" }, { color: "#F9D423" }]),
];
