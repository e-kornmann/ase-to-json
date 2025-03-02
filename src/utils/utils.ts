const cmykToHex = (c: number, m: number, y: number, k: number) => {
  return `#${normalizeToHex(1 - c * (1 - k))}${normalizeToHex(1 - m * (1 - k))}${normalizeToHex(1 - y * (1 - k))}`;
};

const normalizeToHex = (value: number) => {
  return Math.round(value * 255).toString(16).padStart(2, '0').toUpperCase();
};

export { cmykToHex, normalizeToHex };
