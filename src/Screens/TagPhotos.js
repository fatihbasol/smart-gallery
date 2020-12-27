import React, {Component} from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import Modal from 'react-native-modal';

export default class TagPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      animIn: 'bounceInDown',
      animOut: 'bounceOutUp',
      modalVisibility: false,
      tempModalImageUrl: '',
    };
  }

  render() {
    console.log(this.props.route.params.images);
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          isVisible={this.state.modalVisibility}
          backdropColor="black"
          backdropOpacity={0.6}
          animationIn={this.state.animIn}
          animationOut={this.state.animOut}
          animationInTiming={500}
          animationOutTiming={500}
          backdropTransitionInTiming={500}
          backdropTransitionOutTiming={500}
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
        <Text style={{color:'#292b2c',marginTop:3,marginBottom:3,textAlign:'center',fontStyle:'italic',fontSize:14}}>Toplam {this.props.route.params.images.length} sonuç gösteriliyor</Text>
        <FlatList horizontal={false} numColumns={2}
                  data={this.props.route.params.images}
                  renderItem={({item}) => (
                    <TouchableHighlight style={[styles.item]} onPress={() => {
                      this.setState({modalVisibility: true, tempModalImageUrl: item.uri});
                    }}>
                      <Image source={{uri: item.uri}} style={styles.ItemImage}/>
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
    width: 160,
    height: 160,
    alignSelf: 'center',
    borderRadius: 5,
  },
  ModalItemImage: {
    shadowColor: '#000',
    borderRadius: 10,
    shadowOffset: {
      width: 10,
      height: 6,
    },
    width: 340,
    height: 340,
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
