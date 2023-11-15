import { View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native'
import React,{useCallback} from 'react'
import {SchemaContext} from '../models/main'
import {User} from '../models/user'
import Realm from 'realm'

// global scope const 
const {useQuery,useRealm} = SchemaContext;

const Test = () => {
    
    const users = useQuery(User);
    const realm = useRealm();
    // console.log(users)

    const createUser = useCallback(()=>{
        realm.write(()=>{
            realm.create('User',{
                _id: new Realm.BSON.ObjectId(),
                username:'back',
                userpass:'1234',
                userphone:'09154968488',
                time: new Date(),
            })
        })
    },[realm])

  return (
    <View
        className='flex-1 bg-red-500 relative items-center'
    >
        <FlatList
            data={users}
            className='flex-1'
            keyExtractor={item=> String(item._id)}
            contentContainerStyle={{width:'100%', height:'auto', paddingVertical:40}}
            renderItem={({item})=> 
                <UserComponent
                item={item}
                />}
        />
        <TouchableOpacity 
            className='absolute bottom-6 bg-green-500 rounded-full z-50 p-5'
            onPress={createUser}
        >
        <Text className='text-black'>create user!</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Test;



const UserComponent = ({item}:{item: User})=>{

    const realm = useRealm();

    const handleDelet = useCallback(()=>{
        realm.write(()=>{
            realm.delete(item)
        })
    },[realm])

    const handleUpdate = useCallback(()=>{
        realm.write(()=>{
            item.username = 'updated!'
        })
    },[realm])

    return(
        <Pressable
            style={{gap:2}}
            onLongPress={handleDelet}
            onPress={handleUpdate}
            className='w-[90vw] bg-gray-950 p-5 mb-5 rounded-lg shadow-md flex-col justify-center items-center'
        >
            <Text>userID : {String(item._id)}</Text>
            <Text>UserName : {item.username}</Text>
            <Text>UserPass : {item.userpass}</Text>
            <Text>UserPhone : {item.userphone}</Text>
            <Text>Usergmail : {item.usergmail}</Text>
            <Text>time : {String(item.time)}</Text>
        </Pressable>
    )
}