/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import constants from './../constants/constants'
export default class Button extends Component {
  getButtonStyle(buttonType) {
    if (buttonType === 'homeScreenButton') {
      return {
        viewStyle: {
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#FFF',
          height: 40,
          width: 300,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 15
        },
        textStyle: {
          color: '#FFF',
          fontSize: 17
        }
      };
    } else if (buttonType === 'logInButton') {
      return {
        viewStyle: {
          height: 40,
          width: 220,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 15,
          backgroundColor: constants.baseColor,
          borderRadius: 10,
        },
        textStyle: {
          color: '#FFF',
          fontSize: 17
        }
      };
    } else if (buttonType === 'mybtn') {
      return {
        viewStyle: {
          borderWidth: 1,
          borderRadius: 10,
          borderColor: constants.baseColor,
          height: 40,
          width: 170,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 15
        },
        textStyle: {
          color: constants.baseColor,
          fontSize: 17
        }
      };
    } else if (buttonType === 'profileBtn') {
      return {
        viewStyle: {
          borderWidth: 1,
          borderRadius: 10,
          borderColor: constants.baseColor,
          height: 40,
          width: "95%",
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 15,
          marginLeft: '2.5%'
        },
        textStyle: {
          color: constants.baseColor,
          fontSize: 14, marginLeft: 5, marginRight: 5
        }
      };
    } else if (buttonType === 'pBtn') {
      return {
        viewStyle: {
          borderWidth: 1,
          borderRadius: 10,
          borderColor: constants.baseColor,
          backgroundColor: constants.baseColor,
          height: 60,
          width: "100%",
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 15,
          marginLeft: '1%'
        },
        textStyle: {
          color: '#ffffff',
          fontSize: 15
        }
      };
    }

    return {
      viewStyle: {
        height: 40,
        width: 220,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
      },
      textStyle: {
        color: '#AAA',
        fontSize: 15,
        fontWeight: 'bold'
      }
    };
  }

  render() {
    const buttonStyle = this.getButtonStyle(this.props.buttonType);
    return (
      <TouchableOpacity onPress={this.props.onPress} style={buttonStyle.viewStyle} >
        <View >
          <Text allowFontScaling={false} style={buttonStyle.textStyle}>{this.props.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
