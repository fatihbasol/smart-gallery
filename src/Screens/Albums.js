import React, {Component} from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import firebase from 'firebase';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tags from './Tags';
import AlbumList from './AlbumList';
const Tab = createMaterialBottomTabNavigator();
export default class Albums extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fromLeft: 0,
      data: [{uri: 'https://lh3.googleusercontent.com/8XJO7IRcumQEqzFJeJ_Pn1woLks3V09bItX1jz7SzQ0M53uT8i9iTOEmq3qfbCA466Kk68f2bX0=s500'},
        {uri: 'https://lh3.googleusercontent.com/eyDGK7uWTqjNWm1x9Q-laCuMarIjFCvfUeoKccdT_0L-XXu3x1us-r0tJ0kF3k7mDtQeQ3fTQKw=s500'},
        {uri: 'https://lh3.googleusercontent.com/rzCKkHqvlzuRBfXoY8MTp6zkLivf9QmfElIuew8luwojxPcdN6yXnYyR3TNw9q-6R7P0aHpfBhA=s500'}],
      hasAlbume: false,
    };
  }

  componentDidMount(): void {
    firebase.database().ref('UserList/' + this.props.currentUser.user.id + '/albums').on('value', querySnapShot => {
      console.log('DÖNEN' + querySnapShot.val());
      if (querySnapShot.val()) {
        this.setState({hasAlbume: true});
      }
    });
  }


  render() {
    const myIcon = <Icon name="home" size={30} color="#900"/>;
    return (
      <Tab.Navigator initialRouteName={'Home'}
                     activeColor="#f0edf6"
                     inactiveColor="#3e2465"
                     shifting={false}
                     barStyle={{backgroundColor: '#355bad'}}>
        <Tab.Screen name="Home" component={AlbumList} options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (myIcon),
        }}/>
        <Tab.Screen name="Add" component={Tags} options={{
          tabBarLabel: 'Ekle',
          tabBarIcon: () => (myIcon),
        }}/>
        <Tab.Screen name="Edit" component={Tags} options={{
          tabBarLabel: 'Düzenle',
          tabBarIcon: ({color}) => (
            <View>
              <Icon name="account" color={color} size={26}/>

            </View>
          ),
        }}/>
      </Tab.Navigator>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  item: {
    width: 140,
    height: 140,
    margin: 1,
    flex: 1,
  },
  ItemImage: {
    width: 140,
    height: 140,
    borderColor: '#000',
    borderRadius: 8,
  },
  ModalItemImage: {
    shadowColor: '#000',
    borderRadius: 10,
    shadowOffset: {
      width: 10,
      height: 6,
    },
    width: 320,
    height: 320,
  },
  title: {
    fontSize: 12,
  },
  centeredView: {

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 20,
    borderColor: 'black',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

});
