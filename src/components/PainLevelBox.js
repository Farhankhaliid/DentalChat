/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import constants from './../constants/constants'

export default class PainLevelBox extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon name='tooth' size={12} color='white' />
        <Text allowFontScaling={false} style={styles.textStyle}>
          {this.props.painLevel}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: constants.baseColor,
    width: 30,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    marginTop: 2,
    marginLeft: 2,
    marginRight: 2,
    flexDirection: 'row'
  },
  textStyle: {
    color: 'white',
    fontSize: 10,
    marginLeft: 3
  }
});
