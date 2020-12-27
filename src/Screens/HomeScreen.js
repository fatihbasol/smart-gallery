import React, {Component} from 'react';
import {Alert} from 'react-native';
import Albums from './Albums';
import Photos from './Photos';
import Tags from './Tags';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isImageViewVisible: true,
    };
  }


  render() {
    const {images, isLoggedIn, currentUser} = this.props.route.params;

    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor:'#0275d8',
          inactiveTintColor:'#292b2c',
        }}>
        <Tab.Screen name="Photos" options={{
          leftTitle: 'Resimler',
        }}>
          {() => <Photos navigate={this.props.navigation.navigate} images={images}/>}
        </Tab.Screen>

        <Tab.Screen name="Tags" options={{
          leftTitle: 'Etiketler',
        }}>
          {() =>  <Tags navigation={this.props.navigation} currentUser={currentUser}  images={images}/>}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }
}
