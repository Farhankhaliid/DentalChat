/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Button,
  TouchableOpacity,
  Text,
  StatusBar

} from 'react-native';
import { SearchBar } from 'react-native-elements';
import PatientPostItem from '../components/PatientPostItem';
import Spinner from 'react-native-loading-spinner-overlay';
import MessagesIconWithBadge from '../components/MessagesIconWithBadge';
import SInfo from 'react-native-sensitive-info';
import Patient from './PatientMessages';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import ImageZoom from 'react-native-image-pan-zoom';
import PropTypes from 'prop-types';
import constants from './../constants/constants'

export default class PatientDashBoard extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Dashboard',
      tabBarLabel: 'Posts',
      headerLeft: null,

      tabBarIcon: ({ tintColor }) => (
        <Icon name='file-text-o' size={30} color={tintColor} />

      ),
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: constants.baseColor
      }
    };
  };



  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      rady: false,
      dataArrayAll: [],
      patientId: '',
      isRefreshing: false,
      token: ''
    };
  }

  componentDidMount() {
    console.log("QQqqqqqqqqq111");
    SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      console.log('time to fetch token')
      this.setState({ token: value, })
    });
    SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientId: value, })
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

  mGetRecentPost() {
    var mThis = this;
    var rawData = [];
    var data = new FormData();
    data.append("auth_token", this.state.token);
    data.append("patient_id", this.state.patientId);
    data.append("post_limit", "50");
    data.append("post_offset", '0');
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.responseText.indexOf('status') !== -1) {
          var text = this.responseText;
          console.log('<><><>abc' + this.responseText);
          var obj = JSON.parse(text);
          for (i in obj.post_list) {
            rawData.push(obj.post_list[i])
          }
          mThis.setState({
            rady: true,
            dataArrayAll: rawData,
            visible: false
          });
        }
        else if (this.responseText.indexOf('status') == 5) {
          SInfo.setItem('is_patient_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          SInfo.setItem('is_dentist_login', '0', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
          this.props.navigation.navigate('Home')
        } else {
          mThis.setState({
            rady: true,
          });
          mThis.mFailed();
        }
      }
    });
    xhr.open("POST", constants.url + 'list-patient-post');
    xhr.send(data);
  }


  call(id) {
    const { navigate } = this.props.navigation;
    SInfo.setItem('post_id', id + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    navigate('PatientMessages')
  }

  call2(id) {
    const { navigate } = this.props.navigation;
    SInfo.setItem('post_id', id + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    navigate('PatientDoctorList')
  }

  call3(id, item) {
    const { navigate } = this.props.navigation;
    SInfo.setItem('post_id', id + '', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' });
    navigate('PatientPostDetailsFromList', item)
  }


  mRefresh = async () => {
    this.setState({
      visible: true,
      rady: false,
    });
    SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
      this.setState({ patientId: value, })
      this.mGetRecentPost();
    });

  };





  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 10,
          width: "100%",
          backgroundColor: "#efeff2",
        }}
      />
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.rady == false) {
      return (
        <View style={styles.container}>
          {/* <NavigationEvents
            onWillFocus={() => {
              console.log("QQqqqqqqqqq111");
              SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
                console.log('time to fetch token')
                this.setState({ token: value, })
              });
              SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
                this.setState({ patientId: value, })
                this.mGetRecentPost();
              });

              //Call whatever logic or dispatch redux actions and update the screen!
            }}
          /> */}
          <Spinner overlayColor={'rgba(0, 0, 0, 0.75)'} color={'#08a1d9'} textContent={"Updating"} visible={this.state.visible} textStyle={{ color: '#fff', fontSize: 15, marginTop: -70 }} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {/* <NavigationEvents
            onWillFocus={() => {
              console.log("QQqqqqqqqqq111");
              SInfo.getItem('token', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
                console.log('time to fetch token')
                this.setState({ token: value, })
              });
              SInfo.getItem('patient_id', { sharedPreferencesName: 'mySharedPrefs', keychainService: 'myKeychain' }).then(value => {
                this.setState({ patientId: value, })
                this.mGetRecentPost();
              });

              //Call whatever logic or dispatch redux actions and update the screen!
            }}
          /> */}
          <FlatList
            onRefresh={this.mRefresh}
            refreshing={this.state.isRefreshing}
            data={this.state.dataArrayAll}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <PatientPostItem item={item} onPress={() => this.call(item.id)} onPress2={() => this.call2(item.id)} onPress3={() => this.call3(item.id, item)} />}
          />
          <StatusBar backgroundColor={constants.baseColor} barStyle="light-content" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
});

