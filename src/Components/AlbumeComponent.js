import React, {Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default class AlbumeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromLeft: 0,
    };
  }

  render() {
    return (
      <TouchableHighlight>
        <View style={styles.container}>
          <View style={styles.leftArea}>
            <Text style={styles.leftTitle}>{this.props.albumeTitle}</Text>
          </View>
          <View style={styles.rightArea}>
            <View style={styles.imageCover}>
              <Image style={styles.rightImages} source={{uri: 'https://picsum.photos/200'}}/>
            </View>
            <View style={styles.imageCover}>
              <Image style={styles.rightImages} source={{uri: 'https://picsum.photos/200'}}/>
            </View>
            <View style={styles.imageCover}>
              <Image style={styles.rightImages} source={{uri: 'https://picsum.photos/200'}}/>
            </View>
          </View>
        </View>
      </TouchableHighlight>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginTop: 30,
    marginBottom: 30,


  },
  leftArea: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(237, 86, 59, 1)',
  },
  leftTitle: {
    alignSelf: 'center',
    textAlign: 'center',
    margin: 10,
    fontSize: 20,
  },
  rightArea: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  rightImages: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  imageCover: {
    width: 150,
    height: 150,
    rotation: 10,
    marginLeft: -80,
    borderRadius: 5,
    borderColor: '#000',

    elevation: 30,
  },


});
