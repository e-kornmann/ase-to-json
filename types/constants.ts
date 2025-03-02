export const SIGNATURE = {
  ASEF: 'ASEF',
} as const;

export const BLOCK_TYPES = {
  GROUP_START: Buffer.from([0xC0, 0x01]),
  GROUP_END: Buffer.from([0xC0, 0x02]),
  COLOR_ENTRY: Buffer.from([0x00, 0x01]),
} as const;


export const COLOR_SPACES = {
  CMYK: 'CMYK',
  RGB: 'RGB',
  LAB: 'LAB',
  Gray: 'Gray',
} as const;

export const COLOR_TYPES = {
  GLOBAL: 0,
  SPOT: 1,
  NORM: 2,
} as const;
