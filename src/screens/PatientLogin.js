/* @flow */

import React, {Component} from 'react';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons';
import logo from './../images/logo.png';
import Iconss from 'react-native-vector-icons/dist/FontAwesome';
import CheckBox from '../components/CheckBox';
import {ScrollView, Image, View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import TextInputWithIcon from '../components/TextInputWithIcon';
import Button from '../components/Button';
import SInfo from 'react-native-sensitive-info';
import PropTypes from 'prop-types';
import constants, {PATIENT, PLACEHOLDER_COLOR} from './../constants/constants';
import {throwStatement} from '@babel/types';
export default class PatientLogin extends Component {
  static navigationOptions = {
    title: 'Patient Login',
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor,
    },
  };
  mValidateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      username: '',
      password: '',
      checkBoxValue: '',
      checkBox: false,
      firebase: '',
    };
  }
  async componentDidMount() {
    var mt = true;
    try {
      let value = await AsyncStorage.getItem('patientRemberMe');
      let jsonvalue = JSON.parse(value);
      console.log('jsonvalue', jsonvalue);
      if (jsonvalue) {
        this.setState({
          username: jsonvalue.email,
          password: jsonvalue.password,
          checkBox: true,
        });
      } else {
        this.setState({checkBox: false});
      }
    } catch (err) {
      console.log(err);
    }
    SInfo.getItem('fcmToken', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      this.setState({firebase: value});
    });
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible,
    });
  }
  mCheckBox() {
    this.setState({
      checkBox: !this.state.checkBox,
    });
  }
  mValidation = () => {
    if (this.state.username.length <= 0) {
      Alert.alert('Email address is required.');
      return false;
    } else if (!this.mValidateEmail(this.state.username)) {
      Alert.alert('Please enter a valid email address.');
      return false;
    } else if (this.state.password.length <= 0) {
      Alert.alert('Password is required.');
      return false;
    }
    this.mLoaderShowHide();
    this.mLogin();
  };
  mFailed() {
    this.setState({visible: false}, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Please provide valid email id or password');
      }, 200);
    });
  }
  mNetworkFailed() {
    this.setState({visible: false}, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Something went wrong, Please try again');
      }, 200);
    });
  }
  mLogin() {
    const {navigate} = this.props.navigation;
    var mThis = this;
    // console.log('DEVICE_TOKEN:' + this.state.firebase);
    // console.log('email:' + this.state.username);
    // console.log('password:' + this.state.password);
    // console.log('auth_token:' + 'z7NHOmfvqRPAoKM');

    var data = new FormData();
    data.append('email', this.state.username);
    data.append('password', this.state.password);
    data.append('is_agent', true);
    data.append('device_token', this.state.firebase);
    data.append('auth_token', 'z7NHOmfvqRPAoKM');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', constants.url + 'patient-login', true);
    //xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function() {
      // mThis.mLoaderShowHide();
      console.log(xhr.response);
      console.log('PATIENT_LOGIN_RES:', JSON.stringify(xhr));
      var users = xhr.responseText;
      if (xhr.readyState == 4 && xhr.status == '200') {
        var obj = JSON.parse(users);
        if (obj.status == 1) {
          SInfo.setItem('patient_id', obj.patient_id_raw + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('patient_name', obj.patient_name + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('patient_pic', obj.profile_pic + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('patient_tokan', obj.auth_token + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('patient_email', mThis.state.username + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('patient_password', mThis.state.password + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('post_id', '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('is_patient_login', '1', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('token', obj.auth_token, {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          AsyncStorage.setItem('loginStatus', '1');
          AsyncStorage.setItem('checkLoginStatus', PATIENT);

          navigate('PatientMainStack');
          if (mThis.state.checkBox == true) {
            SInfo.setItem('login_email', mThis.state.username + '', {
              sharedPreferencesName: 'mySharedPrefs',
              keychainService: 'myKeychain',
            });
            let obj = {
              email: mThis.state.username,
              password: mThis.state.password,
            };
            mThis.storeData(obj);
          } else {
            try {
              AsyncStorage.removeItem('patientRemberMe');
            } catch (err) {
              console.log(err);
            }
          }
        } else {
          mThis.mFailed();
        }
      } else {
        mThis.mNetworkFailed();
      }
    };
    xhr.send(data);
  }
  storeData = async value => {
    console.log('data to state is ', value);
    try {
      let jsonValue = JSON.stringify(value);
      AsyncStorage.setItem('patientRemberMe', jsonValue);
      console.log('patientRemberMe key saved');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={{backgroundColor: 'white', flex: 1}}>
        <View style={{flex: 1}}>
          <Spinner
            overlayColor={'rgba(0, 0, 0, 0.75)'}
            color={'#08a1d9'}
            textContent={'Establishing secure connection'}
            visible={this.state.visible}
            textStyle={{color: '#fff', fontSize: 15, marginTop: -70}}></Spinner>
          <View style={{flex: 1}}>
            <View
              style={{flex: 4, alignItems: 'center', justifyContent: 'center'}}>
              <View
                style={{
                  marginTop: 80,
                  backgroundColor: constants.baseColor,
                  borderWidth: 1,
                  borderColor: constants.baseColor,
                  borderRadius: 10,
                }}>
                <Image
                  source={logo}
                  style={{
                    height: 80,
                    width: 140,
                    resizeMode: 'contain',
                    borderRadius: 10,
                    margin: 10,
                  }}
                />
              </View>
            </View>
            <View style={{flex: 4}}>
              <View style={[styles.searchSection, {marginTop: 40}]}>
                <Icon
                  style={{marginLeft: 10}}
                  name="md-at"
                  size={24}
                  color="#BDC6CF"
                />
                <TextInput
                  allowFontScaling={false}
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  value={this.state.username}
                  keyboardType="email-address"
                  placeholder="Email address"
                  style={styles.textInputStyle}
                  onChangeText={text => this.setState({username: text})}
                />
              </View>
              <View style={styles.searchSection}>
                <Icon
                  style={{marginLeft: 10}}
                  name="md-lock"
                  size={24}
                  color="#BDC6CF"
                />
                <TextInput
                  value={this.state.password}
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  allowFontScaling={false}
                  secureTextEntry={true}
                  keyboardType="default"
                  placeholder="Password"
                  style={styles.textInputStyle}
                  onChangeText={text => this.setState({password: text})}
                  returnKeyType="done"
                  onSubmitEditing={event => this.mValidation()}
                />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainerStyle}>
            <Button
              allowFontScaling={false}
              buttonType="logInButton"
              name="Sign In"
              onPress={() => this.mValidation()}
            />
          </View>
          <View style={styles.section}>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                checked={this.state.checkBox}
                checkboxStyle={{marginLeft: 20, marginRight: 10}}
                onChange={() => {
                  this.mCheckBox();
                }}
              />
              <Text style={{color: 'gray', fontSize: 15}}> Remember Me</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigate('PatientForgetPassword')}
              style={{marginLeft: '7%', fontSize: 15}}>
              <Text style={{color: 'gray'}} numberOfLines={2}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 15,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button allowFontScaling={false} name="New to DentalChat?" />
          </View>
          <View
            style={{
              marginTop: 15,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button
              allowFontScaling={false}
              buttonType="logInButton"
              name="Sign up"
              onPress={() => navigate('PatientRegistration')}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  buttonContainerStyle: {
    marginTop: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginLeft: '10%',
  },
  section: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 30,
    marginVertical: 30,
  },
  viewContainerStyle: {
    flexDirection: 'row',
  },
  iconContainerStyle: {
    width: 30,
    justifyContent: 'center',
  },
  textContainerStyle: {
    justifyContent: 'center',
  },
  textInputStyle: {
    shadowOffset: {width: 1, height: 2},
    shadowColor: '#ccc',
    width: '85%',
    height: 50,
    paddingLeft: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
