import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeScreen from '../screens/HomeScreen'
import UsersScreen from '../screens/UsersScreen'
import LogoutScreen from '../screens/LogoutScreen'
import TodoApp from '../screens/TodoApp'
import CrudOp from '../screens/CrudOP'
import ChangeLanguage from '../screens/ChangeLanguage'
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useTranslation } from 'react-i18next'
import ReduxMainPage from '../screens/ReduxMainPage'
import CreateUser from '../screens/CreateUser'

const Drawer = createDrawerNavigator()

export default function DrawerNavigation() {
  const { t } = useTranslation();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: '#fff', width: 250 },
        headerStyle: { backgroundColor: '#374151' },
        headerTintColor: '#ffe2db',
      }}
    >
      <Drawer.Screen name={t('drawer.home')} component={HomeScreen}
        options={{
          drawerLabel: t('drawer.home'),
          drawerIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          )
        }}
      />
      {/* <Drawer.Screen name={t('drawer.users')} component={UsersScreen}
        options={{
          drawerLabel: t('drawer.users'),
          drawerIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          )
        }} /> */}

      {/* <Drawer.Screen name={t('drawer.crud')} component={CrudOp}
        options={{
          drawerLabel: t('drawer.crud'),
          drawerIcon: ({ color, size }) => (
            <AntDesign name="edit" size={size} color={color} />
          )
        }}
      /> */}

      {/* <Drawer.Screen name={t('drawer.todo')} component={TodoApp}
        options={{
          drawerLabel: t('drawer.todo'),
          drawerIcon: ({ color, size }) => (
            <AntDesign name="checkcircleo" size={size} color={color} />
          )
        }}
      /> */}

      <Drawer.Screen name={t('drawer.changeLanguage')} component={ChangeLanguage}
        options={{
          drawerLabel: t('drawer.changeLanguage'),
          drawerIcon: ({ color, size }) => (
            <AntDesign name="earth" size={size} color={color} />
          )
        }}
      />

      <Drawer.Screen name='Create User' component={CreateUser}
      options={{
          drawerLabel: "Create New User ",
          drawerIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          )
        }} />


      <Drawer.Screen name='Redux' component={ReduxMainPage}
        options={{
          headerShown: false,
          drawerLabel: "Redux",
          drawerIcon: ({ color, size }) => (
            <AntDesign name="database" size={size} color={color} />
          )
        }}
      />

      <Drawer.Screen name={t('drawer.logout')} component={LogoutScreen}
        options={{
          drawerLabel: t('drawer.logout'),
          drawerIcon: ({ color, size }) => (
            <AntDesign name="logout" size={size} color={color} />
          )
        }} />
        
    </Drawer.Navigator>
  )
}