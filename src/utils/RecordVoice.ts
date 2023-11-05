import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Platform } from 'react-native';
import { useState } from 'react';



export const onStartRecord = async ({input:any}) => {

  const result = await input.startRecorder();
//  audioRecorderPlayer.addRecordBackListener((e) => {
//     this.setState({
//       recordSecs: e.currentPosition,
//       recordTime: this.audioRecorderPlayer.mmssss(
//         Math.floor(e.currentPosition),
//       ),
//     });
//     return;
//   });
  console.log(result);
};