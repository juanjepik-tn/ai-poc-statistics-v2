function hexToRGB(h: any) {
  const r = '0x' + h[1] + h[2];
  const g = '0x' + h[3] + h[4];
  const b = '0x' + h[5] + h[6];

  return `rgb(${+r}, ${+g}, ${+b})`;
}

function adjustColor(
  color: string,
  adjustedOpacity: number,
  adjustment: number,
) {
  return Math.round(parseInt(color) * adjustedOpacity + adjustment);
}

/**
 * This function adds a decimal opacity for a given color
 *
 * @param hexColor color in hexadecimal string format
 * @param opacity The desired opacity from 0 to 1, where 1 is full opacity
 * @returns
 */
export function addOpacityToHexColor(hexColor: string, opacity: number) {
  // Convert hex color to RGB
  const rgbColor = hexToRGB(hexColor);
  // Extract RGB components
  const [rawRed, rawGreen, rawBlue, alpha] = rgbColor.split(',');
  // Calculate adjusted opacity values
  const isNegative = opacity < 0;
  const adjustment = isNegative ? 0 : 255 * opacity;
  const adjustedOpacity = isNegative ? 1 + opacity : 1 - opacity;

  const red = adjustColor(
    rawRed[3] === 'a' ? rawRed.slice(5) : rawRed.slice(4),
    adjustedOpacity,
    adjustment,
  );
  const green = adjustColor(rawGreen, adjustedOpacity, adjustment);
  const blue = adjustColor(rawBlue, adjustedOpacity, adjustment);

  // Compose the modified RGB(A) string
  const modifiedColor = `rgb${alpha ? 'a' : ''}(${red},${green},${blue}${
    alpha ? `,${alpha}` : ''
  })`;

  return modifiedColor;
}
