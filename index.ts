import read from './src/converter';
import * as fs from 'fs';

const result = read(fs.readFileSync('./src/colors/COLORS.ase'));

console.log(JSON.stringify(result, null, 2));