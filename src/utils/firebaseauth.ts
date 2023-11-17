import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import {Firebase_Auth} from '../config/firebase'

const auth = Firebase_Auth;



export const firebaseAuthintication = async (username,password)=>{
    
    try{
       return  await signInWithEmailAndPassword(auth,username,password)
    }
    catch(e){
        console.log('ERROR#1:',e)
        try{
            await createUserWithEmailAndPassword(auth,username,password)
           
        }
        catch(e){
            console.log("ERROR#2",e)
        }
        finally{
            return await signInWithEmailAndPassword(auth,username,password)
        }
    }
    finally{
        console.log('authentication is Done!')
    }


};


