/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from './../constants/constants'
export default class IsEmergencyBox extends Component {
  renderIsEmergencyBox(isEmer) {
    if (isEmer === 1) {
      return (
        <View
          style={{
            backgroundColor: 'red',
            width: 35,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 3,
            marginTop: 2,
            marginLeft: 2,
            marginRight: 2,
            flexDirection: 'row',
            marginLeft: 20
          }}
        >
          <Icon name='md-flash' size={12} color='white' />
          <Text allowFontScaling={false} style={{ color: 'white', fontSize: 10, marginLeft: 3 }}>
            YES
              </Text>
        </View>
      );
    }

    return (
      <View
        style={{
          backgroundColor: '#fda629',
          width: 32,
          height: 20,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 3,
          marginTop: 2,
          marginLeft: 2,
          marginRight: 2,
          flexDirection: 'row',
          marginLeft: 20
        }}
      >
        <Icon name='md-flash' size={12} color='white' />
        <Text allowFontScaling={false} style={{ color: 'white', fontSize: 10, marginLeft: 3 }}>
          NO
          </Text>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.renderIsEmergencyBox(this.props.isEmer)}
      </View>
    );
  }
}
