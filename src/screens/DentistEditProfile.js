/* @flow */

import React, { Component } from 'react';
import {
  Button,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Avatar, ButtonGroup } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import ListItem from '../components/ListItem';
import TextInputWithIcon from '../components/TextInputWithIcon';
import PropTypes from 'prop-types';
import constants from './../constants/constants'
import SInfo from 'react-native-sensitive-info';
export default class DentistEditProfile extends Component {
  static navigationOptions = {
    title: 'Edit Profile',
    tabBarVisible: false,
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor
    },
    headerRight: <Button title='Done' color='#ffffff' />
  };

  constructor(props) {
    super(props);
    this.state = { avatarSource: { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' } };
  }

  showImagePicker() {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar
            style={styles.avatarStyle}
            width={60}
            height={60}
            source={this.state.avatarSource}
            rounded
            activeOpacity={0.7}
          />
          <TouchableOpacity onPress={() => this.showImagePicker()}>
            <View style={styles.textContainerStyle}>
              <Text allowFontScaling={false} style={styles.textStyle}>
                Change Profile Photo
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          <ListItem containerStyle={styles.topBorder}>
            <TextInputWithIcon
              allowFontScaling={false}
              icon='account'
              iconType='materialCommunity'
              keyboardType='default'
              placeholder='First Name'
              textInputStyle={styles.textInputStyle}
            />
          </ListItem>
          <ListItem containerStyle={styles.topBorder}>
            <TextInputWithIcon
              allowFontScaling={false}
              icon='account'
              iconType='materialCommunity'
              keyboardType='default'
              placeholder='Last Name'
              textInputStyle={styles.textInputStyle}
            />
          </ListItem>
          <ListItem containerStyle={[styles.topAndBottomBorder, styles.genderInputContainerStyle]}>
            <View style={styles.iconContainerStyle}>
              <MaterialCommunityIcon name='human-male-female' size={24} color="#BDC6CF" />
            </View>
            <ButtonGroup
              selectedIndex={1}
              buttons={['Male', 'Female']}
              containerStyle={{ height: 30, width: 300, backgroundColor: 'white' }}
              selectedBackgroundColor='#2295bf'
              selectedTextStyle={{ color: 'white' }}
            />
          </ListItem>
        </View>
        <View style={styles.listContainer}>
          <ListItem containerStyle={styles.topAndBottomBorder}>
            <TextInputWithIcon
              allowFontScaling={false}
              icon='phone'
              iconType='materialCommunity'
              keyboardType='phone-pad'
              placeholder='Phone Number'
              textInputStyle={styles.textInputStyle}
            />
          </ListItem>
        </View>
        <View style={styles.listContainer}>
          <ListItem containerStyle={styles.topAndBottomBorder}>
            <TextInputWithIcon
              allowFontScaling={false}
              icon='hospital'
              iconType='materialCommunity'
              keyboardType='default'
              placeholder='Dentist Type'
              textInputStyle={styles.textInputStyle}
            />
          </ListItem>
        </View>
        <View style={styles.listContainer}>
          <ListItem containerStyle={styles.topBorder}>
            <TextInputWithIcon
              allowFontScaling={false}
              icon='library-books'
              iconType='materialCommunity'
              keyboardType='default'
              placeholder='Education'
              textInputStyle={styles.textInputStyle}
            />
          </ListItem>
          <ListItem containerStyle={styles.topBorder}>
            <TextInputWithIcon
              allowFontScaling={false}
              icon='translate'
              iconType='materialCommunity'
              keyboardType='default'
              placeholder='Languages Spoken'
              textInputStyle={styles.textInputStyle}
            />
          </ListItem>
          <ListItem containerStyle={styles.topBorder}>
            <TextInputWithIcon
              allowFontScaling={false}
              icon='star-circle'
              iconType='materialCommunity'
              keyboardType='default'
              placeholder='Specialities'
              textInputStyle={styles.textInputStyle}
            />
          </ListItem>
          <ListItem containerStyle={styles.topAndBottomBorder}>
            <TextInputWithIcon
              allowFontScaling={false}
              icon='clipboard-text'
              iconType='materialCommunity'
              keyboardType='default'
              placeholder='Professional Statement'
              textInputStyle={styles.textInputStyle}
            />
          </ListItem>
        </View>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3fa'
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarStyle: {
    marginTop: 20,
  },
  textContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  textStyle: {
    color: '#2295bf',
    fontSize: 12
  },
  textInputStyle: {
    width: 300
  },
  titleContainerStyle: {
    width: 0
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC'
  },
  topAndBottomBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC'
  },
  listContainer: {
    marginBottom: 30
  },
  iconContainerStyle: {
    width: 30,
    justifyContent: 'center'
  },
  genderInputContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
