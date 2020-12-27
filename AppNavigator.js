import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginController from './LoginController';
import HomeScreen from './src/Screens/HomeScreen';
import Tags from './src/Screens/Tags';
import TagPhotos from './src/Screens/TagPhotos';

const Stack = createStackNavigator();

export default class AppNavigator extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginController} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Tags" component={Tags} options={{headerShown: false}}/>
          <Stack.Screen name="TagPhotos" component={TagPhotos}
                        options={{headerShown: true, title: 'Etiketli Resimler'}}/>
        </Stack.Navigator>
      </NavigationContainer>

    );
  }
}
