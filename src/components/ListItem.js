/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import constants from './../constants/constants'
export default class ListItem extends Component {
  render() {
    return (
      <View style={[styles.containerStyle, this.props.containerStyle]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    height: 48.5,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 10
  },
  textInputStyle: {
    fontSize: 16
  }
});
