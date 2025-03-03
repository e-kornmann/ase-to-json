import { Block } from './src/types/types';
import read from './src/converter';
import * as fs from 'fs';

const convertion: Block[] = read(fs.readFileSync('./src/colors/COLORS.ase'));

const args = process.argv.slice(2); // Get arguments passed from the CLI
function getOnlyTheHexColorsOfAllGroups(input: Block[], groupName?: string): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  
  input.forEach(item => {
    if (item.type === 'group' && item.entries) {
      if (!groupName || groupName === item.name) {
        const group = item.entries.reduce<Record<string, string>>((acc, entry) => {
          if (entry.name && entry.type === 'color' && entry.color && entry.color.hex) {
            acc[entry.name] = entry.color.hex;
          }
          return acc;
        }, {});  
        
        if (item.name) {
          result[item.name] = group;
        }
      }
    }
  });
  return result;
}
 
if (args.length) {
  args.forEach(a => {
    const groupData = getOnlyTheHexColorsOfAllGroups(convertion, a);
    console.log(`Converting group "${a}" >`);
    console.log(JSON.stringify(groupData, null, 2));
  })
} else {
  
  
  fs.writeFile('src/colors/COLORS.json', JSON.stringify(convertion, null, 4), function(err) {
        
    // error writing file
    if (err) {
      return console.error(err.message);
    }
  });
  

  console.log(`${JSON.stringify(convertion, null, 2)}`);
  console.log('COLORS.ase succesfull converted to > COLORS.json');
}