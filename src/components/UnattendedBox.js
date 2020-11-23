/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from './../constants/constants'
export default class UnattendedBox extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon name='ios-clipboard' size={13} color='white' />
        <Text allowFontScaling={false} style={styles.textStyle}>
          Unattended
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    height: 15,
    width: 85,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    marginTop: 2,
    marginLeft: 2,
    marginRight: 2,
    flexDirection: 'row'
  },
  textStyle: {
    color: 'white',
    fontSize: 12,
    marginLeft: 3,
    marginRight: 3
  }
});
