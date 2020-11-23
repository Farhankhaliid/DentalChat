/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Text,
  TouchableOpacity
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import DoctorListItem from '../components/DoctorListItem';
import Spinner from 'react-native-loading-spinner-overlay';
import MessagesIconWithBadge from '../components/MessagesIconWithBadge';
import SInfo from 'react-native-sensitive-info';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import PropTypes from 'prop-types';
import constants from './../constants/constants'

export default class PatientDoctorList extends Component {



  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Dentist Responded',
      tabBarVisible: false,
      tabBarLabel: 'More',
      tabBarIcon: ({ tintColor }) => (
        <Icon name='ellipsis-h' size={30} color={tintColor} />
      ), headerTintColor: '#ffffff',
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



  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      rady: false,
      dataArray: [],
      dataArrayAll: [],
      patientId: '',
      post_id: '',
      isRefreshing: false,
      more: '0',
      page: 0,
      index: 0,
      token: ''
    };
  }

  componentDidMount() {
    this.setState({
      page: 0,
      index: 0,
      dataArray: [],
      dataArrayAll: [],
    })
    SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientId: value, })
    });
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('post_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('WWWWWW= ' + value);
      if (value == '' || value == undefined) {
        value = "all";
        this.setState({ post_id: value, })
      } else {
        this.setState({ post_id: value, })
      }
      this.mGetRecentPost();
    });
  }

  mFailed() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Failed', 'The Internet connection appears to be offline, Please try again');
      }, 200);
    });
  }

  mSuccess() {
    this.setState({ visible: false }, () => {
      setTimeout(() => {
        Alert.alert('Success', 'Appointment request has been done successfully');
      }, 200);
    });
  }

  mGetRecentPost() {
    var mThis = this;
    var rawData = [];
    var countMSG = 0;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    data.append("post_id", this.state.post_id);
    data.append("is_read", '1');
    data.append("page", this.state.page);
    data.append("perpage", '10');
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abcNew ' + this.responseText);
          var obj = JSON.parse(text);
          for (i in obj.patient_post_arr) {
            rawData.push(obj.patient_post_arr[i])
          }
          var d = mThis.state.page;
          var p = mThis.state.page;
          p = p + 10;
          mThis.setState({
            index: d,
            page: p,
            more: obj.more,
            dataArray: mThis.state.dataArray.concat(rawData),
            dataArrayAll: mThis.state.dataArrayAll.concat(rawData),
            rady: true,
            visible: false,
            post_id: '',
          });
          SInfo.setItem('post_id', '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
        } else {
          mThis.setState({
            rady: true,
            post_id: '',

          });
          SInfo.setItem('post_id', '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          mThis.mFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'get-recent-post');
    xhr.send(data);
  }



  onEndReached = () => {
    if (this.state.more == 1) {
      this.setState({
        rady: false,
        visible: true,
      });

      SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
        this.setState({ patientId: value, })
      });
      SInfo.getItem('post_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
        console.log('WWWWWW= ' + value);
        if (value == '' || value == undefined) {
          value = "all";
          this.setState({ post_id: value, })
        } else {
          this.setState({ post_id: value, })
        }
        this.mGetRecentPost();
      });
    }
    console.log("<><>#  " + this.state.page);
    console.log("<><>#  " + this.state.more);
  };


  mRefresh = async () => {
    this.setState({
      page: 0,
      index: 0,
      rady: false,
      visible: true,
      dataArray: [],
      dataArrayAll: [],
    });
    SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientId: value, })
      this.mGetRecentPost();
    });

  };




  appointmentRequest(postId, patientId, doctorId) {
    this.setState({ visible: true, rady: false });
    var mThis = this;
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", patientId);
    data.append("doctor_id", doctorId);
    data.append("post_id", postId);
    data.append("is_appoitment", "1");
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          mThis.setState({
            visible: false,
            rady: true
          });
          mThis.mSuccess();
        }
        else if (this.responseText.indexOf('status') == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        } else {
          mThis.setState({
            visible: false,
            rady: true
          });
          mThis.mFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'set-appointment-patient');
    xhr.send(data);
  }

  call(id) {
    const { navigate } = this.props.navigation;
    SInfo.setItem('post_id', id + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    navigate('PatientMainTab')
  }



  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "100%",
          backgroundColor: "#ffffff",
        }}
      />
    );
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


      if (this.state.dataArray.length > 0) {

        return (
          <View style={styles.container}>
            <FlatList
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.5}
              // onRefresh={this.mRefresh}
              // refreshing={this.state.isRefreshing}
              data={this.state.dataArray}
              keyExtractor={item => item.chat_history_arr.get_doctor.id}
              //ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={({ item }) => <DoctorListItem item={item} mMassage={() => this.call(item.chat_history_arr.post_id)} mSeeProfile={() => navigate('PatientDoctorProfile', item)} Appointment={() => this.appointmentRequest(item.post_id, item.chat_history_arr.patient_id, item.chat_history_arr.doctor_id)} />}
            />
          </View>
        );

      } else {
        return (
          <View style={styles.container}>
            <View style={{ width: "100%", height: 50, backgroundColor: "#111", justifyContent: 'center', alignItems: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>
                Sorry! No doctor available
            </Text>
            </View>
          </View>
        );

      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 10,
    // // marginLeft: 10,
    // // marginRight: 10,
    // marginBottom: 10
  },
});
