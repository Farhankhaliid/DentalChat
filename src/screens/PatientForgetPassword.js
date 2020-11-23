/* @flow */

import React, { Component } from 'react';
import { Alert, TextInput, Text, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Iconss from 'react-native-vector-icons/dist/FontAwesome';
import {
  View,
  StyleSheet
} from 'react-native';
import Button from '../components/Button';
import PropTypes from 'prop-types';
import constants from './../constants/constants'
import SInfo from 'react-native-sensitive-info';

export default class PatientForgetPassword extends Component {

  // static screenOptions = {
  //   header: null,
  //   headerTintColor: 'red',
  //   headerStyle: {
  //     backgroundColor: constants.baseColor
  //   }
  // };
  mValidateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      email: '',
      token: ''
    };
  }
  componentDidMount() {
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
  }
  mForgetpassword() {
    var mThis = this;
    var data = new FormData();
    data.append("email", this.state.email);
    data.append("auth_token", this.state.token)
    console.log(data)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          mThis.mLoaderShowHide();
          var text = this.responseText;
          console.log("<><><>" + text);
          var obj = JSON.parse(text);
          if (obj.status == 1) {
            mThis.mSuccess();
          } else {
            mThis.mFailed();
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/patient/patient-forgot-password");
    xhr.send(data);
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };
  mValidation() {
    if (this.state.email.length <= 0) {
      Alert.alert('Email address field is required..')
      return false;
    } else if (!this.mValidateEmail(this.state.email)) {
      Alert.alert('Please enter a valid email address.')
      return false;
    }
    this.mLoaderShowHide();
    this.mForgetpassword();
  }
  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Please provide valid entries for both fields');
      }, 200);
    });
  }
  mSuccess() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Success', 'Change password link is sent to your email.');
      }, 200);
    });
  }

  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline, Please try again');
      }, 200);
    });
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View style={{ flexDirection: 'row' }}>
          
          
        </View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />
        <View style={styles.container}>
          <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
          </Spinner>
          <View>
            <View style={styles.searchSection}>
              <TextInput
                allowFontScaling={false}
                keyboardType='email-address'
                placeholder='Email address'
                style={styles.textInputStyle}
                onChangeText={(text) => this.setState({ email: text })} />
            </View>
            <View style={styles.lineStyle}></View>
          </View>
          <View style={styles.buttonContainerStyle}>
            <Button
              buttonType="logInButton"
              name='Continue'
              onPress={() => this.mValidation()} />
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'white'
  },
  dropdown: {
    flex: 1,
    top: 5,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
  },
  dropdown_row: {
    flexDirection: 'row',
  },
  dropdown_cell: {
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#ccc',
    width: 200,
    height: 50,
    borderColor: '#ccc'
  },
  dropdown_text: {
    marginVertical: 5,
    fontSize: 18,
    color: '#111',
    textAlignVertical: 'center',
  },
  dropdown_pop: {
    width: 200,
    height: 160,
  },
  dropdown_pop_text: {
    marginVertical: 5,
    marginHorizontal: 6,
    fontSize: 18,
    color: '#ccc',
  },

  buttonContainerStyle: {
    marginTop: 30
  },
  textInputStyle: {
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#ccc',
    width: 300,
    height: 40,
    borderColor: '#ccc'
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  section: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
