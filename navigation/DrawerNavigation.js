import React, { useEffect, useState } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeScreen from '../screens/HomeScreen'
import LogoutScreen from '../screens/LogoutScreen'
import ChangeLanguage from '../screens/ChangeLanguage'
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from 'react-i18next'
import CreateUser from '../screens/CreateUser'
import { Text } from 'react-native'

const Drawer = createDrawerNavigator()

export default function DrawerNavigation() {

  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.warn('Token not found');
        return;
      }

      const response = await axios.get(
        'https://mobile.faveodemo.com/mudabir/public/v3/user-export-data',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            'roles[0]': 'user',
            'roles[1]': 'agent',
            'sort-order': 'desc',
            limit: 10,
            page: 1,
          },
        }
      );
      const userNumber = response.data?.data?.total || 0;
      setTotalUsers(userNumber);
      console.log(totalUsers, "Total Users Fetched");

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [])

  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: '#fff', width: 250 },
        headerStyle: { backgroundColor: '#374151' },
        headerTintColor: '#ffe2db',
      }}
    >
      <Drawer.Screen name="User List" component={HomeScreen}
        options={{
          // drawerLabel: t('drawer.home'),
          drawerLabel: "User List",
          drawerIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
          headerTitleAlign: 'center',
          headerRight: ()=> (
            <Text style={{fontSize: 20, color:"white", marginRight:15,}}>{totalUsers}</Text>
          )
        }}
      />

      <Drawer.Screen name={t('drawer.changeLanguage')} component={ChangeLanguage}
        options={{
          drawerLabel: t('drawer.changeLanguage'),
          drawerIcon: ({ color, size }) => (
            <AntDesign name="earth" size={size} color={color} />
          ),
          headerTitleAlign: 'center'
        }}
      />

      <Drawer.Screen name='Create User' component={CreateUser}
        options={{
          drawerLabel: "Create New User ",
          drawerIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
          headerTitleAlign: 'center'
        }} />

      <Drawer.Screen name={t('drawer.logout')} component={LogoutScreen}
        options={{
          drawerLabel: t('drawer.logout'),
          drawerIcon: ({ color, size }) => (
            <AntDesign name="logout" size={size} color={color} />
          ),
          headerTitleAlign: 'center'
        }} />

    </Drawer.Navigator>
  )
}