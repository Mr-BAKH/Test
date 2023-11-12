import Video, {VideoRef} from 'react-native-video';
import { useEffect, useRef,useState,useMemo } from 'react';
import { StyleSheet, View, Text,Image,ImageBackground } from 'react-native';
import {Icon_Botton} from '../components/Botton'
import * as Progress from 'react-native-progress';
import {faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';



export default function VideoPlayer({path,style}){
 const defaultPath = require('../assets/video/Simple_Criss_cross_background_HD_BG.mp4');
//  const background2 = {uri:"https://vod-progressive.akamaized.net/exp=1699657240~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F3448%2F15%2F392243847%2F1661797336.mp4~hmac=510a7aeb2d2a0775b145daf826a70c75fa6cd109bec5de42b52decff4a3ddbc6/vimeo-prod-skyfire-std-us/01/3448/15/392243847/1661797336.mp4"};
 const background = path !== ''?{uri:path}: defaultPath;

  const [pauseState, setPause] = useState<boolean>(true) // default is true
  const [displayReady,setDisplayReady] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  useMemo(()=>{
    if(pauseState){
      setDisplayReady(false)
    }else{
      setDisplayReady(true)
    }
    setProgress(0)
  },[pauseState])

  const handleProgeresss = (val) => {
        setProgress(Math.ceil(Math.ceil(Math.ceil(val.currentTime/val.seekableDuration*1000)/10)/10)/10); 
  }

 return (
  <View
    className='flex-1 relative justify-center items-center'
  >
    {/* controll button */}
    <View className='absolute z-40 right-5 bottom-2'>
      <Icon_Botton color={"#eee"} backColor={'rgba(0,0,0,0.2)'} icon={pauseState? faPlay: faPause} func={()=>setPause(!pauseState)}/>
    </View>
    {/*  */}
    {!displayReady  ? 
      <View className='w-full h-full z-10 absolute justify-end'>
      <Image
        style={{opacity:0.2}}
        source={require('../assets/image/pexels-martin-lopez-1117132.jpg')}
        className='w-full h-full'
        />
        <Text className='backdrop-blur-lg font-bold text-white p-4 px-3 bg-black/10 '>Tap to play video!</Text>
      </View>
      :
      <View
        className='w-full absolute z-20 bottom-1 bg-black/20 py-1 justify-end items-center'
      >
          <Progress.Bar 
          width={wp(65)}
          height={10}
          color={style?'purple':'darkblue'} 
          borderWidth={0}
          progress={progress} 
          indeterminateAnimationDuration={1000}
          />
      </View>
    }  
   <Video 
    // Can be a URL or a local file.
    className='w-full h-full'
    source={background}
    // source={background}
    // controls={true}
    paused={pauseState} // default is true 
    resizeMode='cover'
    muted={false}
    rate={1}
    fullScreen={true}
    // posterResizeMode='cover'
    // poster={'https://s3-prod-europe.autonews.com/s3fs-public/styles/1024x512/public/Maybach%20S%20Class%20web.jpg'}
    // paused={true}

    // Callback when remote video is buffering                                      
    // onBuffer={(val)=> console.log('buffer CALBACK >>> ',val)}
    // onError={(val:any)=> console.log('ERROR CALBACK >>> ',val)}
    // onLoadStart={(val:any)=> console.log('onLoadStart >>> ',val)}
    onLoad={()=> setPause(true)}
    // onStart={(val)=> console.log('onStart CALBACK >>> ',val)}
    // onPlay={(val)=> console.log('onPlay CALBACK >>> ',val)}
    onEnd={()=> setPause(!setPause)}
    onProgress={handleProgeresss}
    // onTimedMetadata={(val)=> console.log('onTimedMet CALBACK >>> ',val)}
    onReadyForDisplay={()=> {setDisplayReady(true)}}
    />
    </View>
 )
}
 
