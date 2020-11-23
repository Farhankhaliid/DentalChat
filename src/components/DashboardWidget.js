/* @flow */

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import constants from './../constants/constants'
export default class DashboardWidget extends Component {



  getDentalLogo(isER) {
    if (isER === true) {
      return 'https://image.ibb.co/eoTisk/dental_er.png';
    }
    return 'https://image.ibb.co/ddFk55/dental_non_er.png';
  }

  render() {



    return (
      <View style={styles.container}>

        <View>
          <Image source={{ uri: this.getDentalLogo(this.props.isER) }} style={styles.imageStyle} />
        </View>
        <View style={styles.textContainerStyle}>
          <Text allowFontScaling={false} style={styles.textStyle}>
            {this.props.isER ? 'ER Posts' : 'NON ER Posts'} ({this.props.count})
        </Text>
        </View>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 5
  },
  imageStyle: {
    width: 64,
    height: 60,
    resizeMode: 'contain'
  },
  textStyle: {
    color: constants.baseColor
  },
  textContainerStyle: {
    marginTop: 5
  }
});
