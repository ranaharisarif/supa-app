import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../helpers/NavigationService';

import {MainStack} from './RootStackParams';
import HomeTabs from './HomeTabs';
import AuthStack from './AuthStack';
import SplashScreen from '../screens/auth/Splash';
const linking = {
  prefixes: ['supapk://'],
};
export default function App() {
  const {Navigator, Screen} = createNativeStackNavigator<MainStack>();

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Screen name="HomeTabs" component={HomeTabs} />
        <Screen component={AuthStack} name="AuthStack" />
        <Screen name={'SplashScreen'} component={SplashScreen} />
      </Navigator>
    </NavigationContainer>
  );
}
