import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeScreen from '../screens/HomeScreen'
import UsersScreen from '../screens/UsersScreen'
import LogoutScreen from '../screens/LogoutScreen'
import TodoApp from '../screens/TodoApp'
import CrudOp from '../screens/CrudOP'

const Drawer = createDrawerNavigator()

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: '#fff', width: 250 },
        headerStyle: { backgroundColor: '#374151' },
        headerTintColor: '#ffe2db',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Users" component={UsersScreen} />
      <Drawer.Screen name ="CRUD" component={CrudOp}/>
      <Drawer.Screen name= "Todo App" component={TodoApp}/>
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  )
}