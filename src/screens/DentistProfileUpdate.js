/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Button
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import SInfo from 'react-native-sensitive-info'
import { Avatar } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PropTypes from 'prop-types';

import constants from './../constants/constants'
const DEMO_OPTIONS_1 = ['Please Select Gender', 'Male', 'Female', 'Rather not say'];

var options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class DentistProfileUpdate extends Component {


  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Edit Profile',
      tabBarVisible: false,
      tabBarLabel: 'More',
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: constants.baseColor
      },
      tabBarIcon: ({ tintColor }) => (
        <Icon name='ellipsis-h' size={30} color={tintColor} />
      ),
      headerLeft: <TouchableOpacity onPress={() => navigation.navigate('DentistAccount')} >
        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginLeft: 15 }} name='angle-left' size={30} color={'#ffffff'} />
          <Text style={{ fontSize: 15, marginTop: 7, marginLeft: 5, fontWeight: '500', color: '#ffffff' }}>Back</Text>
        </View>
      </TouchableOpacity>
    };
  };




  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userProfileImg: '',
      avatarSource: '',
      firstName: '',
      lastName: '',
      contact: '',
      countryCode: '',
      gender: '',
      dentistId: '',
      dentistTokan: '',
      pic: [],
      imgOption: '1',
      email: '',
      dob: '',
      token: '',
    };
  }

  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };

  componentDidMount() {
    // this.props.navigation.setParams({ handleSave: this.mValidation });
    SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ dentistId: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('dentist_tokan', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ dentistTokan: value, })
      this.mLoaderShowHide();
      this.mEditProfile();
    });
  }

  mValidation = () => {
    if (this.state.firstName.length <= 0) {
      Alert.alert('first name is required.')
      return false;
    } else if (this.state.lastName.length <= 0) {
      Alert.alert('last name is required.')
      return false;
    } else if (this.state.contact.length <= 0) {
      Alert.alert('mobile no is required.')
      return false;
    } else if (this.state.countryCode.length <= 0) {
      Alert.alert('country code is required.')
      return false;
    }
    this.mLoaderShowHide();
    this.mUpdateProfile();
  }

  mValidation1 = () => {
    if (this.state.firstName.length <= 0) {
      Alert.alert('first name is required.')
      return false;
    } else if (this.state.lastName.length <= 0) {
      Alert.alert('last name is required.')
      return false;
    } else if (this.state.contact.length <= 0) {
      Alert.alert('mobile no is required.')
      return false;
    } else if (this.state.countryCode.length <= 0) {
      Alert.alert('country code is required.')
      return false;
    }
    this.mLoaderShowHide();
    this.mUpdateProfile1();
  }
  mEditProfile() {
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token)
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          mThis.mLoaderShowHide();
          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj)
          if (obj.status == 1) {
            var img = constants.imageUrl + 'uploads/patient_profile_image/no_image.jpg';
            if (obj.dentistdetails.docs_details.profile_pics == '') {
              img = constants.imageUrl + 'uploads/patient_profile_image/no_image.jpg';
            } else {
              img = constants.imageUrl + 'uploads/dentist_profile_image/' + obj.dentistdetails.docs_details.profile_pics;
            }

            if (obj.dentistdetails.docs_details.gender == 1) {

              mThis.setState({
                userProfileImg: img,
                dentistId: obj.dentistdetails.docs_details.doctor_id,
                firstName: obj.dentistdetails.docs_details.first_name,
                lastName: obj.dentistdetails.docs_details.last_name,
                contact: obj.dentistdetails.docs_details.contact_number,
                countryCode: obj.dentistdetails.docs_details.conuntry_code,
                gender: 'Male',
                email: obj.dentistdetails.docs_details.email,
                dob: obj.dentistdetails.docs_details.date_of_birth,
                imgOption: '1',
                subscribeStatus: obj.dentistdetails.subcribe_status
              });

            } else if (obj.dentistdetails.docs_details.gender == 2) {

              mThis.setState({
                userProfileImg: img,
                dentistId: obj.dentistdetails.docs_details.doctor_id,
                firstName: obj.dentistdetails.docs_details.first_name,
                lastName: obj.dentistdetails.docs_details.last_name,
                contact: obj.dentistdetails.docs_details.contact_number,
                countryCode: obj.dentistdetails.docs_details.conuntry_code,
                gender: 'Female',
                email: obj.dentistdetails.docs_details.email,
                dob: obj.dentistdetails.docs_details.date_of_birth,
                imgOption: '1',
                subscribeStatus: obj.dentistdetails.subcribe_status
              });

            } else if (obj.dentistdetails.docs_details.gender == 3) {

              mThis.setState({
                userProfileImg: img,
                dentistId: obj.dentistdetails.docs_details.doctor_id,
                firstName: obj.dentistdetails.docs_details.first_name,
                lastName: obj.dentistdetails.docs_details.last_name,
                contact: obj.dentistdetails.docs_details.contact_number,
                countryCode: obj.dentistdetails.docs_details.conuntry_code,
                gender: 'Rather not say',
                email: obj.dentistdetails.docs_details.email,
                dob: obj.dentistdetails.docs_details.date_of_birth,
                imgOption: '1',
                subscribeStatus: obj.dentistdetails.subcribe_status
              });
            } else {

              mThis.setState({
                userProfileImg: img,
                dentistId: obj.dentistdetails.docs_details.doctor_id,
                firstName: obj.dentistdetails.docs_details.first_name,
                lastName: obj.dentistdetails.docs_details.last_name,
                contact: obj.dentistdetails.docs_details.contact_number,
                countryCode: obj.dentistdetails.docs_details.conuntry_code,
                gender: 'Please Select Gender',
                email: obj.dentistdetails.docs_details.email,
                dob: obj.dentistdetails.docs_details.date_of_birth,
                imgOption: '1',
                subscribeStatus: obj.dentistdetails.subcribe_status
              });
            }
          }
          else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step1");
    xhr.setRequestHeader("access-token", this.state.dentistTokan);
    xhr.send(data);
  }




  renderCustomActions() {

    const options = {
      rotation: 360,
      allowsEditing: true,
      noData: true,
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: false
      }
    }
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        const myImg = {
          uri: response.uri,
          type: 'image/jpeg',
          name: 'dhsiushdishidsiuhdiuh',
        };
        this.setState({
          imgOption: '2',
          avatarSource: source,
          pic: myImg
        });
      }
    });

  }

  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'Profile Updation failed');
      }, 200);
    });
  }

  mSuccess() {
    this.props.navigation.navigate('DentistAccount')
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Got it', 'Profile Updated Successfully');
      }, 200);
    });

  }
  mSuccess1() {
    this.props.navigation.navigate('dentistProfileUpdate2')
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Got it', 'Profile Updated Successfully');
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

  mUpdateProfile1() {


    var mThis = this;
    var data = new FormData();
    if (this.state.gender === 'Male') {
      this.setState({ gender: '1' }, () => {
        data.append("doctor_id", this.state.dentistId);
        data.append("first_name", this.state.firstName);
        data.append("last_name", this.state.lastName);
        data.append("date_of_birth", this.state.dob);
        data.append("gender", this.state.gender);
        data.append("email", this.state.email);
        data.append("conuntry_code", this.state.countryCode);
        data.append("contact_number", this.state.contact);
        data.append("profile_pics", this.state.pic);
        data.append("auth_token", this.state.token)
        fetch(constants.url + 'service/dentistservice/update-dentist-profile-step1', {
          method: 'POST',
          body: data,
          headers: {
            //Accept: 'application/json',
            //'Content-Type': 'json; charset=UTF-8',
            'Content-Type': 'multipart/form-data'

          },
        }).then((response) => response.json())
          .then((responseJson) => {
            //var users = responseJson;

            this.mLoaderShowHide();
            if (responseJson.status == 1) {
              SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log(responseJson)
              this.mSuccess1();


            }
            else if (responseJson.status == 5) {
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('Home')
            } else {
              this.mFailed();
            }
          })
          .catch((error) => {
            this.mLoaderShowHide();
            console.log(error);
            // this.mFailed();
          });
      })
    } else if (this.state.gender === "Female") {
      this.setState({ gender: '2' }, () => {
        data.append("doctor_id", this.state.dentistId);
        data.append("first_name", this.state.firstName);
        data.append("last_name", this.state.lastName);
        data.append("date_of_birth", this.state.dob);
        data.append("gender", this.state.gender);
        data.append("email", this.state.email);
        data.append("conuntry_code", this.state.countryCode);
        data.append("contact_number", this.state.contact);
        data.append("profile_pics", this.state.pic);
        data.append("auth_token", this.state.token)
        fetch(constants.url + 'service/dentistservice/update-dentist-profile-step1', {
          method: 'POST',
          body: data,
          headers: {
            //Accept: 'application/json',
            //'Content-Type': 'json; charset=UTF-8',
            'Content-Type': 'multipart/form-data'

          },
        }).then((response) => response.json())
          .then((responseJson) => {
            //var users = responseJson;

            this.mLoaderShowHide();
            if (responseJson.status == 1) {
              SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log(responseJson)
              this.mSuccess1();


            }
            else if (responseJson.status == 5) {
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('Home')
            } else {
              this.mFailed();
            }
          })
          .catch((error) => {
            //this.mLoaderShowHide();
            console.log(error);
            // this.mFailed();
          });
      })
      console.log(this.state.gender)
    } else if (this.state.gender === 'Rather not say') {
      this.setState({ gender: '3' }, () => {
        data.append("doctor_id", this.state.dentistId);
        data.append("first_name", this.state.firstName);
        data.append("last_name", this.state.lastName);
        data.append("date_of_birth", this.state.dob);
        data.append("gender", this.state.gender);
        data.append("email", this.state.email);
        data.append("conuntry_code", this.state.countryCode);
        data.append("contact_number", this.state.contact);
        data.append("profile_pics", this.state.pic);
        data.append("auth_token", this.state.token)
        fetch(constants.url + 'service/dentistservice/update-dentist-profile-step1', {
          method: 'POST',
          body: data,
          headers: {
            //Accept: 'application/json',
            //'Content-Type': 'json; charset=UTF-8',
            'Content-Type': 'multipart/form-data'

          },
        }).then((response) => response.json())
          .then((responseJson) => {
            //var users = responseJson;

            this.mLoaderShowHide();
            if (responseJson.status == 1) {
              SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log(responseJson)
              this.mSuccess1();


            }
            else if (responseJson.status == 5) {
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('Home')
            } else {
              this.mFailed();
            }
          })
          .catch((error) => {
            //this.mLoaderShowHide();
            console.log(error);
            // this.mFailed();
          });
      })
    }
    else {
      this.setState({ gender: '0' }, () => {
        data.append("doctor_id", this.state.dentistId);
        data.append("first_name", this.state.firstName);
        data.append("last_name", this.state.lastName);
        data.append("date_of_birth", this.state.dob);
        data.append("gender", this.state.gender);
        data.append("email", this.state.email);
        data.append("conuntry_code", this.state.countryCode);
        data.append("contact_number", this.state.contact);
        data.append("profile_pics", this.state.pic);
        data.append("auth_token", this.state.token)
        fetch(constants.url + 'service/dentistservice/update-dentist-profile-step1', {
          method: 'POST',
          body: data,
          headers: {
            //Accept: 'application/json',
            //'Content-Type': 'json; charset=UTF-8',
            'Content-Type': 'multipart/form-data'

          },
        }).then((response) => response.json())
          .then((responseJson) => {
            //var users = responseJson;

            this.mLoaderShowHide();
            if (responseJson.status == 1) {
              SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log(responseJson)
              this.mSuccess1();


            }
            else if (responseJson.status == 5) {
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('Home')
            } else {
              this.mFailed();
            }
          })
          .catch((error) => {
            //this.mLoaderShowHide();
            console.log(error);
            // this.mFailed();
          });
      })
    }

    console.log(data)
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {
    //     mThis.mLoaderShowHide();
    //     console.warn("@@@@@" + this.responseText);
    //     // var text = this.responseText;
    //     // var obj = JSON.parse(text);
    //     // if (obj.status == 1) {
    //     //   mThis.mSuccess();
    //     //   SInfo.setItem('dentist_name', obj.update_doc_details.docs_details.first_name + ' ' + obj.update_doc_details.docs_details.last_name, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     //   SInfo.setItem('dentist_pic', obj.update_doc_details.docs_details.profile_pics + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     // } else {
    //     //   mThis.mFailed();
    //     // }
    //   }
    // });
    // xhr.open("POST", constants.url + "service/dentistservice/update-dentist-profile-step1");
    // xhr.setRequestHeader('content-type', 'multipart/form-data');
    // xhr.send(data);



  }

  mUpdateProfile() {


    var mThis = this;
    var data = new FormData();
    if (this.state.gender === 'Male') {
      this.setState({ gender: '1' }, () => {
        data.append("doctor_id", this.state.dentistId);
        data.append("first_name", this.state.firstName);
        data.append("last_name", this.state.lastName);
        data.append("date_of_birth", this.state.dob);
        data.append("gender", this.state.gender);
        data.append("email", this.state.email);
        data.append("conuntry_code", this.state.countryCode);
        data.append("contact_number", this.state.contact);
        data.append("profile_pics", this.state.pic);
        data.append("auth_token", this.state.token)
        fetch(constants.url + 'service/dentistservice/update-dentist-profile-step1', {
          method: 'POST',
          body: data,
          headers: {
            //Accept: 'application/json',
            //'Content-Type': 'json; charset=UTF-8',
            'Content-Type': 'multipart/form-data'

          },
        }).then((response) => response.json())
          .then((responseJson) => {
            //var users = responseJson;

            this.mLoaderShowHide();
            if (responseJson.status == 1) {
              SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log(responseJson)
              this.mSuccess();
              this.props.navigation.navigate('dentistProfileUpdate2')


            }
            else if (responseJson.status == 5) {
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('Home')
            } else {
              this.mFailed();
            }
          })
          .catch((error) => {
            this.mLoaderShowHide();
            console.log(error);
            // this.mFailed();
          });
      })
    } else if (this.state.gender === "Female") {
      this.setState({ gender: '2' }, () => {
        data.append("doctor_id", this.state.dentistId);
        data.append("first_name", this.state.firstName);
        data.append("last_name", this.state.lastName);
        data.append("date_of_birth", this.state.dob);
        data.append("gender", this.state.gender);
        data.append("email", this.state.email);
        data.append("conuntry_code", this.state.countryCode);
        data.append("contact_number", this.state.contact);
        data.append("profile_pics", this.state.pic);
        data.append("auth_token", this.state.token)
        fetch(constants.url + 'service/dentistservice/update-dentist-profile-step1', {
          method: 'POST',
          body: data,
          headers: {
            //Accept: 'application/json',
            //'Content-Type': 'json; charset=UTF-8',
            'Content-Type': 'multipart/form-data'

          },
        }).then((response) => response.json())
          .then((responseJson) => {
            //var users = responseJson;

            this.mLoaderShowHide();
            if (responseJson.status == 1) {
              SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log(responseJson)
              this.mSuccess();
              this.props.navigation.navigate('dentistProfileUpdate2')


            }
            else if (responseJson.status == 5) {
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('Home')
            } else {
              this.mFailed();
            }
          })
          .catch((error) => {
            //this.mLoaderShowHide();
            console.log(error);
            // this.mFailed();
          });
      })
      console.log(this.state.gender)
    } else if (this.state.gender === 'Rather not say') {
      this.setState({ gender: '3' }, () => {
        data.append("doctor_id", this.state.dentistId);
        data.append("first_name", this.state.firstName);
        data.append("last_name", this.state.lastName);
        data.append("date_of_birth", this.state.dob);
        data.append("gender", this.state.gender);
        data.append("email", this.state.email);
        data.append("conuntry_code", this.state.countryCode);
        data.append("contact_number", this.state.contact);
        data.append("profile_pics", this.state.pic);
        data.append("auth_token", this.state.token)
        fetch(constants.url + 'service/dentistservice/update-dentist-profile-step1', {
          method: 'POST',
          body: data,
          headers: {
            //Accept: 'application/json',
            //'Content-Type': 'json; charset=UTF-8',
            'Content-Type': 'multipart/form-data'

          },
        }).then((response) => response.json())
          .then((responseJson) => {
            //var users = responseJson;

            this.mLoaderShowHide();
            if (responseJson.status == 1) {
              SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log(responseJson)
              this.mSuccess();
              this.props.navigation.navigate('dentistProfileUpdate2')


            }
            else if (responseJson.status == 5) {
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('Home')
            } else {
              this.mFailed();
            }
          })
          .catch((error) => {
            //this.mLoaderShowHide();
            console.log(error);
            // this.mFailed();
          });
      })
    }
    else {
      this.setState({ gender: '0' }, () => {
        data.append("doctor_id", this.state.dentistId);
        data.append("first_name", this.state.firstName);
        data.append("last_name", this.state.lastName);
        data.append("date_of_birth", this.state.dob);
        data.append("gender", this.state.gender);
        data.append("email", this.state.email);
        data.append("conuntry_code", this.state.countryCode);
        data.append("contact_number", this.state.contact);
        data.append("profile_pics", this.state.pic);
        data.append("auth_token", this.state.token)
        fetch(constants.url + 'service/dentistservice/update-dentist-profile-step1', {
          method: 'POST',
          body: data,
          headers: {
            //Accept: 'application/json',
            //'Content-Type': 'json; charset=UTF-8',
            'Content-Type': 'multipart/form-data'

          },
        }).then((response) => response.json())
          .then((responseJson) => {
            //var users = responseJson;

            this.mLoaderShowHide();
            if (responseJson.status == 1) {
              SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              console.log(responseJson)
              this.mSuccess();
              this.props.navigation.navigate('dentistProfileUpdate2')


            }
            else if (responseJson.status == 5) {
              SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('Home')
            } else {
              this.mFailed();
            }
          })
          .catch((error) => {
            //this.mLoaderShowHide();
            console.log(error);
            // this.mFailed();
          });
      })
    }

    console.log(data)
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {
    //     mThis.mLoaderShowHide();
    //     console.warn("@@@@@" + this.responseText);
    //     // var text = this.responseText;
    //     // var obj = JSON.parse(text);
    //     // if (obj.status == 1) {
    //     //   mThis.mSuccess();
    //     //   SInfo.setItem('dentist_name', obj.update_doc_details.docs_details.first_name + ' ' + obj.update_doc_details.docs_details.last_name, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     //   SInfo.setItem('dentist_pic', obj.update_doc_details.docs_details.profile_pics + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     // } else {
    //     //   mThis.mFailed();
    //     // }
    //   }
    // });
    // xhr.open("POST", constants.url + "service/dentistservice/update-dentist-profile-step1");
    // xhr.setRequestHeader('content-type', 'multipart/form-data');
    // xhr.send(data);



  }




  render() {
    const { navigate } = this.props.navigation;


    if (this.state.gender == 1) {
      this.setState({
        gender: 'Male',
      });
    } else if (this.state.gender == 2) {
      this.setState({
        gender: 'Female',
      });
    } else if (this.state.gender == 3) {
      this.setState({
        gender: 'Rather not say',
      });
    }

    return (
      <View style={styles.container}>
        <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
        </Spinner>

        <ScrollView
          keyboardShouldPersistTaps="never">

          <View style={styles.profileImage}>

            <Text style={{ color: constants.baseColor, fontSize: 22, marginBottom: 15 }} >Basic Info</Text>
            {this.state.imgOption === '1' ? <Avatar rounded large source={{ uri: this.state.userProfileImg }} /> : <Avatar rounded large source={this.state.avatarSource} />}
            <Text allowFontScaling={false} style={{ color: constants.baseColor, fontSize: 16, fontWeight: 'bold', marginTop: 15 }} onPress={() => this.renderCustomActions()} >Change Profile Photo</Text>
          </View>
          <View style={styles.editView}>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="user" size={30} color="#C7C7CC" />
              <TextInput
                allowFontScaling={false}
                value={this.state.firstName}
                keyboardType='default'
                placeholder='First Name'
                style={styles.textInputStyle}
                onChangeText={(text) => this.setState({ firstName: text })} />
            </View>
          </View>
          <View style={styles.editViewNext}>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="user" size={30} color="#C7C7CC" />
              <TextInput
                allowFontScaling={false}
                value={this.state.lastName}
                keyboardType='default'
                placeholder='Last Name'
                style={styles.textInputStyle}
                onChangeText={(text) => this.setState({ lastName: text })} />
            </View>
          </View>

          <View style={styles.editViewNext}>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="user" size={30} color="#C7C7CC" />
              <TextInput
                allowFontScaling={false}
                value={this.state.email}
                editable={false}
                placeholder='Email'
                style={styles.textInputStyle}
                onChangeText={(text) => this.setState({ email: text })} />
            </View>
          </View>

          <View style={styles.editViewNext}>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="venus" size={30} color="#C7C7CC" />
              {/* <ModalDropdown
                allowFontScaling={false}
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_pop}
                defaultValue={this.state.gender}
                dropdownTextStyle={styles.dropdown_pop_text}
                options={DEMO_OPTIONS_1}
                onSelect={(idx, value) => this.setState({ gender: value })} /> */}
               
            </View>
          </View>
          <View style={styles.editViewLast}>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="mobile" size={30} color="#C7C7CC" />
              <TextInput
                allowFontScaling={false}
                maxLength={4}
                value={this.state.countryCode}
                keyboardType='phone-pad'
                placeholder='Country Code'
                style={styles.textInputStyle}
                returnKeyType='done'
                onChangeText={(text) => this.setState({ countryCode: text })} />
            </View>
          </View>
          <View style={styles.editViewNext}>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="mobile" size={30} color="#C7C7CC" />
              <TextInput
                allowFontScaling={false}
                value={this.state.contact}
                keyboardType='phone-pad'
                placeholder='Mobile No.'
                style={styles.textInputStyle}
                returnKeyType='done'
                onChangeText={(text) => this.setState({ contact: text })} />
            </View>
          </View>

          <TouchableOpacity style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: constants.baseColor, borderRadius: 10, height: 50, width: '50%', marginLeft: '25%' }} onPress={() => { this.mValidation1() }}>
            <Text style={{ color: 'white' }}>Save & Next</Text>
          </TouchableOpacity>
          <KeyboardSpacer />
        </ScrollView>



      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchIcon: {
    marginLeft: 20
  },
  textInputStyle: {
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#ccc',
    width: 300,
    height: 50,
    marginLeft: 20,
    borderColor: '#ccc',
    fontSize: 18,
    fontWeight: 'bold'

  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  optionsListStyle: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: 'white'
  },
  subtitleView: {
    marginLeft: 30,
  },
  maintitleView: {
    marginLeft: 30,
    marginTop: 10
  },
  optiontitleView: {
    marginTop: 10,
  },
  subtitleTextStyle: {
    color: '#999'
  },
  maintitleTextStyle: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleAndVersionContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150
  },
  titleContainerStyle: {
    marginBottom: 10
  },
  titleTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'grey',
  },
  versionTextStyle: {
    color: 'grey'
  },
  containerRow: {
    height: 60,
    marginTop: 10,
    backgroundColor: 'white'
  },
  imageview: {
    marginTop: 5
  },
  profileImage: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editView: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  editViewNext: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  editViewLast: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchSection1: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdown: {
    width: 300,
    height: 50,
    marginLeft: 20,
  },
  dropdown_text: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
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
});


const optionsList = [
  {
    title: 'Edit Profie',
    icon: 'edit',
    screenName: 'DentistEditProfile'
  },
  {
    title: 'Change Password',
    icon: 'lock',
    screenName: 'DentistChangePassword'
  },
];
