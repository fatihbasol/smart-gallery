import {FlatList, Text, View} from 'react-native';
import Tags from './Screens/Tags';
import AlbumeComponent from './Components/AlbumeComponent';
import React from 'react';

return (
  <View>
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Tags} />
      <Tab.Screen name="Settings" component={Tags} />
    </Tab.Navigator>
    {this.state.hasAlbume ? <FlatList horizontal={false} numColumns={1}
                                      data={[1, 2, 3]}
                                      renderItem={({item}) => (
                                        <AlbumeComponent anim={this.props.anim} albumeTitle={'Tümü'}
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
