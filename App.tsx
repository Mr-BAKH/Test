import React from 'react'
import HomeRouter from './src/router'
import {SchemaContext} from './src/models/main'

// user Provider of realm
const {RealmProvider} = SchemaContext;

// App Component
const App= ()=> {

  return (
    <RealmProvider>
      <HomeRouter/>
    </RealmProvider>
  )
}


export default App;