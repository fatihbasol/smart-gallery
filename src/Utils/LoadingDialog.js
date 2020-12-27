import React, { Component } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
import Dialog, { ScaleAnimation, DialogContent } from 'react-native-popup-dialog';
import {DotIndicator} from 'react-native-indicators';


export default class LoadingDialog extends Component {

  render() {
      return(
        <View>
          <Dialog
            visible={this.props.visibility}
            dialogAnimation={new ScaleAnimation({
              initialValue: 0, // optional
              useNativeDriver: true, // optional
            })}
          >
            <DialogContent  style={{maxHeight:100}} >
              <Text style={{marginTop:14, color: '#292b2c'}} >Resimler Senkronize ediliyor</Text>
              <DotIndicator  color={'#0275d8'}  />
              <Text style={{marginTop:14, color: '#292b2c'}} >{this.props.resimsayac} - Resim Algılandı ve işleniyor.</Text>
            </DialogContent>
          </Dialog>
        </View>
      );
  }
}
