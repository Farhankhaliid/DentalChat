/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import constants from './../constants/constants'
export default class ImageBubble extends Component {


  getTitle(firstName, lastName) {
    // return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    return firstName.length > 0 ? firstName.charAt(0).toUpperCase() : "" + lastName.length > 0 ? lastName.charAt(0).toUpperCase() : "";

  }

  getImageContent(image, firstName, lastName) {
    if (image === '') {
      return (
        <Avatar
          rounded
          width={this.props.size}
          height={this.props.size}
          title={this.getTitle(firstName, lastName)}
          activeOpacity={1}
        />
      );
    }
    return (
      <Avatar
        rounded
        width={this.props.size}
        height={this.props.size}
        source={{ uri: baseURL + image }}
        activeOpacity={1}
      />
    );
  }

  render() {
    return (
      <View style={styles.imageContainer}>
        {this.getImageContent(this.props.image, this.props.firstName, this.props.lastName)}
      </View>
    );
  }
}
const baseURL = 'https://blog.dentalchat.com/server/uploads/patient_profile_image/';

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
