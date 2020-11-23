/* @flow */

import React, { Component } from 'react';
import { Image, ActivityIndicator, Alert, TextInput, Text, Picker, ScrollView, Linking, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  View,
  StyleSheet
} from 'react-native';
import TextInputWithIcon from '../components/TextInputWithIcon';
import CheckBox from '../components/CheckBox';

import Button from '../components/Button';
import SInfo from 'react-native-sensitive-info'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import logo from './../images/logo.png'
import constants, { PLACEHOLDER_COLOR } from './../constants/constants'
const DEMO_OPTIONS_1 = ['Male', 'Female', 'Rather not say'];
export default class DentistRegistration extends Component {
  static navigationOptions = {
    title: 'Dentist Registration',
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
      businessname: '',
      countrycode: '',
      phone: '',
      password: '',
      zipcode: '',
      email: '',
      checkBox1: false,
      checkBox2: false,
      firebase: ''
    };
  }
  componentDidMount() {
    // var mt = true;
    // SInfo.getItem('login_email_dentist', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
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
    console.log('Hey I as')
    if (this.state.firstname.length <= 0) {
      Alert.alert('First name field is required..')
      return false;
    } else if (this.state.lastname.length <= 0) {
      Alert.alert('Last name field is required..')
      return false;
    } else if (this.state.businessname.length <= 0) {
      Alert.alert('Business name field is required..')
      return false;
    } else if (this.state.phone.length <= 0) {
      Alert.alert('Phone Number field is required..')
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
    } else if (this.state.zipcode.length <= 0) {
      Alert.alert('Zipcode field is required..')
      return false;
    } else if (this.state.checkBox1 == false) {
      Alert.alert('Please select privacy policy')
      return false;
    } else if (this.state.checkBox2 == false) {
      Alert.alert('Please select HIPAA Authorization')
      return false;
    }
    this.mLoaderShowHide();
    this.mRegistration();
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
        Alert.alert('Success', 'Thank you for registering your Dental Practice with us A verification link has been sent to email id ' + this.state.email);
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

    var mThis = this;
    // var data = new FormData();
    // data.append("user[first_name]", this.state.firstname);
    // data.append("user[last_name]", this.state.lastname);
    // data.append("user[business_name]", this.state.businessname);
    // data.append("user[contact_number]", this.state.phone);
    // data.append("user[password]", this.state.password);
    // data.append("user[country_code]", this.state.countrycode);
    // data.append("user[email]", this.state.email);
    // data.append("user[zipcode]", this.state.zipcode);
    let user = {}
    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", "https://blog.dentalchat.com/server/service/register", true);
    // xhr.onload = function () {
    //   var users = xhr.responseText;
    //   if (xhr.readyState == 4 && xhr.status == "200") {
    //     console.log('<><><> ' + users);
    //     var obj = JSON.parse(users);
    //     mThis.mSuccess();
    //     mThis.props.navigation.navigate('DentistLogin')
    //   } else {
    //     mThis.mNetworkFailed();
    //     console.log('<><><> ' + users);
    //   }
    // }
    // xhr.send(data);
    fetch(constants.url + 'service/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user": {
          "email": this.state.email,
          "password": this.state.password,
          "first_name": this.state.firstname,
          "last_name": this.state.lastname,
          "address": this.state.zipcode,
          "contact_number": this.state.phone,
          "patient_checkbox": true,
          "patient_checkbox2": true,
          "device_token": this.state.firebase
        },
        "auth_token": "z7NHOmfvqRPAoKM",
        "address": this.state.zipcode,
        "plan": 0
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 1) {
          mThis.mLogin();
        }
        else {
          mThis.mFailed();
        }
      })
      .catch((error) => {
        console.log(error);
        mThis.setState({
          rady: true,
          visible: false
        });
        mThis.mNetworkFailed();
      });
  }
  mLogin() {
    const { navigate } = this.props.navigation;
    var mThis = this;
    var data = new FormData();
    data.append("user[email]", this.state.email);
    data.append("user[password]", this.state.password);
    data.append("user[device_token]", this.state.firebase)
    data.append("auth_token", "z7NHOmfvqRPAoKM")
    var xhr = new XMLHttpRequest();
    xhr.open("POST", constants.url + "service/dentist-login", true);
    // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
      mThis.mLoaderShowHide();
      var users = xhr.responseText;
      if (xhr.readyState == 4 && xhr.status == "200") {
        console.log('<><><> ' + users);
        var obj = JSON.parse(users);
        if (obj.status == 1) {
          SInfo.setItem('is_dentist_login', '1', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('dentist_tokan', obj.auth_token + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('dentist_id', obj.data.user_id + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('dentist_name', obj.data.name + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('dentist_pic', obj.data.final_profile_image + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('dentist_tokan', obj.data.token + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('dentist_email', mThis.state.username + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('dentist_password', mThis.state.password + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('opration', '-1', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('type', '-1', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('token', obj.data.token, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          // navigate('subscripitonScreen')
          navigate('DentistMainStackScreens')
          if (mThis.state.checkBox == true) {
            SInfo.setItem('login_email_dentist', mThis.state.username + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          }
        } else {
          mThis.mFailed();
        }
      } else {
        console.log('<><><> ' + users);
        mThis.mNetworkFailed();
      }
    }
    xhr.send(data);
  }


  mCheckBox1() {
    this.setState({
      checkBox1: !this.state.checkBox1,
    })
  }

  mCheckBox2() {
    this.setState({
      checkBox2: !this.state.checkBox2,
    })
  }



  render() {
    const { navigate } = this.props.navigation;
    const label = (
      <View style={styles.row}>

        <Text allowFontScaling={false}>Expiration date</Text>
        <Text allowFontScaling={false}>Expiration </Text>
      </View>
    )

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
                  keyboardType='default'
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  placeholder='Dentist First Name'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ firstname: text })} />
              </View>
              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  placeholderTextColor={PLACEHOLDER_COLOR}

                  keyboardType='default'
                  placeholder='Last Name Initial'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ lastname: text })} />
              </View>


              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  placeholderTextColor={PLACEHOLDER_COLOR}

                  keyboardType='default'
                  placeholder='Business Name'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ businessname: text })} />
              </View>
              <View style={styles.searchSection}>
                <TextInput
                  allowFontScaling={false}
                  placeholderTextColor={PLACEHOLDER_COLOR}

                  keyboardType='phone-pad'
                  placeholder='Business Phone'
                  style={styles.textInputStyle}
                  onChangeText={(text) => this.setState({ phone: text })} />
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
                  onChangeText={(text) => this.setState({ password: text })} />
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 10,
                width: '90%',
                borderColor: '#B1B2C9',
                borderWidth: 0.5,
                marginTop: 5,
                marginLeft: '5%'
              }}>
                {/* <TextInput
                keyboardType='default'
                placeholder='Full Address'
                style={styles.textInputStyle}
                /> */}
                <GooglePlacesAutocomplete
                  placeholderTextColor={PLACEHOLDER_COLOR}
                  placeholder='Enter Location'
                  minLength={2}
                  autoFocus={false}
                  returnKeyType={'default'}
                  fetchDetails={true}
                  styles={{
                    textInputContainer: {
                      backgroundColor: 'rgba(0,0,0,0)',
                      borderTopWidth: 0,
                      borderBottomWidth: 0
                    },

                    textInput: {

                      marginLeft: 0,
                      marginRight: 0,
                      color: '#5d5d5d',
                      fontSize: 16
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb'
                    },
                  }}
                  currentLocation={false}
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: 'AIzaSyCECNx6YKAjaYfP9Eq7FXAMB1QmjUKvMZk',
                    language: 'en', // language of the results
                    types: '(cities)' // default: 'geocode'
                  }}
                  onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    console.log(data);
                    this.setState({ zipcode: data.description })
                  }}


                />
              </View>
              <View style={[styles.searchSection6]}>

                {/* <CheckBox
                  label=''
                  checkboxStyle={{ height: 16, width: 16 }}
                  onChange={() => this.mCheckBox1()}
                /> */}
                <CheckBox checked={this.state.checkBox1} checkboxStyle={{ marginLeft: 20 }}
                  //  checkedImage={Images.ImgRadioCheck}
                  //  uncheckedImage={Images.ImgRadioUncheck}
                  onChange={() => {
                    this.mCheckBox1()
                  }}
                />

                <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13 }}> I agree</Text>
                {/* <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13, color: '#337ab7' }} onPress={() => { Linking.openURL('https://dentalchat.com/terms-and-conditions') }}>terms</Text> */}
                <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13, color: '#337ab7' }} onPress={() => { Linking.openURL('https://dentalchat.com/terms-and-conditions?show=0') }}>terms</Text>
                <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13 }}>of use and</Text>
                <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13, color: '#337ab7' }} onPress={() => Linking.openURL('https://dentalchat.com/privacy-policy?show=0')}>privacy policy.</Text>
                {/* <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13, color: '#337ab7' }} onPress={() => { Linking.openURL('https://dentalchat.com/privacy-policy') }}>privacy policy.</Text> */}
              </View>
              <View style={styles.searchSection6}>
                <CheckBox checked={this.state.checkBox2} checkboxStyle={{ marginLeft: 20 }}

                  onChange={() => {
                    this.mCheckBox2()
                  }}
                />
                {/* <CheckBox
                  label=''
                  checkboxStyle={{ height: 16, width: 16 }}
                  onChange={() => this.mCheckBox2()}
                /> */}
                <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13 }}> Read and accept</Text>
                {/* <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13, color: '#337ab7' }} onPress={() => { Linking.openURL('https://dentalchat.com/hipaa-authorization') }}>Dentalchat HIPAA Authorization</Text> */}
                <Text allowFontScaling={false} style={{ marginLeft: 5, fontSize: 13, color: '#337ab7' }} onPress={() => { Linking.openURL('https://dentalchat.com/hipaa-authorization?show=0') }}>Dentalchat HIPAA Authorization</Text>
              </View>
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
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
  chaildView: {
    width: 60,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#000'
  },
  chaildView2: {
    marginLeft: 20,
    width: 300,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#000'
  },
  row: {
    width: 200,
    height: 20,
    flex: 1,
    flexDirection: "row"
  },
  dropdown: {
    flex: 1,
    top: 5,
  },
  lineStyle: {

    borderWidth: 0.5,
    borderColor: 'black',
    marginLeft: 20,
    marginRight: 20,
  },
  lineStyle2: {
    width: 60,
    borderWidth: 0.5,
    borderColor: 'black',
  },

  lineStyle3: {
    width: 184,
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
    width: "90%",
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    fontWeight: '500',
    borderColor: '#ccc'
  },
  textInputStyle2: {
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#ccc',
    width: 60,
    height: 48,
    borderColor: '#ccc'
  },
  textInputStyle3: {
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#ccc',
    width: 300,
    height: 48,
    borderColor: '#ccc'
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    borderColor: '#B1B2C9',
    borderWidth: 0.5,
    marginTop: 5,
    height: 40,
    marginLeft: '5%'
  },
  searchSection6: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchSection2: {
    marginTop: 10,
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
  insta: {
    height: 150,

  },
});
