import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import Tags from './Tags';
import AlbumeComponent from '../Components/AlbumeComponent';

export default class AlbumList extends Component {
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

  render() {
    return (
      <View>
        {!this.state.hasAlbume ? <FlatList horizontal={false} numColumns={1}
                                           data={[1, 2, 3]}
                                           renderItem={({item}) => (
                                             <AlbumeComponent albumeTitle={'Tümü'}
                                                              childImages={this.state.data}/>
                                           )}
                                           keyExtractor={(item, index) => item}
          /> :

          <View>
            <Text>Oluşturulmuş albümünüz bulunmuyor</Text>
          </View>
        }
      </View>


    );
  }
}

const styles = StyleSheet.create({});
