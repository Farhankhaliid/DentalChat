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
  Button,

} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import SInfo from 'react-native-sensitive-info'
import { List, ListItem, Avatar } from 'react-native-elements';
import constants from './../constants/constants'
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import PropTypes from 'prop-types';

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
var options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class PatientProfileUpdate extends Component {


  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Edit Profile',
      tabBarLabel: 'More',
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: constants.baseColor
      },
      tabBarIcon: ({ tintColor }) => (
        <Icon name='ellipsis-h' size={30} color={tintColor} />
      ),

      headerLeft: <TouchableOpacity onPress={() => navigation.goBack()} >
        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginLeft: 15 }} name='angle-left' size={30} color={'#ffffff'} />
          <Text allowFontScaling={false} style={{ fontSize: 15, marginTop: 7, marginLeft: 5, fontWeight: '500', color: '#ffffff' }}>Back</Text>
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
      patientId: '',
      patientTokan: '',
      pic: [],
      imgOption: '1',
      token: ''
    };
  }

  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.mValidation });
    SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientId: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('patient_tokan', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientTokan: value, })
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


  mEditProfile() {
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          mThis.mLoaderShowHide();
          var text = this.responseText;
          console.warn('<><><>akki ' + this.responseText);
          var obj = JSON.parse(text);
          if (obj.status == 1) {
            var img = constants.imageUrl + 'uploads/patient_profile_image/no_image.jpg';
            if (obj.patient_details.image == '') {
              img = constants.imageUrl + 'uploads/patient_profile_image/no_image.jpg';
            } else {
              img = constants.imageUrl + 'uploads/patient_profile_image/' + obj.patient_details.image;
            }
            let gender = 0;
            if (obj.patient_details.gender === "1") {
              gender = 'Male'
            }
            else if (obj.patient_details.gender === "2") {
              gender = 'Female'
            }
            else {
              gender = 'Rather not say'
            }
            mThis.setState({
              userProfileImg: img,
              firstName: obj.patient_details.name,
              lastName: obj.patient_details.last_name,
              contact: obj.patient_details.contact,
              countryCode: obj.patient_details.country_code,
              email: obj.patient_details.email,
              gender: gender,
              imgOption: '1',
            });
          } else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/patient/edit-profile");
    xhr.setRequestHeader("access-token", this.state.patientTokan);
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

        let fileName = "GUYYGUYGBUGUYGBGU.JPG"
        if (response && response.fileName) {
          let extension = response.fileName.substr(response.fileName.lastIndexOf('.'));
          if (extension && extension != "") {
            fileName = response.fileName
          }

        }

        const myImg = {
          uri: response.uri,
          type: 'image/jpeg',
          name: fileName,
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



  mUpdateProfile() {
    this.mLoaderShowHide();
    console.warn(this.state.gender)
    if (this.state.gender == 'Male') {
      this.setState({ gender: '1' })
    } else if (this.state.gender === "Female") {
      this.setState({ gender: '2' })
    } else if (this.state.gender == 'Rather not say') {
      this.setState({ gender: '3' })
    }
    var mThis = this;
    var data = new FormData();
    data.append("id", this.state.patientId);
    data.append("profile_pics", this.state.pic);
    data.append("name", this.state.firstName);
    data.append("last_name", this.state.lastName);
    data.append("contact", this.state.contact);
    data.append("country_code", this.state.countryCode);
    data.append("dob", '');
    data.append("gender", this.state.gender);
    data.append("auth_token", this.state.token)
    console.log(data)
    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {
    //     console.warn("@@@@@@@" + this.responseText);
    //     // if (this.responseText.indexOf('status') !== -1) {
    //     //   mThis.mLoaderShowHide();
    //     //   var text = this.responseText;
    //     //   var obj = JSON.parse(text);
    //     //   if (obj.status == 1) {
    //     //     mThis.mSuccess();
    //     //     SInfo.setItem('patient_name', obj.patient_name + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     //     SInfo.setItem('patient_pic', obj.profile_pic + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     //   } else {
    //     //     mThis.mFailed();
    //     //   }
    //     // } if (obj.status == 5) {
    //     //   SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     //   SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    //     //   this.props.navigation.navigate('Home')
    //     // }
    //     // else {
    //     //   mThis.mNetworkFailed();
    //     // }
    //   }
    // });
    // xhr.open("POST", constants.url + "service/patient/update-profile");
    // xhr.setRequestHeader('content-type', 'multipart/form-data');
    // xhr.send(data);

    fetch(constants.url + 'service/patient/update-profile', {
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
        if (this.state.gender == '1') {
          this.setState({ gender: 'Male' })
        } else if (this.state.gender === "2") {
          this.setState({ gender: 'Female' })
        } else if (this.state.gender == '3') {
          this.setState({ gender: 'Rather not say' })
        }
        this.mLoaderShowHide();
        console.log(responseJson)
        if (responseJson.status == 1) {
          //SInfo.setItem('dentist_pic', responseJson.update_doc_details.docs_details.profile_pics, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('patient_pic', responseJson.profile_pic + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.mSuccess();


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
  }




  render() {
    const { navigate } = this.props.navigation;
    const placeholder = {
      label: 'Choose Gender',
      value: null,
      color: '#9EA0A4',
    };
    return (
      <View style={styles.container}>
        <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }}>
        </Spinner>

        <ScrollView
          keyboardShouldPersistTaps="never">


          <View style={styles.profileImage}>
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
                keyboardType='default'
                placeholder='Last Name'
                style={styles.textInputStyle}
                onChangeText={(text) => this.setState({ lastName: text })} />
            </View>
          </View>
          <View style={styles.editViewNext}>
            <View style={styles.searchSection}>
              <Icon style={styles.searchIcon} name="venus" size={30} color="#C7C7CC" />
              <View style={{ justifyContent: 'center', marginLeft: 20, marginTop: 4, }}>
                {/* <RNPickerSelect
                  placeholder={placeholder}
                  value={this.state.gender}
                  onValueChange={(value) => this.setState({ gender: value })}
                                      // pickerProps={{ style: { height: 214, overflow: 'hidden' } }}
                  items={PickerData}
                  style={{
                    fontSize: 36,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 4,
                    color: 'black',
                    paddingRight: 30,
                    placeholder: {
                      color: 'black',
                      fontSize: 16,
                      fontWeight: 'bold',

                    }, inputIOS: {
                      color: 'black',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }
                  }

                  }
                  // useNativeAndroidPickerStyle={false}
                /> */}
                {/* <Text>fasdfasdfasdf</Text> */}
                {Platform.OS == 'ios' ? 
                <RNPickerSelect
                placeholder={placeholder}
                value={this.state.gender}
                pickerProps={{ style: { height: 214, overflow: 'hidden' } }}
                onValueChange={(value) => this.setState({ gender: value })}
                items={PickerData}
                style={{
                  fontSize: 36,
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 4,
                  color: 'black',
                  paddingRight: 30,
                  placeholder: {
                    color: 'black',
                    fontSize: 16,
                    fontWeight: 'bold',

                  }, inputIOS: {
                    color: 'black',
                    fontSize: 16,
                    fontWeight: 'bold',
                  },
                  placeholder:"hello"
                }

                }
                useNativeAndroidPickerStyle={false}
              />:<RNPickerSelect
              placeholder={placeholder}
              value={this.state.gender}
              // pickerProps={{ style: { height: 214, overflow: 'hidden' } }}
              onValueChange={(value) => this.setState({ gender: value })}
              items={PickerData}
              style={{
                fontSize: 36,
                paddingVertical: 12,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 4,
                color: 'black',
                paddingRight: 30,
                placeholder: {
                  color: 'black',
                  fontSize: 16,
                  fontWeight: 'bold',

                }, inputIOS: {
                  color: 'black',
                  fontSize: 16,
                  fontWeight: 'bold',
                },
                inputAndroid:{
                  color: 'black',
                  fontSize: 16,
                  fontWeight: 'bold',

                },
                // use this if useNativeAndroidPickerStyle={false}
                inputAndroidContainer:{
                  // backgroundColor:'red'
                },
              
              }

              }
              useNativeAndroidPickerStyle={false}
            />}
              </View>
              {/* <ModalDropdown
                allowFontScaling={false}
                style={styles.dropdown}
                textStyle={styles.dropdown_text}
                dropdownStyle={styles.dropdown_pop}
                defaultValue={this.state.gender}
                dropdownTextStyle={styles.dropdown_pop_text}
                options={DEMO_OPTIONS_1}
                onSelect={(idx, value) => this.setState({ gender: idx })} /> */}
            </View>
          </View>
          <View style={[styles.editViewLast, { marginTop: -10 }]}>
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
          <TouchableOpacity style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: constants.baseColor, borderRadius: 10, height: 50, width: '50%', marginLeft: '25%' }} onPress={() => { this.mUpdateProfile() }}>
            <Text style={{ color: 'white' }}>Submit</Text>
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
    marginTop: 60,
  },
  searchSection: {
    flexDirection: 'row',
    // alignItems: 'center',
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
  inputIOS: {
    fontSize: 36,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 86,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'red',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
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
  }
];
