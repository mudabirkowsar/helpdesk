import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthCheck from '../middleware/AuthCheck';
import DrawerNavigation from './DrawerNavigation';
import LoginScreen from '../screens/LoginScreen';
import ShowUserDetailInCrud from '../screens/otherpages/ShowUserDetailInCrud';
import UpdateUserInCrud from '../screens/otherpages/UpdateUserInCrud';
import AddUserInCrud from '../screens/otherpages/AddUserInCrud';
import SignupScreen from '../screens/SignupScreen';
import UserDetailPageInAPI from '../screens/otherpages/UserDetailPageInAPI';
import { useTranslation } from 'react-i18next';
import TodoApp from '../screens/TodoApp';
import CartProductsScreen from '../screens/CartProductsScreen';

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
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthCheck" component={AuthCheck} />

      <Stack.Screen name="Drawer" component={DrawerNavigation} />

      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="Todo" component={TodoApp}/>

      <Stack.Screen name="CartProducts" component={CartProductsScreen}/>

      <Stack.Screen name="User Detail" component={ShowUserDetailInCrud} 
        options={commonHeaderOptions(t("navigation.userDetail"))}
      />

      <Stack.Screen name="UserDetail" component={UserDetailPageInAPI}
        options={commonHeaderOptions(t("navigation.userDetail"))}
      />

      <Stack.Screen name="UpdateUser" component={UpdateUserInCrud}
        options={commonHeaderOptions(t("navigation.updateUser"))}
      />

      <Stack.Screen name="Add User"  component={AddUserInCrud} 
      options={commonHeaderOptions(t("navigation.addUser"))}
      />


    </Stack.Navigator>

  )
}