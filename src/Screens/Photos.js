import React, {Component} from 'react';
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  BackHandler,
  View,
  Button, TouchableHighlight, Alert, Text, Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      animIn: 'zoomInLeft',
      animOut: 'fadeOut',
      modalCounter: 0,
      modalVisibility: false,
      tempModalImageUrl: '',
    };
  }

  componentDidMount(): void {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }

  sendImagse = async (url) => {
    console.log(this.props.images[1].tag);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.modalVisibility}
          backdropColor="black"
          backdropOpacity={0.5}
          animationIn={this.state.animIn}
          animationOut={this.state.animOut}
          animationInTiming={500}
          animationOutTiming={500}
          backdropTransitionInTiming={500}
          backdropTransitionOutTiming={500}
          deviceWidth={deviceWidth}
          deviceHeight={deviceHeight}
          swipeDirection={'up'}
          swipeThreshold={50}
          onSwipeComplete={() => {
            this.setState({modalVisibility: false});
            console.log('bitti');
          }}
          onRequestClose={() => {
            this.setState({modalVisibility: false});
          }}
          onBackdropPress={() => {
            this.setState({modalVisibility: false});
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={{uri: this.state.tempModalImageUrl}} style={styles.ModalItemImage}/>
            </View>
          </View>
        </Modal>
        <Text style={{color:'#292b2c',marginTop:3,marginBottom:3,textAlign:'center',fontStyle:'italic',fontSize:14}}>Toplam {this.props.images.length} sonuç gösteriliyor</Text>
        <FlatList horizontal={false} numColumns={3}
                  data={this.props.images}
                  renderItem={({item}) => (
                    <TouchableHighlight style={[styles.item]} onPress={() => {
                      if (item.flatListId % 3 === 0) { //ITEM SOLDA
                        this.setState({animIn: 'zoomInLeft'});
                        this.setState({animOut: 'zoomOutLeft'});
                      }
                      if (item.flatListId % 3 === 1) { //ORTADA
                        this.setState({animIn: 'zoomIn'});
                        this.setState({animOut: 'zoomOut'});
                      }
                      if (item.flatListId % 3 === 2) { //SAĞDA
                        this.setState({animIn: 'zoomInRight'});
                        this.setState({animOut: 'zoomOutRight'});
                      }

                      this.setState({modalVisibility: true, tempModalImageUrl: item.source.uri});
                    }}>
                      <Image source={{uri: item.source.uri}} style={styles.ItemImage}/>
                    </TouchableHighlight>
                  )}
                  keyExtractor={item => item.id}
        />

      </SafeAreaView>
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
  },
  ItemImage: {
    width: 140,
    height: 140,
    alignSelf: 'center',
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

