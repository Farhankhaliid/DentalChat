/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button, TouchableOpacity,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DashboardWidget from '../components/DashboardWidget';
import Spinner from 'react-native-loading-spinner-overlay';
import SInfo from 'react-native-sensitive-info'

import constants from './../constants/constants'
export default class DentistDashboard extends Component {

  static navigationOptions = {
    title: 'Dashboard',
    headerTintColor: '#ffffff',
    headerStyle: {
      backgroundColor: constants.baseColor
    }
  };



  constructor(props) {
    super(props);
    this.state = {
      userId: '',
      rady: false,
      visible: true,
      mUnattendantEr: '',
      mUnattendantNonEr: '',
      mAttendantEr: '',
      mAttendantNonEr: '',
      token: ''
    };
  }

  componentDidMount() {
    
    this.props.navigation.setParams({ handleSave: this.mRefrashScreen });
    SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log(value)
      this.setState({
        userId: value
      });
      this.mGetAttendantPost();
      this.mGetUnattendantPost();
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
  }
  mLoaderShowHide() {
    this.setState({
      visible: !this.state.visible,
    });
  };

  mGetUnattendantPost() {
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("doctor_id", this.state.userId);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", constants.url + "tot-unattendant-post-count", true);
    xhr.onload = function () {
      mThis.mLoaderShowHide();
      var users = xhr.responseText;
      if (xhr.readyState == 4 && xhr.status == "200") {
        console.log('<><><> ' + users);
        var obj = JSON.parse(users);
        mThis.setState({
          mUnattendantEr: obj.emergency,
          mUnattendantNonEr: obj.unemergency,
          rady: true
        });
      } else {
        console.log('<><><> ' + users);
        mThis.mFailed();
      }
    }
    xhr.send(data);
  }

  mGetAttendantPost() {
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("doctor_id", this.state.userId);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", constants.url + "tot-attendant-post-count", true);
    xhr.onload = function () {
      var users = xhr.responseText;
      if (xhr.readyState == 4 && xhr.status == "200") {
        console.log('<><><> ' + users);
        var obj = JSON.parse(users);
        mThis.setState({
          rady: true,
          mAttendantEr: obj.emergency,
          mAttendantNonEr: obj.unemergency
        });
      } else {
        console.log('<><><> ' + users);
        mThis.mFailed();
      }
    }
    xhr.send(data);
  }

  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline, Please try again');
      }, 200);
    });
  }



  mRefrashScreen = () => {
    SInfo.getItem('dentist_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log(value)
      this.setState({
        userId: value,
        rady: false,
        visible: true
      });
      this.mGetAttendantPost();
      this.mGetUnattendantPost();
    });
  }


  goMassageScreen(opration, type) {
    SInfo.setItem('opration', opration, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    SInfo.setItem('type', type, { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    this.props.navigation.navigate('DentistMessages')
  }

  render() {
    const { navigate } = this.props.navigation;

    if (this.state.rady == false) {
      return (
        <View style={styles.container}>
          <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} />
        </View>
      );
    } else {

      return (
        <View style={styles.container}>
          <View style={styles.postsContainerStyle}>
            <View style={styles.textContainer}>
              <Text allowFontScaling={false} style={styles.textStyle}> Unattended Posts </Text>
            </View>
            <View style={styles.unattendedPostsContainer}>

              <TouchableOpacity style={styles.unattendedPostsContainer} onPress={() => {
                this.goMassageScreen('0', '1')
              }
              }>
                <DashboardWidget isER count={this.state.mUnattendantEr} />
              </TouchableOpacity>


              <TouchableOpacity style={styles.unattendedPostsContainer} onPress={() => {
                this.goMassageScreen('0', '0')
              }
              }>
                <DashboardWidget isErn count={this.state.mUnattendantNonEr} />
              </TouchableOpacity>


            </View>
          </View>
          <View style={styles.postsContainerStyle}>
            <View style={styles.textContainer}>
              <Text allowFontScaling={false} style={styles.textStyle}> Attended Posts </Text>
            </View>
            <View style={styles.attendedPostsContainer}>

              <TouchableOpacity style={styles.unattendedPostsContainer} onPress={() => {
                this.goMassageScreen('1', '1')
              }
              }>
                <DashboardWidget isER count={this.state.mAttendantEr} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.unattendedPostsContainer} onPress={() => {
                this.goMassageScreen('1', '0')
              }
              }>
                <DashboardWidget count={this.state.mAttendantNonEr} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );

    }


  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#edf2f9',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  postsContainerStyle: {
    flex: 1
  },
  unattendedPostsContainer: {
    flexDirection: 'row',
    flex: 1
  },
  attendedPostsContainer: {
    flexDirection: 'row',
    flex: 1
  },
  textContainer: {
    marginTop: 5,
    marginBottom: 5
  },
  textStyle: {
    fontSize: 17,
    color: '#444'
  }
});
