/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* @flow */

import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Button from '../components/Button';
import SInfo from 'react-native-sensitive-info';
import PropTypes from 'prop-types';
import {ScrollView} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

import logo from './../images/logo.png';
import constants from './../constants/constants';
import Spinner from 'react-native-loading-spinner-overlay';

//import FCM from "react-native-fcm"// import { Text } from 'react-native';

// let originalGetDefaultProps = Text.getDefaultProps;
// Text.getDefaultProps = function () {
//   return {
//     ...originalGetDefaultProps(),
//     allowFontScaling: false,
//   };
// };

export default class Home extends Component {
  static navigationOptions = {
    header: null,
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      patient_login: '0',
      dentist_login: '0',
      fcmToken: '',
      rady: false,
    };
  }

  componentDidMount() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {});

    console.log('Home component is called ');
    this.registerAppWithFCM();
    this.setState({rady: true});

    fetch(constants.url + 'get-latest-version', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        console.log(res);
        let responseJson = res;
        this.setState(
          {
            rady: false,
          },
          () => {
            setTimeout(() => {
              if (Platform.OS == 'ios') {
                // this.setState({ rady: false });
                if (responseJson.data[1].version > constants.ios) {
                  Alert.alert(
                    'Application Update',
                    'This version of DentalChat is no longer supported. Please update your app or use DentalChat for web to login to your account',
                    [
                      {
                        text: 'Continue',
                        onPress: () => console.log('OK Pressed'),
                      },
                    ],
                    {cancelable: false},
                  );
                }
                // navigator.geolocation.getCurrentPosition(
                //   position => {
                //     this.setState({
                //       latitude: position.coords.latitude,
                //       longitude: position.coords.longitude,
                //       error: null
                //     });
                //   },
                //   error => this.setState({ error: error.message }),
                //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                // );
                AsyncStorage.getItem('loginStatus').then(value => {
                  if (value == '1') {
                    SInfo.getItem('is_patient_login', {
                      sharedPreferencesName: 'mySharedPrefs',
                      keychainService: 'myKeychain',
                    }).then(value => {
                      if (value == '1') {
                        // this.props.navigation.navigate("PatientMainTab");
                      }
                    });
                    let token, dentistToken;
                    SInfo.getItem('token', {
                      sharedPreferencesName: 'mySharedPrefs',
                      keychainService: 'myKeychain',
                    }).then(value => {
                      console.log('time to fetch token');
                      // this.setState({ token: value });
                      token = value;
                    });
                    SInfo.getItem('dentist_tokan', {
                      sharedPreferencesName: 'mySharedPrefs',
                      keychainService: 'myKeychain',
                    }).then(value => {
                      // this.setState({ dentistTokan: value });
                      // this.mLoaderShowHide();
                      // this.mEditProfile();
                      dentistToken = value;
                    });

                    SInfo.getItem('is_dentist_login', {
                      sharedPreferencesName: 'mySharedPrefs',
                      keychainService: 'myKeychain',
                    }).then(value => {
                      if (value == '1') {
                        // this.props.navigation.navigate("subscripitonScreen");
                        this.setState({rady: true});
                        this.checkSubscription(token, dentistToken);
                      }
                    });
                  }
                });
              } else {
                // this.setState({ rady: false });
                if (responseJson.data[0].version > constants.android) {
                  Alert.alert(
                    'Application Update',
                    'This version of DentalChat is no longer supported. Please update your app or use DentalChat for web to login to your account',
                    [
                      {
                        text: 'Continue',
                        onPress: () => console.log('OK Pressed'),
                      },
                    ],
                    {cancelable: false},
                  );
                }
                // navigator.geolocation.getCurrentPosition(
                //   position => {
                //     this.setState({
                //       latitude: position.coords.latitude,
                //       longitude: position.coords.longitude,
                //       error: null
                //     });
                //   },
                //   error => this.setState({ error: error.message }),
                //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                // );

                AsyncStorage.getItem('loginStatus').then(value => {
                  console.log('value');
                  if (value == '1') {
                    SInfo.getItem('is_patient_login', {
                      sharedPreferencesName: 'mySharedPrefs',
                      keychainService: 'myKeychain',
                    }).then(value => {
                      if (value == '1') {
                        // this.props.navigation.navigate("PatientMainTab");
                      }
                    });

                    let token, dentistToken;
                    SInfo.getItem('token', {
                      sharedPreferencesName: 'mySharedPrefs',
                      keychainService: 'myKeychain',
                    }).then(value => {
                      console.log('time to fetch token');
                      // this.setState({ token: value });
                      token = value;
                    });
                    SInfo.getItem('dentist_tokan', {
                      sharedPreferencesName: 'mySharedPrefs',
                      keychainService: 'myKeychain',
                    }).then(value => {
                      // this.setState({ dentistTokan: value });
                      // this.mLoaderShowHide();
                      // this.mEditProfile();
                      dentistToken = value;
                    });

                    SInfo.getItem('is_dentist_login', {
                      sharedPreferencesName: 'mySharedPrefs',
                      keychainService: 'myKeychain',
                    }).then(value => {
                      if (value == '1') {
                        // this.props.navigation.navigate("subscriptionScreen");
                        this.setState({rady: true});
                        this.checkSubscription(token, dentistToken);
                      }
                    });
                  }
                });
              }
            }, 100);
          },
        );
      })
      .catch(error => {
        console.log('myerror ' + error);
        this.setState({rady: false});
      });
  }

  registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const settings = await messaging().requestPermission({
      sound: true,
      announcement: true,
    });

    console.log('notifcation setting are =>>  ', settings);

    messaging()
      .getToken()
      .then(fcmToken => {
        console.log('FCM Token . ', fcmToken);
        if (fcmToken) {
          this.setState({fcmToken: fcmToken});
          console.log('fcm id is' + fcmToken);
          // alert(fcmToken)
          SInfo.setItem('fcmToken', fcmToken, {
            sharedPreferencesName: 'mySharedPrefs',
            keychainService: 'myKeychain',
          });
        } else {
          console.warn('some error occured');
        }
      })
      .catch(error => {
        console.log('error while fetting fcm token ', error);
      });
    messaging().registerDeviceForRemoteMessages();
  };

  checkSubscription(token, dentistToken) {
    var mThis = this;
    if (token == null || dentistToken == null) {
      mThis.setState({rady: false});
      return;
    }

    var data = new FormData();
    data.append('auth_token', token);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        // console.log("CHECK_SUBSCRIPTION:" + xhr)
        // console.log("CHECK_SUBSCRIPTION:" + JSON.stringify(xhr))
        if (this.responseText.indexOf('status') !== -1) {
          mThis.setState({rady: false});
          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj);
          if (obj.status == 1) {
            if (obj.dentistdetails.docs_details.payment_status === 0) {
              // mThis.props.navigation.navigate("subscripitonScreen");
              // mThis.props.navigation.navigate("DentistTabMenu");
            } else {
              // mThis.props.navigation.navigate("DentistTabMenu");
            }
          } else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      } else {
        mThis.setState({rady: false});
      }
    });
    xhr.open('POST', constants.url + 'service/dentistservice/dentist-step1');
    xhr.setRequestHeader('access-token', dentistToken);
    xhr.send(data);
  }

  mNetworkFailed() {
    this.setState({rady: false}, () => {
      setTimeout(() => {
        Alert.alert(
          'Failed',
          'The Internet connection appears to be offline, Please try again',
        );
      }, 200);
    });
  }

  render() {
    const {navigate} = this.props.navigation;

    const showAlert = () => {
      var str = '2017-07-20 06:16:52';

      var e = new Date(str.replace(/-/g, '/'));
      var strDate = e.getDate();
      var strMonth = e.getMonth() + 1;
      var strYear = e.getFullYear();
      var strHr = e.getHours();
      var strMin = e.getMinutes();
      var strSec = e.getSeconds();
      console.log('<><><><><><>  ' + strDate);
      console.log('<><><><><><>  ' + strMonth);
      console.log('<><><><><><>  ' + strYear);
      console.log('<><><><><><>  ' + strHr);
      console.log('<><><><><><>  ' + strMin);
      console.log('<><><><><><>  ' + strSec);

      var datum = Date.parse('02/13/2017 06:16:52');
      console.disableYellowBox = true;

      //console.log("<><><><>"+new Date(Date.UTC(2017, 6, 1,0,0, 0)));
    };

    return (
      <View style={{backgroundColor: constants.baseColor, flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.viewStyle}>
            {this.state.rady == true ? (
              <Spinner
                overlayColor={'rgba(0, 0, 0, 0.75)'}
                color={'#08a1d9'}
                textContent={'Updating'}
                visible={this.state.rady}
                textStyle={{color: '#fff', fontSize: 15, marginTop: -70}}
              />
            ) : (
              <View></View>
            )}
            <Text
              allowFontScaling={false}
              style={{
                color: 'white',
                fontSize: 16,
                margin: 10,
                fontWeight: '600',
                marginTop: 60,
              }}></Text>
            <View>
              <Image source={logo} style={styles.imageStyle} />
            </View>
            <View
              allowFontScaling={false}
              style={{alignItems: 'center', width: '100%'}}>
              <View
                style={{
                  backgroundColor: constants.baseColor,
                  width: '80%',
                  height: 110,
                  marginTop: 15,
                }}>
                <Text allowFontScaling={false} style={styles.textStyle}>
                  We connect patients to dentists in real-time. Instant answers
                  and dental advice when you need it...for FREE.
                </Text>
              </View>
              <View
                style={{
                  width: '80%',
                  backgroundColor: constants.baseColor,
                  height: 30,
                  marginTop: 40,
                  marginBottom: 15,
                  justifyContent: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    color: 'white',
                    fontSize: 13,

                    fontWeight: '600',
                    textAlign: 'center',
                  }}>
                  Have a dental question or need a dentist now?
                </Text>
              </View>
              <CardView
                cardElevation={5}
                cardMaxElevation={5}
                style={{width: '80%', height: 40}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FEFE53',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    borderColor: '#FEFE53',
                    borderWidth: 1,
                  }}
                  onPress={() => navigate('PatientLogin')}>
                  <Text
                    allowFontScaling={false}
                    style={{color: 'black', fontSize: 18}}>
                    Sign in as Patient
                  </Text>
                </TouchableOpacity>
              </CardView>
              <View
                style={{
                  flexDirection: 'row',
                  height: 20,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 35,
                }}>
                <View
                  style={{
                    height: 1,
                    backgroundColor: 'lightgray',
                    flex: 2,
                  }}></View>
                <View
                  style={{
                    height: 30,
                    backgroundColor: 'lightgray',
                    width: 30,
                    borderRadius: 15,
                    marginLeft: 5,
                    marginRight: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: constants.baseColor}}>or</Text>
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: 'lightgray',
                    flex: 2,
                  }}></View>
              </View>
              <Text
                allowFontScaling={false}
                style={{
                  color: 'white',
                  fontSize: 13,
                  margin: 10,
                  marginTop: 20,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                Are you a Dentist?
              </Text>
              <CardView
                cardElevation={5}
                cardMaxElevation={5}
                style={{
                  width: '80%',
                  height: 40,
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FEFE53',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    borderColor: '#FEFE53',
                    borderWidth: 1,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('DentistLogin')
                  }>
                  <Text
                    allowFontScaling={false}
                    style={{color: 'black', fontSize: 18}}>
                    Sign in as Dentist
                  </Text>
                </TouchableOpacity>
              </CardView>
              <StatusBar
                backgroundColor={constants.baseColor}
                barStyle="light-content"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: constants.baseColor,
    alignItems: 'center',
  },
  textContainerStyle: {
    margin: 20,
  },
  textStyle: {
    width: '90%',
    color: 'white',
    fontSize: 16,
    margin: 10,
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageStyle: {
    marginTop: 20,
    width: 200,
    height: 140,
    resizeMode: 'contain',
  },
});
