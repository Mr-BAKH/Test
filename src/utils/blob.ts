import RNFS from 'react-native-fs';

// Function to read a file from the local path and convert it to Base64
export const fileToBase64 = async (filePath:string) => {
  try {
    // Read the file using react-native-fs
    const fileData = await RNFS.readFile(filePath, 'base64');
    // console.log(fileData)
    return fileData;
  } catch (error) {
    console.error('Error reading and converting file:', error);
    throw error;
  }
};

// Usage example
// const filePath = '/path/to/your/file.jpg'; // Replace with the actual file path

// fileToBase64(filePath)
//   .then((base64Data) => {
//     console.log('Base64 data:', base64Data);
//     // You can now use the base64Data as needed
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
// In 