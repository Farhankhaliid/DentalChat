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
      businessName: '',
      businessAddress: '',
      dentistEducation: [],
      dentistInsurance: [],
      dentistAward: [],
      dentistExperience: []
    };
  }

  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.mValidation });
    SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ dentistId: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('dentist_tokan', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ dentistTokan: value, })
      this.mEditProfile()
    });
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

          var text = this.responseText;
          console.log(this.responseText);
          var obj = JSON.parse(text);
          console.log(obj)
          if (obj.status == 1) {
            mThis.setState({
              dentistExperience: obj.dentist_experience_data
            })

          }
          else {
          }
        } else {
          mThis.mNetworkFailed();
        }
      }
    });
    xhr.open("POST", constants.url + "service/dentistservice/dentist-step5");
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



  mNetworkFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline, Please try again');
      }, 200);
    });
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

            <Text style={{ color: constants.baseColor, fontSize: 22, marginBottom: 15 }} >Professional Experience</Text>

          </View>
          {this.state.dentistExperience.map((item, index) =>
            (
              <View>
                <View style={styles.editView}>
                  <View style={styles.searchSection}>
                    <TextInput
                      allowFontScaling={false}
                      value={item.prof_exp}
                      keyboardType='default'
                      placeholder='Role/ Job Title'
                      style={styles.textInputStyle}
                      onChangeText={(text) => this.setState({ degree: text })} />
                  </View>
                </View>
                <View style={styles.editView}>
                  <View style={styles.searchSection}>
                    <TextInput
                      allowFontScaling={false}
                      value={item.dental_business}
                      keyboardType='default'
                      placeholder='Employee Name'
                      style={styles.textInputStyle}
                      onChangeText={(text) => this.setState({ completed_year: text })} />
                  </View>
                </View>
                <View style={styles.editView}>
                  <View style={styles.searchSection}>
                    <TextInput
                      allowFontScaling={false}
                      value={item.location}
                      keyboardType='default'
                      placeholder="Location"
                      style={styles.textInputStyle}
                      onChangeText={(text) => this.setState({ medical_school: text })} />
                  </View>
                </View>
                <View style={styles.editView}>
                  <View style={styles.searchSection}>
                    <TextInput
                      allowFontScaling={false}
                      value={item.exp_from}
                      keyboardType='default'
                      placeholder='Expirence From'
                      style={styles.textInputStyle}
                      onChangeText={(text) => this.setState({ schoolLocation: text })} />
                  </View>
                </View>
                <View style={styles.editView}>
                  <View style={styles.searchSection}>
                    <TextInput
                      allowFontScaling={false}
                      value={item.exp_to}
                      keyboardType='default'
                      placeholder='Expirence To'
                      style={styles.textInputStyle}
                      onChangeText={(text) => this.setState({ schoolLocation: text })} />
                  </View>
                </View>
                <View style={styles.editView}>
                  <View style={styles.searchSection}>
                    <Text allowFontScaling={false} style={{ color: constants.baseColor, fontSize: 16, fontWeight: 'bold', marginTop: 15, marginLeft: 20 }} onPress={() => this.renderCustomActions()} >Upload Certificate</Text>
                  </View>
                </View>
              </View>
            ))}

          <TouchableOpacity style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: constants.baseColor, borderRadius: 10, height: 50, width: '50%', marginLeft: '25%' }} onPress={() => { this.props.navigation.navigate('dentistProfileUpdate4') }}>
            <Text style={{ color: 'white' }}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: constants.baseColor, borderRadius: 10, height: 50, width: '50%', marginLeft: '25%' }} onPress={() => { this.props.navigation.navigate('dentistProfileUpdate6') }}>
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
    width: 150,
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
