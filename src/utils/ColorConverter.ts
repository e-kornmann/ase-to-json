import { RgbToHex } from '@/types';
import iconv from 'iconv-lite'

class ColorConverter {
  private static cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number } {
    return {
      r: this.toIntRGB((1 - c / 100) * (1 - k / 100)),
      g: this.toIntRGB((1 - m / 100) * (1 - k / 100)),
      b: this.toIntRGB((1 - y / 100) * (1 - k / 100))
    };
  }

  public static toIntCMYK(value: number): number {
    return Math.round(value * 1000) / 10;
  }

  public static readUTF16BE(buffer: Buffer, offset: number, length: number) {
    // Slice the buffer using Uint8Array.slice and convert it back to a Buffer
    const slicedBuffer = Buffer.from(Uint8Array.prototype.slice.call(buffer, offset, offset + length * 2));
    return iconv.decode(slicedBuffer, 'utf16be');
  };
  

  static toIntRGB(value: number): number {
    return Math.round(255 * value);
  }


  public static rgbToHex({ r, g, b, gray }: RgbToHex): string {
    const componentToHex = (c: number = 0): string => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${componentToHex(gray || r!)}${componentToHex(gray || g!)}${componentToHex(gray || b!)}`;
  }

  public static cmykToHex(c: number, m: number, y: number, k: number): string {
    return this.rgbToHex(this.cmykToRgb(c, m, y, k));
  }
}

export { ColorConverter };
