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
  AppRegistry,
  TouchableOpacity,
  Keyboard,
  Button, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import SInfo from 'react-native-sensitive-info'
import { Avatar, Slider } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import ExpandingTextInput from '../components/ExpandingTextInput';
import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import callImage from './../images/call.png'
import doctorImage from './../images/doctor.png'
import CardView from 'react-native-cardview'

import constants from './../constants/constants'
var options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
export default class mainHome extends Component {
  static navigationOptions = {
    title: 'Home',
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      avatarSource: '',
      patientId: '',
      pic: [],
      postTitle: '',
      currentLocation: '',
      description: '',
      latitude: '',
      longitude: '',
      error: '',
      height: 0,
      painLevel: 0,
      emergency: false,
      sendEmergency: false,
      insurance: false,
      sendInsurance: false,
      appointment: false,
      sendAppointment: false,
      tog: false,


      userProfileName: ''
    };
  }
  componentDidMount() {
    SInfo.getItem('patient_name', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({
        userProfileName: value
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View>
            <Text allowFontScaling={false} style={{ marginTop: '20%', fontSize: 30, fontWeight: 'bold', marginLeft: '5%', marginRight: '5%', color: 'black' }}>Hi {this.state.userProfileName}</Text>
            <Text allowFontScaling={false} style={{ color: 'black', marginLeft: '5%', marginRight: '5%', marginTop: 10 }}>Welcome Back !</Text>
          </View>

          <CardView cardElevation={5} cardMaxElevation={5}
            style={{

              backgroundColor: "white",
              height: 100,
              width: '90%',
              marginTop: 60,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: '5%',
              marginRight: '5%'
            }} >
            <TouchableOpacity style={{ width: '90%', flexDirection: 'row', height: '100%', alignItems: "center", justifyContent: "center" }} onPress={() => {
              SInfo.setItem('appointment_type', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('PatientCreatePost')
            }}>
              <View style={{ flexDirection: "column", width: 200 }}>
                <Text allowFontScaling={false} style={{ color: "black", marginLeft: 10, fontWeight: 'bold' }}>FIND A DENTIST</Text>
                <Text allowFontScaling={false} style={{ marginTop: 8, color: 'black', marginLeft: 10 }}>Connect Now</Text>
              </View>
              <Image source={doctorImage} style={{ height: 40, width: 40, marginLeft: '15%' }} />
            </TouchableOpacity>
          </CardView>
          <CardView cardElevation={5} cardMaxElevation={5}
            style={{
              backgroundColor: "white",
              height: 100,
              width: '90%',
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: '5%',
              marginRight: '5%'
            }} >
            <TouchableOpacity style={{
              backgroundColor: "white",
              height: '100%',
              width: "100%",
              borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
            }} onPress={() => {
              SInfo.setItem('appointment_type', '1', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
              this.props.navigation.navigate('PatientCreatePost')
            }}>

              <View style={{ flexDirection: "column", width: 200 }}>
                <Text allowFontScaling={false} style={{ color: "black", marginLeft: 10, fontWeight: 'bold' }}>ASK DENTAL QUESTION</Text>
                <Text allowFontScaling={false} style={{ marginTop: 8, color: 'black', marginLeft: 10 }}>24/7 AVAILABILITY</Text>
              </View>
              <Image source={callImage} style={{ height: 40, width: 40, marginLeft: '15%' }} />
            </TouchableOpacity>
          </CardView>
        </View>
      </SafeAreaView>
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
    width: "90%",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    fontWeight: '500'
  },
  textInputStyle: {
    width: "90%",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    fontWeight: '500'
  },
  textInputStyleDesc: {
    width: "90%",
    height: 70,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 17,
    fontWeight: '500'
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
    marginTop: 10,
    marginLeft: 20
  },
  editView: {
    height: 50,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  editViewNext: {
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
    fontWeight: '500',
    color: '#111',
  },
  dropdown_pop: {
    width: 200,
    height: 100,
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
