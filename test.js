const colors = require("tailwindcss/colors");

// console.log(colors);

const formatedColors = {};
const blacklist = ["lightBlue", "warmGray", "trueGray", "blueGray", "coolGray"];

for (const [color, props] of Object.entries(colors)) {
  if (blacklist.includes(color)) continue;
  if (typeof props == "string") {
    formatedColors[color] = props;
  } else if (typeof props == "object") {
    for (const [shade, value] of Object.entries(props)) {
      formatedColors[`${color}-${shade}`] = value;
    }
  }
}

console.log(JSON.stringify(formatedColors));
