import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import UsersScreen from './screens/UsersScreen';
import 'react-native-gesture-handler';
import DrawerNavigation from './navigation/DrawerNavigation';
import MainNavigation from './navigation/MainNavigation';

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <MainNavigation/>
    </NavigationContainer>
  );
}

export default App;
