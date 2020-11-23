/* @flow */

import React, { Component } from 'react';
import { ActivityIndicator, Alert, TextInput, Text, Picker, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import RNPickerSelect from 'react-native-picker-select';
import logo from './../images/logo.png'
import {
  View,
  StyleSheet, Image, Platform
} from 'react-native';
import TextInputWithIcon from '../components/TextInputWithIcon';
import Button from '../components/Button';
import SInfo from 'react-native-sensitive-info'
import PropTypes from 'prop-types';
import constants, { PLACEHOLDER_COLOR } from './../constants/constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
const DEMO_OPTIONS_1 = ['Male', 'Female', 'Rather not say'];
const PickerData = [
  {
    label: 'Male',
    value: 'Male',
  },
  {
    label: 'Female',
    value: 'Female',
  },
  {
    label: 'Rather not say',
    value: 'Rather not say',
  },
];
export default class PatientRegistration extends Component {
  static navigationOptions = {
    title: 'Patient Registration',
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor
    }
  };

  mValidateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      firstname: '',
      lastname: '',
      password: '',
      gender: '',
      email: '',
      firebase: ''
    };
  }
  componentDidMount() {
    // var mt = true;
    // SInfo.getItem('login_email', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
    //   if (value == undefined) {
    //     value = "";
    //     mt = false;
    //   }
    //   this.setState({ username: value, checkBox: mt })
    // });
    SInfo.getItem('fcmToken', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log("we recieved fcm token" + value)
      this.setState({ firebase: value })
    });
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };
  mValidation() {
    if (this.state.firstname.length <= 0) {
      Alert.alert('First name field is required..')
      return false;
    } else if (this.state.lastname.length <= 0) {
      Alert.alert('Last name field is required..')
      return false;
    } else if (this.state.email.length <= 0) {
      Alert.alert('Email address field is required..')
      return false;
    } else if (!this.mValidateEmail(this.state.email)) {
      Alert.alert('Please enter a valid email address.')
      return false;
    } else if (this.state.password.length <= 0) {
      Alert.alert('Password field is required..')
      return false;
    } else if (this.state.gender.length <= 0) {
      Alert.alert('Please select your gender..')
      return false;
    }
    this.mLoaderShowHide();
    this.mPatientEmailCheck();
  }
  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Email address already exist');
      }, 200);
    });
  }
  mSuccess() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Success', 'Registration successfull.');
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
  mPatientEmailCheck() {
    var mThis = this;
    var data = new FormData();
    data.append("email", this.state.email);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", constants.url + "service/patient/patient-email-check", true);
    xhr.onload = function () {
      var users = xhr.responseText;
      if (xhr.readyState == 4 && xhr.status == "200") {
        console.log('<><><> ' + users);
        var obj = JSON.parse(users);
        if (obj.status == "1") {
          mThis.mRegistration();
        } else {
          mThis.mFailed();
        }
      } else {
        mThis.mNetworkFailed();
        console.log('<><><> ' + users);
      }
    }
    xhr.send(data);
  }
  mRegistration() {
    if (this.state.gender == 'Male') {
      this.setState({ gender: '1' })
    } else if (this.state.gender == 'Female') {
      this.setState({ gender: '2' })
    } else if (this.state.gender == 'Rather not say') {
      this.setState({ gender: '3' })
    }

    console.log("TOKEN:", this.state.firebase)
    var mThis = this;
    var data = new FormData();
    data.append("patient[first_name]", this.state.firstname);
    data.append("patient[last_name]", this.state.lastname);
    data.append("patient[password]", this.state.password);
    data.append("patient[gender]", '1');
    data.append("patient[email]", this.state.email);
    data.append("patient[mobile_request]", '1');
    data.append("patient[device_token]", this.state.firebase);
    data.append("auth_token", "z7NHOmfvqRPAoKM")
    console.log(data)
    var xhr = new XMLHttpRequest();
    xhr.open("POST", constants.url + "patient-registration", true);
    xhr.onload = function () {
      var users = xhr.responseText;
      if (xhr.readyState == 4 && xhr.status == "200") {
        console.log('<1><><> ' + users);
        var obj = JSON.parse(users);
        mThis.mLogin();
      } else {
        // console.log("REG_RES:" +)
        mThis.mNetworkFailed();
        console.log('<2><><> ' + users);
      }
    }
    xhr.send(data);
  }
  mLogin() {
    const { navigate } = this.props.navigation;
    var mThis = this;
    var data = new FormData();
    data.append("email", this.state.email);
    data.append("password", this.state.password);
    data.append("auth_token", "z7NHOmfvqRPAoKM")
    data.append("device_token", this.state.firebase);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", constants.url + "patient-login", true);
    //xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
      mThis.mLoaderShowHide();
      var users = xhr.responseText;
      console.log('<><><> ' + users);
      if (xhr.readyState == 4 && xhr.status == "200") {
        //console.log('<><><> '+users);
        var obj = JSON.parse(users);
        console.log(obj)
        if (obj.status == 1) {
          SInfo.setItem('patient_id', obj.patient_id_raw + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('patient_name', obj.patient_name + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('patient_pic', obj.profile_pic + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('patient_tokan', obj.auth_token + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('patient_email', mThis.state.username + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('patient_password', mThis.state.password + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('post_id', '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_patient_login', '1', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('token', obj.auth_token, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          navigate('PatientMainStack')
          if (mThis.state.checkBox == true) {
            SInfo.setItem('login_email', mThis.state.username + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          }
        } else {
          mThis.mFailed();
        }
      } else {
        mThis.mNetworkFailed();
      }
    }
    xhr.send(data);
  }
  render() {
    const { navigate } = this.props.navigation;
    const placeholder = {
      label: 'Choose Gender',
      value: null,
      color: PLACEHOLDER_COLOR,
    };
    return (
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
            </Spinner>
            <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', }}>
              <View style={{ marginTop: 30, backgroundColor: constants.baseColor, borderWidth: 1, borderColor: constants.baseColor, borderRadius: 10 }}>
                <Image source={logo} style={{ height: 80, width: 140, resizeMode: 'contain', borderRadius: 10, margin: 10 }} />
              </View>
            </View>
            <View style={{ flex: 5, marginTop: 30 }}>
              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  keyboardType='default'
                  placeholder='First Name'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ firstname: text })} />
              </View>
              <View style={styles.searchSection}>
                <TextInput
                placeholderTextColor={PLACEHOLDER_COLOR}
                  allowFontScaling={false}
                  keyboardType='default'
                  placeholder='Last Name'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ lastname: text })} />
              </View>
              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  keyboardType='email-address'
                  placeholder='Email address'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ email: text })} />
              </View>
              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  secureTextEntry={true}
                  keyboardType='default'
                  placeholder='Password'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ password: text })}
                  returnKeyType="done"
                  onSubmitEditing={event => this.mValidation()} />
              </View>
            </View>
            <View style={styles.searchSection}>
              <View style={styles.dropdown_row}>
                <View style={styles.dropdown_cell}>

           
                  <RNPickerSelect
                    placeholder={placeholder}
                    value={this.state.gender}
                    pickerProps={{ style: { height: 214, overflow: 'hidden' } }}
                    onValueChange={(value) => this.setState({ gender: value })}
                    items={PickerData}
                    style={
                      
                      Platform.OS === 'ios'
                        ? styles.inputIOS
                        : styles.inputAndroid
                      
                    }

                    // useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>
            </View>
            <View style={styles.buttonContainerStyle}>
              <Button
                buttonType="logInButton"
                name='Save & Continue'
                onPress={() => this.mValidation()} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
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
    top: 10,
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
    borderColor: '#ccc',
    marginLeft: 15,
    justifyContent: 'center'
  },
  dropdown_text: {
    marginVertical: 5,
    fontSize: 14,
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
    marginTop: 30, alignItems: 'center'
  },
  textInputStyle: {
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#ccc',
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    marginLeft: '5%'
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    borderColor: '#B1B2C9',
    borderWidth: 0.5,
    marginTop: 5,
    height: 40,
    marginLeft: '10%'
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
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'red',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});