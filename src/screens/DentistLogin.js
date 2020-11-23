/* @flow */

import React, {Component} from 'react';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckBox from '../components/CheckBox';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconss from 'react-native-vector-icons/dist/FontAwesome';
import logo from './../images/logo.png';
import {View, StyleSheet, Image} from 'react-native';
import TextInputWithIcon from '../components/TextInputWithIcon';
import Button from '../components/Button';
import SInfo from 'react-native-sensitive-info';
import PropTypes from 'prop-types';
import constants, {DENTIST, PLACEHOLDER_COLOR} from './../constants/constants';
export default class DentistLogin extends Component {
  static navigationOptions = {
    title: 'Dentist Login',
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
    try {
      const email_Password = await AsyncStorage.getItem('rememberMe');
      console.log(email_Password, 'email_Password');
      let jsonValue = JSON.parse(email_Password);
      if (jsonValue) {
        console.log(jsonValue, 'email_Password');
        this.setState({
          username: jsonValue.email,
          password: jsonValue.password,
          checkBox: true,
        });
      } else {
        this.setState({
          checkBox: false,
        });
      }
    } catch (error) {
      console.log(error);
    }

    var mt = true;
    SInfo.getItem('login_email_dentist', {
      sharedPreferencesName: 'mySharedPrefs',
      keychainService: 'myKeychain',
    }).then(value => {
      if (value == undefined) {
        value = '';
        mt = false;
      }
      // this.setState({username: value, checkBox: mt});
    });
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
  mValidation() {
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
  }
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
    var data = new FormData();
    data.append('user[email]', this.state.username);
    data.append('user[password]', this.state.password);
    data.append('auth_token', 'z7NHOmfvqRPAoKM');
    data.append('is_dentist', true);
    data.append('user[device_token]', this.state.firebase);
    console.log('REQ:' + data);
    console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', constants.url + 'service/dentist-login', true);
    // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function() {
      mThis.mLoaderShowHide();
      // console.log(xhr.response)
      console.log('DENTIST_LOGIN_RES:', JSON.stringify(xhr.responseText));
      var users = xhr.responseText;

      if (xhr.readyState == 4 && xhr.status == '200') {
        var obj = JSON.parse(users);
        if (obj.status == 1) {
          //AsyncStorage.setItem('token', JSON.stringify(obj.data.token));
          SInfo.setItem('is_dentist_login', '1', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('dentist_tokan', obj.auth_token + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('dentist_id', obj.data.user_id + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('dentist_name', obj.data.name + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('dentist_pic', obj.data.final_profile_image + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('dentist_tokan', obj.data.token + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('dentist_email', mThis.state.username + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('dentist_password', mThis.state.password + '', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('opration', '-1', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('type', '-1', {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          SInfo.setItem('token', obj.data.token, {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
          // navigate("subscripitonScreen");
          AsyncStorage.setItem('checkLoginStatus', DENTIST);
          AsyncStorage.setItem('loginStatus', '1');
          if (mThis.state.checkBox == true) {
            let obj = {
              email: mThis.state.username,
              password: mThis.state.password,
            };

            mThis.storeData(obj);
            // AsyncStorage.setItem('rememberMe', valueToStore);
          } else {
            try {
              AsyncStorage.removeItem('rememberMe');
            } catch (err) {
              console.log(err);
            }
          }
          if (obj.data != null && obj.data.token != null) {
            mThis.mLoaderShowHide();
            mThis.checkSubscription(obj.data.token, obj.data.token + '');
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
    console.log('value to store is ', value);
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('rememberMe', jsonValue);
      console.log('data saved');
    } catch (e) {
      console.log('error while saving data', e);
    }
  };

  checkSubscription(token, dentistToken) {
    var mThis = this;
    if (token == null || dentistToken == null) {
      mThis.setState({visible: false});
      return;
    }

    var data = new FormData();
    data.append('auth_token', token);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          mThis.setState({visible: false});
          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj);
          if (obj.status == 1) {
            if (obj.dentistdetails.docs_details.payment_status === 0) {
              // mThis.props.navigation.navigate("subscripitonScreen");
              mThis.props.navigation.navigate('DentistMainStackScreens');
            } else {
              mThis.props.navigation.navigate('DentistMainStackScreens');
            }
          } else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      } else {
        mThis.setState({visible: false});
      }
    });
    xhr.open('POST', constants.url + 'service/dentistservice/dentist-step1');
    xhr.setRequestHeader('access-token', dentistToken);
    xhr.send(data);
  }

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
            textStyle={{color: '#fff', fontSize: 15, marginTop: -70}}
          />
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
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
                  value={this.state.username}
                  keyboardType="email-address"
                  placeholder="Email address"
                  placeholderTextColor={PLACEHOLDER_COLOR}
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
                  allowFontScaling={false}
                  secureTextEntry={true}
                  keyboardType="default"
                  value={this.state.password}
                  placeholderTextColor={PLACEHOLDER_COLOR}
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
              <Text style={{color: '#999999', fontSize: 15}}>Remember Me</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigate('DentistForgotPassword')}
              style={{marginLeft: '14%'}}>
              <Text style={{color: '#999999', fontSize: 15}} numberOfLines={2}>
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
            <Button name="New to DentalChat?" />
          </View>
          <View
            style={{
              marginTop: 15,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button
              buttonType="logInButton"
              name="Sign up"
              onPress={() => navigate('DentistRegistration')}
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
    marginVertical: 30,
    marginHorizontal: 30,
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
