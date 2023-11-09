import React, { useEffect, useState } from 'react';
import { View, Button,Image } from 'react-native';
import RNFS from 'react-native-fs';

const FileDownloadScreen = () => {

 const [path,setPath] = useState('')

  useEffect(() => {
    // Optional: Delete the file if it exists before downloading
    const filePath = RNFS.DocumentDirectoryPath + '/example.jpg';
    RNFS.unlink(filePath)
      .then(() => {
        console.log('Previous file deleted');
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const downloadFile = () => {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Portrait_of_Ruhollah_Khomeini.jpg/220px-Portrait_of_Ruhollah_Khomeini.jpg';
    var filePath = RNFS.DocumentDirectoryPath + '/example.jpg';

    RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      background: true, // Enable downloading in the background (iOS only)
      discretionary: true, // Allow the OS to control the timing and speed (iOS only)
      progress: (res) => {
        // Handle download progress updates if needed
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Progress: ${progress.toFixed(2)}%`);
      },
    })
      .promise.then((response) => {
        console.log('File downloaded!', response);
        setPath('file://'+filePath)
      })
      .catch((err) => {
        console.log('Download error:', err);
      });
  };

  return (
    <View>
      <Button title="Download File" onPress={downloadFile} />
      <Image
            source={
                path !== ''?
                {uri: path}
                :
                require('../assets/image/mercedes-maybach-s-class-haute-voiture.jpg')
            }
            className='w-[100px] h-[100px]'
            resizeMode="cover"
        />
    </View>
  );
};

export default FileDownloadScreen;
