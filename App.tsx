import SQLite from 'react-native-sqlite-storage';
import { View, Text, TouchableOpacity, TextInput, Alert, StatusBar, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'


const db =SQLite.openDatabase({
  name:'task',
  location:'default'
},
()=>{
  console.log('Open task successfully!');
},
error=>{
  console.log("Error: ", error)
}
)

const App = ()=> {

  const [task, setTask]= useState<string>('')
  const [showlist, setShowlist] = useState([])
  const [edit, setEdit] = useState<boolean>(false)
  const [editID, setEditID] = useState<number>()

  //handle creatign a table
  const createtable = () => {
    db.executeSql(
      "CREATE TABLE IF NOT EXISTS "
      +"task "
      +"(id INTEGER PRIMARY KEY AUTOINCREMENT, task VARCHAR)",
      [],
      (result) => {
        console.log("Table created successfully");
      }, 
      (error) => {
        console.log("Create table error", error)
    })
  }

  //handle add item
  const addTask = ()=>{
    if(task !== ''){
      let sql = "INSERT INTO task (task) VALUES (?)";
      let params = [task]; 
      setTask('')
      db.executeSql(sql, params, (result) => {
          Alert.alert("Success", "Task created successfully.");
      }, (error) => {
          console.log("Create Task error", error);
      });
      listUsers()
    }else{
      Alert.alert('please Write a task!')
    }
  }

  //fetch task
  const listUsers = async () => {
    let sql = "SELECT * FROM task";
    db.transaction((tx) => {
        tx.executeSql(sql, [], (tx, resultSet) => {
            var length = resultSet.rows.length;
            let task:any = []
            for (let i = 0; i < length; i++){
                // console.log(resultSet.rows.item(i))
                task.push(resultSet.rows.item(i))
            }
            setShowlist(task);
            // console.log(showlist)
        }, (error) => {
            console.log("List user error", error);
        })
    })
}

  //handle delete task
  const deleteTast = (id:number) => {
    // console.log(i)
    let sql = "DELETE FROM task WHERE id = ?";
    let params = [id];
    db.executeSql(sql, params, (resultSet) => {
        Alert.alert("Success", "Task deleted successfully!");
        listUsers()
    }, (error) => {
        console.log("Delete user error", error);
    })
}

  //handle updating task
  const updateUser = () => {
    let sql = 'UPDATE task SET task = ? WHERE id = ?';
    let params = [task, editID];
    db.executeSql(sql, params, (resultSet) => {
        Alert.alert("Success", "Record updated successfully");
        setEdit(false);
        listUsers();
        setTask('')
    }, (error) => {
        console.log(error);
        setTask('')
    });
}

  //handle show use by Id
  const selectUserById = (id:any) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM task WHERE id = ?',
          [id],
          (tx, results) => {
            if (results.rows.length === 1) {
              // User found, resolve with user data
              const user = results.rows.item(0);
              resolve(user);
            } else {
              // User not found, resolve with null
              resolve(null);
            }
          },
          (tx, error) => {
            reject(error);
          }
        );
      });
    }).then((val:any) => {
      if (val) {
        // console.log(task)
        setTask(val.task)
        setEditID(val.id)
      } else {
        console.log('User not found');
      }
    })
    .catch((error:any) => {
      console.error('Error selecting user:', error);
    });
  };

  useEffect(()=>{
    // create a table
    createtable()
    listUsers()
  },[])
  

  return (
    <View
      style={{
        flex:1,
        alignItems:'center',
        gap:10
      }}
    >
      <StatusBar backgroundColor={'yellow'} barStyle='dark-content'/>
      <TextInput
        placeholder='write a task...'
        onChangeText={setTask}
        value={task}
        style={{width:'100%',fontSize:20,paddingHorizontal:20,paddingVertical:20}}
      />
      <View
        style={{
          flexDirection:'row',
          gap:5,
          justifyContent:"center"
        }}
      >
        <Button 
          title={'Creat Task'} 
          fuc={addTask} 
          color={'darkgreen'}
          edit={edit}
          appplyFunc={updateUser}
        />
      </View>

      <ScrollView
        style={{
          width:'100%',          
        }}
        contentContainerStyle={{
          paddingHorizontal:70,
          paddingVertical:20,
          justifyContent:'flex-start',
          gap:10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {showlist.length > 0 ? showlist.map((item,index)=>{
          // console.log(item.id)
          return(
            <Task_COM
             key={index}
             id={item['id']} 
             title={item['task']} 
             fuc={()=> console.log('task id:!')}
             delete_fuc={deleteTast}
             edit={edit}
             setEdit={setEdit}
             selectUserById={selectUserById}
            />
          )
        })
        :
        <View
          style={{flex:1,alignItems:'center',justifyContent:'center'}}
        >
          <Text>nothing to show!</Text>
        </View>
        }
      </ScrollView>
      
    </View>
  )
}

export default App;


const Button = ({title, fuc, color, edit,appplyFunc}:any)=>{
  return(
    <TouchableOpacity
      onPress={edit? appplyFunc : fuc}
      style={{
        backgroundColor:color,
        padding:10,
        paddingHorizontal:70,
        borderRadius:10,
      }}
    >
      <Text style={{color:"white"}}>
        {edit ? 'Apply Edit': title}
      </Text>
    </TouchableOpacity>
  )
}

const Task_COM = ({title,fuc,id,delete_fuc,edit,setEdit,selectUserById}:any)=>{

  return(
    <TouchableOpacity
      onPress={fuc}
      style={{
        width:'98%',
        position:'relative',
        padding:10,
        borderRadius:10,
        backgroundColor:"darkorange",
        justifyContent:'center',
        alignItems:'center'
      }}
    >
      <Text style={{color:'white'}}>{title}</Text>
      {/* action button */}
      <TouchableOpacity
        onPress={() => delete_fuc(id)}
        style={{
         backgroundColor:'darkred',
          position:'absolute',
          right:-60,
          padding:7,
          borderRadius:10,
        }}
      >
        <Text style={{color:"white"}}>Delete</Text>
      </TouchableOpacity>

      {!edit && 
        <TouchableOpacity
          onPress={() => {
            setEdit(!edit)
            selectUserById(id)
          }}
          style={{
          backgroundColor:'darkblue',
            position:'absolute',
            left:-50,
            padding:7,
            borderRadius:10,
          }}
        >
          <Text style={{color:"white"}}>Edit</Text>
        </TouchableOpacity>
      }

    </TouchableOpacity>
  )
}