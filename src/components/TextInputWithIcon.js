/* @flow */

import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import constants from './../constants/constants'
export default class TextInputWithIcon extends Component {

  renderIcon() {
    const { iconType, icon } = this.props;
    if (iconType === 'materialCommunity') {
      return (
        <MaterialCommunityIcon name={icon} size={24} color="#BDC6CF" />
      );
    } else {
      return (
        <Icon name={this.props.icon} size={24} color="#BDC6CF" />
      );
    }
  }

  render() {
    return (
      <View style={[styles.viewContainerStyle, this.props.containerStyle]}>
        <View style={[styles.iconContainerStyle, this.props.iconContainerStyle]}>
          {this.renderIcon()}
        </View>
        <View style={styles.textContainerStyle}>
          <TextInput
            allowFontScaling={false}
            keyboardType={this.props.keyboardType}
            secureTextEntry={this.props.isPassword}
            style={[styles.textInputStyle, this.props.textInputStyle]}
            placeholder={this.props.placeholder}
          />
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  viewContainerStyle: {
    flexDirection: 'row',
  },
  iconContainerStyle: {
    width: 30,
    justifyContent: 'center'
  },
  textContainerStyle: {
    justifyContent: 'center'
  },
  textInputStyle: {
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#ccc',
    width: 200,
    height: 30,
    paddingLeft: 10
  }
});
