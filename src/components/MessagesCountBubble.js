/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import constants from './../constants/constants'
export default class MessagesCountBubble extends Component {

  renderCountBubbleIfRequired(count) {
    if (count > 0) {
      return (
        <View style={styles.countBubbleContainer}>
          <View style={styles.countBubbleStyle}>
            <Text allowFontScaling={false} style={styles.messageCountTextStyle}>
              {this.props.count}
            </Text>
          </View>
        </View>
      );
    }
    return;
  }
  render() {
    return (
      <View>
        {this.renderCountBubbleIfRequired(this.props.count)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  countBubbleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  countBubbleStyle: {
    backgroundColor: '#2295bf',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    borderRadius: 12
  },
  messageCountTextStyle: {
    color: 'white'
  }
});
