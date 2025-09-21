function softenColor(colorName) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = colorName;
  const baseColor = ctx.fillStyle;

  let r, g, b;
  if (baseColor.startsWith("#")) {
    const bigint = parseInt(baseColor.slice(1), 16);
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } else {
    [r, g, b] = baseColor.match(/\d+/g).map(Number);
  }

  const blend = { r: 248, g: 245, b: 242 };

  const weight = 0.6;
  const newR = Math.round(r * (1 - weight) + blend.r * weight);
  const newG = Math.round(g * (1 - weight) + blend.g * weight);
  const newB = Math.round(b * (1 - weight) + blend.b * weight);

  return `rgb(${newR}, ${newG}, ${newB})`;
}

export default softenColor;
