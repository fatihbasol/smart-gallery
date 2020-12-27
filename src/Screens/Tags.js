import React, {Component} from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

export default class Tags extends Component {


  constructor(props) {
    super(props);
    this.state = {
      isTagged: true,
      tags: [],
      tagsWithUrl: [],
    };
  }

  componentDidMount(): void {

    this.props.images.forEach((item) => {
      this.state.tags.push(item.tag['_55']);
    });
    const distinct = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    const distinctTags = this.state.tags.filter(distinct); // tekrar eden etiketler teke düştü
    //this.setState({tags: distinctTags});

    let tmpArray = [];
    let tmpObj = {};
    let lastArray = [];
    distinctTags.forEach((tag) => {
      this.props.images.forEach((item) => {
        if (item.tag['_55'] === tag) {
          tmpArray.push({tag: tag, uri: item.source.uri});
        }
      });
      tmpObj = tmpArray;
      lastArray.push(tmpObj);
      tmpObj = {};
      tmpArray = [];
    });


    this.state.tags = lastArray;
    console.log(this.state.tags);
    console.log(this.props.images);
  }


  render() {

    return (
      <View>
        <Text style={{color:'#292b2c',marginTop:3,marginBottom:3,textAlign:'center',fontStyle:'italic',fontSize:14}}>Toplam {this.state.tags.length} adet etiket listeleniyor.</Text>
        <FlatList horizontal={false} numColumns={2}
                  data={this.state.tags.sort((a, b) => {
                    if (a.length > b.length) return -1;
                    if (a.length < b.length) return 1; else return 0;
                  })}
                  renderItem={({item}) => (
                    <TouchableHighlight style={[styles.item]} onPress={()=> {
                      this.props.navigation.navigate('TagPhotos',{images: item})
                    }}>
                      <View>
                        <Image
                          source={{uri: item[0].uri}}
                          style={styles.ItemImage}/>
                        {item.length > 1 && <Image
                          source={{uri: item[1].uri}}
                          style={styles.SecondImage}/>}
                        <View style={styles.titleArea}>
                          <Text style={styles.title}>{item[0].tag} {item.length > 1 && `(${item.length})`}</Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  )}
                  keyExtractor={item => item.id}
        />

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  item: {
    margin: 1,
    flex: 1,
    paddingVertical: 5,
  },
  ItemImage: {
    width: 160,
    height: 160,
    backgroundColor: '#3e3e3e',
    borderRadius: 5,
    margin: 10,
    alignSelf: 'center',
  },
  SecondImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
    position: 'absolute',
    marginTop: 14.5,
    left: 50,
    borderWidth: .4,
    borderColor: '#000000',
    rotation: 5,
  },
  titleArea: {},
  title: {
    color: '#2f2f2f',
    textAlign: 'center',
    letterSpacing: 2,
  },
});
