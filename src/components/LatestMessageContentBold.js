/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import UnattendedBox from './UnattendedBox';
import constants from './../constants/constants'
export default class LatestMessageContentBold extends Component {

  getMessageContent(lastChatItem) {
    const totalLength = 35;
    if (lastChatItem.patient_content.length > 0) {
      if (lastChatItem.patient_content.length > totalLength) {
        return 'Patient : ' + lastChatItem.patient_content.substring(0, totalLength) + '...';
      }
      return 'Patient : ' + lastChatItem.patient_content;
    }
    if (lastChatItem.doctor_content.length > (totalLength - 5)) {
      return 'You : ' + lastChatItem.doctor_content.substring(0, (totalLength - 5)) + '...';
    }
    return 'You : ' + lastChatItem.doctor_content;
  }



  getDsiplayContent(isAttendant, lastChatItem) {
    if (isAttendant === '0') {
      return <UnattendedBox />;
    }

    return (
      <Text allowFontScaling={false} numberOfLines={1} style={styles.messageTextStyle}>
        {this.getMessageContent(lastChatItem)}
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getDsiplayContent(this.props.isAttendant, this.props.lastChatItem)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  messageTextStyle: {
    fontWeight: 'bold',

  },
});