import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthCheck from '../middleware/AuthCheck';
import DrawerNavigation from './DrawerNavigation';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import UserDetailPageInAPI from '../screens/otherpages/UserDetailPageInAPI';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator()

export default function MainNavigation() {
  const {t} = useTranslation();

  const commonHeaderOptions = (title) => ({
    headerShown: true,
    title,
    headerStyle: {
      backgroundColor: '#374151',
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
    headerTitleAlign: 'left',
  });
  return (
    <Stack.Navigator
      initialRouteName="AuthCheck"
      screenOptions={{ headerShown: false }}
      >
      <Stack.Screen name="AuthCheck" component={AuthCheck} />

      <Stack.Screen name="Drawer" component={DrawerNavigation} />

      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="UserDetail" component={UserDetailPageInAPI} />
    </Stack.Navigator>

  )
}