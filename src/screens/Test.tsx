import Video, {VideoRef} from 'react-native-video';
import { useRef,useState } from 'react';
import { StyleSheet } from 'react-native';

export default function VideoPlayer(){
 const background = require('../assets/video/Simple_Criss_cross_background_HD_BG.mp4');
 const background2 = {uri:"https://vod-progressive.akamaized.net/exp=1699657240~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F3448%2F15%2F392243847%2F1661797336.mp4~hmac=510a7aeb2d2a0775b145daf826a70c75fa6cd109bec5de42b52decff4a3ddbc6/vimeo-prod-skyfire-std-us/01/3448/15/392243847/1661797336.mp4"};

  const [pauseState, setPause] = useState<boolean>(true)
  const [playState, setplay] = useState<boolean>(true)

 return (
   <Video 
    // Can be a URL or a local file.
    className='flex-1 bg-gray-500'
    source={background2}
    controls={true}
    paused={true}
    resizeMode='cover'
    muted={false}
    rate={1}
    fullScreen={true}
    // poster={'https://media.ed.edmunds-media.com/mercedes-benz/maybach/2022/oem/2022_mercedes-benz_maybach_sedan_s-580-4matic_fq_oem_1_1280.jpg'}
    // paused={true}

    // Callback when remote video is buffering                                      
    onBuffer={(val)=> console.log('buffer CALBACK >>> ',val)}
    onError={(val)=> console.log('ERROR CALBACK >>> ',val)}
    onLoad={(val)=> console.log('onLoad CALBACK >>> ',val)}
    onStart={(val)=> console.log('onStart CALBACK >>> ',val)}
    onPlay={(val)=> console.log('onPlay CALBACK >>> ',val)}
    onEnd={(val)=> console.log('onEnd CALBACK >>> ',val)}
    // onProgress={(val)=> console.log('onProgress CALBACK >>> ',val)}
    onTimedMetadata={(val)=> console.log('onTimedMet CALBACK >>> ',val)}
    onReadyForDisplay={(val)=> console.log('onReadyForDisplay CALBACK >>> ',val)}
    
   
   />
 )
}
 
