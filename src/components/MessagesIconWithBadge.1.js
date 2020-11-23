/* @flow */

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SInfo from 'react-native-sensitive-info';
import constants from './../constants/constants'
export default class MessagesIconWithBadge extends Component {

  constructor(props) {
    super(props);
    this.state = {
      msgCount: ''
    };
  }

  componentDidMount() {
    SInfo.getItem('msgCount', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain'
    }).then(value => {
      console.log('<><>inMsg ' + value);
      this.setState({ msgCount: value })
    });
  }

  render() {

    return (
      <View style={{
        zIndex: 0,
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        <Icon name='ios-mail' size={38} color={this.props.tintColor} />
        <View style={{
          position: 'absolute',
          top: 0,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            borderRadius: 10,
            width: 20,
            height: 20,
            backgroundColor: 'red',
            zIndex: 2,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 25
          }}>
            <Text allowFontScaling={false} style={{
              fontSize: 11,
              color: 'white'
            }}>{this.state.msgCount}</Text>
          </View>

        </View>

      </View>
    );
  }
}
