
import iconv from 'iconv-lite'
import { Buffer } from 'node:buffer';
import { ColorObject } from '../types/types';
import { cmykToHex, normalizeToHex } from './utils/utils';

// For more information about the ASE format see: http://www.selapa.net/swatches/colors/fileformats.php#adobe_ase
const ASE_SIGNATURE = 0x41534546;
const ASE_VERSION_MAYOR = 1;
const ASE_VERSION_MINOR = 0;
const ASE_BLOCK_TYPE_COLOR = 0x1;
const ASE_BLOCK_TYPE_GROUP_START = 0xC001;
const ASE_BLOCK_TYPE_GROUP_END = 0xC002;
const ASE_COLOR_TYPES: Array<ColorObject['color']['type']> = ['GLOB', 'SPOT', 'NORM'];

const readBlocks = (buffer: Buffer, offset: number) => {
  const result: Array<object> = [],
    numBlocks = buffer.readUInt32BE(8);

  for (let i = 0; i < numBlocks; i++) {
    offset += readBlock(buffer, offset, result);
  }

  return result;
}

function readBlock(buffer: Buffer, offset: number, result: object[]): number {
  const
    type = buffer.readUInt16BE(offset),
    blockLength = buffer.readUInt32BE(offset + 2);

  switch (type) {
  case ASE_BLOCK_TYPE_COLOR:
    result.push(readColorEntry(buffer, offset + 6));
    break;
  case ASE_BLOCK_TYPE_GROUP_START:
    // Note this function only adds group-start/group-end markers to the result array, then another
    // function process those markers to group the colors in the group (see createGroups)
    result.push(readGroupStart(buffer, offset + 6));
    break;
  case ASE_BLOCK_TYPE_GROUP_END:
    result.push({type: 'group-end'});
    break;
  default:
    throw new Error('Unsupported type ' + type.toString(16) + ' at offset ' + offset);
  }

  return 6 + blockLength;
}

const readColorEntry = (buffer: Buffer, offset: number): ColorObject => {
  const nameLength = buffer.readUInt16BE(offset);

  return {
    type: 'color',
    name: readUTF16BE(buffer, offset + 2, nameLength),
    color: readColor(buffer, offset + 2 + nameLength * 2)
  };
}

const readColor = (buffer: Buffer<ArrayBufferLike>, offset: number): ColorObject['color'] => {
  const model = buffer.toString('utf8', offset, offset + 4).trim();
  

  switch (model) {
  case 'RGB': {
    const { r, g, b } = {
      r: buffer.readFloatBE(offset + 4),
      g: buffer.readFloatBE(offset + 8),
      b: buffer.readFloatBE(offset + 12),
    }
    return {
      model,
      r, g, b,
      hex: normalizeToHex(r) + normalizeToHex(g) + normalizeToHex(b),
      type: ASE_COLOR_TYPES[buffer.readUInt16BE(offset + 16)]
    };
  }
  case 'CMYK': {
    const { c, m, y, k } = {
      c: buffer.readFloatBE(offset + 4),
      m: buffer.readFloatBE(offset + 8),
      y: buffer.readFloatBE(offset + 12),
      k: buffer.readFloatBE(offset + 16),
    }
  
    return {
      model,
      c, m, y, k,
      hex: cmykToHex(c,m,y,k),
      type: ASE_COLOR_TYPES[buffer.readUInt16BE(offset + 20)]
    }
  };
  case 'Gray': {
    const gray = buffer.readFloatBE(offset + 4)
    return {
      model: model,
      gray,
      hex: normalizeToHex(gray) + normalizeToHex(gray) + normalizeToHex(gray),
      type: ASE_COLOR_TYPES[buffer.readUInt16BE(offset + 8)]
    };
  };
  case 'LAB':
    return {
      model: model,
      lightness: buffer.readFloatBE(offset + 4),
      a: buffer.readFloatBE(offset + 8),
      b: buffer.readFloatBE(offset + 12),
      type: ASE_COLOR_TYPES[buffer.readUInt16BE(offset + 16)]
    };
  default:
    throw new Error('Unsupported color model: ' + model + ' at offset ' + offset);
  }
}

const readGroupStart = (buffer: Buffer, offset: number): { type: string, name: string } => {
  const nameLength = buffer.readUInt16BE(offset);
  return {
    type: 'group-start',
    name: readUTF16BE(buffer, offset + 2, nameLength)
  };
}

const readUTF16BE = (buffer: Buffer, offset: number, length: number) => {
  // Slice the buffer using Uint8Array.slice and convert it back to a Buffer
  const slicedBuffer = Buffer.from(Uint8Array.prototype.slice.call(buffer, offset, offset + length * 2));
  return iconv.decode(slicedBuffer, 'utf16be');
};


// Reduces an array of objects that contains group-start/group-end markers to an array that contants group objects
// containing all the objects between the markers.
function createGroups(accumulated, item) {
  const last = accumulated[accumulated.length - 1];

  if (last && last.type === 'group-start') {
    if (item.type === 'group-end') {
      last.type = 'group';
    } else {
      last.entries.push(item);
    }
  } else if (item.type === 'group-start') {
    item.entries = [];
    accumulated.push(item);
  } else {
    accumulated.push(item);
  }
  return accumulated;
}

const read = (buffer: Buffer) => { 
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('The argument is not an instance of Buffer');
  }

  if (buffer.readUInt32BE(0) !== ASE_SIGNATURE) {
    throw new Error('Invalid file signature: ASEF header expected');
  }

  if (buffer.readUInt16BE(4) !== ASE_VERSION_MAYOR || buffer.readUInt16BE(6) !== ASE_VERSION_MINOR) {
    throw new Error('Only version 1.0 of the ASE format is supported');
  }

  return readBlocks(buffer, 12).reduce(createGroups, []);
};

export default read;
