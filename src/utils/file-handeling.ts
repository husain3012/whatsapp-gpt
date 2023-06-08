import fs from "fs"

export const readFromFile = (filename ) => {
    try {
      const data = fs.readFileSync(filename, 'utf8');
      const numbers = data.split('\n').filter(Boolean);
      return new Set(numbers);
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File doesn't exist, initialize an empty set
        return new Set();
      } else {
        // Other error occurred, handle it accordingly
        console.error('Error reading from file:', err);
      }
    }
  };



export  const writeToFile = (filename, trusted_numbers) => {
    fs.writeFileSync(filename, Array.from(trusted_numbers).join('\n'));
  };
  