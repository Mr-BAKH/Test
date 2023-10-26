import SQLite from 'react-native-sqlite-storage';
import { View, Text, TouchableOpacity, TextInput, Alert, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'


const db = SQLite.openDatabase({
  name: 'mydb',
  location: 'default'
},
() => {
  console.log("Database connected!")
}, //on success
error => console.log("Database error", error) //on error
)



const App = ()=> {

  useEffect(() => {
    createUserTable(); //call create table function here
  },[])

  //create table function
  const createUserTable = () => {
      db.executeSql(
        "CREATE TABLE IF NOT EXISTS "+
        "users "+
        "(id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR, name VARCHAR)",
        [],
        (result) => {
          console.log("Table created successfully");
        }, (error) => {
          console.log("Create table error", error)
        })
  }

  const createUser = async() => {
    let sql = "INSERT INTO users (email, name) VALUES (?, ?)";
    let params = ["yoursocialmd@gmail.com", "MD Sarfaraj"]; //storing user data in an array
    await db.executeSql(sql, params, (result) => {
        Alert.alert("Success", "User created successfully.");
    }, (error) => {
        console.log("Create user error", error);
    });
}

const listUsers = async () => {
  let sql = "SELECT * FROM users";
  db.transaction((tx) => {
      tx.executeSql(sql, [], (tx, resultSet) => {
          var length = resultSet.rows.length;
          for (var i = 0; i < length; i++) {
              console.log(resultSet.rows.item(i));
          }
      }, (error) => {
          console.log("List user error", error);
      })
  })
}

const updateUser = () => {
  let sql = 'UPDATE users SET email = ?, name = ? WHERE id = ?';
  let params = ['yoursocialmd@gmail.com', "Mohammad Sarfaraj", 1];
  db.executeSql(sql, params,(resultSet) => {
      Alert.alert("Success", "Record updated successfully");
  }, (error) => {
      console.log(error);
  });
}

const deleteUser = () => {
  let sql = "DELETE FROM users WHERE id = ?";
  let params = [1];
  db.executeSql(sql, params, (resultSet) => {
      Alert.alert("Success", "User deleted successfully");
  }, (error) => {
      console.log("Delete user error", error);
  })
}

  return (
    <View
      style={{
        flex:1,
        alignItems:'center',
        gap:10
      }}
    >
      <Text>
        test SQLite
      </Text>
      <TouchableOpacity
        onPress={createUser}
        style={{backgroundColor:'blue',width:'80%',margin:'auto',padding:15,alignItems:'center'}}
      >
        <Text>
          Create User
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={listUsers}
        style={{backgroundColor:'green',width:'80%',margin:'auto',padding:15,alignItems:'center'}}
      >
        <Text>
          showUser
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={updateUser}
        style={{backgroundColor:'yellow',width:'80%',margin:'auto',padding:15,alignItems:'center'}}
      >
        <Text>
          Update
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={deleteUser}
        style={{backgroundColor:'red',width:'80%',margin:'auto',padding:15,alignItems:'center'}}
      >
        <Text>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default App;