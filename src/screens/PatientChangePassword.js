/* @flow */

import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Text,
  Picker,
  TouchableOpacity
} from 'react-native';
import TextInputWithIcon from '../components/TextInputWithIcon';
import Button from '../components/Button';
import SInfo from 'react-native-sensitive-info'
import PropTypes from 'prop-types';
import constants from './../constants/constants'



export default class PatientChangePassword extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Change Password',
      tabBarLabel: 'More',

      tabBarIcon: ({ tintColor }) => (
        <Icon name='ellipsis-h' size={30} color={tintColor} />
      ),
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: constants.baseColor
      },
      headerLeft: <TouchableOpacity onPress={() => navigation.goBack()} >
        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginLeft: 15 }} name='angle-left' size={30} color={'#ffffff'} />
          <Text allowFontScaling={false} style={{ fontSize: 15, marginTop: 7, marginLeft: 5, fontWeight: '500', color: '#ffffff' }}>Back</Text>
        </View>
      </TouchableOpacity>
    };
  };





  mValidateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      oldPass: '',
      newPass: '',
      conPass: '',
      patientTokan: '',
      token: ''
    };
  }

  componentDidMount() {
    SInfo.getItem('patient_tokan', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientTokan: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
  }


  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };

  mValidation() {
    if (this.state.oldPass.length <= 0) {
      Alert.alert('Old password is required')
      return false;
    } else if (this.state.newPass.length <= 0) {
      Alert.alert('New password is required')
      return false;
    } else if (this.state.conPass.length <= 0) {
      Alert.alert('Confirm password is required')
      return false;
    } else if (this.state.newPass != this.state.conPass) {
      Alert.alert('Password not match')
      return false;
    }
    this.mLoaderShowHide();
    this.mChangePassword();
  }

  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Please enter correct old password');
      }, 200);
    });
  }

  mSuccess() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Success', 'Password update successfull.');
      }, 200);
    });
  }

  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline');
      }, 200);
    });
  }

  mChangePassword() {
    var mThis = this;
    var data = new FormData();
    data.append("dentist[old_password]", this.state.oldPass);
    data.append("dentist[password]", this.state.newPass);
    data.append("dentist[confirm_password]", this.state.conPass);
    data.append("auth_token", this.state.token)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        mThis.setState({
          visible: false
        }, () => {
          if (xhr.status === 200) {
            var text = this.responseText;
            console.log("<><><>123 " + text);
            var obj = JSON.parse(text);
            if (obj.status == 1) {
              mThis.mSuccess();
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              mThis.props.navigation.navigate('Home');
            } else {
              mThis.mFailed();
            }
          } else {
            mThis.mNetworkFailed();
          }
        });

      }
    });
    xhr.open("POST", constants.url + "service/patient/change-password");
    xhr.setRequestHeader("access-token", this.state.patientTokan);
    xhr.send(data);

    // fetch(constants.url + "service/patient/change-password", {
    //   method: 'POST',
    //   body: data,
    //   headers: {
    //     //Accept: 'application/json',
    //     //'Content-Type': 'json; charset=UTF-8',
    //     'Content-Type': 'multipart/form-data',
    //     "access-token": this.state.patientTokan

    //   },
    // }).then((response) => {
    //   //var users = responseJson;
    //   // this.mLoaderShowHide();
    //   console.log("CHANGE_PWD")
    //   console.log(response)
    //   mThis.setState({
    //     visible: false
    //   }, () => {
    //     mThis.mSuccess();
    //     mThis.props.navigation.navigate('Home');
    //   });


    // })
    //   .catch((error) => {
    //     this.mLoaderShowHide();
    //     mThis.mFailed();

    //   });
  }



  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
        </Spinner>
        <View>

          <View style={styles.searchSection}>
            <TextInput
              allowFontScaling={false}
              secureTextEntry={true}
              keyboardType='default'
              placeholder='Old Password'
              style={styles.textInputStyle}
              onChangeText={(text) => this.setState({ oldPass: text })} />
          </View>

          <View style={styles.lineStyle}></View>

          <View style={styles.searchSection}>
            <TextInput
              allowFontScaling={false}
              secureTextEntry={true}
              keyboardType='default'
              placeholder='New Password'
              style={styles.textInputStyle}
              onChangeText={(text) => this.setState({ newPass: text })} />
          </View>

          <View style={styles.lineStyle}></View>

          <View style={styles.searchSection}>
            <TextInput
              allowFontScaling={false}
              secureTextEntry={true}
              keyboardType='default'
              placeholder='Confirm Password'
              style={styles.textInputStyle}
              onChangeText={(text) => this.setState({ conPass: text })} />
          </View>

          <View style={styles.lineStyle}></View>
        </View>
        <View style={styles.buttonContainerStyle}>
          <Button
            buttonType="logInButton"
            name='Submit'
            onPress={() => this.mValidation()} />
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
    width: 250,
    height: 50,
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
