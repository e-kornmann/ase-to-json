import { COLOR_SPACES, COLOR_TYPES, SIGNATURE } from './constants';

type ColorType = {
  model: string;
  r?: number;
  g?: number;
  b?: number;
  c?:  number;
  m?: number;
  y?: number;
  k?: number;
  lightness?: number;
  a?: number;
  gray?: number,
  hex?: string
  type: 'GLOB' | 'SPOT' | 'NORM'
};

export type ConstantObject = typeof SIGNATURE | typeof COLOR_SPACES | typeof COLOR_TYPES;
export type ColorObject = { type: 'color', name: string, color: ColorType };
export type ColorGroup = Record<string, ColorObject> | ColorObject;
export type RgbToHex = { r: number; g: number; b: number; gray?: never } | { gray: number; r?: never; g?: never; b?: never }
export type Block = { type: string, name?: string, color?: ColorObject['color'], entries?: Block[] }
export { Buffer } from 'node:buffer';
